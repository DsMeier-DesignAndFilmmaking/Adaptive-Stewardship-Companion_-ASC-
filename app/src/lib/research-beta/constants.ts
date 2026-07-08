import type {
  AttentionLevel,
  CardStatus,
  Confidence,
  FeedbackResponse,
  LandscapeStatus,
  RecommendationAction,
} from "./types";

export const actionLabels: Record<RecommendationAction, string> = {
  open: "Open",
  promote: "Promote",
  rest: "Rest",
  restrict: "Restrict",
  close: "Close",
};

export const actionDescriptions: Record<RecommendationAction, string> = {
  open: "Available with normal guidance.",
  promote: "Actively direct visitors here.",
  rest: "Reduce visitor pressure to support recovery.",
  restrict: "Limit access, timing, or group size.",
  close: "Do not send visitors until reviewed.",
};

export const confidenceLabels: Record<Confidence, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export const statusLabels: Record<CardStatus, string> = {
  unreviewed: "Needs review",
  accepted: "Accepted",
  dismissed: "Dismissed",
  overridden: "Overridden",
};

// Phase C — attention triage.
export const attentionLabels: Record<AttentionLevel, string> = {
  critical: "Critical",
  monitor: "Monitor",
  opportunity: "Opportunity",
};

// Tag-ribbon tooltip copy — what each attention level means, shown on hover
// so the chip doesn't rely on color/label alone to convey why it matters.
export const attentionDescriptions: Record<AttentionLevel, string> = {
  critical: "Needs a decision today — don't defer.",
  monitor: "Watch closely; no action needed yet.",
  opportunity: "A chance to actively improve the outcome, not just a problem to fix.",
};

export const statusDescriptions: Record<CardStatus, string> = {
  unreviewed: "No staff decision recorded yet.",
  accepted: "Staff confirmed this recommendation should stand.",
  dismissed: "Staff dismissed this recommendation.",
  overridden: "Staff replaced this recommendation with their own call.",
};

// Lower rank sorts first (critical → monitor → opportunity).
export const attentionRank: Record<AttentionLevel, number> = {
  critical: 0,
  monitor: 1,
  opportunity: 2,
};

// Phase D — qualitative landscape statuses.
export const landscapeStatusLabels: Record<LandscapeStatus, string> = {
  healthy: "Healthy",
  "high-use": "High use",
  recovery: "Recovery",
  monitoring: "Monitoring",
  sensitive: "Sensitive",
};

// Phase E — discovery capture.
export const feedbackLabels: Record<FeedbackResponse, string> = {
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
};

export const defaultOverrideReasons = [
  "Local staff context changed the recommendation.",
  "Repair or stewardship work is already underway.",
  "Visitor commitment requires a different operating call.",
  "Need a field check before changing guidance.",
];
