import { sql } from "drizzle-orm";
import { check, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { ROLES } from "@/lib/auth/roles";

// Schema-per-bounded-context (database-architecture.md §1). Identity is the
// first context; property/recommendation/etc. add alongside later.
export const identity = pgSchema("identity");

/**
 * `users` — thin mirror of the Clerk identity (ADR-002 broker: Clerk is the
 * system of record for authentication; Neon mirrors it, keyed by clerk_user_id).
 * Global identity: NOT tenant-scoped (no organization_id in E1).
 */
export const users = identity.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  // Soft delete (database-architecture.md §8). Full PII anonymization on a
  // Clerk user.deleted webhook is a documented follow-on (security §9).
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/**
 * `user_profiles` — ASC-owned attributes (1:1 with users). Holds `role`, the
 * role-propagation foundation. When Organizations arrive, role moves to
 * org-scoped membership; this column becomes a platform role or is dropped.
 */
export const userProfiles = identity.table(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name"),
    // text + CHECK, not a native pg enum (database-architecture.md §2 — the
    // role vocabulary may evolve). Enum arg gives the TS union; check() enforces
    // it in the database.
    role: text("role", { enum: ROLES }).notNull().default("staff"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "user_profiles_role_check",
      sql`${table.role} in ('owner', 'manager', 'staff', 'viewer')`,
    ),
  ],
);

export type UserRow = typeof users.$inferSelect;
export type UserProfileRow = typeof userProfiles.$inferSelect;
