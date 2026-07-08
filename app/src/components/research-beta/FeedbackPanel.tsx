import { feedbackLabels } from "@/lib/research-beta/constants";
import type { CardFeedback, FeedbackResponse } from "@/lib/research-beta/types";

type FeedbackPanelProps = {
  feedback: CardFeedback;
  onRespond: (response: FeedbackResponse) => void;
  onNoteChange: (note: string) => void;
};

const responses: FeedbackResponse[] = ["yes", "maybe", "no"];

// Phase E — lightweight discovery capture. Styled as "backstage" research
// scaffolding (dashed border), not part of the product the interviewee reacts
// to. Persisted locally by the page; no backend.
export function FeedbackPanel({
  feedback,
  onRespond,
  onNoteChange,
}: FeedbackPanelProps) {
  return (
    <section
      aria-labelledby="feedback-title"
      className="rounded-lg border border-dashed border-muted-foreground/25 bg-secondary/30 p-4"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
        Research capture
      </p>
      <h3
        id="feedback-title"
        className="mt-1 text-sm font-semibold text-foreground"
      >
        Would you take this action?
      </h3>
      <div
        role="group"
        aria-label="Would you take this action?"
        className="mt-3 grid gap-2 sm:grid-cols-3"
      >
        {responses.map((response) => {
          const isActive = feedback.response === response;
          return (
            <button
              key={response}
              type="button"
              aria-pressed={isActive}
              onClick={() => onRespond(response)}
              className={`min-h-11 rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              }`}
            >
              {feedbackLabels[response]}
            </button>
          );
        })}
      </div>
      <label className="mt-3 block text-sm font-semibold text-foreground">
        Why? (optional)
        <textarea
          value={feedback.note ?? ""}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={2}
          className="mt-2 w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm font-normal leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-ring/25"
          placeholder="Capture the interviewee's reasoning in their own words."
        />
      </label>
    </section>
  );
}
