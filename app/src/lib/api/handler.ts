import { type NextRequest } from "next/server";
import { type AuthContext, getAuthContext } from "@/lib/auth/context";
import { hasRole, type Role } from "@/lib/auth/roles";
import { HEADER_CORRELATION_ID } from "./constants";
import { forbidden, toProblemResponse, unauthorized } from "./errors";

// Composable route-handler wrappers — the auth/authz "middleware" lives HERE, in
// the service layer, not in Next's middleware.ts (reconciliation OWN-1;
// api-architecture.md §10). Compose: withApi -> withAuth -> withRole.

// Next's dynamic-route context. Loose params typing so any route shape composes.
type RouteContext = { params: Promise<Record<string, string | string[]>> };

export type Api = { correlationId: string };
export type AuthedApi = Api & { ctx: AuthContext };

type BaseHandler = (
  req: NextRequest,
  rc: RouteContext,
  api: Api,
) => Response | Promise<Response>;

type AuthedHandler = (
  req: NextRequest,
  rc: RouteContext,
  api: AuthedApi,
) => Response | Promise<Response>;

function correlationIdFrom(req: NextRequest): string {
  return req.headers.get(HEADER_CORRELATION_ID) ?? crypto.randomUUID();
}

/** Base wrapper: correlation id + error boundary (any throw -> problem+json). */
export function withApi(handler: BaseHandler) {
  return async (req: NextRequest, rc: RouteContext): Promise<Response> => {
    const correlationId = correlationIdFrom(req);
    try {
      const res = await handler(req, rc, { correlationId });
      res.headers.set(HEADER_CORRELATION_ID, correlationId);
      return res;
    } catch (err) {
      return toProblemResponse(err, correlationId);
    }
  };
}

/** Authentication wrapper: resolves the caller or 401s. */
export function withAuth(handler: AuthedHandler) {
  return withApi(async (req, rc, api) => {
    const ctx = await getAuthContext();
    if (!ctx) throw unauthorized();
    return handler(req, rc, { ...api, ctx });
  });
}

/**
 * Authorization wrapper: requires `min` role or higher (foundation hierarchy —
 * the full ADR-003 permission matrix is deferred). 403 if insufficient.
 */
export function withRole(min: Role, handler: AuthedHandler) {
  return withAuth(async (req, rc, api) => {
    if (!hasRole(api.ctx.role, min)) {
      throw forbidden(`Requires role '${min}' or higher.`);
    }
    return handler(req, rc, api);
  });
}
