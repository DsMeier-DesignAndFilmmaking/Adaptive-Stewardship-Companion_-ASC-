import type { OverrideCategory } from "@/lib/audit/events";

// The recommendation domain vocabulary. This module owns it; the persistence
// schema imports these arrays. Aligned with the research-beta prototype shape
// (app/src/lib/research-beta/types.ts), promoted to production fields.

// The lifecycle states (directed): Draft -> Generated -> Reviewed ->
// Accepted | Rejected -> Executed -> Archived.
export const LIFECYCLE_STATES = [
  "draft",
  "generated",
  "reviewed",
  "accepted",
  "rejected",
  "executed",
  "archived",
] as const;
export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

// The MVP action vocabulary (pins TERM-3: the prototype's five, incl. `rest`).
export const RECOMMENDATION_ACTIONS = [
  "open",
  "promote",
  "rest",
  "restrict",
  "close",
] as const;
export type RecommendationAction = (typeof RECOMMENDATION_ACTIONS)[number];

// Confidence is categorical and includes `unknown` (decision-models.md).
export const CONFIDENCE_LEVELS = ["high", "medium", "low", "unknown"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export const ATTENTION_LEVELS = ["critical", "monitor", "opportunity"] as const;
export type Attention = (typeof ATTENTION_LEVELS)[number];

export const EXPLANATION_SOURCES = ["deterministic", "llm"] as const;
export type ExplanationSource = (typeof EXPLANATION_SOURCES)[number];

// The rules-decide provenance: which rules fired + the (future) input refs.
export type RuleTrace = {
  rules: Array<{ id: string; note: string; matched: boolean }>;
  inputRefs?: {
    observationIds?: string[];
    signalIds?: string[];
    landscapeAreaId?: string | null;
  };
  placeholder?: boolean;
};

export type { OverrideCategory };
