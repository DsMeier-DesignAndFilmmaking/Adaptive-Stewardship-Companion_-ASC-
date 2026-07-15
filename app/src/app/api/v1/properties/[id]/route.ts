import { ok, withAuth, withRole } from "@/lib/api";
import { getProperty, updateProperty } from "@/lib/property/service";

export const GET = withAuth(async (_req, rc) => {
  const { id } = await rc.params;
  return ok(await getProperty(String(id)));
});

export const PATCH = withRole(
  "manager",
  async (req, rc, { ctx, correlationId }) => {
    const { id } = await rc.params;
    const body = await req.json().catch(() => ({}));
    return ok(await updateProperty(ctx, String(id), body, correlationId));
  },
);
