type BetaHeaderProps = {
  propertyName: string;
};

// Intentionally static — nothing here changes with the active scenario.
// Scenario-dependent context (operating moment, weather, decision owner)
// lives inside the Daily Briefing card instead, below the scenario tabs in
// ScenarioBar. Standard tab pattern: a control should precede the content it
// affects, never follow it — this used to show scenario-dependent data above
// the tabs that determine it, which reads backwards.
export function BetaHeader({ propertyName }: BetaHeaderProps) {
  return (
    <header className="border-b border-border bg-card/90 py-4 shadow-[0_1px_0_rgba(27,24,19,0.04)] backdrop-blur">
      <div className="mx-auto w-[calc(100vw-2rem)] max-w-7xl md:w-[calc(100vw-3rem)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Research Beta
        </p>
        <h1 className="mt-1 max-w-full break-words font-serif text-[1.8rem] font-semibold leading-tight text-foreground [overflow-wrap:anywhere] md:text-3xl">
          {propertyName}
        </h1>
      </div>
    </header>
  );
}
