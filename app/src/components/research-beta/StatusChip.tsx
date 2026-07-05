import { statusLabels } from "@/lib/research-beta/constants";
import type { CardStatus } from "@/lib/research-beta/types";

type StatusChipProps = {
  status: CardStatus;
};

const statusClassNames: Record<CardStatus, string> = {
  unreviewed: "border-border bg-card text-muted-foreground",
  accepted: "border-primary/20 bg-primary/8 text-primary",
  dismissed: "border-border bg-muted/50 text-muted-foreground",
  overridden: "border-teal-200 bg-teal-50 text-teal-700",
};

export function StatusChip({ status }: StatusChipProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusClassNames[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
