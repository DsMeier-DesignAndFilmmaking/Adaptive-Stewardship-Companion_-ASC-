import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as identity from "./schema/identity";

// Single DB client — the ONLY module that knows the driver.
//
// E1 uses the neon-http (stateless) driver: simplest, sufficient with no RLS.
// When tenancy/RLS lands, swap to the neon Pool/WebSocket driver here (to carry
// `SET LOCAL app.current_organization_id` per transaction, the TEN-1/TEN-2
// decision) and add a `withTenant(orgId, fn)` primitive — a one-file change
// that does not touch the auth layer.

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. See app/.env.example.");
}

const client = neon(process.env.DATABASE_URL);

export const db = drizzle(client, {
  schema: { ...identity },
});
