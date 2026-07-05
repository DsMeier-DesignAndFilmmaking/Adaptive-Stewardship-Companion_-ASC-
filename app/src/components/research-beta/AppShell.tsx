import type { ReactNode } from "react";

import { propertyProfile } from "@/data/research-beta";
import type { Scenario } from "@/lib/research-beta/types";

import { BetaHeader } from "./BetaHeader";

type AppShellProps = {
  scenario: Scenario;
  children: ReactNode;
};

export function AppShell({ scenario, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BetaHeader propertyName={propertyProfile.name} scenario={scenario} />
      <main className="mx-auto w-[calc(100vw-2rem)] max-w-7xl overflow-x-hidden py-5 md:w-[calc(100vw-3rem)] md:py-6">
        {children}
      </main>
    </div>
  );
}
