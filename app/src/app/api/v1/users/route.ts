import { collection, withRole } from "@/lib/api";
import { listUsersForAdmin } from "@/lib/user/service";

// Owner-only: user roster + roles (ADR-003 permission matrix — membership/role
// visibility is an Owner concern, not general operational data). Exists so the
// role-elevation endpoint below is usable without falling back to raw SQL to
// look up user ids.
export const GET = withRole("owner", async () => {
  const items = await listUsersForAdmin();
  return collection(items, { nextCursor: null, hasMore: false });
});
