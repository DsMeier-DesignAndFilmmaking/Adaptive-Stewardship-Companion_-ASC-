"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/research-beta/AppShell";
import { AttentionSummary } from "@/components/research-beta/AttentionSummary";
import { DailyBriefing } from "@/components/research-beta/DailyBriefing";
import { DetailDrawer } from "@/components/research-beta/DetailDrawer";
import {
  ALL_AREAS,
  LandscapeHealthStrip,
} from "@/components/research-beta/LandscapeHealthStrip";
import { ObservationGlimpse } from "@/components/research-beta/ObservationGlimpse";
import { RecommendationDetail } from "@/components/research-beta/RecommendationDetail";
import { ScenarioBar } from "@/components/research-beta/ScenarioBar";
import { TodayFeed } from "@/components/research-beta/TodayFeed";
import {
  propertyProfile,
  recommendationCards,
  scenarios,
} from "@/data/research-beta";
import {
  createInitialStatuses,
  getAttentionCounts,
  getOrderedCardsForScenario,
  getRepresentativeCardByArea,
  getScenario,
  getSelectedCard,
} from "@/lib/research-beta/selectors";
import type {
  CardFeedback,
  CardStatus,
  FeedbackResponse,
  ScenarioId,
} from "@/lib/research-beta/types";

const initialScenarioId: ScenarioId = scenarios[0].id;
const FEEDBACK_KEY = "asc-beta-research-feedback";

export default function ResearchBetaPage() {
  const initialStatuses = useMemo(
    () => createInitialStatuses(recommendationCards),
    [],
  );
  const [activeScenarioId, setActiveScenarioId] =
    useState<ScenarioId>(initialScenarioId);
  const [selectedCardId, setSelectedCardId] = useState(
    getOrderedCardsForScenario(recommendationCards, initialScenarioId)[0].id,
  );
  // Single-select area scope, driven by the Landscape Health tab list. This
  // is deliberately one value, not a Set — a tab list has exactly one active
  // tab at a time, matching standard tab semantics rather than a multi-select
  // filter's checkbox semantics.
  const [selectedArea, setSelectedArea] = useState<string>(ALL_AREAS);
  const [cardStatuses, setCardStatuses] =
    useState<Record<string, CardStatus>>(initialStatuses);
  const [overrideReasons, setOverrideReasons] = useState<Record<string, string>>(
    {},
  );
  const [feedback, setFeedback] = useState<Record<string, CardFeedback>>({});
  const [openOverrideCardId, setOpenOverrideCardId] = useState<string | null>(
    null,
  );
  const [observationGlimpseOpen, setObservationGlimpseOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Phase E — hydrate captured feedback from local storage after mount (kept
  // out of initial state to avoid SSR hydration mismatch), then persist it.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FEEDBACK_KEY);
      // Hydrating from an external store (localStorage) after mount is a valid
      // effect sync; empty initial state keeps server/client render identical.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setFeedback(JSON.parse(raw) as Record<string, CardFeedback>);
    } catch {
      // ignore unavailable/corrupt storage — research capture is best-effort
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
    } catch {
      // ignore unavailable storage
    }
  }, [feedback]);

  const activeScenario = getScenario(scenarios, activeScenarioId);
  const orderedCards = getOrderedCardsForScenario(
    recommendationCards,
    activeScenarioId,
  );
  const attentionCounts = getAttentionCounts(orderedCards);
  const areaCards = useMemo(
    () => getRepresentativeCardByArea(orderedCards),
    [orderedCards],
  );
  const feedCards =
    selectedArea === ALL_AREAS
      ? orderedCards
      : orderedCards.filter((card) => card.areaName === selectedArea);

  const selectedCard = getSelectedCard(orderedCards, selectedCardId);
  const selectedStatus =
    cardStatuses[selectedCard.id] ?? selectedCard.initialStatus;
  const selectedOverrideReason = overrideReasons[selectedCard.id] ?? "";
  const selectedFeedback = feedback[selectedCard.id] ?? {};

  function selectScenario(scenarioId: ScenarioId) {
    const firstCard = getOrderedCardsForScenario(
      recommendationCards,
      scenarioId,
    )[0];
    setActiveScenarioId(scenarioId);
    setSelectedCardId(firstCard.id);
    setSelectedArea(ALL_AREAS);
    setOpenOverrideCardId(null);
    setObservationGlimpseOpen(false);
    setDetailOpen(false);
  }

  // The action list's only job when a card is tapped: slide the full detail
  // drawer in. Selecting an area tab never does this — the two gestures stay
  // fully separate, each with one meaning.
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

  function respondFeedback(response: FeedbackResponse) {
    setFeedback((current) => ({
      ...current,
      [selectedCard.id]: { ...current[selectedCard.id], response },
    }));
  }

  function changeFeedbackNote(note: string) {
    setFeedback((current) => ({
      ...current,
      [selectedCard.id]: { ...current[selectedCard.id], note },
    }));
  }

  function exportResearchNotes() {
    const payload = {
      exportedAt: new Date().toISOString(),
      property: propertyProfile.name,
      responses: recommendationCards.map((card) => ({
        cardId: card.id,
        scenario: card.scenarioId,
        area: card.areaName,
        action: card.action,
        attention: card.attention,
        decision: cardStatuses[card.id] ?? card.initialStatus,
        overrideReason: overrideReasons[card.id] ?? null,
        wouldTakeAction: feedback[card.id]?.response ?? null,
        note: feedback[card.id]?.note ?? null,
      })),
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `asc-beta-research-${Date.now()}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore — export is best-effort in a research prop
    }
  }

  function resetDemo() {
    selectScenario(initialScenarioId);
    setCardStatuses(initialStatuses);
    setOverrideReasons({});
  }

  return (
    <AppShell>
      {/* pb clears the phone-only fixed "Log Observation" bar (TodayFeed) so
          the last card isn't hidden behind it; no bar on desktop, so pb-0. */}
      <div className="grid gap-5 pb-20 lg:pb-0">
        <ScenarioBar
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={selectScenario}
          onReset={resetDemo}
          onExport={exportResearchNotes}
        />

        {/* Keyed by scenario so briefing + the hero band + the working area
            below fade in together on a scenario switch — one visible "this
            refreshed" cue instead of silent in-place text swaps. */}
        <div key={activeScenarioId} className="grid animate-fade-in gap-5">
          <DailyBriefing
            day={activeScenario.day}
            weather={activeScenario.weather}
            decisionOwner={activeScenario.decisionOwner}
            paragraphs={activeScenario.briefing}
          />

          {/* Hero band — see AttentionSummary.tsx. Full width, right after
              the briefing, deliberately not paired side-by-side with
              anything else. */}
          <AttentionSummary counts={attentionCounts} />

          {/* Working area: Landscape Health as a left tab rail, Recommended
              Actions filling the remaining width. A tab click only ever
              changes which area's actions show here — it never opens a
              detail view by itself. */}
          <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
            <LandscapeHealthStrip
              zones={activeScenario.landscape}
              areaCards={areaCards}
              totalActionCount={orderedCards.length}
              selectedArea={selectedArea}
              onSelectArea={setSelectedArea}
            />
            <TodayFeed
              cards={feedCards}
              totalCount={orderedCards.length}
              selectedCardId={selectedCard.id}
              cardStatuses={cardStatuses}
              selectedArea={selectedArea === ALL_AREAS ? null : selectedArea}
              onSelect={selectCard}
              onClearArea={() => setSelectedArea(ALL_AREAS)}
              onOpenObservation={() => setObservationGlimpseOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Third and final drill-in step: full detail slides in from the right
          over everything above, on every breakpoint. The action list and its
          area scope stay untouched underneath, so closing the drawer returns
          to exactly where the user left off. */}
      <DetailDrawer
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setOpenOverrideCardId(null);
        }}
        titleId="recommendation-detail-title"
      >
        <RecommendationDetail
          card={selectedCard}
          status={selectedStatus}
          overrideReason={selectedOverrideReason}
          isOverrideOpen={openOverrideCardId === selectedCard.id}
          feedback={selectedFeedback}
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
          onFeedbackRespond={respondFeedback}
          onFeedbackNoteChange={changeFeedbackNote}
        />
      </DetailDrawer>

      <ObservationGlimpse
        isOpen={observationGlimpseOpen}
        observation={activeScenario.observation}
        onClose={() => setObservationGlimpseOpen(false)}
      />
    </AppShell>
  );
}
