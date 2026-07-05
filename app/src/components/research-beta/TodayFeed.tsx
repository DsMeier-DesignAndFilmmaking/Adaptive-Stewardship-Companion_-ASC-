import type {
  CardStatus,
  RecommendationCard as RecommendationCardType,
} from "@/lib/research-beta/types";

import { RecommendationCard } from "./RecommendationCard";

type TodayFeedProps = {
  cards: RecommendationCardType[];
  selectedCardId: string;
  cardStatuses: Record<string, CardStatus>;
  onSelect: (cardId: string) => void;
  onOpenObservation: () => void;
};

export function TodayFeed({
  cards,
  selectedCardId,
  cardStatuses,
  onSelect,
  onOpenObservation,
}: TodayFeedProps) {
  return (
    <section aria-labelledby="today-feed-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Today feed
          </p>
          <h2
            id="today-feed-title"
            className="mt-1 font-serif text-xl font-semibold text-foreground"
          >
            Morning operating recommendations
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenObservation}
          className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[#1f3025] focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:min-w-40"
        >
          Log Observation
        </button>
      </div>
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
    </section>
  );
}
