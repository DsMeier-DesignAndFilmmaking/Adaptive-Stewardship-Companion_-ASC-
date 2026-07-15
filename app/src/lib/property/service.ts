import { badRequest, notFound } from "@/lib/api";
import { AUDIT_ACTIONS, actorFromContext, recordAuditEvent } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/context";
import {
  PROPERTY_STATUSES,
  type PropertyRow,
} from "@/lib/db/schema/property";
import * as repo from "./repository";

// Domain service for Property: validation + persistence + audit (ADR-003 AUD-1).
// Services throw ApiError (badRequest/notFound) directly — the API layer is
// shared infrastructure and withApi's error boundary maps them to problem+json.
//
// Atomicity note: the write and the audit emit are separate awaits (neon-http,
// no interactive transaction — TEN-1). Documented gap; ordered write-then-audit.

export type CreatePropertyInput = {
  name?: unknown;
  description?: unknown;
  status?: unknown;
};

export type UpdatePropertyInput = CreatePropertyInput;

function validateStatus(status: unknown): string | undefined {
  if (status === undefined || status === null) return undefined;
  if (
    typeof status !== "string" ||
    !(PROPERTY_STATUSES as readonly string[]).includes(status)
  ) {
    throw badRequest([
      {
        field: "status",
        message: `Status must be one of: ${PROPERTY_STATUSES.join(", ")}.`,
      },
    ]);
  }
  return status;
}

export async function createProperty(
  ctx: AuthContext,
  input: CreatePropertyInput,
  correlationId: string,
): Promise<PropertyRow> {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) {
    throw badRequest([{ field: "name", message: "Name is required." }]);
  }
  const status = validateStatus(input.status);
  const description =
    typeof input.description === "string" ? input.description : null;

  const row = await repo.insertProperty({
    name,
    description,
    ...(status ? { status: status as PropertyRow["status"] } : {}),
  });

  await recordAuditEvent({
    action: AUDIT_ACTIONS.PropertyCreated,
    actor: actorFromContext(ctx),
    targetType: "property",
    targetId: row.id,
    correlationId,
    summary: `Property created: ${row.name}`,
  });
  return row;
}

export async function getProperty(id: string): Promise<PropertyRow> {
  const row = await repo.selectPropertyById(id);
  if (!row) throw notFound(`Property not found: ${id}`);
  return row;
}

export async function listProperties(): Promise<PropertyRow[]> {
  return repo.selectProperties();
}

export async function updateProperty(
  ctx: AuthContext,
  id: string,
  input: UpdatePropertyInput,
  correlationId: string,
): Promise<PropertyRow> {
  const patch: Partial<PropertyRow> = {};
  if (input.name !== undefined) {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name) {
      throw badRequest([{ field: "name", message: "Name cannot be empty." }]);
    }
    patch.name = name;
  }
  if (input.description !== undefined) {
    patch.description =
      typeof input.description === "string" ? input.description : null;
  }
  const status = validateStatus(input.status);
  if (status) patch.status = status as PropertyRow["status"];

  const row = await repo.updatePropertyById(id, patch);
  if (!row) throw notFound(`Property not found: ${id}`);

  await recordAuditEvent({
    action: AUDIT_ACTIONS.PropertyUpdated,
    actor: actorFromContext(ctx),
    targetType: "property",
    targetId: row.id,
    correlationId,
    summary: `Property updated: ${row.name}`,
    metadata: { changed: Object.keys(patch) },
  });
  return row;
}
