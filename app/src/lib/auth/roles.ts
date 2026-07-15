// Role-propagation foundation (ADR-003).
//
// E1 is user-centric: `role` is an app-global attribute on `user_profiles`.
// When Organizations arrive, role resolution moves to org-scoped membership —
// but this module's types and helper signatures stay identical, so callers and
// the AuthContext interface do not change. That is the "no auth refactoring"
// guarantee for adding tenancy later.
//
// The full ADR-003 permission matrix is deliberately NOT implemented here; this
// is only the propagation plumbing (a role travels in AuthContext and can gate
// actions via a simple hierarchy).

export const ROLES = ["owner", "manager", "staff", "viewer"] as const;
export type Role = (typeof ROLES)[number];

// Least-privilege default assigned at provisioning time.
export const DEFAULT_ROLE: Role = "staff";

// Simple hierarchy for the foundation. Higher rank => more capability.
// A real matrix (per-action, per-domain) is deferred to the Authorization work.
const RANK: Record<Role, number> = {
  viewer: 0,
  staff: 1,
  manager: 2,
  owner: 3,
};

export function hasRole(role: Role, minimum: Role): boolean {
  return RANK[role] >= RANK[minimum];
}

/** Throws ForbiddenError if `ctx.role` is below `minimum`. */
export function requireRole(ctx: { role: Role }, minimum: Role): void {
  if (!hasRole(ctx.role, minimum)) {
    throw new ForbiddenError(
      `Requires role '${minimum}' or higher; caller has '${ctx.role}'.`,
    );
  }
}

export class ForbiddenError extends Error {
  readonly status = 403 as const;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
