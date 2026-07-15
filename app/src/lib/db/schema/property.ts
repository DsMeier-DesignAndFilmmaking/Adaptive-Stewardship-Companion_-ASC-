import { sql } from "drizzle-orm";
import {
  check,
  index,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { ROLES } from "@/lib/auth/roles";
import { users } from "./identity";

// The Property bounded context (backend-domain-architecture.md) — owns Property,
// Landscape Area, and Staff Member.
//
// FUTURE TENANCY SEAM (ADR-004 single-tenant pilot). There is deliberately no
// organization_id here. When multi-tenancy lands, organization_id is added to
// `properties` (the tenant root) and denormalized to children; these tables are
// shaped so that is an *additive* migration + RLS pass, not a redesign. Do not
// add tenancy complexity at this stage.
export const property = pgSchema("property");

export const PROPERTY_STATUSES = ["active", "inactive", "archived"] as const;
export const AREA_TYPES = [
  "trail",
  "zone",
  "habitat",
  "water",
  "viewpoint",
  "route",
  "other",
] as const;
export const AREA_STATUSES = ["open", "restricted", "closed", "resting"] as const;
export const STAFF_STATUSES = ["active", "inactive"] as const;

export const properties = property.table(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status", { enum: PROPERTY_STATUSES })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "properties_status_check",
      sql`${t.status} in ('active', 'inactive', 'archived')`,
    ),
  ],
);

export const landscapeAreas = property.table(
  "landscape_areas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Cross-aggregate, same context: RESTRICT (database-architecture.md §5) —
    // a property with areas cannot be deleted out from under them.
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    areaType: text("area_type", { enum: AREA_TYPES }).notNull().default("other"),
    // The area's operational status (unambiguous here — TERM-1 only applies to
    // the recommendation entity, which distinguishes lifecycleState vs action).
    status: text("status", { enum: AREA_STATUSES }).notNull().default("open"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("landscape_areas_property_id_idx").on(t.propertyId),
    check(
      "landscape_areas_area_type_check",
      sql`${t.areaType} in ('trail', 'zone', 'habitat', 'water', 'viewpoint', 'route', 'other')`,
    ),
    check(
      "landscape_areas_status_check",
      sql`${t.status} in ('open', 'restricted', 'closed', 'resting')`,
    ),
  ],
);

// The stewardship accountability anchor (ADR-003 §4 / DATA-1). Optionally links
// to an authenticated user (0..1) — a volunteer/seasonal staffer may have no
// login. `role` reuses the ADR-003 MVP role set.
export const staffMembers = property.table(
  "staff_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Cross-context ref to identity. SET NULL so the roster row survives a user
    // deletion (accountability outlives the login; security §9).
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    displayName: text("display_name").notNull(),
    role: text("role", { enum: ROLES }).notNull().default("staff"),
    status: text("status", { enum: STAFF_STATUSES }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // At most one staff member per authenticated user (nulls allowed).
    uniqueIndex("staff_members_user_id_unique").on(t.userId),
    check(
      "staff_members_role_check",
      sql`${t.role} in ('owner', 'manager', 'staff', 'viewer')`,
    ),
    check(
      "staff_members_status_check",
      sql`${t.status} in ('active', 'inactive')`,
    ),
  ],
);

export type PropertyRow = typeof properties.$inferSelect;
export type NewPropertyRow = typeof properties.$inferInsert;
export type LandscapeAreaRow = typeof landscapeAreas.$inferSelect;
export type NewLandscapeAreaRow = typeof landscapeAreas.$inferInsert;
export type StaffMemberRow = typeof staffMembers.$inferSelect;
export type NewStaffMemberRow = typeof staffMembers.$inferInsert;
