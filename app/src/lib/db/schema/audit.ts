import { sql } from "drizzle-orm";
import {
  check,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Dedicated append-only audit context (database-architecture.md §6, security §5).
export const audit = pgSchema("audit");

/**
 * `audit_events` — the immutable accountability ledger (ADR-003 AUD-1…AUD-7).
 *
 * Append-only: this module exposes no update/delete path, and a DB trigger
 * (see the audit_immutability migration) blocks UPDATE/DELETE at the row level.
 *
 * `actor_user_id` has NO foreign key on purpose: the ledger must survive a
 * referent's deletion (security §9 anonymize-not-delete) — the accountability
 * record outlives the user it names. No organization_id yet (tenancy deferred).
 */
export const auditEvents = audit.table(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // Namespaced action, e.g. "identity.user.provisioned",
    // "stewardship.recommendation.overridden".
    action: text("action").notNull(),
    // Actor attribution (DATA-1): a user id, or the system (webhook-initiated).
    actorType: text("actor_type", { enum: ["user", "system"] }).notNull(),
    actorUserId: uuid("actor_user_id"),
    // Polymorphic target (stored as text — identifiers across future contexts).
    targetType: text("target_type"),
    targetId: text("target_id"),
    // Ties request -> audit -> event (api-architecture.md §9).
    correlationId: text("correlation_id"),
    summary: text("summary"),
    // Event-specific payload: before/after, override reason+category,
    // decision-owner, policyDriven. Typed by the TS event catalog.
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
  },
  (table) => [
    check(
      "audit_events_actor_type_check",
      sql`${table.actorType} in ('user', 'system')`,
    ),
  ],
);

export type AuditEventRow = typeof auditEvents.$inferSelect;
