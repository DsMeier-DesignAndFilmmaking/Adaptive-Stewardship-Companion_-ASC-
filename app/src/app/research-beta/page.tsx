"use client";

import { useMemo, useState } from "react";

import { AppShell } from "@/components/research-beta/AppShell";
import { ObservationGlimpse } from "@/components/research-beta/ObservationGlimpse";
import { RecommendationDetail } from "@/components/research-beta/RecommendationDetail";
import { ScenarioBar } from "@/components/research-beta/ScenarioBar";
import { TodayFeed } from "@/components/research-beta/TodayFeed";
import { recommendationCards, scenarios } from "@/data/research-beta";
import {
  createInitialStatuses,
  getCardsForScenario,
  getScenario,
  getSelectedCard,
} from "@/lib/research-beta/selectors";
import type { CardStatus, ScenarioId } from "@/lib/research-beta/types";

const initialScenarioId: ScenarioId = scenarios[0].id;

export default function ResearchBetaPage() {
  const initialStatuses = useMemo(
    () => createInitialStatuses(recommendationCards),
    [],
  );
  const [activeScenarioId, setActiveScenarioId] =
    useState<ScenarioId>(initialScenarioId);
  const [selectedCardId, setSelectedCardId] = useState(
    getCardsForScenario(recommendationCards, initialScenarioId)[0].id,
  );
  const [cardStatuses, setCardStatuses] =
    useState<Record<string, CardStatus>>(initialStatuses);
  const [overrideReasons, setOverrideReasons] = useState<Record<string, string>>(
    {},
  );
  const [openOverrideCardId, setOpenOverrideCardId] = useState<string | null>(
    null,
  );
  const [observationGlimpseOpen, setObservationGlimpseOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const activeScenario = getScenario(scenarios, activeScenarioId);
  const scenarioCards = getCardsForScenario(recommendationCards, activeScenarioId);
  const selectedCard = getSelectedCard(scenarioCards, selectedCardId);
  const selectedStatus =
    cardStatuses[selectedCard.id] ?? selectedCard.initialStatus;
  const selectedOverrideReason = overrideReasons[selectedCard.id] ?? "";

  function selectScenario(scenarioId: ScenarioId) {
    const firstCard = getCardsForScenario(recommendationCards, scenarioId)[0];
    setActiveScenarioId(scenarioId);
    setSelectedCardId(firstCard.id);
    setOpenOverrideCardId(null);
    setObservationGlimpseOpen(false);
    setDetailOpen(false);
  }

  function selectCard(cardId: string) {
    setSelectedCardId(cardId);
    setOpenOverrideCardId(null);
    setDetailOpen(true);
  }

  function updateSelectedStatus(status: CardStatus) {
    setCardStatuses((statuses) => ({
      ...statuses,
      [selectedCard.id]: status,
    }));
  }

  function resetDemo() {
    selectScenario(initialScenarioId);
    setCardStatuses(initialStatuses);
    setOverrideReasons({});
  }

  return (
    <AppShell scenario={activeScenario}>
      <div className="grid gap-5">
        <ScenarioBar
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={selectScenario}
          onReset={resetDemo}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.9fr)_minmax(460px,1.4fr)]">
          <div className={detailOpen ? "hidden lg:block" : "block"}>
            <TodayFeed
              cards={scenarioCards}
              selectedCardId={selectedCard.id}
              cardStatuses={cardStatuses}
              onSelect={selectCard}
              onOpenObservation={() => setObservationGlimpseOpen(true)}
            />
          </div>

          <div className={detailOpen ? "block" : "hidden lg:block"}>
            <RecommendationDetail
              card={selectedCard}
              status={selectedStatus}
              overrideReason={selectedOverrideReason}
              isOverrideOpen={openOverrideCardId === selectedCard.id}
              onBack={() => {
                setDetailOpen(false);
                setOpenOverrideCardId(null);
              }}
              onAccept={() => {
                updateSelectedStatus("accepted");
                setOpenOverrideCardId(null);
              }}
              onDismiss={() => {
                updateSelectedStatus("dismissed");
                setOpenOverrideCardId(null);
              }}
              onOpenOverride={() => setOpenOverrideCardId(selectedCard.id)}
              onCancelOverride={() => setOpenOverrideCardId(null)}
              onSubmitOverride={() => {
                const reason =
                  overrideReasons[selectedCard.id]?.trim() ||
                  "Local staff context changed the recommendation.";
                setOverrideReasons((reasons) => ({
                  ...reasons,
                  [selectedCard.id]: reason,
                }));
                updateSelectedStatus("overridden");
                setOpenOverrideCardId(null);
              }}
              onOverrideReasonChange={(reason) =>
                setOverrideReasons((reasons) => ({
                  ...reasons,
                  [selectedCard.id]: reason,
                }))
              }
            />
          </div>
        </div>
      </div>

      <ObservationGlimpse
        isOpen={observationGlimpseOpen}
        observation={activeScenario.observation}
        onClose={() => setObservationGlimpseOpen(false)}
      />
    </AppShell>
  );
}
