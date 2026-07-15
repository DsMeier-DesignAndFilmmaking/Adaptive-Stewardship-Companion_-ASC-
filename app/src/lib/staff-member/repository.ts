import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type NewStaffMemberRow,
  type StaffMemberRow,
  staffMembers,
} from "@/lib/db/schema/property";
import { users } from "@/lib/db/schema/identity";

export async function insertStaffMember(
  values: NewStaffMemberRow,
): Promise<StaffMemberRow> {
  const [row] = await db.insert(staffMembers).values(values).returning();
  return row;
}

export async function selectStaffMemberById(
  id: string,
): Promise<StaffMemberRow | null> {
  const [row] = await db
    .select()
    .from(staffMembers)
    .where(eq(staffMembers.id, id))
    .limit(1);
  return row ?? null;
}

export async function selectStaffMemberByUserId(
  userId: string,
): Promise<StaffMemberRow | null> {
  const [row] = await db
    .select()
    .from(staffMembers)
    .where(eq(staffMembers.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function selectStaffMembers(): Promise<StaffMemberRow[]> {
  return db.select().from(staffMembers).orderBy(desc(staffMembers.createdAt));
}

export async function updateStaffMemberById(
  id: string,
  patch: Partial<NewStaffMemberRow>,
): Promise<StaffMemberRow | null> {
  const [row] = await db
    .update(staffMembers)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(staffMembers.id, id))
    .returning();
  return row ?? null;
}

/** Existence check for an optional user link. */
export async function userExists(userId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return Boolean(row);
}
