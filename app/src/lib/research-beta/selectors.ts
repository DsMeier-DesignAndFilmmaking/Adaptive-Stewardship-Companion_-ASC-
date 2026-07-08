import { attentionRank } from "./constants";
import type {
  AttentionLevel,
  CardStatus,
  RecommendationCard,
  Scenario,
  ScenarioId,
} from "./types";

export function createInitialStatuses(cards: RecommendationCard[]) {
  return cards.reduce<Record<string, CardStatus>>((statuses, card) => {
    statuses[card.id] = card.initialStatus;
    return statuses;
  }, {});
}

export function getCardsForScenario(
  cards: RecommendationCard[],
  scenarioId: ScenarioId,
) {
  return cards.filter((card) => card.scenarioId === scenarioId);
}

// Phase C — feed ordered by attention (critical → monitor → opportunity), then
// by confidence so the most consequential, best-evidenced call reads first.
const confidenceRank = { high: 0, medium: 1, low: 2 } as const;

export function getOrderedCardsForScenario(
  cards: RecommendationCard[],
  scenarioId: ScenarioId,
) {
  return getCardsForScenario(cards, scenarioId).sort((a, b) => {
    const byAttention = attentionRank[a.attention] - attentionRank[b.attention];
    if (byAttention !== 0) return byAttention;
    return confidenceRank[a.confidence] - confidenceRank[b.confidence];
  });
}

// Which card "represents" an area when a summary view (the Landscape Health
// strip) can only show one signal per zone. Resolved by attentionRank rather
// than array order, so a zone with more than one recommendation still
// resolves to the same card every time instead of an arbitrary "first" one.
export function getAreaAttention(
  cards: RecommendationCard[],
): Map<string, AttentionLevel> {
  const byArea = new Map<string, AttentionLevel>();
  for (const card of cards) {
    const current = byArea.get(card.areaName);
    if (!current || attentionRank[card.attention] < attentionRank[current]) {
      byArea.set(card.areaName, card.attention);
    }
  }
  return byArea;
}

// Same resolution rule as getAreaAttention, but keeps the whole card rather
// than just its attention level. The Landscape Health strip's inline detail
// panel needs the card's shortReason/confidence/id (to open full detail), not
// just the level used for its chip color.
export function getRepresentativeCardByArea(
  cards: RecommendationCard[],
): Map<string, RecommendationCard> {
  const byArea = new Map<string, RecommendationCard>();
  for (const card of cards) {
    const current = byArea.get(card.areaName);
    if (!current || attentionRank[card.attention] < attentionRank[current.attention]) {
      byArea.set(card.areaName, card);
    }
  }
  return byArea;
}

export function getAttentionCounts(cards: RecommendationCard[]) {
  return cards.reduce<Record<AttentionLevel, number>>(
    (counts, card) => {
      counts[card.attention] += 1;
      return counts;
    },
    { critical: 0, monitor: 0, opportunity: 0 },
  );
}

export function getScenario(scenarios: Scenario[], scenarioId: ScenarioId) {
  return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
}

export function getSelectedCard(
  cards: RecommendationCard[],
  selectedCardId: string,
) {
  return cards.find((card) => card.id === selectedCardId) ?? cards[0];
}
