import type {
  Attention,
  Confidence,
  ExplanationSource,
  RecommendationAction,
  RuleTrace,
} from "./types";

// Service abstractions for future stewardship intelligence. These are the
// seams the real engine will implement; E5 ships placeholder implementations
// (see placeholders.ts). NOTHING here decides real stewardship outcomes.

/**
 * Inputs the future engine will consume. All refs are LOOSE — Landscape Areas,
 * Observations, and Signals (E2) do not exist yet, so they are carried as ids
 * to be resolved once those entities are built.
 */
export type EvaluationInput = {
  landscapeAreaId?: string | null;
  observationIds?: string[];
  environmentalSignalIds?: string[];
  operationalSignalIds?: string[];
  context?: Record<string, unknown>;
};

export type RuleEvaluationResult = {
  action: RecommendationAction;
  attention: Attention;
  ruleTrace: RuleTrace;
  evidence: string[];
  missingEvidence?: string | null;
  alternative?: string | null;
};

/** rules-decide. Real thresholds are excluded (require discovery). */
export interface RuleEvaluator {
  evaluate(input: EvaluationInput): RuleEvaluationResult | Promise<RuleEvaluationResult>;
}

export type ConfidenceResult = { level: Confidence; reason: string };

/** Confidence from data quality. Production formula excluded. */
export interface ConfidenceCalculator {
  calculate(
    input: EvaluationInput,
    evaluation: RuleEvaluationResult,
  ): ConfidenceResult | Promise<ConfidenceResult>;
}

export type ExplanationInput = {
  action: RecommendationAction;
  attention: Attention;
  confidence: ConfidenceResult;
  ruleTrace: RuleTrace;
  evidence: string[];
  missingEvidence?: string | null;
};

export type ExplanationResult = { text: string; source: ExplanationSource };

/**
 * LLM-explains. The interface is provider-agnostic (provider-specific LLM
 * integration is excluded in E5). The deterministic implementation is both the
 * placeholder and the future LLM's failure-path fallback.
 */
export interface Explainer {
  explain(input: ExplanationInput): ExplanationResult | Promise<ExplanationResult>;
}

/** Composes evaluation + confidence + explanation into a generated draft. */
export type GeneratedRecommendation = {
  action: RecommendationAction;
  attention: Attention;
  title: string;
  shortReason: string;
  confidence: Confidence;
  confidenceReason: string;
  explanation: string;
  explanationSource: ExplanationSource;
  ruleTrace: RuleTrace;
  evidence: string[];
  missingEvidence: string | null;
  alternative: string | null;
  landscapeAreaId: string | null;
};

export interface RecommendationGenerator {
  generate(input: EvaluationInput): Promise<GeneratedRecommendation>;
}
