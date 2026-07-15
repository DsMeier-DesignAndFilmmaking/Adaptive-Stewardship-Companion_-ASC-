import { and, eq, isNull, sql } from "drizzle-orm";
import { AUDIT_ACTIONS, recordAuditEvent, safeAudit, systemActor } from "@/lib/audit";
import { DEFAULT_ROLE, type Role } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { userProfiles, users } from "@/lib/db/schema/identity";

// Identity data-access. Reused by the auth context (JIT provisioning) and the
// Clerk webhook (lifecycle sync) so provisioning logic lives in exactly one place.

export type AuthUser = {
  userId: string;
  email: string | null;
  role: Role;
};

/** Resolve the ASC user + role for a Clerk user id, or null if not provisioned. */
export async function findAuthUserByClerkId(
  clerkUserId: string,
): Promise<AuthUser | null> {
  const rows = await db
    .select({
      userId: users.id,
      email: users.email,
      role: userProfiles.role,
    })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  return rows[0] ?? null;
}

/**
 * Idempotently provision a user + profile (default role). Safe to call
 * repeatedly (JIT on first request AND from the user.created webhook) — the
 * webhook-idempotency requirement of ADR-002. `source` records which path
 * actually created the row, for audit visibility.
 *
 * neon-http has no interactive transaction; the two upserts are individually
 * idempotent, so a retry after a partial failure converges.
 *
 * Audits exactly once per real creation: the user_profiles insert's
 * onConflictDoNothing().returning() is empty on an idempotent replay (row
 * already existed) and non-empty on a genuine first insert — that's the
 * only reliable "was this new" signal (the users upsert always returns a
 * row via onConflictDoUpdate, so it can't be used for this check).
 */
export async function provisionUser(
  clerkUserId: string,
  email: string | null,
  source: "jit" | "webhook",
): Promise<AuthUser> {
  const [u] = await db
    .insert(users)
    .values({ clerkUserId, email })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: { updatedAt: new Date(), ...(email ? { email } : {}) },
    })
    .returning({ id: users.id, email: users.email });

  const insertedProfiles = await db
    .insert(userProfiles)
    .values({ userId: u.id, role: DEFAULT_ROLE })
    .onConflictDoNothing({ target: userProfiles.userId })
    .returning({ role: userProfiles.role });

  const isNewUser = insertedProfiles.length > 0;
  const profile = isNewUser
    ? insertedProfiles[0]
    : (
        await db
          .select({ role: userProfiles.role })
          .from(userProfiles)
          .where(eq(userProfiles.userId, u.id))
          .limit(1)
      )[0];

  if (isNewUser) {
    // Provisioning is infrastructural, not a user decision: at this instant
    // the new user's own userId (the audit anchor) has no prior existence to
    // attribute to, so this is a system actor for both the JIT and webhook
    // paths (AUD-1; security-architecture.md §5 names identity events as
    // audit-critical). Log-and-continue, not throw-on-failure (AUD-7 still
    // applies as an alert, not a block): a transient audit-write blip must
    // not lock a brand-new user out of their own first login.
    await safeAudit(() =>
      recordAuditEvent({
        action: AUDIT_ACTIONS.IdentityUserProvisioned,
        actor: systemActor(),
        targetType: "user",
        targetId: u.id,
        summary: `User provisioned (${source})`,
        metadata: { source },
      }),
    );
  }

  return { userId: u.id, email: u.email, role: profile?.role ?? DEFAULT_ROLE };
}

/** Update the mirrored email (Clerk user.updated). No-op if user absent. */
export async function updateUserEmail(
  clerkUserId: string,
  email: string | null,
): Promise<void> {
  await db
    .update(users)
    .set({ email, updatedAt: new Date() })
    .where(eq(users.clerkUserId, clerkUserId));
}

/** Soft delete (Clerk user.deleted). PII anonymization is a documented follow-on. */
export async function softDeleteUser(clerkUserId: string): Promise<void> {
  await db
    .update(users)
    .set({ deletedAt: sql`now()`, updatedAt: new Date() })
    .where(eq(users.clerkUserId, clerkUserId));
}

// --- Admin-facing reads/writes (F5: role-elevation path) ---

/** All non-deleted users with their role, for the Owner-only admin listing. */
export async function listUsers(): Promise<AuthUser[]> {
  return db
    .select({ userId: users.id, email: users.email, role: userProfiles.role })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(isNull(users.deletedAt));
}

/** Resolve a single user by ASC user id, or null if absent/soft-deleted. */
export async function findUserById(userId: string): Promise<AuthUser | null> {
  const rows = await db
    .select({ userId: users.id, email: users.email, role: userProfiles.role })
    .from(users)
    .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}

/** Set a user's role. Returns the updated user, or null if the user is absent. */
export async function updateUserRole(
  userId: string,
  role: Role,
): Promise<AuthUser | null> {
  const [updated] = await db
    .update(userProfiles)
    .set({ role, updatedAt: new Date() })
    .where(eq(userProfiles.userId, userId))
    .returning({ userId: userProfiles.userId });

  if (!updated) return null;
  return findUserById(userId);
}

/**
 * Count active owners — the app-layer half of the last-owner guard (fast,
 * friendly 409 in the service layer; the DB trigger on user_profiles is the
 * hard backstop against the neon-http TOCTOU race between two concurrent
 * requests, see migration 000X_last_owner_guard.sql).
 */
export async function countOwners(): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(userProfiles)
    .innerJoin(users, eq(users.id, userProfiles.userId))
    .where(and(eq(userProfiles.role, "owner"), isNull(users.deletedAt)));
  return row?.count ?? 0;
}
