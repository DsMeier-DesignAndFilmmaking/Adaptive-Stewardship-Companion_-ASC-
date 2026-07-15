import { ok, withAuth } from "@/lib/api";

// Canonical protected endpoint (api-architecture.md §1), now built on the API
// platform: withAuth handles session validation + 401 problem+json; ok() applies
// the { data } envelope; withApi stamps the correlation id + version headers.
// Tenant is implicit from auth, never the URL (trivially true — tenancy deferred).
export const GET = withAuth((_req, _rc, { ctx }) =>
  ok({ user: { id: ctx.userId, email: ctx.email, role: ctx.role } }),
);
