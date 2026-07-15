import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type LandscapeAreaRow,
  type NewLandscapeAreaRow,
  landscapeAreas,
} from "@/lib/db/schema/property";

export async function insertLandscapeArea(
  values: NewLandscapeAreaRow,
): Promise<LandscapeAreaRow> {
  const [row] = await db.insert(landscapeAreas).values(values).returning();
  return row;
}

export async function selectLandscapeAreaById(
  id: string,
): Promise<LandscapeAreaRow | null> {
  const [row] = await db
    .select()
    .from(landscapeAreas)
    .where(eq(landscapeAreas.id, id))
    .limit(1);
  return row ?? null;
}

export async function selectLandscapeAreas(
  propertyId?: string,
): Promise<LandscapeAreaRow[]> {
  return db
    .select()
    .from(landscapeAreas)
    .where(propertyId ? eq(landscapeAreas.propertyId, propertyId) : undefined)
    .orderBy(desc(landscapeAreas.createdAt));
}

export async function updateLandscapeAreaById(
  id: string,
  patch: Partial<NewLandscapeAreaRow>,
): Promise<LandscapeAreaRow | null> {
  const [row] = await db
    .update(landscapeAreas)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(landscapeAreas.id, id))
    .returning();
  return row ?? null;
}
