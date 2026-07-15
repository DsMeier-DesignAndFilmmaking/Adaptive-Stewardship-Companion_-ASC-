import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type NewObservationRow,
  type ObservationRow,
  observations,
} from "@/lib/db/schema/observation";

export async function insertObservation(
  values: NewObservationRow,
): Promise<ObservationRow> {
  const [row] = await db.insert(observations).values(values).returning();
  return row;
}

export async function selectObservationById(
  id: string,
): Promise<ObservationRow | null> {
  const [row] = await db
    .select()
    .from(observations)
    .where(eq(observations.id, id))
    .limit(1);
  return row ?? null;
}

export async function selectObservations(
  landscapeAreaId?: string,
): Promise<ObservationRow[]> {
  return db
    .select()
    .from(observations)
    .where(
      landscapeAreaId
        ? eq(observations.landscapeAreaId, landscapeAreaId)
        : undefined,
    )
    .orderBy(desc(observations.observedAt));
}

export async function updateObservationById(
  id: string,
  patch: Partial<NewObservationRow>,
): Promise<ObservationRow | null> {
  const [row] = await db
    .update(observations)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(observations.id, id))
    .returning();
  return row ?? null;
}
