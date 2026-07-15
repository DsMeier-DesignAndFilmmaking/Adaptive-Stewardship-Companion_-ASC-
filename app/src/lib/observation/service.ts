import { badRequest, notFound } from "@/lib/api";
import { AUDIT_ACTIONS, actorFromContext, recordAuditEvent } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/context";
import {
  OBSERVATION_TYPES,
  type ObservationRow,
} from "@/lib/db/schema/observation";
import { selectLandscapeAreaById } from "@/lib/landscape-area/repository";
import {
  selectStaffMemberById,
  selectStaffMemberByUserId,
} from "@/lib/staff-member/repository";
import * as repo from "./repository";

// Domain service for Observation — the primary stewardship evidence object.
// Validates its Landscape Area (proper relationship) and resolves Staff Member
// attribution: an explicit staffMemberId, else the staff member linked to the
// authenticated caller, else null.
//
// NOTE (divergence, recorded): E4/database-architecture §8 modeled observations
// as append-only. F1's spec makes them updatable with an `observation.updated`
// audit event — mutable-with-full-audit-trail. That trail preserves the
// accountability append-only would have provided differently.

function validateType(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (
    typeof value !== "string" ||
    !(OBSERVATION_TYPES as readonly string[]).includes(value)
  ) {
    throw badRequest([
      {
        field: "observationType",
        message: `observationType must be one of: ${OBSERVATION_TYPES.join(", ")}.`,
      },
    ]);
  }
  return value;
}

async function resolveStaffMemberId(
  explicit: unknown,
  ctx: AuthContext,
): Promise<string | null> {
  if (typeof explicit === "string" && explicit) {
    const staff = await selectStaffMemberById(explicit);
    if (!staff) {
      throw badRequest([
        { field: "staffMemberId", message: `Staff member not found: ${explicit}.` },
      ]);
    }
    return staff.id;
  }
  // Auto-attribute to the caller's linked staff member, if any.
  const own = await selectStaffMemberByUserId(ctx.userId);
  return own?.id ?? null;
}

export type CreateObservationInput = {
  landscapeAreaId?: unknown;
  staffMemberId?: unknown;
  observationType?: unknown;
  notes?: unknown;
  observedAt?: unknown;
};

export async function createObservation(
  ctx: AuthContext,
  input: CreateObservationInput,
  correlationId: string,
): Promise<ObservationRow> {
  const landscapeAreaId =
    typeof input.landscapeAreaId === "string" ? input.landscapeAreaId : "";
  if (!landscapeAreaId) {
    throw badRequest([
      { field: "landscapeAreaId", message: "landscapeAreaId is required." },
    ]);
  }
  const area = await selectLandscapeAreaById(landscapeAreaId);
  if (!area) {
    throw badRequest([
      {
        field: "landscapeAreaId",
        message: `Landscape area not found: ${landscapeAreaId}.`,
      },
    ]);
  }
  const observationType = validateType(input.observationType);
  const staffMemberId = await resolveStaffMemberId(input.staffMemberId, ctx);
  const notes = typeof input.notes === "string" ? input.notes : null;
  const observedAt =
    typeof input.observedAt === "string" && !Number.isNaN(Date.parse(input.observedAt))
      ? new Date(input.observedAt)
      : undefined;

  const row = await repo.insertObservation({
    landscapeAreaId,
    staffMemberId,
    notes,
    ...(observationType
      ? { observationType: observationType as ObservationRow["observationType"] }
      : {}),
    ...(observedAt ? { observedAt } : {}),
  });

  await recordAuditEvent({
    action: AUDIT_ACTIONS.ObservationCreated,
    actor: actorFromContext(ctx),
    targetType: "observation",
    targetId: row.id,
    correlationId,
    summary: `Observation logged (${row.observationType})`,
    metadata: { landscapeAreaId, staffMemberId },
  });
  return row;
}

export async function getObservation(id: string): Promise<ObservationRow> {
  const row = await repo.selectObservationById(id);
  if (!row) throw notFound(`Observation not found: ${id}`);
  return row;
}

export async function listObservations(
  landscapeAreaId?: string,
): Promise<ObservationRow[]> {
  return repo.selectObservations(landscapeAreaId);
}

export async function updateObservation(
  ctx: AuthContext,
  id: string,
  input: CreateObservationInput,
  correlationId: string,
): Promise<ObservationRow> {
  const patch: Partial<ObservationRow> = {};
  const observationType = validateType(input.observationType);
  if (observationType) {
    patch.observationType =
      observationType as ObservationRow["observationType"];
  }
  if (input.notes !== undefined) {
    patch.notes = typeof input.notes === "string" ? input.notes : null;
  }
  if (
    typeof input.observedAt === "string" &&
    !Number.isNaN(Date.parse(input.observedAt))
  ) {
    patch.observedAt = new Date(input.observedAt);
  }

  const row = await repo.updateObservationById(id, patch);
  if (!row) throw notFound(`Observation not found: ${id}`);

  await recordAuditEvent({
    action: AUDIT_ACTIONS.ObservationUpdated,
    actor: actorFromContext(ctx),
    targetType: "observation",
    targetId: row.id,
    correlationId,
    summary: `Observation updated (${row.observationType})`,
    metadata: { changed: Object.keys(patch) },
  });
  return row;
}
