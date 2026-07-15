import { auth, currentUser } from "@clerk/nextjs/server";
import { findAuthUserByClerkId, provisionUser } from "@/lib/db/users";
import type { Role } from "@/lib/auth/roles";

/**
 * AuthContext — the resolved caller identity + role.
 *
 * This is the shared service-layer enforcement point (reconciliation OWN-1):
 * BOTH route handlers and server components call getAuthContext(), so tenancy
 * and role are never enforced only in middleware.
 *
 * Extension point (Organizations, later): add `organizationId` and switch the
 * role source to org-scoped membership INSIDE getAuthContext(). This type gains
 * a field; existing callers destructure what they use and need no change — the
 * "no auth refactoring when adding tenancy" guarantee.
 */
export type AuthContext = {
  userId: string; // ASC user id (accountability anchor — DATA-1)
  clerkUserId: string;
  email: string | null;
  role: Role;
};

/**
 * Resolve the current caller, or null if unauthenticated.
 * JIT-provisions the ASC user on first access, so the foundation works before
 * the Clerk webhook is configured (the webhook is the lifecycle sync).
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const existing = await findAuthUserByClerkId(clerkUserId);
  if (existing) {
    return { ...existing, clerkUserId };
  }

  // JIT provisioning: fetch email from Clerk once, then persist. Subsequent
  // requests take the fast path above (no Clerk round-trip).
  const cu = await currentUser();
  const email =
    cu?.primaryEmailAddress?.emailAddress ??
    cu?.emailAddresses?.[0]?.emailAddress ??
    null;

  const provisioned = await provisionUser(clerkUserId, email, "jit");
  return { ...provisioned, clerkUserId };
}

export class UnauthorizedError extends Error {
  readonly status = 401 as const;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** Convenience for route handlers: resolve or throw UnauthorizedError. */
export async function requireAuthContext(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx) throw new UnauthorizedError();
  return ctx;
}
