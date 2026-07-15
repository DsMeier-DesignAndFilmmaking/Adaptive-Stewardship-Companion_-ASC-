import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditEvents, type AuditEventRow } from "@/lib/db/schema/audit";
import {
  AUDIT_ACTIONS,
  type Actor,
  type AuditAction,
  type OverrideCategory,
} from "./events";

type RecordInput = {
  action: AuditAction;
  actor: Actor;
  targetType?: string;
  targetId?: string;
  correlationId?: string | null;
  summary?: string;
  metadata?: Record<string, unknown>;
};

/**
 * The single append-only writer (AUD-1/AUD-3). INSERT only — this module
 * exposes no update or delete, and a DB trigger blocks mutation at the row
 * level too.
 *
 * Throws on failure: an audit-write failure on an accountability action is a
 * security event, never a silent no-op (AUD-7). A decision-path caller MUST let
 * the throw fail the operation. (Atomicity of decision + audit in one
 * transaction requires the Neon Pool driver — TEN-1, arriving with E5.)
 */
export async function recordAuditEvent(input: RecordInput): Promise<void> {
  const actorUserId = input.actor.type === "user" ? input.actor.userId : null;
  await db.insert(auditEvents).values({
    action: input.action,
    actorType: input.actor.type,
    actorUserId,
    targetType: input.targetType ?? null,
    targetId: input.targetId ?? null,
    correlationId: input.correlationId ?? null,
    summary: input.summary ?? null,
    metadata: input.metadata ?? {},
  });
}

// --- Recommendation accountability framework (ready for E5; no caller yet) ---

type DecisionInput = {
  actor: Actor;
  action:
    | typeof AUDIT_ACTIONS.RecommendationAccepted
    | typeof AUDIT_ACTIONS.RecommendationRejected;
  recommendationId: string;
  /** The accountable decision owner — the second anchor (ADR-003 §4). */
  decisionOwnerUserId: string;
  correlationId?: string | null;
  reason?: string;
};

/**
 * Record a stewardship decision (accept/reject) with the dual accountability
 * anchor: the acting user (`actor`) AND the accountable decision owner. These
 * may differ (a manager acts; a stewardship lead owns the outcome).
 */
export async function recordDecision(input: DecisionInput): Promise<void> {
  await recordAuditEvent({
    action: input.action,
    actor: input.actor,
    targetType: "recommendation",
    targetId: input.recommendationId,
    correlationId: input.correlationId,
    metadata: {
      decisionOwnerUserId: input.decisionOwnerUserId,
      ...(input.reason ? { reason: input.reason } : {}),
    },
  });
}

type OverrideInput = {
  actor: Actor;
  recommendationId: string;
  decisionOwnerUserId: string;
  reason: string;
  category: OverrideCategory;
  correlationId?: string | null;
  policyDriven?: boolean;
};

/**
 * Record a human override (ADR-003 HOR-1/HOR-3): always with a reason + category.
 * `policyDriven` carries the ADR-003 §6 escalation flag when present.
 */
export async function recordOverride(input: OverrideInput): Promise<void> {
  await recordAuditEvent({
    action: AUDIT_ACTIONS.RecommendationOverridden,
    actor: input.actor,
    targetType: "recommendation",
    targetId: input.recommendationId,
    correlationId: input.correlationId,
    metadata: {
      decisionOwnerUserId: input.decisionOwnerUserId,
      reason: input.reason,
      category: input.category,
      policyDriven: input.policyDriven ?? false,
    },
  });
}

// --- Restricted reads (accountability / dispute resolution) ---

export async function findAuditEventsByTarget(
  targetType: string,
  targetId: string,
): Promise<AuditEventRow[]> {
  return db
    .select()
    .from(auditEvents)
    .where(
      and(
        eq(auditEvents.targetType, targetType),
        eq(auditEvents.targetId, targetId),
      ),
    )
    .orderBy(desc(auditEvents.occurredAt));
}

export async function findAuditEventsByCorrelation(
  correlationId: string,
): Promise<AuditEventRow[]> {
  return db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.correlationId, correlationId))
    .orderBy(desc(auditEvents.occurredAt));
}

// AUD-6 / security §6 (anti-surveillance): there is INTENTIONALLY no
// "list/count events by actor" query. Override data is purpose-limited to
// accountability (by target / correlation) and aggregate learning — never a
// per-individual performance metric. Do not add a by-actor reader here.
