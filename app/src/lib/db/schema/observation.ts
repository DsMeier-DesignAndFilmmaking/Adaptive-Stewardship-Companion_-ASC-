import { sql } from "drizzle-orm";
import { check, index, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { landscapeAreas, staffMembers } from "./property";

// The Observation bounded context — the primary stewardship evidence object.
// FUTURE TENANCY SEAM (ADR-004): no organization_id yet; derives tenancy through
// its Landscape Area when tenancy lands (additive migration).
export const observation = pgSchema("observation");

export const OBSERVATION_TYPES = [
  "condition",
  "wildlife",
  "visitor",
  "hazard",
  "maintenance",
  "other",
] as const;

export const observations = observation.table(
  "observations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Cross-context ref: an observation is always about an area. RESTRICT
    // protects the evidence trail (an area with observations can't be deleted).
    landscapeAreaId: uuid("landscape_area_id")
      .notNull()
      .references(() => landscapeAreas.id, { onDelete: "restrict" }),
    // Attribution. SET NULL so the observation survives staff removal (evidence
    // persists; the actor is also captured in the audit event).
    staffMemberId: uuid("staff_member_id").references(() => staffMembers.id, {
      onDelete: "set null",
    }),
    observationType: text("observation_type", { enum: OBSERVATION_TYPES })
      .notNull()
      .default("condition"),
    notes: text("notes"),
    // Field time (when observed), distinct from created_at (when recorded) —
    // load-bearing for future confidence recency (ai-architecture.md).
    observedAt: timestamp("observed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("observations_landscape_area_id_idx").on(t.landscapeAreaId),
    index("observations_staff_member_id_idx").on(t.staffMemberId),
    check(
      "observations_type_check",
      sql`${t.observationType} in ('condition', 'wildlife', 'visitor', 'hazard', 'maintenance', 'other')`,
    ),
  ],
);

export type ObservationRow = typeof observations.$inferSelect;
export type NewObservationRow = typeof observations.$inferInsert;
