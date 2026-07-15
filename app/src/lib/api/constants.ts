// API platform constants (api-architecture.md §3, §6, §9).

export const API_VERSION = "v1" as const;

// Header names (lowercase; Headers are case-insensitive).
export const HEADER_CORRELATION_ID = "x-correlation-id";
export const HEADER_API_VERSION = "x-asc-api-version";

// RFC 9457 problem `type` URIs are namespaced under this base.
export const PROBLEM_TYPE_BASE = "https://api.asc.app/errors/";
