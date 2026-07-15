import { badRequest, conflict, notFound } from "@/lib/api";
import { AUDIT_ACTIONS, actorFromContext, recordAuditEvent } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/context";
import { ROLES } from "@/lib/auth/roles";
import {
  STAFF_STATUSES,
  type StaffMemberRow,
} from "@/lib/db/schema/property";
import * as repo from "./repository";

// Domain service for Staff Member — the stewardship accountability anchor
// (ADR-003 §4 / DATA-1). Role reuses the ADR-003 MVP role set. A staff member
// may optionally link to an authenticated user (0..1).

function validateEnum(
  value: unknown,
  allowed: readonly string[],
  field: string,
): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw badRequest([
      { field, message: `${field} must be one of: ${allowed.join(", ")}.` },
    ]);
  }
  return value;
}

async function validateUserLink(userId: unknown): Promise<string | null> {
  if (userId === undefined || userId === null) return null;
  if (typeof userId !== "string") {
    throw badRequest([{ field: "userId", message: "userId must be a string." }]);
  }
  if (!(await repo.userExists(userId))) {
    throw badRequest([{ field: "userId", message: `User not found: ${userId}.` }]);
  }
  const existing = await repo.selectStaffMemberByUserId(userId);
  if (existing) {
    throw conflict(
      { staffMemberId: existing.id },
      "This user is already linked to a staff member.",
    );
  }
  return userId;
}

export type CreateStaffMemberInput = {
  displayName?: unknown;
  userId?: unknown;
  role?: unknown;
  status?: unknown;
};

export async function createStaffMember(
  ctx: AuthContext,
  input: CreateStaffMemberInput,
  correlationId: string,
): Promise<StaffMemberRow> {
  const displayName =
    typeof input.displayName === "string" ? input.displayName.trim() : "";
  if (!displayName) {
    throw badRequest([
      { field: "displayName", message: "displayName is required." },
    ]);
  }
  const userId = await validateUserLink(input.userId);
  const role = validateEnum(input.role, ROLES, "role");
  const status = validateEnum(input.status, STAFF_STATUSES, "status");

  const row = await repo.insertStaffMember({
    displayName,
    userId,
    ...(role ? { role: role as StaffMemberRow["role"] } : {}),
    ...(status ? { status: status as StaffMemberRow["status"] } : {}),
  });

  await recordAuditEvent({
    action: AUDIT_ACTIONS.StaffMemberCreated,
    actor: actorFromContext(ctx),
    targetType: "staff_member",
    targetId: row.id,
    correlationId,
    summary: `Staff member created: ${row.displayName}`,
    metadata: { role: row.role, linkedUser: Boolean(row.userId) },
  });
  return row;
}

export async function getStaffMember(id: string): Promise<StaffMemberRow> {
  const row = await repo.selectStaffMemberById(id);
  if (!row) throw notFound(`Staff member not found: ${id}`);
  return row;
}

export async function listStaffMembers(): Promise<StaffMemberRow[]> {
  return repo.selectStaffMembers();
}

export async function updateStaffMember(
  ctx: AuthContext,
  id: string,
  input: CreateStaffMemberInput,
  correlationId: string,
): Promise<StaffMemberRow> {
  const patch: Partial<StaffMemberRow> = {};
  if (input.displayName !== undefined) {
    const displayName =
      typeof input.displayName === "string" ? input.displayName.trim() : "";
    if (!displayName) {
      throw badRequest([
        { field: "displayName", message: "displayName cannot be empty." },
      ]);
    }
    patch.displayName = displayName;
  }
  const role = validateEnum(input.role, ROLES, "role");
  if (role) patch.role = role as StaffMemberRow["role"];
  const status = validateEnum(input.status, STAFF_STATUSES, "status");
  if (status) patch.status = status as StaffMemberRow["status"];

  const row = await repo.updateStaffMemberById(id, patch);
  if (!row) throw notFound(`Staff member not found: ${id}`);

  await recordAuditEvent({
    action: AUDIT_ACTIONS.StaffMemberUpdated,
    actor: actorFromContext(ctx),
    targetType: "staff_member",
    targetId: row.id,
    correlationId,
    summary: `Staff member updated: ${row.displayName}`,
    metadata: { changed: Object.keys(patch) },
  });
  return row;
}
