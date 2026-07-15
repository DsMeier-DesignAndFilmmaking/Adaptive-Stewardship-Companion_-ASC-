/**
 * F5 cold-start seed: grant the very first Owner role.
 *
 * This is deliberately NOT an application code path (security-architecture.md
 * §4: "Admin/platform access ... must be separately authenticated, heavily
 * audited, and time-boxed — never a quiet superuser backdoor in the app.").
 * It runs at the same operational tier as `db:migrate` — a human, holding the
 * privileged MIGRATION_DATABASE_URL credential, running a one-time command
 * outside the deployed app. It is not reachable over HTTP.
 *
 * Guards (both enforced inside a single transaction):
 *   1. Refuses if ANY owner already exists — makes this script provably
 *      single-purpose (cold-start only). Once bootstrapped, all further role
 *      changes go through the audited API: PATCH /api/v1/users/[id]/role.
 *   2. Refuses if the target email has no existing identity.users row — the
 *      person must have already signed up once (JIT or webhook). This script
 *      never fabricates a phantom pre-provisioned identity ("invites" are an
 *      explicitly deferred feature, ADR-003 footnote 1).
 *
 * Usage: npm run db:seed-owner -- --email=owner@example.com
 */
import { config } from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, isNull, sql } from "drizzle-orm";
import { userProfiles, users } from "../src/lib/db/schema/identity";
import { auditEvents } from "../src/lib/db/schema/audit";

config({ path: ".env.local" });

function parseEmailArg(): string {
  const arg = process.argv.slice(2).find((a) => a.startsWith("--email="));
  const email = arg?.slice("--email=".length).trim();
  if (!email) {
    console.error("Usage: npm run db:seed-owner -- --email=<address>");
    process.exit(1);
  }
  return email;
}

class SeedGuardError extends Error {}

async function main() {
  const email = parseEmailArg();

  const connectionString = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("MIGRATION_DATABASE_URL (or DATABASE_URL) is not set. See app/.env.example.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    const result = await db.transaction(async (tx) => {
      const [{ count: ownerCount }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(userProfiles)
        .where(eq(userProfiles.role, "owner"));
      if (ownerCount > 0) {
        throw new SeedGuardError(
          "An owner already exists. This script is single-use, for cold start only.\n" +
            "Use the role-elevation API instead: PATCH /api/v1/users/{id}/role (as an existing owner).",
        );
      }

      const [target] = await tx
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.email, email), isNull(users.deletedAt)))
        .limit(1);
      if (!target) {
        throw new SeedGuardError(
          `No user found for "${email}". They must sign up first (via /sign-up), then re-run this script.`,
        );
      }

      await tx
        .update(userProfiles)
        .set({ role: "owner", updatedAt: new Date() })
        .where(eq(userProfiles.userId, target.id));

      await tx.insert(auditEvents).values({
        action: "identity.user.owner_seeded",
        actorType: "system",
        targetType: "user",
        targetId: target.id,
        summary: `Owner seeded via cold-start script for ${email}`,
        metadata: { grantedVia: "seed-script", operator: process.env.USER ?? null },
      });

      return target.id;
    });

    console.log(`Owner granted: ${email} (user id ${result}).`);
    process.exitCode = 0;
  } catch (err) {
    if (err instanceof SeedGuardError) {
      console.error(`Refused: ${err.message}`);
    } else {
      console.error("Seed failed:", err);
    }
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
