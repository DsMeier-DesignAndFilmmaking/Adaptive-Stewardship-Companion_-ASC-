import { ok, withAuth, withRole } from "@/lib/api";
import {
  getLandscapeArea,
  updateLandscapeArea,
} from "@/lib/landscape-area/service";

export const GET = withAuth(async (_req, rc) => {
  const { id } = await rc.params;
  return ok(await getLandscapeArea(String(id)));
});

export const PATCH = withRole(
  "manager",
  async (req, rc, { ctx, correlationId }) => {
    const { id } = await rc.params;
    const body = await req.json().catch(() => ({}));
    return ok(await updateLandscapeArea(ctx, String(id), body, correlationId));
  },
);
