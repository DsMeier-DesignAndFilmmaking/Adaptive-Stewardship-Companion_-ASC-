import { confidenceLabels } from "@/lib/research-beta/constants";
import type { Confidence } from "@/lib/research-beta/types";

type ConfidenceChipProps = {
  confidence: Confidence;
};

const confidenceClassNames: Record<Confidence, string> = {
  high: "border-primary/20 bg-primary/8 text-primary",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-border bg-muted/50 text-muted-foreground",
};

export function ConfidenceChip({ confidence }: ConfidenceChipProps) {
  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold ${confidenceClassNames[confidence]}`}
      aria-label={confidenceLabels[confidence]}
    >
      {confidenceLabels[confidence]}
    </span>
  );
}
