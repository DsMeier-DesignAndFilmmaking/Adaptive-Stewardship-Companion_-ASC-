import type {
  CardFeedback,
  CardStatus,
  FeedbackResponse,
  RecommendationCard,
} from "@/lib/research-beta/types";

import { ActionButtons } from "./ActionButtons";
import { ActionChip } from "./ActionChip";
import { AttentionChip } from "./AttentionChip";
import { ConfidenceChip } from "./ConfidenceChip";
import { EvidenceList } from "./EvidenceList";
import { FeedbackPanel } from "./FeedbackPanel";
import { OverridePanel } from "./OverridePanel";
import { StatusChip } from "./StatusChip";

type RecommendationDetailProps = {
  card: RecommendationCard;
  status: CardStatus;
  overrideReason: string;
  isOverrideOpen: boolean;
  feedback: CardFeedback;
  onAccept: () => void;
  onDismiss: () => void;
  onOpenOverride: () => void;
  onCancelOverride: () => void;
  onSubmitOverride: () => void;
  onOverrideReasonChange: (reason: string) => void;
  onFeedbackRespond: (response: FeedbackResponse) => void;
  onFeedbackNoteChange: (note: string) => void;
  onBack?: () => void;
};

const sectionLabelClassName =
  "text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground";

export function RecommendationDetail({
  card,
  status,
  overrideReason,
  isOverrideOpen,
  feedback,
  onAccept,
  onDismiss,
  onOpenOverride,
  onCancelOverride,
  onSubmitOverride,
  onOverrideReasonChange,
  onFeedbackRespond,
  onFeedbackNoteChange,
  onBack,
}: RecommendationDetailProps) {
  return (
    <section
      aria-labelledby="recommendation-detail-title"
      className="rounded-lg border border-border bg-card shadow-sm"
    >
      <div className="border-b border-border p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {onBack ? (
            // Always visible now — the detail is a sliding drawer over the
            // action list on every breakpoint, not a desktop side-by-side
            // pane, so its close control isn't mobile-only anymore.
            <button
              type="button"
              onClick={onBack}
              className="mr-auto min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-foreground transition hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              Close
            </button>
          ) : null}
          <AttentionChip level={card.attention} />
          <ActionChip action={card.action} />
          <ConfidenceChip confidence={card.confidence} reason={card.confidenceReason} />
          <StatusChip status={status} />
        </div>
        <p className="mt-5 text-sm font-medium text-muted-foreground">
          {card.areaName} · {card.areaType}
        </p>
        <h2
          id="recommendation-detail-title"
          className="mt-1 break-words font-serif text-[26px] font-light leading-tight text-foreground [overflow-wrap:anywhere]"
        >
          {card.title}
        </h2>
        <p className="mt-3 break-words text-base leading-7 text-foreground/80 [overflow-wrap:anywhere]">
          {card.shortReason}
        </p>
      </div>

      <div className="grid gap-5 p-4 md:p-5">
        {/* Expected outcome leads the body — "what happens if I do this." */}
        <section
          aria-labelledby="expected-outcome-title"
          className="rounded-lg border border-primary/20 bg-primary/5 p-4"
        >
          <h3
            id="expected-outcome-title"
            className="text-[10px] font-mono uppercase tracking-[0.12em] text-primary"
          >
            Expected outcome
          </h3>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {card.expectedOutcome}
          </p>
        </section>

        <section aria-labelledby="landscape-condition-title">
          <h3 id="landscape-condition-title" className={sectionLabelClassName}>
            Landscape condition
          </h3>
          <p className="mt-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-6 text-foreground">
            {card.landscapeCondition}
          </p>
        </section>

        <section aria-labelledby="confidence-title">
          <h3 id="confidence-title" className={sectionLabelClassName}>
            Why this confidence level?
          </h3>
          <p className="mt-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-6 text-foreground/70">
            {card.confidenceReason}
          </p>
        </section>

        <EvidenceList
          evidence={card.evidence}
          missingEvidence={card.missingEvidence}
        />

        {card.alternative ? (
          <section
            aria-labelledby="alternative-title"
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 id="alternative-title" className={sectionLabelClassName}>
              Suggested alternative
            </h3>
            <p className="mt-2.5 text-sm leading-6 text-foreground/70">
              {card.alternative}
            </p>
          </section>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <section
            aria-labelledby="visitor-view-title"
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3
              id="visitor-view-title"
              className="text-[10px] font-mono uppercase tracking-[0.12em] text-sky-700"
            >
              Visitor view
            </h3>
            <p className="mt-2.5 text-sm leading-6 text-foreground/70">
              {card.visitorView}
            </p>
          </section>

          <section
            aria-labelledby="stewardship-view-title"
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3
              id="stewardship-view-title"
              className="text-[10px] font-mono uppercase tracking-[0.12em] text-primary"
            >
              Stewardship view
            </h3>
            <p className="mt-2.5 text-sm leading-6 text-foreground/70">
              {card.stewardshipView}
            </p>
          </section>
        </div>

        <section
          aria-labelledby="interview-objective-title"
          className="rounded-lg border border-dashed border-muted-foreground/25 bg-secondary/30 p-4"
        >
          <h3 id="interview-objective-title" className={sectionLabelClassName}>
            Interview objective
          </h3>
          <p className="mt-2.5 text-sm leading-6 text-foreground/70">
            {card.interviewPrompt}
          </p>
        </section>

        <ActionButtons
          onAccept={onAccept}
          onDismiss={onDismiss}
          onOverride={onOpenOverride}
        />

        {status === "overridden" && overrideReason ? (
          <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm leading-6 text-teal-950">
            <span className="font-semibold">Saved override:</span>{" "}
            {overrideReason}
          </p>
        ) : null}

        {isOverrideOpen ? (
          <OverridePanel
            areaName={card.areaName}
            currentReason={overrideReason}
            onReasonChange={onOverrideReasonChange}
            onSubmit={onSubmitOverride}
            onCancel={onCancelOverride}
          />
        ) : null}

        <FeedbackPanel
          feedback={feedback}
          onRespond={onFeedbackRespond}
          onNoteChange={onFeedbackNoteChange}
        />
      </div>
    </section>
  );
}
