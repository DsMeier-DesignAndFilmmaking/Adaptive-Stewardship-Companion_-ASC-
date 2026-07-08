import { attentionLabels } from "@/lib/research-beta/constants";
import type { AttentionLevel } from "@/lib/research-beta/types";

type AttentionSummaryProps = {
  counts: Record<AttentionLevel, number>;
};

const order: AttentionLevel[] = ["critical", "monitor", "opportunity"];

// Large-tile treatment: a saturated background (not just a bordered chip) and
// a big tabular number, so this reads at a glance from across a room, not
// just up close — the property-level headline of the whole page.
const tileClassNames: Record<AttentionLevel, string> = {
  critical: "border-destructive/30 bg-destructive/10 text-destructive",
  monitor: "border-amber-300 bg-amber-100 text-amber-800",
  opportunity: "border-primary/30 bg-primary/10 text-primary",
};

// Hero band — the first thing anyone reading this page should see, and still
// visually distinct from the cards below it (saturated tiles + a big number),
// but sized as a clear headline rather than a full dominant block: one glance
// to register the count, not a section that competes with everything below
// it for the whole viewport.
export function AttentionSummary({ counts }: AttentionSummaryProps) {
  const total = counts.critical + counts.monitor + counts.opportunity;

  return (
    <section
      aria-label="Attention required"
      className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Attention required
        </p>
        <p className="text-sm text-foreground/70">
          {total === 0
            ? "Nothing flagged this morning."
            : `${total} item${total === 1 ? "" : "s"} across the property today.`}
        </p>
      </div>

      {total > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {order
            .filter((level) => counts[level] > 0)
            .map((level) => (
              <div
                key={level}
                className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 ${tileClassNames[level]}`}
              >
                <p className="font-serif text-2xl font-light tabular-nums leading-none md:text-3xl">
                  {counts[level]}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                  {attentionLabels[level]}
                </p>
              </div>
            ))}
        </div>
      ) : null}
    </section>
  );
}
