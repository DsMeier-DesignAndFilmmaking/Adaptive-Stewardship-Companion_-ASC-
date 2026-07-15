import { badRequest, notFound } from "@/lib/api";
import { AUDIT_ACTIONS, actorFromContext, recordAuditEvent } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/context";
import {
  AREA_STATUSES,
  AREA_TYPES,
  type LandscapeAreaRow,
} from "@/lib/db/schema/property";
import { selectPropertyById } from "@/lib/property/repository";
import * as repo from "./repository";

// Domain service for Landscape Area. Validates the parent Property exists (a
// proper relationship, not a loose ref) before creating.

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

export type CreateLandscapeAreaInput = {
  propertyId?: unknown;
  name?: unknown;
  areaType?: unknown;
  status?: unknown;
  metadata?: unknown;
};

export type UpdateLandscapeAreaInput = Omit<
  CreateLandscapeAreaInput,
  "propertyId"
>;

export async function createLandscapeArea(
  ctx: AuthContext,
  input: CreateLandscapeAreaInput,
  correlationId: string,
): Promise<LandscapeAreaRow> {
  const propertyId =
    typeof input.propertyId === "string" ? input.propertyId : "";
  if (!propertyId) {
    throw badRequest([
      { field: "propertyId", message: "propertyId is required." },
    ]);
  }
  const property = await selectPropertyById(propertyId);
  if (!property) {
    throw badRequest([
      { field: "propertyId", message: `Property not found: ${propertyId}.` },
    ]);
  }
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) throw badRequest([{ field: "name", message: "Name is required." }]);

  const areaType = validateEnum(input.areaType, AREA_TYPES, "areaType");
  const status = validateEnum(input.status, AREA_STATUSES, "status");
  const metadata =
    input.metadata && typeof input.metadata === "object"
      ? (input.metadata as Record<string, unknown>)
      : undefined;

  const row = await repo.insertLandscapeArea({
    propertyId,
    name,
    ...(areaType ? { areaType: areaType as LandscapeAreaRow["areaType"] } : {}),
    ...(status ? { status: status as LandscapeAreaRow["status"] } : {}),
    ...(metadata ? { metadata } : {}),
  });

  await recordAuditEvent({
    action: AUDIT_ACTIONS.LandscapeAreaCreated,
    actor: actorFromContext(ctx),
    targetType: "landscape_area",
    targetId: row.id,
    correlationId,
    summary: `Landscape area created: ${row.name}`,
    metadata: { propertyId },
  });
  return row;
}

export async function getLandscapeArea(id: string): Promise<LandscapeAreaRow> {
  const row = await repo.selectLandscapeAreaById(id);
  if (!row) throw notFound(`Landscape area not found: ${id}`);
  return row;
}

export async function listLandscapeAreas(
  propertyId?: string,
): Promise<LandscapeAreaRow[]> {
  return repo.selectLandscapeAreas(propertyId);
}

export async function updateLandscapeArea(
  ctx: AuthContext,
  id: string,
  input: UpdateLandscapeAreaInput,
  correlationId: string,
): Promise<LandscapeAreaRow> {
  const patch: Partial<LandscapeAreaRow> = {};
  if (input.name !== undefined) {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name) {
      throw badRequest([{ field: "name", message: "Name cannot be empty." }]);
    }
    patch.name = name;
  }
  const areaType = validateEnum(input.areaType, AREA_TYPES, "areaType");
  if (areaType) patch.areaType = areaType as LandscapeAreaRow["areaType"];
  const status = validateEnum(input.status, AREA_STATUSES, "status");
  if (status) patch.status = status as LandscapeAreaRow["status"];
  if (input.metadata && typeof input.metadata === "object") {
    patch.metadata = input.metadata as Record<string, unknown>;
  }

  const row = await repo.updateLandscapeAreaById(id, patch);
  if (!row) throw notFound(`Landscape area not found: ${id}`);

  await recordAuditEvent({
    action: AUDIT_ACTIONS.LandscapeAreaUpdated,
    actor: actorFromContext(ctx),
    targetType: "landscape_area",
    targetId: row.id,
    correlationId,
    summary: `Landscape area updated: ${row.name}`,
    metadata: { changed: Object.keys(patch) },
  });
  return row;
}
