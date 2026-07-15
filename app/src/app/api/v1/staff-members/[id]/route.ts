import { ok, withRole } from "@/lib/api";
import { getStaffMember, updateStaffMember } from "@/lib/staff-member/service";

export const GET = withRole("manager", async (_req, rc) => {
  const { id } = await rc.params;
  return ok(await getStaffMember(String(id)));
});

export const PATCH = withRole(
  "owner",
  async (req, rc, { ctx, correlationId }) => {
    const { id } = await rc.params;
    const body = await req.json().catch(() => ({}));
    return ok(await updateStaffMember(ctx, String(id), body, correlationId));
  },
);
