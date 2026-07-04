---
status: draft
last_updated: 2026-07-04
owner: Dan
related_stage: 7. Product Strategy
---

# Product Vision

## Purpose

A concrete, falsifiable articulation of what ASC does for its first real customers — more specific than the charter's aspirational mission.

## Key Questions to Answer

- What is the first concrete decision ASC improves for a named ICP?
- What does success look like in 12 months with real pilot customers?

## Important Caveat

This vision is built entirely from desk research (`01-research/`) and the problem hypotheses in `02-strategy/problem-statements.md` — it has not been tested against a real customer conversation. It is written to be concrete enough to be *wrong* — and should be revised the moment discovery interviews contradict it, not defended.

## Working Vision Statement

For mid-size botanical gardens and nature centers — expanding next to eco-lodges and guest ranches — ASC is the daily decision layer that recommends which trails, garden zones, or guided experiences to open, restrict, close, or actively promote today, based on current visitor flow, ecological/habitat condition signals, and weather. Every recommendation comes with a plain-language reason and a confidence score, so operations and grounds staff can act with more confidence and less ad hoc coordination — while giving stressed areas of the landscape room to recover before damage becomes costly or irreversible.

This resolves the first-concrete-decision gap flagged in `00-charter/charter-review-2026-07-04.md`: the specific, falsifiable "day one" feature is a daily zone/trail/experience recommendation feed, not an abstract "adaptive intelligence layer."

## Why This Segment, This Decision, First

Botanical gardens/nature centers rank as the strongest ICP candidate in `01-research/customer-segmentation.md` (best thesis fit, existing digitized visitor data via Doubleknot/Veevart-type systems). The specific decision — daily routing/promotion/restriction of trails and zones — is the same underlying pattern documented at costly scale in national parks (`01-research/industry-research.md`) and named explicitly in the charter's own Product Goals ("Which experience is most appropriate today?", "Where should visitors be encouraged?", "Where should visitation be reduced?"). No competing tool was found combining visitor-flow and ecological-condition data into this kind of recommendation (`01-research/competitive-analysis.md`) — so this is both evidenced by analogy and, as far as desk research can tell, unaddressed by any existing vendor.

## What Success Looks Like in 12 Months

With real pilot customers (not just software usage):

- 2-4 paying pilot customers live — ideally at least one botanical garden/nature center and one eco-lodge/guest ranch, testing whether the wedge generalizes across the two ICP candidates per `02-strategy/product-strategy.md`.
- Operations/grounds staff at each pilot site are using ASC's daily recommendation feed as part of real, live operational decisions — not a shadow/parallel system they ignore.
- Staff self-report increased decision confidence and reduced ad hoc coordination burden (a leading indicator, directly attributable, unlike multi-year ecological metrics — see `00-charter/charter-review-2026-07-04.md` on ecological-metric attribution).
- At least one concrete instance per pilot where a recommendation changed a real decision (a zone was closed, promoted, or rerouted differently than it would have been without ASC) and staff judged the outcome better than the status quo.
- At least a working hypothesis, informed by pilot data, on a shorter-cycle ecological leading indicator (e.g., reduced repeat flagging of the same overstressed trail segment) that could mature into a validated metric in `07-continuous-learning/metrics-tracking.md`.

Deliberately not a success criterion at 12 months: measurable habitat recovery or other multi-year ecological outcomes (per the charter's own success metrics) — those take longer than a first pilot year to observe and attribute, and treating them as a 12-month gate would be inconsistent with the charter-review's attribution-risk finding.

## What Would Falsify This Vision

Stated explicitly, per the charter's instruction to distinguish known/assumed/needs-validation:

- If discovery interviews reveal that botanical garden/nature center operations staff don't actually make daily trail/zone routing decisions (e.g., it's set once per season and rarely revisited), the "daily decision layer" framing is wrong and the product needs a different cadence.
- If staff perceive ecological condition assessment as someone else's job (a separate horticulture/curatorial team with no operational authority), the single-recommendation-engine framing may need to split into two products or a narrower operational scope.
- If neither pilot segment is willing to pay a subscription for this specific decision (tested in `02-strategy/business-model.md` and `01-research/customer-discovery.md`), the vision holds conceptually but fails commercially and needs re-scoping, not further design polish.

## Validated Knowledge

- The underlying visitor-flow-vs-condition decision problem is real and costly at the largest researched scale (national parks). *(`01-research/industry-research.md`)*
- No existing product combines visitor-flow and ecological-condition data into a recommendation engine for any segment researched. *(`01-research/competitive-analysis.md`)*

## Evidence-Informed Insight

- Framing the MVP around a single daily recommendation type (not a broad platform) matches the charter's "simplicity over unnecessary complexity" principle and gives the clearest single point of falsification for pilot testing.
- Attaching a plain-language reason and confidence score to every recommendation directly operationalizes two charter principles ("every recommendation explains why it exists," "confidence accompanies every prediction") in a way concrete enough to prototype immediately.

## Hypotheses / Open Questions

- Everything under "What Would Falsify This Vision" above — these are the primary discovery-interview questions, not settled answers.
- Whether "daily" is the right cadence, or whether real operational rhythms run weekly, event-triggered (e.g., a storm, a bloom event), or some mix.

## Notes

Depends on: `02-strategy/problem-statements.md`, `01-research/customer-segmentation.md`, `01-research/competitive-analysis.md`, `01-research/industry-research.md`, `00-charter/charter-review-2026-07-04.md`.
