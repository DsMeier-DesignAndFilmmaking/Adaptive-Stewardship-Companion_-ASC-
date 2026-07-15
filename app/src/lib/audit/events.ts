import type { AuthContext } from "@/lib/auth/context";

// The namespaced audit action vocabulary. Identity events are emitted today;
// stewardship.* is the framework contract E5 will emit once the Recommendation
// aggregate exists.
export const AUDIT_ACTIONS = {
  IdentityUserProvisioned: "identity.user.provisioned",
  IdentityUserUpdated: "identity.user.updated",
  IdentityUserDeleted: "identity.user.deleted",
  IdentityUserRoleChanged: "identity.user.role_changed",
  IdentityUserOwnerSeeded: "identity.user.owner_seeded",

  RecommendationAccepted: "stewardship.recommendation.accepted",
  RecommendationRejected: "stewardship.recommendation.rejected",
  RecommendationOverridden: "stewardship.recommendation.overridden",

  // Stewardship domain entity lifecycle (F1).
  PropertyCreated: "stewardship.property.created",
  PropertyUpdated: "stewardship.property.updated",
  LandscapeAreaCreated: "stewardship.landscape_area.created",
  LandscapeAreaUpdated: "stewardship.landscape_area.updated",
  StaffMemberCreated: "stewardship.staff_member.created",
  StaffMemberUpdated: "stewardship.staff_member.updated",
  ObservationCreated: "stewardship.observation.created",
  ObservationUpdated: "stewardship.observation.updated",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

/**
 * Who acted. Anchored on user_id (DATA-1). `system` covers webhook-initiated
 * lifecycle events that have no human actor.
 */
export type Actor = { type: "system" } | { type: "user"; userId: string };

export function actorFromContext(ctx: Pick<AuthContext, "userId">): Actor {
  return { type: "user", userId: ctx.userId };
}

export function systemActor(): Actor {
  return { type: "system" };
}

// ADR-003 HOR-3: an override always carries a reason category.
export const OVERRIDE_CATEGORIES = [
  "bad-input",
  "missing-context",
  "bad-reasoning",
  "changed-conditions",
  "preference",
] as const;

export type OverrideCategory = (typeof OVERRIDE_CATEGORIES)[number];
