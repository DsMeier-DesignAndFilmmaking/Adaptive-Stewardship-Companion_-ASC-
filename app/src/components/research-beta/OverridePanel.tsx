import { defaultOverrideReasons } from "@/lib/research-beta/constants";

type OverridePanelProps = {
  areaName: string;
  currentReason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function OverridePanel({
  areaName,
  currentReason,
  onReasonChange,
  onSubmit,
  onCancel,
}: OverridePanelProps) {
  return (
    <section
      aria-labelledby="override-title"
      className="rounded-lg border border-teal-200 bg-teal-50 p-4"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
          Human override
        </p>
        <h3 id="override-title" className="mt-1 text-lg font-semibold text-foreground">
          What local context changes the call for {areaName}?
        </h3>
        <p className="mt-2 text-sm leading-6 text-teal-950">
          Overrides are treated as learning signal, not failure. Capture the
          reason a human would adjust or reject this recommendation.
        </p>
      </div>
      <div className="mt-4 grid gap-2">
        {defaultOverrideReasons.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onReasonChange(reason)}
            className={`min-h-11 rounded-md border px-3 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
              currentReason === reason
                ? "border-teal-700 bg-card text-teal-950"
                : "border-teal-200 bg-teal-50 text-teal-900 hover:border-teal-500"
            }`}
          >
            {reason}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-sm font-semibold text-foreground">
        Override note
        <textarea
          value={currentReason}
          onChange={(event) => onReasonChange(event.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-md border border-teal-200 bg-card px-3 py-2 text-sm font-normal leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-teal-600 focus:ring-3 focus:ring-teal-500/25"
          placeholder="Example: volunteer crew is repairing this path at 9 AM."
        />
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onSubmit}
          className="min-h-11 rounded-md bg-teal-800 px-4 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          Save override
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-md border border-teal-300 bg-card px-4 text-sm font-semibold text-teal-900 transition hover:border-teal-600 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
