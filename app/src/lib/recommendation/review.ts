import {
  AUDIT_ACTIONS,
  actorFromContext,
  recordDecision,
  recordOverride,
} from "@/lib/audit";
import type { OverrideCategory } from "@/lib/audit/events";
import type { AuthContext } from "@/lib/auth/context";
import type { RecommendationRow } from "@/lib/db/schema/recommendation";
import { assertTransition } from "./lifecycle";
import {
  RecommendationNotFoundError,
  getRecommendation,
  insertOverride,
  updateLifecycle,
} from "./repository";

// Human review workflow. Every function here is an explicit HUMAN action
// (human-in-the-loop) — there is no automated execution path. Each composes:
// lifecycle guard + persistence update + audit emission (E4).
//
// ATOMICITY GAP (documented): the lifecycle update and the audit write are
// separate awaits — neon-http has no interactive transaction (TEN-1). If the
// audit write throws after the lifecycle update commits, the two can diverge.
// True single-transaction atomicity arrives with the Neon Pool driver. Until
// then, order is: persist first, then audit, and a thrown audit error surfaces
// (AUD-7) for operator follow-up.

type ReviewOpts = { correlationId?: string | null };

async function load(id: string): Promise<RecommendationRow> {
  const rec = await getRecommendation(id);
  if (!rec) throw new RecommendationNotFoundError(id);
  return rec;
}

/** Generated -> Reviewed: a human has opened the recommendation for review. */
export async function markReviewed(
  id: string,
  ctx: AuthContext,
): Promise<RecommendationRow> {
  const rec = await load(id);
  assertTransition(rec.lifecycleState, "reviewed");
  return updateLifecycle(id, "reviewed", rec.version, {
    reviewedByUserId: ctx.userId,
    reviewedAt: new Date(),
  });
}

/** Reviewed -> Accepted. Records the decision with the dual accountability anchor. */
export async function acceptRecommendation(
  id: string,
  ctx: AuthContext,
  opts: ReviewOpts & { reason?: string } = {},
): Promise<RecommendationRow> {
  const rec = await load(id);
  assertTransition(rec.lifecycleState, "accepted");
  const updated = await updateLifecycle(id, "accepted", rec.version);
  await recordDecision({
    actor: actorFromContext(ctx),
    action: AUDIT_ACTIONS.RecommendationAccepted,
    recommendationId: id,
    decisionOwnerUserId: rec.decisionOwnerUserId ?? ctx.userId,
    correlationId: opts.correlationId ?? null,
    reason: opts.reason,
  });
  return updated;
}

/** Reviewed -> Rejected. */
export async function rejectRecommendation(
  id: string,
  ctx: AuthContext,
  opts: ReviewOpts & { reason?: string } = {},
): Promise<RecommendationRow> {
  const rec = await load(id);
  assertTransition(rec.lifecycleState, "rejected");
  const updated = await updateLifecycle(id, "rejected", rec.version);
  await recordDecision({
    actor: actorFromContext(ctx),
    action: AUDIT_ACTIONS.RecommendationRejected,
    recommendationId: id,
    decisionOwnerUserId: rec.decisionOwnerUserId ?? ctx.userId,
    correlationId: opts.correlationId ?? null,
    reason: opts.reason,
  });
  return updated;
}

/**
 * Override: a human supersedes the recommendation. Transitions Reviewed ->
 * Rejected, persists the Override child (domain data), and records the override
 * audit event (immutable ledger). Always carries a reason + category (HOR-1/3).
 */
export async function overrideRecommendation(
  id: string,
  ctx: AuthContext,
  override: {
    reason: string;
    category: OverrideCategory;
    policyDriven?: boolean;
  } & ReviewOpts,
): Promise<RecommendationRow> {
  const rec = await load(id);
  assertTransition(rec.lifecycleState, "rejected");
  const updated = await updateLifecycle(id, "rejected", rec.version);
  await insertOverride({
    recommendationId: id,
    actorUserId: ctx.userId,
    reason: override.reason,
    category: override.category,
    policyDriven: override.policyDriven,
  });
  await recordOverride({
    actor: actorFromContext(ctx),
    recommendationId: id,
    decisionOwnerUserId: rec.decisionOwnerUserId ?? ctx.userId,
    reason: override.reason,
    category: override.category,
    policyDriven: override.policyDriven,
    correlationId: override.correlationId ?? null,
  });
  return updated;
}

/**
 * Accepted -> Executed: a human confirms the action was carried out. This marks
 * that it was executed — it does NOT execute anything automatically. The
 * accountable decision was already audited at accept; a dedicated
 * `recommendation.executed` audit action is a future enhancement (needs a new
 * event type + a real-world action to attribute, which arrives with E2).
 */
export async function executeRecommendation(
  id: string,
): Promise<RecommendationRow> {
  const rec = await load(id);
  assertTransition(rec.lifecycleState, "executed");
  return updateLifecycle(id, "executed", rec.version, {
    executedAt: new Date(),
  });
}

/** Rejected|Executed -> Archived (terminal). */
export async function archiveRecommendation(
  id: string,
): Promise<RecommendationRow> {
  const rec = await load(id);
  assertTransition(rec.lifecycleState, "archived");
  return updateLifecycle(id, "archived", rec.version, {
    archivedAt: new Date(),
  });
}
