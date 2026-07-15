import { NextResponse } from "next/server";
import { API_VERSION, HEADER_API_VERSION } from "./constants";
import type { CursorPagination } from "./pagination";

// Standardized success responses (api-architecture.md §7).
// Envelope: { data } (single) / { data, pagination } (collection). camelCase.
// The correlation-id header is stamped by `withApi` on the way out, so these
// helpers stay correlation-agnostic and ergonomic: `return ok(data)`.

function versionHeaders(): Record<string, string> {
  return { [HEADER_API_VERSION]: API_VERSION };
}

export function ok<T>(data: T, init?: { status?: number }): NextResponse {
  return NextResponse.json(
    { data },
    { status: init?.status ?? 200, headers: versionHeaders() },
  );
}

export function created<T>(data: T): NextResponse {
  return ok(data, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204, headers: versionHeaders() });
}

export function collection<T>(
  data: T[],
  pagination: CursorPagination,
): NextResponse {
  return NextResponse.json(
    { data, pagination },
    { status: 200, headers: versionHeaders() },
  );
}
