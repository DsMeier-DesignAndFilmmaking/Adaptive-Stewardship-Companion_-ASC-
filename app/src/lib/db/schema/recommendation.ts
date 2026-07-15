import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { OVERRIDE_CATEGORIES } from "@/lib/audit/events";
import { landscapeAreas, staffMembers } from "./property";
import {
  ATTENTION_LEVELS,
  CONFIDENCE_LEVELS,
  EXPLANATION_SOURCES,
  LIFECYCLE_STATES,
  RECOMMENDATION_ACTIONS,
  type RuleTrace,
} from "@/lib/recommendation/types";

// The Recommendation bounded context (database-architecture.md §1).
export const recommendation = pgSchema("recommendation");

/**
 * `recommendations` — the recommendation aggregate root: the container for
 * future stewardship intelligence. Field names resolve TERM-1 (lifecycle_state
 * vs action — never a bare "status"). No organization_id yet (tenancy deferred).
 * landscape_area_id and input refs are LOOSE (no FK) — E2 entities not built.
 */
export const recommendations = recommendation.table(
  "recommendations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lifecycleState: text("lifecycle_state", { enum: LIFECYCLE_STATES })
      .notNull()
      .default("draft"),
    action: text("action", { enum: RECOMMENDATION_ACTIONS }).notNull(),
    attention: text("attention", { enum: ATTENTION_LEVELS }).notNull(),
    title: text("title").notNull(),
    shortReason: text("short_reason").notNull(),
    // Confidence persistence (categorical, incl. unknown).
    confidenceLevel: text("confidence_level", { enum: CONFIDENCE_LEVELS })
      .notNull()
      .default("unknown"),
    confidenceReason: text("confidence_reason"),
    // Explanation persistence + which explainer produced it.
    explanation: text("explanation"),
    explanationSource: text("explanation_source", { enum: EXPLANATION_SOURCES })
      .notNull()
      .default("deterministic"),
    // rules-decide provenance (write-once by convention; OWN-2/DATA-2).
    ruleTrace: jsonb("rule_trace")
      .$type<RuleTrace>()
      .notNull()
      .default({ rules: [] }),
    evidence: jsonb("evidence").$type<string[]>().notNull().default([]),
    missingEvidence: text("missing_evidence"),
    alternative: text("alternative"),
    visitorView: text("visitor_view"),
    stewardshipView: text("stewardship_view"),
    // Accountable decision owner. `decision_owner_user_id` is retained (the E5
    // user-level anchor); F1 adds the proper Staff Member relationship — the
    // ADR-003 §4 accountability anchor. SET NULL keeps the recommendation if the
    // staff member is removed.
    decisionOwnerUserId: uuid("decision_owner_user_id"),
    decisionOwnerStaffMemberId: uuid("decision_owner_staff_member_id").references(
      () => staffMembers.id,
      { onDelete: "set null" },
    ),
    // The area this recommendation concerns — now a proper relationship (F1).
    landscapeAreaId: uuid("landscape_area_id").references(
      () => landscapeAreas.id,
      { onDelete: "set null" },
    ),
    // Optimistic-concurrency token for lifecycle transitions (resolves CS-1).
    version: integer("version").notNull().default(1),
    reviewedByUserId: uuid("reviewed_by_user_id"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    executedAt: timestamp("executed_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("recommendations_landscape_area_id_idx").on(t.landscapeAreaId),
    index("recommendations_decision_owner_staff_member_id_idx").on(
      t.decisionOwnerStaffMemberId,
    ),
    check(
      "recommendations_lifecycle_state_check",
      sql`${t.lifecycleState} in ('draft', 'generated', 'reviewed', 'accepted', 'rejected', 'executed', 'archived')`,
    ),
    check(
      "recommendations_action_check",
      sql`${t.action} in ('open', 'promote', 'rest', 'restrict', 'close')`,
    ),
    check(
      "recommendations_confidence_check",
      sql`${t.confidenceLevel} in ('high', 'medium', 'low', 'unknown')`,
    ),
    check(
      "recommendations_attention_check",
      sql`${t.attention} in ('critical', 'monitor', 'opportunity')`,
    ),
  ],
);

/**
 * `recommendation_overrides` — the Override child of the aggregate
 * (backend-domain-architecture.md). Domain-data complement to the immutable
 * audit event (E4). FK cascade is within-aggregate (database-architecture §5).
 */
export const recommendationOverrides = recommendation.table(
  "recommendation_overrides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recommendationId: uuid("recommendation_id")
      .notNull()
      .references(() => recommendations.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id").notNull(),
    reason: text("reason").notNull(),
    category: text("category", { enum: OVERRIDE_CATEGORIES }).notNull(),
    policyDriven: boolean("policy_driven").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "recommendation_overrides_category_check",
      sql`${t.category} in ('bad-input', 'missing-context', 'bad-reasoning', 'changed-conditions', 'preference')`,
    ),
  ],
);

export type RecommendationRow = typeof recommendations.$inferSelect;
export type NewRecommendationRow = typeof recommendations.$inferInsert;
export type RecommendationOverrideRow =
  typeof recommendationOverrides.$inferSelect;
