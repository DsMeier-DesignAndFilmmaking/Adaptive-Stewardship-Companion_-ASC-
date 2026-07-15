import { badRequest, conflict, notFound } from "@/lib/api";
import { AUDIT_ACTIONS, actorFromContext, recordAuditEvent } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/context";
import { ROLES, type Role } from "@/lib/auth/roles";
import {
  countOwners,
  findUserById,
  listUsers,
  updateUserRole,
} from "@/lib/db/users";

// Domain service for admin-facing user/role management (F5 — the ongoing
// role-elevation path, ADR-003 permission-matrix footnote 1: "Membership +
// role grants are Owner-only at MVP — privilege-escalation control"). Owner-
// only is enforced at the route layer (withRole("owner", ...)); this module
// adds the guard the route layer can't express: never allow the last owner
// to be demoted. The DB trigger on identity.user_profiles
// (migration 000X_last_owner_guard.sql) is the hard backstop against the
// neon-http TOCTOU race this app-layer check alone can't fully close.

export type AdminUserView = { id: string; email: string | null; role: Role };

function toAdminView(u: { userId: string; email: string | null; role: Role }): AdminUserView {
  return { id: u.userId, email: u.email, role: u.role };
}

export type ChangeRoleInput = { role?: unknown };

function validateRole(value: unknown): Role {
  if (typeof value !== "string" || !(ROLES as readonly string[]).includes(value)) {
    throw badRequest([
      { field: "role", message: `role must be one of: ${ROLES.join(", ")}.` },
    ]);
  }
  return value as Role;
}

export async function listUsersForAdmin(): Promise<AdminUserView[]> {
  const users = await listUsers();
  return users.map(toAdminView);
}

export async function changeUserRole(
  ctx: AuthContext,
  targetUserId: string,
  input: ChangeRoleInput,
  correlationId: string,
): Promise<AdminUserView> {
  const newRole = validateRole(input.role);

  const target = await findUserById(targetUserId);
  if (!target) throw notFound(`User not found: ${targetUserId}`);

  if (target.role === "owner" && newRole !== "owner") {
    const owners = await countOwners();
    if (owners <= 1) {
      throw conflict(
        { role: target.role },
        "Cannot remove the last owner. Promote another user to owner first.",
      );
    }
  }

  const updated = await updateUserRole(targetUserId, newRole);
  if (!updated) throw notFound(`User not found: ${targetUserId}`);

  await recordAuditEvent({
    action: AUDIT_ACTIONS.IdentityUserRoleChanged,
    actor: actorFromContext(ctx),
    targetType: "user",
    targetId: targetUserId,
    correlationId,
    summary: `Role changed: ${target.role} -> ${newRole}`,
    metadata: { previousRole: target.role, newRole },
  });

  return toAdminView(updated);
}
