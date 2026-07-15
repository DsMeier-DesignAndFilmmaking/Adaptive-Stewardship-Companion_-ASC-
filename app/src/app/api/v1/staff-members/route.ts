import { collection, created, withRole } from "@/lib/api";
import { createStaffMember, listStaffMembers } from "@/lib/staff-member/service";

// Roster read is Manager+ (staff PII); staff management is Owner-only (ADR-003
// permission matrix — membership/role changes are Owner-only).
export const GET = withRole("manager", async () => {
  const items = await listStaffMembers();
  return collection(items, { nextCursor: null, hasMore: false });
});

export const POST = withRole(
  "owner",
  async (req, _rc, { ctx, correlationId }) => {
    const body = await req.json().catch(() => ({}));
    return created(await createStaffMember(ctx, body, correlationId));
  },
);
