import { actionDescriptions, actionLabels } from "@/lib/research-beta/constants";
import type {
  CardStatus,
  RecommendationCard as RecommendationCardType,
} from "@/lib/research-beta/types";

import { ConfidenceChip } from "./ConfidenceChip";
import { StatusChip } from "./StatusChip";

type RecommendationCardProps = {
  card: RecommendationCardType;
  isSelected: boolean;
  status: CardStatus;
  onSelect: (cardId: string) => void;
};

const actionClassNames = {
  open: "border-primary/20 bg-primary/8 text-primary",
  promote: "border-green-200 bg-green-50 text-green-700",
  rest: "border-amber-200 bg-amber-50 text-amber-700",
  restrict: "border-orange-200 bg-orange-50 text-orange-700",
  close: "border-destructive/25 bg-destructive/10 text-destructive",
};

export function RecommendationCard({
  card,
  isSelected,
  status,
  onSelect,
}: RecommendationCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card.id)}
      aria-pressed={isSelected}
      // Selected state follows the reference's left-accent-border pattern
      // (colored edge + subtle tint) instead of recoloring the whole border.
      className={`w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-primary/25 hover:shadow-md focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 ${
        isSelected
          ? "border-border border-l-[3px] border-l-primary bg-primary/5"
          : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold ${actionClassNames[card.action]}`}
          aria-label={`${actionLabels[card.action]} recommendation: ${actionDescriptions[card.action]}`}
        >
          {actionLabels[card.action]}
        </span>
        <ConfidenceChip confidence={card.confidence} />
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
      </div>
    </button>
  );
}
