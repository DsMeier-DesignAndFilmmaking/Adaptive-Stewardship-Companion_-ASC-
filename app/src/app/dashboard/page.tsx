import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/context";

// Minimal protected server component. Uses the SAME getAuthContext() as the API
// (reconciliation OWN-1: one enforcement path for HTTP and RSC). Middleware
// already protects /dashboard; the null check is defensive.
export default async function DashboardPage() {
  const ctx = await getAuthContext();
  if (!ctx) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Adaptive Stewardship Companion</h1>
        <UserButton />
      </header>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Authentication foundation — signed in with no organization required.
      </p>

      <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt className="font-medium">User ID</dt>
        <dd className="font-mono text-xs">{ctx.userId}</dd>
        <dt className="font-medium">Email</dt>
        <dd>{ctx.email ?? "—"}</dd>
        <dt className="font-medium">Role</dt>
        <dd>{ctx.role}</dd>
      </dl>
    </main>
  );
}
