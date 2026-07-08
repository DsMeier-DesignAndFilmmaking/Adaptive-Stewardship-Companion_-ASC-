import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { propertyProfile } from "@/data/research-beta";
import type { Scenario, ScenarioId } from "@/lib/research-beta/types";

type ScenarioBarProps = {
  scenarios: Scenario[];
  activeScenarioId: ScenarioId;
  onSelectScenario: (scenarioId: ScenarioId) => void;
  onReset: () => void;
  onExport: () => void;
};

type OpenPanel = "scenario" | "more" | null;

// Facilitator control surface — deliberately the least visually dominant
// thing on the page, so Daily Briefing carries the visual hierarchy.
//
// Scenario selection lives behind a combobox-style trigger rather than a row
// of chips: a fixed row of buttons doesn't scale as scenarios are added (10
// exist in research-beta-scenario-library.md; only 4 are wired into this
// build), while a listbox scrolls gracefully at any count. Export/Reset/the
// reminder stay in their own small overflow panel — "pick one of N" and
// "trigger a one-off action" are different interaction models and shouldn't
// share a control (a listbox's children must all be options, not a mix of
// options and unrelated buttons).
export function ScenarioBar({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onReset,
  onExport,
}: ScenarioBarProps) {
  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ??
    scenarios[0];

  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const scenarioWrapRef = useRef<HTMLDivElement>(null);
  const scenarioTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const moreWrapRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);

  // Shared dismiss behavior for both panels: outside click or Escape closes
  // whichever is open and returns focus to its own trigger.
  useEffect(() => {
    if (!openPanel) return;
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const insideScenario = scenarioWrapRef.current?.contains(target);
      const insideMore = moreWrapRef.current?.contains(target);
      if (!insideScenario && !insideMore) setOpenPanel(null);
    }
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        const triggerRef =
          openPanel === "scenario" ? scenarioTriggerRef : moreTriggerRef;
        setOpenPanel(null);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  // Move focus onto the current option whenever the listbox opens, and keep
  // it tracking the focused option during arrow-key navigation.
  useEffect(() => {
    if (openPanel === "scenario") {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [openPanel, focusedIndex]);

  function openScenarioList() {
    const activeIndex = scenarios.findIndex((s) => s.id === activeScenarioId);
    setFocusedIndex(activeIndex >= 0 ? activeIndex : 0);
    setOpenPanel("scenario");
  }

  function selectAndClose(scenarioId: ScenarioId) {
    onSelectScenario(scenarioId);
    setOpenPanel(null);
    scenarioTriggerRef.current?.focus();
  }

  function handleListboxKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setFocusedIndex((current) => (current + 1) % scenarios.length);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setFocusedIndex(
          (current) => (current - 1 + scenarios.length) % scenarios.length,
        );
        break;
      }
      case "Home": {
        event.preventDefault();
        setFocusedIndex(0);
        break;
      }
      case "End": {
        event.preventDefault();
        setFocusedIndex(scenarios.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        selectAndClose(scenarios[focusedIndex].id);
        break;
      }
      case "Tab": {
        setOpenPanel(null);
        break;
      }
      default:
        break;
    }
  }

  return (
    <section
      aria-label="Facilitator scenario controls"
      className="z-20 rounded-lg border border-dashed border-muted-foreground/25 bg-card/95 p-2.5 shadow-sm backdrop-blur lg:sticky lg:top-2"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Scenario
        </span>

        <div ref={scenarioWrapRef} className="relative shrink-0">
          <button
            ref={scenarioTriggerRef}
            type="button"
            onClick={() =>
              openPanel === "scenario"
                ? setOpenPanel(null)
                : openScenarioList()
            }
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" && openPanel !== "scenario") {
                event.preventDefault();
                openScenarioList();
              }
            }}
            aria-haspopup="listbox"
            aria-expanded={openPanel === "scenario"}
            aria-controls="scenario-listbox"
            aria-label={`Scenario: ${activeScenario.label}. Activate to change.`}
            className="flex h-11 w-[190px] items-center gap-2 rounded-md border border-border bg-card px-3.5 text-left transition hover:border-primary/30 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <span
              key={activeScenarioId}
              className="min-w-0 flex-1 animate-fade-in truncate text-sm font-semibold text-foreground"
            >
              {activeScenario.label}
            </span>
            <span
              aria-hidden="true"
              className={`shrink-0 text-xs text-muted-foreground transition-transform ${
                openPanel === "scenario" ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>

          {openPanel === "scenario" ? (
            <div
              id="scenario-listbox"
              role="listbox"
              aria-label="Scenarios"
              tabIndex={-1}
              onKeyDown={handleListboxKeyDown}
              className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-80 w-72 overflow-y-auto rounded-lg border border-border bg-card p-1.5 shadow-lg focus:outline-none"
            >
              {scenarios.map((scenario, index) => {
                const isActive = scenario.id === activeScenarioId;
                return (
                  <div
                    key={scenario.id}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    onClick={() => selectAndClose(scenario.id)}
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-l-[3px] px-2.5 py-1.5 transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
                      isActive
                        ? "border-l-primary bg-primary/5"
                        : "border-l-transparent hover:bg-secondary/40"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {scenario.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {scenario.theme}
                      </span>
                    </span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-sm font-semibold text-primary"
                      >
                        ✓
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div ref={moreWrapRef} className="relative ml-auto shrink-0">
          <button
            ref={moreTriggerRef}
            type="button"
            onClick={() => setOpenPanel(openPanel === "more" ? null : "more")}
            aria-haspopup="true"
            aria-expanded={openPanel === "more"}
            aria-controls="scenario-bar-more-panel"
            aria-label="More facilitator actions"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:border-primary/30 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ⋯
            </span>
          </button>

          {openPanel === "more" ? (
            <div
              id="scenario-bar-more-panel"
              className="absolute right-0 top-[calc(100%+8px)] z-30 w-72 rounded-lg border border-border bg-card p-2 shadow-lg"
            >
              <button
                type="button"
                onClick={() => {
                  onExport();
                  setOpenPanel(null);
                }}
                className="block min-h-11 w-full rounded-md px-2.5 text-left text-sm font-medium text-foreground transition hover:bg-secondary/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                Export research notes
              </button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setOpenPanel(null);
                }}
                className="block min-h-11 w-full rounded-md px-2.5 text-left text-sm font-medium text-foreground transition hover:bg-secondary/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                Reset demo
              </button>
              <p className="mt-1 border-t border-border px-2.5 pt-2 text-xs leading-5 text-muted-foreground">
                <span className="font-medium text-foreground">
                  Start with behavioral discovery.
                </span>{" "}
                Reveal a scenario only after the interviewee has described a
                real recent operating decision. {propertyProfile.facilitatorNote}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
