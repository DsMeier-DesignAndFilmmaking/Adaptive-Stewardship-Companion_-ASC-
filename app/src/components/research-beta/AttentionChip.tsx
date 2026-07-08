import {
  attentionDescriptions,
  attentionLabels,
} from "@/lib/research-beta/constants";
import type { AttentionLevel } from "@/lib/research-beta/types";

import { Tooltip } from "./Tooltip";

type AttentionChipProps = {
  level: AttentionLevel;
};

const attentionClassNames: Record<AttentionLevel, string> = {
  critical: "border-destructive/25 bg-destructive/10 text-destructive",
  monitor: "border-amber-200 bg-amber-50 text-amber-700",
  opportunity: "border-primary/20 bg-primary/8 text-primary",
};

export function AttentionChip({ level }: AttentionChipProps) {
  return (
    <Tooltip label={attentionDescriptions[level]}>
      <span
        className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-wide ${attentionClassNames[level]}`}
      >
        {attentionLabels[level]}
      </span>
    </Tooltip>
  );
}
