type ActionButtonsProps = {
  onAccept: () => void;
  onDismiss: () => void;
  onOverride: () => void;
};

export function ActionButtons({
  onAccept,
  onDismiss,
  onOverride,
}: ActionButtonsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3" aria-label="Recommendation actions">
      <button
        type="button"
        onClick={onAccept}
        className="min-h-12 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[#1f3025] focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        Accept
      </button>
      <button
        type="button"
        onClick={onOverride}
        className="min-h-12 rounded-md border border-teal-300 bg-teal-50 px-4 text-sm font-semibold text-teal-900 transition hover:border-teal-500 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        Override
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="min-h-12 rounded-md border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        Dismiss
      </button>
    </div>
  );
}
