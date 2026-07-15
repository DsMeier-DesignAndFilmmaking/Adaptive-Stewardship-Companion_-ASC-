import { collection, created, withAuth, withRole } from "@/lib/api";
import { createProperty, listProperties } from "@/lib/property/service";

export const GET = withAuth(async () => {
  const items = await listProperties();
  return collection(items, { nextCursor: null, hasMore: false });
});

export const POST = withRole(
  "manager",
  async (req, _rc, { ctx, correlationId }) => {
    const body = await req.json().catch(() => ({}));
    return created(await createProperty(ctx, body, correlationId));
  },
);
