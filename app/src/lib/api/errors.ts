import { NextResponse } from "next/server";
import {
  API_VERSION,
  HEADER_API_VERSION,
  HEADER_CORRELATION_ID,
  PROBLEM_TYPE_BASE,
} from "./constants";

// Standardized errors — RFC 9457 problem+json (api-architecture.md §6).
// Clients switch on the stable `code`, never on `status` or human text.

export const ERROR_CODES = {
  UNAUTHORIZED: { status: 401, title: "Unauthorized" },
  FORBIDDEN: { status: 403, title: "Forbidden" },
  NOT_FOUND: { status: 404, title: "Not Found" },
  VALIDATION_ERROR: { status: 400, title: "Validation Failed" },
  CONFLICT: { status: 409, title: "Conflict" },
  RATE_LIMITED: { status: 429, title: "Too Many Requests" },
  INTERNAL: { status: 500, title: "Internal Server Error" },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly detail?: string;
  readonly fieldErrors?: FieldError[];
  readonly extra?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    opts?: {
      detail?: string;
      fieldErrors?: FieldError[];
      extra?: Record<string, unknown>;
    },
  ) {
    super(opts?.detail ?? ERROR_CODES[code].title);
    this.name = "ApiError";
    this.code = code;
    this.status = ERROR_CODES[code].status;
    this.detail = opts?.detail;
    this.fieldErrors = opts?.fieldErrors;
    this.extra = opts?.extra;
  }
}

// Factories.
export const unauthorized = (detail?: string) =>
  new ApiError("UNAUTHORIZED", { detail });
export const forbidden = (detail?: string) =>
  new ApiError("FORBIDDEN", { detail });
export const notFound = (detail?: string) =>
  new ApiError("NOT_FOUND", { detail });
export const badRequest = (fieldErrors?: FieldError[], detail?: string) =>
  new ApiError("VALIDATION_ERROR", { fieldErrors, detail });
export const conflict = (currentState?: unknown, detail?: string) =>
  new ApiError("CONFLICT", {
    detail,
    extra: currentState !== undefined ? { currentState } : undefined,
  });
export const internal = (detail?: string) =>
  new ApiError("INTERNAL", { detail });

function slug(code: ErrorCode): string {
  return code.toLowerCase().replace(/_/g, "-");
}

/** Map any thrown value to an RFC 9457 problem+json response. */
export function toProblemResponse(
  err: unknown,
  correlationId: string,
): NextResponse {
  // Unexpected (non-ApiError) => 500, logged, no internal leakage.
  if (!(err instanceof ApiError)) {
    console.error("[api] unhandled error", err);
  }
  const apiErr = err instanceof ApiError ? err : internal();
  const { code, status, detail, fieldErrors, extra } = apiErr;
  const safeDetail = status >= 500 ? undefined : detail;

  const body = {
    type: `${PROBLEM_TYPE_BASE}${slug(code)}`,
    title: ERROR_CODES[code].title,
    status,
    code,
    ...(safeDetail ? { detail: safeDetail } : {}),
    ...(fieldErrors && fieldErrors.length ? { errors: fieldErrors } : {}),
    ...(extra ?? {}),
    traceId: correlationId,
  };

  return NextResponse.json(body, {
    status,
    headers: {
      "content-type": "application/problem+json",
      [HEADER_CORRELATION_ID]: correlationId,
      [HEADER_API_VERSION]: API_VERSION,
    },
  });
}
