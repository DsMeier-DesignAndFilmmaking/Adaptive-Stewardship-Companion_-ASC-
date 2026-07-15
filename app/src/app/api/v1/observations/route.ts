import { collection, created, withAuth, withRole } from "@/lib/api";
import { createObservation, listObservations } from "@/lib/observation/service";

export const GET = withAuth(async (req) => {
  const landscapeAreaId =
    req.nextUrl.searchParams.get("landscapeAreaId") ?? undefined;
  const items = await listObservations(landscapeAreaId);
  return collection(items, { nextCursor: null, hasMore: false });
});

// Logging observations is the core field-staff action — Staff+ (excludes viewer).
export const POST = withRole(
  "staff",
  async (req, _rc, { ctx, correlationId }) => {
    const body = await req.json().catch(() => ({}));
    return created(await createObservation(ctx, body, correlationId));
  },
);
