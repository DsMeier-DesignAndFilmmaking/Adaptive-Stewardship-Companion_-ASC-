import type { CardStatus, Confidence, RecommendationAction } from "./types";

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

export const defaultOverrideReasons = [
  "Local staff context changed the recommendation.",
  "Repair or stewardship work is already underway.",
  "Visitor commitment requires a different operating call.",
  "Need a field check before changing guidance.",
];
