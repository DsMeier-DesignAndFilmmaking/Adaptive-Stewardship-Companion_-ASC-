import type { LifecycleState } from "./types";

// The directed lifecycle graph. Accepted and Rejected are alternative branches
// from Reviewed; Executed follows Accepted; Archived is terminal.
const TRANSITIONS: Record<LifecycleState, readonly LifecycleState[]> = {
  draft: ["generated"],
  generated: ["reviewed"],
  reviewed: ["accepted", "rejected"],
  accepted: ["executed"],
  rejected: ["archived"],
  executed: ["archived"],
  archived: [],
};

export function canTransition(from: LifecycleState, to: LifecycleState): boolean {
  return TRANSITIONS[from].includes(to);
}

export class LifecycleTransitionError extends Error {
  constructor(
    readonly from: LifecycleState,
    readonly to: LifecycleState,
  ) {
    super(`Invalid recommendation lifecycle transition: ${from} -> ${to}`);
    this.name = "LifecycleTransitionError";
  }
}

export function assertTransition(from: LifecycleState, to: LifecycleState): void {
  if (!canTransition(from, to)) {
    throw new LifecycleTransitionError(from, to);
  }
}

export function isTerminal(state: LifecycleState): boolean {
  return TRANSITIONS[state].length === 0;
}
