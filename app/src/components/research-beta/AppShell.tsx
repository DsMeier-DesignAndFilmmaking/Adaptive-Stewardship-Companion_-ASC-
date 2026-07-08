import type { ReactNode } from "react";

import { propertyProfile } from "@/data/research-beta";

import { BetaHeader } from "./BetaHeader";

type AppShellProps = {
  children: ReactNode;
};

// BetaHeader is now fully static (no scenario prop) — nothing above the
// scenario tabs changes when a tab is clicked. See BetaHeader.tsx.
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BetaHeader propertyName={propertyProfile.name} />
      {/* overflow-x-clip (not hidden) contains the sticky area-scope bar's
          -mx bleed without turning <main> into a scroll container — `hidden`
          coerces overflow-y to auto, which silently breaks position: sticky. */}
      <main className="mx-auto w-[calc(100vw-2rem)] max-w-7xl overflow-x-clip py-5 md:w-[calc(100vw-3rem)] md:py-6">
        {children}
      </main>
    </div>
  );
}
