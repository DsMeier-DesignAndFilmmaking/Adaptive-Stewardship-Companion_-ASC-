import { collection, created, withAuth, withRole } from "@/lib/api";
import {
  createLandscapeArea,
  listLandscapeAreas,
} from "@/lib/landscape-area/service";

export const GET = withAuth(async (req) => {
  const propertyId = req.nextUrl.searchParams.get("propertyId") ?? undefined;
  const items = await listLandscapeAreas(propertyId);
  return collection(items, { nextCursor: null, hasMore: false });
});

export const POST = withRole(
  "manager",
  async (req, _rc, { ctx, correlationId }) => {
    const body = await req.json().catch(() => ({}));
    return created(await createLandscapeArea(ctx, body, correlationId));
  },
);
