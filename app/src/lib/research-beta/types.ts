export type Confidence = "high" | "medium" | "low";

export type RecommendationAction =
  | "open"
  | "promote"
  | "rest"
  | "restrict"
  | "close";

export type CardStatus =
  | "unreviewed"
  | "accepted"
  | "dismissed"
  | "overridden";

// Property-level triage (Phase C). Ordering priority: critical → monitor →
// opportunity. This is a lens over recommendations, not a severity score.
export type AttentionLevel = "critical" | "monitor" | "opportunity";

// Qualitative landscape status (Phase D) — never a numeric score.
export type LandscapeStatus =
  | "healthy"
  | "high-use"
  | "recovery"
  | "monitoring"
  | "sensitive";

export type ScenarioId = "rain" | "bloom" | "stale-signal" | "override";

// Discovery instrumentation (Phase E).
export type FeedbackResponse = "yes" | "maybe" | "no";
export type CardFeedback = { response?: FeedbackResponse; note?: string };

export type ObservationSample = {
  areaName: string;
  condition: string;
  severity: string;
  note: string;
};

export type LandscapeZone = {
  area: string; // must match a card's areaName for tap-to-filter
  status: LandscapeStatus;
  note?: string;
};

// The per-scenario "operating moment." Switching scenarios swaps the whole
// briefing, feed, landscape strip, and observation glimpse independently.
export type Scenario = {
  id: ScenarioId;
  label: string;
  theme: string;
  libraryRef: string;
  day: string;
  weather: string;
  decisionOwner: string;
  briefing: string[]; // Phase A — morning briefing, paragraph per line
  landscape: LandscapeZone[]; // Phase D — glanceable zone statuses
  observation: ObservationSample;
};

export type RecommendationCard = {
  id: string;
  scenarioId: ScenarioId;
  areaName: string;
  areaType: string;
  action: RecommendationAction;
  attention: AttentionLevel; // Phase C
  title: string;
  shortReason: string;
  expectedOutcome: string; // Phase B — "what happens if I do this"
  landscapeCondition: string;
  confidence: Confidence;
  confidenceReason: string;
  evidence: string[];
  missingEvidence?: string;
  alternative?: string;
  visitorView: string;
  stewardshipView: string;
  decisionOwner: string;
  interviewPrompt: string;
  initialStatus: CardStatus;
};

export type BetaState = {
  activeScenarioId: ScenarioId;
  selectedCardId: string;
  selectedArea: string; // single-select Landscape Health tab; "all" = no scope
  cardStatuses: Record<string, CardStatus>;
  overrideReasons: Record<string, string>;
  feedback: Record<string, CardFeedback>;
  observationGlimpseOpen: boolean;
  detailOpen: boolean;
};
