import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so it does not auto-load .env.local.
// Load it explicitly for `db:generate` / `db:migrate` / `db:studio`.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema/*",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Direct (unpooled) connection + privileged role for migrations only.
    url: process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  },
  schemaFilter: [
    "identity",
    "audit",
    "recommendation",
    "property",
    "observation",
  ],
  verbose: true,
  strict: true,
});
