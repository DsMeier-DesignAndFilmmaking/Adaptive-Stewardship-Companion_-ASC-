import type {
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

export function getScenario(scenarios: Scenario[], scenarioId: ScenarioId) {
  return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
}

export function getSelectedCard(
  cards: RecommendationCard[],
  selectedCardId: string,
) {
  return cards.find((card) => card.id === selectedCardId) ?? cards[0];
}
