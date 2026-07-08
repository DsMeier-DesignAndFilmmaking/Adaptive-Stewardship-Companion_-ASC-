import { confidenceLabels } from "@/lib/research-beta/constants";
import type { Confidence } from "@/lib/research-beta/types";

import { Tooltip } from "./Tooltip";

type ConfidenceChipProps = {
  confidence: Confidence;
  // Per-recommendation reason (card.confidenceReason) — showing the actual
  // "why," not just a generic definition of the confidence tier, matches the
  // charter's "every recommendation explains why it exists" principle.
  reason: string;
};

const confidenceClassNames: Record<Confidence, string> = {
  high: "border-primary/20 bg-primary/8 text-primary",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-border bg-muted/50 text-muted-foreground",
};

export function ConfidenceChip({ confidence, reason }: ConfidenceChipProps) {
  return (
    <Tooltip label={reason}>
      <span
        className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold ${confidenceClassNames[confidence]}`}
      >
        {confidenceLabels[confidence]}
      </span>
    </Tooltip>
  );
}
