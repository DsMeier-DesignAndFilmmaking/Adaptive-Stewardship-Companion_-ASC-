"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type DetailDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  titleId: string;
};

// A single, honest third step in the drill-down (tab -> action list -> this):
// tapping a Recommended Action card slides its full detail in from the right
// over the current view, rather than swapping the list out for the detail in
// place. The list stays exactly where it was underneath, so closing the
// drawer returns to precisely the same scroll position and area scope —
// nothing else on the page moves or resets when a detail is opened or closed.
export function DetailDrawer({
  isOpen,
  onClose,
  children,
  titleId,
}: DetailDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop — click to close, matches the dim treatment already used by
          Observation Glimpse elsewhere in this prototype. */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/35 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Below lg: a bottom sheet (native mobile metaphor) — anchored to the
          bottom edge, capped height, rounded top, slides up on the y-axis. At
          lg+: unchanged — a full-height panel anchored right that slides in on
          the x-axis. Only one axis is ever offset at a given breakpoint (the
          other's translate resolves to 0). */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-x-0 bottom-0 top-auto flex max-h-[92vh] w-full max-w-xl transform flex-col rounded-t-2xl bg-background shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:inset-y-0 lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:max-h-none lg:rounded-t-none ${
          isOpen
            ? "translate-y-0 lg:translate-x-0"
            : "translate-y-full lg:translate-y-0 lg:translate-x-full"
        }`}
      >
        {/* Visual drag-handle affordance only — closing is via backdrop click
            or Escape (no drag-to-dismiss gesture in scope here). */}
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border lg:hidden"
        />
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
