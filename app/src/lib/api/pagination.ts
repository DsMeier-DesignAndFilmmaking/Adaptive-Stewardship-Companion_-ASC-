// Cursor pagination (api-architecture.md §8). Opaque base64url cursor over a
// stable key (createdAt + id). Scaffolding — no domain consumer yet.

export type CursorPagination = {
  nextCursor: string | null;
  hasMore: boolean;
};

export function encodeCursor(value: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function decodeCursor<T = Record<string, unknown>>(
  cursor: string,
): T | null {
  try {
    return JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

/**
 * Given `limit + 1` fetched rows, slice to `limit` and derive the page cursor.
 * `toCursor` returns the stable key of the last row (e.g. { createdAt, id }).
 */
export function buildPagination<T>(
  items: T[],
  limit: number,
  toCursor: (item: T) => Record<string, unknown>,
): { items: T[]; pagination: CursorPagination } {
  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const last = page[page.length - 1];
  return {
    items: page,
    pagination: {
      hasMore,
      nextCursor: hasMore && last ? encodeCursor(toCursor(last)) : null,
    },
  };
}
