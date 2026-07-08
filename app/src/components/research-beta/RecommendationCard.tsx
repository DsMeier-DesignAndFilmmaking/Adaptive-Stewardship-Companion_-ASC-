import type {
  CardStatus,
  RecommendationCard as RecommendationCardType,
} from "@/lib/research-beta/types";

import { ActionChip } from "./ActionChip";
import { AttentionChip } from "./AttentionChip";
import { ConfidenceChip } from "./ConfidenceChip";
import { StatusChip } from "./StatusChip";

type RecommendationCardProps = {
  card: RecommendationCardType;
  isSelected: boolean;
  status: CardStatus;
  onSelect: (cardId: string) => void;
};

export function RecommendationCard({
  card,
  isSelected,
  status,
  onSelect,
}: RecommendationCardProps) {
  // The card itself is inert — only the explicit "View Details" CTA below
  // triggers selection. This avoids the overloaded-click problem where
  // clicking anywhere on a dense card (e.g. selecting text) accidentally
  // opens the detail drawer.
  return (
    <div
      className={`w-full rounded-lg border bg-card p-4 text-left shadow-sm transition ${
        isSelected
          ? "border-border border-l-[3px] border-l-primary bg-primary/5"
          : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <AttentionChip level={card.attention} />
        <ActionChip action={card.action} />
        <ConfidenceChip confidence={card.confidence} reason={card.confidenceReason} />
        <StatusChip status={status} />
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">
          {card.areaName}
        </p>
        <h2 className="mt-1 break-words text-lg font-semibold leading-6 text-foreground [overflow-wrap:anywhere]">
          {card.title}
        </h2>
        <p className="mt-2 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">
          {card.shortReason}
        </p>
        <p className="mt-2 break-words text-sm leading-6 text-foreground/70 [overflow-wrap:anywhere]">
          <span className="font-medium text-foreground">Expected outcome — </span>
          {card.expectedOutcome}
        </p>
      </div>
      {/* Sole entry point into the detail drawer for this card. */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onSelect(card.id)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/8 px-3 text-xs font-semibold text-primary transition hover:bg-primary/15 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          View Details
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
