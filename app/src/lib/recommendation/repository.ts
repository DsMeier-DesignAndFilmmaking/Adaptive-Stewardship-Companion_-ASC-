import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type NewRecommendationRow,
  type RecommendationRow,
  recommendationOverrides,
  recommendations,
} from "@/lib/db/schema/recommendation";
import type { OverrideCategory } from "@/lib/audit/events";
import type { GeneratedRecommendation } from "./services";
import type { LifecycleState } from "./types";

export class RecommendationNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`Recommendation not found: ${id}`);
    this.name = "RecommendationNotFoundError";
  }
}

/** Optimistic-concurrency failure — the row's version moved under us (CS-1). */
export class RecommendationConcurrencyError extends Error {
  constructor(
    readonly id: string,
    readonly expectedVersion: number,
  ) {
    super(
      `Recommendation ${id} was modified concurrently (expected version ${expectedVersion}).`,
    );
    this.name = "RecommendationConcurrencyError";
  }
}

export async function createRecommendation(
  values: NewRecommendationRow,
): Promise<RecommendationRow> {
  const [row] = await db.insert(recommendations).values(values).returning();
  return row;
}

/** Persist a generated recommendation in the `generated` lifecycle state. */
export async function saveGenerated(
  gen: GeneratedRecommendation,
  opts: { decisionOwnerUserId?: string | null } = {},
): Promise<RecommendationRow> {
  return createRecommendation({
    lifecycleState: "generated",
    action: gen.action,
    attention: gen.attention,
    title: gen.title,
    shortReason: gen.shortReason,
    confidenceLevel: gen.confidence,
    confidenceReason: gen.confidenceReason,
    explanation: gen.explanation,
    explanationSource: gen.explanationSource,
    ruleTrace: gen.ruleTrace,
    evidence: gen.evidence,
    missingEvidence: gen.missingEvidence,
    alternative: gen.alternative,
    landscapeAreaId: gen.landscapeAreaId,
    decisionOwnerUserId: opts.decisionOwnerUserId ?? null,
  });
}

export async function getRecommendation(
  id: string,
): Promise<RecommendationRow | null> {
  const [row] = await db
    .select()
    .from(recommendations)
    .where(eq(recommendations.id, id))
    .limit(1);
  return row ?? null;
}

type LifecycleUpdateFields = Partial<
  Pick<
    NewRecommendationRow,
    "reviewedByUserId" | "reviewedAt" | "executedAt" | "archivedAt"
  >
>;

/**
 * Transition the lifecycle with optimistic concurrency (CS-1): the update only
 * applies if `version` still equals `expectedVersion`, and bumps it. A stale
 * version yields RecommendationConcurrencyError rather than a lost update.
 */
export async function updateLifecycle(
  id: string,
  next: LifecycleState,
  expectedVersion: number,
  extra: LifecycleUpdateFields = {},
): Promise<RecommendationRow> {
  const [row] = await db
    .update(recommendations)
    .set({
      lifecycleState: next,
      version: expectedVersion + 1,
      updatedAt: new Date(),
      ...extra,
    })
    .where(
      and(
        eq(recommendations.id, id),
        eq(recommendations.version, expectedVersion),
      ),
    )
    .returning();
  if (!row) {
    throw new RecommendationConcurrencyError(id, expectedVersion);
  }
  return row;
}

export async function insertOverride(input: {
  recommendationId: string;
  actorUserId: string;
  reason: string;
  category: OverrideCategory;
  policyDriven?: boolean;
}): Promise<void> {
  await db.insert(recommendationOverrides).values({
    recommendationId: input.recommendationId,
    actorUserId: input.actorUserId,
    reason: input.reason,
    category: input.category,
    policyDriven: input.policyDriven ?? false,
  });
}

export async function listByLandscapeArea(
  landscapeAreaId: string,
): Promise<RecommendationRow[]> {
  return db
    .select()
    .from(recommendations)
    .where(eq(recommendations.landscapeAreaId, landscapeAreaId))
    .orderBy(desc(recommendations.createdAt));
}
