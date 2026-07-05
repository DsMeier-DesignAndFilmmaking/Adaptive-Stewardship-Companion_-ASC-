import type { ObservationSample } from "@/lib/research-beta/types";

type ObservationGlimpseProps = {
  isOpen: boolean;
  observation: ObservationSample;
  onClose: () => void;
};

export function ObservationGlimpse({
  isOpen,
  observation,
  onClose,
}: ObservationGlimpseProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-end bg-foreground/35 p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="observation-title"
    >
      <section className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-lg border border-border bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Static glimpse
            </p>
            <h2
              id="observation-title"
              className="mt-1 text-xl font-semibold text-foreground"
            >
              Log a condition observation
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-foreground transition hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            Close
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          <div>
            <span className="text-sm font-semibold text-foreground">
              Landscape Area
            </span>
            <div className="mt-2 rounded-lg border border-border bg-secondary/50 px-3 py-3 text-sm text-foreground">
              {observation.areaName}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="text-sm font-semibold text-foreground">
                Condition
              </span>
              <div className="mt-2 rounded-lg border border-border bg-secondary/50 px-3 py-3 text-sm text-foreground">
                {observation.condition}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">
                Severity
              </span>
              {/* Neutral cell, colored pill for the value — matches how every
                  other state (action, confidence, status) renders elsewhere. */}
              <div className="mt-2 flex items-center rounded-lg border border-border bg-secondary/50 px-3 py-3">
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  {observation.severity}
                </span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">
              Field note
            </span>
            <p className="mt-2 rounded-lg border border-border bg-secondary/50 px-3 py-3 text-sm leading-6 text-foreground/80">
              {observation.note}
            </p>
          </div>
        </div>
        <p className="mt-5 rounded-lg border border-dashed border-muted-foreground/25 bg-secondary/30 px-3 py-3 text-sm leading-6 text-muted-foreground">
          This screen is intentionally non-functional. It exists to test whether
          staff-entered condition data feels plausible in discovery interviews.
        </p>
      </section>
    </div>
  );
}
