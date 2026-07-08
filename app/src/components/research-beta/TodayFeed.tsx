import type {
  CardStatus,
  RecommendationCard as RecommendationCardType,
} from "@/lib/research-beta/types";

import { RecommendationCard } from "./RecommendationCard";

type TodayFeedProps = {
  cards: RecommendationCardType[];
  totalCount: number;
  selectedCardId: string;
  cardStatuses: Record<string, CardStatus>;
  selectedArea: string | null;
  onSelect: (cardId: string) => void;
  onClearArea: () => void;
  onOpenObservation: () => void;
};

export function TodayFeed({
  cards,
  totalCount,
  selectedCardId,
  cardStatuses,
  selectedArea,
  onSelect,
  onClearArea,
  onOpenObservation,
}: TodayFeedProps) {
  return (
    <section aria-labelledby="today-feed-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Recommended actions
          </p>
          <h2
            id="today-feed-title"
            className="mt-1 font-serif text-xl font-semibold text-foreground"
          >
            Morning operating recommendations
          </h2>
        </div>
        {/* Desktop keeps the action in the header (no thumb-reach problem
            with a pointer). On phones it moves to the fixed bottom bar below. */}
        <button
          type="button"
          onClick={onOpenObservation}
          className="hidden min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[#1f3025] focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:min-w-[10rem] lg:inline-block"
        >
          Log Observation
        </button>
      </div>
      {/* Single-area scope summary — mirrors the one active tab in Landscape
          Health, so there's exactly one "what's narrowing this list" state to
          track, shown in one place plus a plain-language echo here. */}
      {selectedArea ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{cards.length}</span>{" "}
            of {totalCount} · scoped to{" "}
            <span className="font-medium text-foreground">{selectedArea}</span>
          </span>
          <button
            type="button"
            onClick={onClearArea}
            className="min-h-8 rounded-md border border-border px-2.5 text-xs font-semibold text-foreground transition hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            View all areas
          </button>
        </div>
      ) : null}
      {cards.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {cards.map((card) => (
            <RecommendationCard
              key={card.id}
              card={card}
              isSelected={card.id === selectedCardId}
              status={cardStatuses[card.id] ?? card.initialStatus}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-secondary/20 px-4 py-6 text-center text-sm text-muted-foreground">
          No recommendations for this area right now.
        </p>
      )}

      {/* Thumb-reach primary action on phones. The header button above is the
          hardest one-handed reach on a tall screen, so below lg the same
          action lives in a fixed bottom bar (same styling so it reads as the
          same action, not a competing one). z-30 keeps it under DetailDrawer
          (z-40) and the Observation modal (z-30, rendered later in the DOM) so
          it never sits on top of an open modal. pb uses the iOS safe-area
          inset so it clears the home-indicator gesture bar. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <button
          type="button"
          onClick={onOpenObservation}
          className="min-h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[#1f3025] focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          Log Observation
        </button>
      </div>
    </section>
  );
}
