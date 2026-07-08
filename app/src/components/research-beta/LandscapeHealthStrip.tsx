import { landscapeStatusLabels } from "@/lib/research-beta/constants";
import type {
  AttentionLevel,
  LandscapeStatus,
  LandscapeZone,
  RecommendationCard,
} from "@/lib/research-beta/types";

import { AttentionChip } from "./AttentionChip";

export const ALL_AREAS = "all" as const;

type LandscapeHealthStripProps = {
  zones: LandscapeZone[];
  areaCards: Map<string, RecommendationCard>;
  totalActionCount: number;
  selectedArea: string;
  onSelectArea: (area: string) => void;
};

const statusClassNames: Record<LandscapeStatus, string> = {
  healthy: "border-primary/20 bg-primary/8 text-primary",
  "high-use": "border-amber-200 bg-amber-50 text-amber-700",
  recovery: "border-sky-200 bg-sky-50 text-sky-700",
  monitoring: "border-border bg-muted/50 text-muted-foreground",
  sensitive: "border-orange-200 bg-orange-50 text-orange-700",
};

// Solid dot equivalents of the attention hues used by AttentionChip — a full
// chip-with-tooltip has no useful role in a compact horizontal touch row, so
// the mobile pill collapses it to a 6px status dot in the same semantic color.
const attentionDotClassNames: Record<AttentionLevel, string> = {
  critical: "bg-destructive",
  monitor: "bg-amber-500",
  opportunity: "bg-primary",
};

// Single-select tab list — standard tab semantics (role="tablist"/"tab",
// exactly one active at a time), not a multi-select filter. Selecting a tab
// only swaps which area's recommended actions show; it never opens a detail
// view. The tab is the first of two drill-in steps (tab -> action list -> tap
// a card -> sliding detail panel), each step doing exactly one job.
//
// Two renderings of the *same* tab list, gated purely by the `lg:` breakpoint
// via Tailwind display utilities (no JS media query — avoids hydration
// mismatches). Below `lg`: a compact, sticky, horizontally-scrolling pill row
// so the action feed isn't buried under a full-width vertical stack and the
// area scope stays reachable while scrolling. At `lg`+: the original vertical
// left rail. Returned as a fragment (not a wrapper) so the sticky mobile row
// is a direct child of the tall working-area grid — its sticky containing
// block is that grid, letting it stay pinned across the feed's full height.
export function LandscapeHealthStrip({
  zones,
  areaCards,
  totalActionCount,
  selectedArea,
  onSelectArea,
}: LandscapeHealthStripProps) {
  const pillClassName = (isSelected: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
      isSelected
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-card text-foreground hover:bg-secondary/40"
    }`;

  return (
    <>
      {/* Mobile (<lg): compact sticky pill row. The bleed (-mx-4) lets the bar
          reach the screen edges inside AppShell's padded <main>; px-4 keeps the
          first pill aligned to the content edge. */}
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div
          role="tablist"
          aria-label="Filter recommended actions by area"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedArea === ALL_AREAS}
            onClick={() => onSelectArea(ALL_AREAS)}
            className={pillClassName(selectedArea === ALL_AREAS)}
          >
            All Attention Areas
            {totalActionCount > 0 ? (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground/70">
                {totalActionCount}
              </span>
            ) : null}
          </button>

          {zones.map((zone) => {
            const card = areaCards.get(zone.area);
            const isSelected = selectedArea === zone.area;

            return (
              <button
                key={zone.area}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectArea(zone.area)}
                className={pillClassName(isSelected)}
              >
                {card ? (
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${attentionDotClassNames[card.attention]}`}
                  />
                ) : null}
                {zone.area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop (lg+): vertical left rail — unchanged from before. */}
      <nav
        aria-label="Landscape health"
        className="hidden h-full flex-col rounded-lg border border-border bg-card p-3 lg:flex"
      >
        <p className="px-1 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
          Landscape health
        </p>
        <div role="tablist" aria-label="Filter by area" className="mt-2 grid gap-1">
          <button
            type="button"
            role="tab"
            aria-selected={selectedArea === ALL_AREAS}
            onClick={() => onSelectArea(ALL_AREAS)}
            className={`flex min-h-11 items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
              selectedArea === ALL_AREAS
                ? "border-primary bg-primary/10 text-primary"
                : "border-transparent text-foreground hover:bg-secondary/40"
            }`}
          >
            All Attention Areas
            {totalActionCount > 0 ? (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground/70">
                {totalActionCount}
              </span>
            ) : null}
          </button>

          {zones.map((zone) => {
            const card = areaCards.get(zone.area);
            const isSelected = selectedArea === zone.area;

            return (
              <button
                key={zone.area}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectArea(zone.area)}
                className={`grid min-h-11 gap-1 rounded-md border px-3 py-2 text-left transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-secondary/40"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {zone.area}
                  </span>
                  {card ? <AttentionChip level={card.attention} /> : null}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClassNames[zone.status]}`}
                  >
                    {landscapeStatusLabels[zone.status]}
                  </span>
                  {zone.note ? (
                    <span className="truncate text-[11px] text-muted-foreground">
                      {zone.note}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
