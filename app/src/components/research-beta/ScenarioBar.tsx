import { propertyProfile } from "@/data/research-beta";
import type { Scenario, ScenarioId } from "@/lib/research-beta/types";

type ScenarioBarProps = {
  scenarios: Scenario[];
  activeScenarioId: ScenarioId;
  onSelectScenario: (scenarioId: ScenarioId) => void;
  onReset: () => void;
};

// Facilitator control surface. Rendered as a distinct "backstage" strip at the
// top of the content area — a scenario switch changes the whole operating
// moment, so it belongs above the content it controls, not in a side panel.
// The dashed border signals that this is scaffolding, not part of the product
// the interviewee is reacting to.
//
// Sticky + a fixed set of same-size buttons: the bar's own position never
// moves on click (only border/background classes toggle, not dimensions),
// and `sticky` keeps it pinned in view if the facilitator scrolls a long
// Detail pane, rather than having to scroll back up to switch scenarios.
export function ScenarioBar({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onReset,
}: ScenarioBarProps) {
  return (
    <section
      aria-label="Facilitator scenario controls"
      className="sticky top-2 z-20 rounded-lg border border-dashed border-muted-foreground/25 bg-card/95 p-3 shadow-sm backdrop-blur md:p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex shrink-0 flex-col leading-tight">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Facilitator
            </span>
            <span className="text-xs text-muted-foreground">
              Active scenario
            </span>
          </div>
          <div
            role="group"
            aria-label="Scenarios"
            className="flex flex-wrap gap-2"
          >
            {scenarios.map((scenario) => {
              const isActive = scenario.id === activeScenarioId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`min-h-11 rounded-md border px-3 py-1.5 text-left transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="block text-sm font-semibold leading-5">
                    {scenario.label}
                  </span>
                  <span
                    className={`block text-[11px] leading-4 ${
                      isActive
                        ? "text-primary-foreground/85"
                        : "text-muted-foreground"
                    }`}
                  >
                    {scenario.theme}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 shrink-0 rounded-md border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          Reset demo
        </button>
      </div>
      <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
        <span className="font-medium text-foreground">
          Start with behavioral discovery.
        </span>{" "}
        Reveal a scenario only after the interviewee has described a real recent
        operating decision. {propertyProfile.facilitatorNote}
      </p>
    </section>
  );
}
