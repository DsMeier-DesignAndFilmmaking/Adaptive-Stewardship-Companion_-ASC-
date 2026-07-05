import { actionDescriptions, actionLabels } from "@/lib/research-beta/constants";
import type {
  CardStatus,
  RecommendationCard,
} from "@/lib/research-beta/types";

import { ActionButtons } from "./ActionButtons";
import { ConfidenceChip } from "./ConfidenceChip";
import { EvidenceList } from "./EvidenceList";
import { OverridePanel } from "./OverridePanel";
import { StatusChip } from "./StatusChip";

type RecommendationDetailProps = {
  card: RecommendationCard;
  status: CardStatus;
  overrideReason: string;
  isOverrideOpen: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onOpenOverride: () => void;
  onCancelOverride: () => void;
  onSubmitOverride: () => void;
  onOverrideReasonChange: (reason: string) => void;
  onBack?: () => void;
};

const actionClassNames = {
  open: "border-primary/20 bg-primary/8 text-primary",
  promote: "border-green-200 bg-green-50 text-green-700",
  rest: "border-amber-200 bg-amber-50 text-amber-700",
  restrict: "border-orange-200 bg-orange-50 text-orange-700",
  close: "border-destructive/25 bg-destructive/10 text-destructive",
};

// Section eyebrow label — matches the reference's in-card label convention
// (10px mono, uppercase, tracked, muted) used consistently across every
// content card in this detail panel.
const sectionLabelClassName =
  "text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground";

export function RecommendationDetail({
  card,
  status,
  overrideReason,
  isOverrideOpen,
  onAccept,
  onDismiss,
  onOpenOverride,
  onCancelOverride,
  onSubmitOverride,
  onOverrideReasonChange,
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
            <button
              type="button"
              onClick={onBack}
              className="mr-auto min-h-10 rounded-md border border-border px-3 text-sm font-semibold text-foreground transition hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 lg:hidden"
            >
              Back
            </button>
          ) : null}
          <span
            className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold ${actionClassNames[card.action]}`}
            aria-label={`${actionLabels[card.action]} recommendation: ${actionDescriptions[card.action]}`}
          >
            {actionLabels[card.action]}
          </span>
          <ConfidenceChip confidence={card.confidence} />
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

        {/* Neutral cards, colored label only — color stays in the small
            eyebrow, not the card surface, matching every other card here. */}
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
      </div>
    </section>
  );
}
