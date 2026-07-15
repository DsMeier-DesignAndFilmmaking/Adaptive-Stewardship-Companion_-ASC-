import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Coarse route protection only. Authoritative enforcement (tenant/role) lives
// in getAuthContext() at the route/RSC level (reconciliation OWN-1).
//
// Public by omission: /, /research-beta (the static prototype), /sign-in,
// /sign-up, and /api/webhooks/* (verified by signature, not session).
const isProtected = createRouteMatcher(["/api/v1(.*)", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
