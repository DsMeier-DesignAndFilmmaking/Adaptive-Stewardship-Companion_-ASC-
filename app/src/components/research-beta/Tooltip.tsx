"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

type TooltipProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

// Shared tooltip for the tag-ribbon chips (attention, action, confidence,
// status). Controlled by state rather than pure CSS so it works on touch: the
// triggers are nested inside already-tappable parents (an AttentionChip inside
// a zone tab button in LandscapeHealthStrip), where a CSS hover/focus-only
// tooltip either can't be summoned by a tap or the tap bubbles into the parent
// and switches tabs instead of showing the tooltip.
//
// Reveal paths: hover (pointer), tap-to-toggle (touch), Enter/Space (keyboard).
// Dismiss paths: mouse-leave, tap again, tap outside, Escape. The onClick
// stopPropagation is what stops a tap from reaching the parent tab/card. SR
// users get the text via aria-describedby on focus regardless of the visual
// open state, so screen-reader access never depended on the visual reveal.
export function Tooltip({ label, children, className = "" }: TooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span ref={wrapRef} className={`relative inline-flex ${className}`}>
      <span
        tabIndex={0}
        aria-describedby={tooltipId}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(event) => {
          // Critical: keep the tap from bubbling into a parent tab button or
          // card, which would switch areas / open a detail instead.
          event.stopPropagation();
          event.preventDefault();
          setIsOpen((open) => !open);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen((open) => !open);
          }
        }}
        className="inline-flex rounded-full focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        {children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-56 -translate-x-1/2 text-balance rounded-md bg-foreground px-2.5 py-1.5 text-center text-xs font-medium leading-snug text-background shadow-md transition duration-150 motion-reduce:transition-none ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </span>
    </span>
  );
}
