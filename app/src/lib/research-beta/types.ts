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

export type ScenarioId = "rain" | "bloom" | "stale-signal" | "override";

// Drives the static Log Observation glimpse so it stays coherent per scenario.
export type ObservationSample = {
  areaName: string;
  condition: string;
  severity: string;
  note: string;
};

// The per-scenario "dashboard state": the operating moment each scenario sets
// up. Switching the active scenario swaps the whole demo context independently.
export type Scenario = {
  id: ScenarioId;
  label: string; // scenario switcher label
  theme: string; // operational theme from the scenario library
  libraryRef: string; // traceability to research-beta-scenario-library.md
  day: string; // operating moment shown in the header
  weather: string; // header weather line
  scene: string; // one-line scene set for facilitator + header context
  decisionOwner: string;
  observation: ObservationSample;
};

export type RecommendationCard = {
  id: string;
  scenarioId: ScenarioId;
  areaName: string;
  areaType: string;
  action: RecommendationAction;
  title: string;
  shortReason: string;
  landscapeCondition: string; // current physical / ecological state of the area
  confidence: Confidence;
  confidenceReason: string;
  evidence: string[];
  missingEvidence?: string;
  alternative?: string;
  visitorView: string; // guest-facing framing (what front desk says)
  stewardshipView: string; // stewardship rationale (why the land steward cares)
  decisionOwner: string;
  interviewPrompt: string;
  initialStatus: CardStatus;
};

export type BetaState = {
  activeScenarioId: ScenarioId;
  selectedCardId: string;
  cardStatuses: Record<string, CardStatus>;
  overrideReasons: Record<string, string>;
  observationGlimpseOpen: boolean;
};
