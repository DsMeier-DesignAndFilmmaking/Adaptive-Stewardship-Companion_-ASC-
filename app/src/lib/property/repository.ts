import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type NewPropertyRow,
  type PropertyRow,
  properties,
} from "@/lib/db/schema/property";

// Pure persistence for Property. Orchestration (validation, audit) is the service.

export async function insertProperty(
  values: NewPropertyRow,
): Promise<PropertyRow> {
  const [row] = await db.insert(properties).values(values).returning();
  return row;
}

export async function selectPropertyById(
  id: string,
): Promise<PropertyRow | null> {
  const [row] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);
  return row ?? null;
}

export async function selectProperties(): Promise<PropertyRow[]> {
  return db.select().from(properties).orderBy(desc(properties.createdAt));
}

export async function updatePropertyById(
  id: string,
  patch: Partial<NewPropertyRow>,
): Promise<PropertyRow | null> {
  const [row] = await db
    .update(properties)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(properties.id, id))
    .returning();
  return row ?? null;
}
