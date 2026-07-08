import { actionDescriptions, actionLabels } from "@/lib/research-beta/constants";
import type { RecommendationAction } from "@/lib/research-beta/types";

import { Tooltip } from "./Tooltip";

type ActionChipProps = {
  action: RecommendationAction;
};

const actionClassNames: Record<RecommendationAction, string> = {
  open: "border-primary/20 bg-primary/8 text-primary",
  promote: "border-green-200 bg-green-50 text-green-700",
  rest: "border-amber-200 bg-amber-50 text-amber-700",
  restrict: "border-orange-200 bg-orange-50 text-orange-700",
  close: "border-destructive/25 bg-destructive/10 text-destructive",
};

// Extracted out of RecommendationCard/RecommendationDetail (both rendered an
// identical inline badge) so the hover tooltip only needs to live in one
// place.
export function ActionChip({ action }: ActionChipProps) {
  return (
    <Tooltip label={actionDescriptions[action]}>
      <span
        className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold ${actionClassNames[action]}`}
      >
        {actionLabels[action]}
      </span>
    </Tooltip>
  );
}
