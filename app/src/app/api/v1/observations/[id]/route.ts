import { ok, withAuth, withRole } from "@/lib/api";
import { getObservation, updateObservation } from "@/lib/observation/service";

export const GET = withAuth(async (_req, rc) => {
  const { id } = await rc.params;
  return ok(await getObservation(String(id)));
});

export const PATCH = withRole(
  "staff",
  async (req, rc, { ctx, correlationId }) => {
    const { id } = await rc.params;
    const body = await req.json().catch(() => ({}));
    return ok(await updateObservation(ctx, String(id), body, correlationId));
  },
);
