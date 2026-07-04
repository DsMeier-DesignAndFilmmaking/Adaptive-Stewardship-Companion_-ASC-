---
status: draft
last_updated: 2026-07-04
owner: Dan
related_stage: 5. Problem Definition
---

# Problem Statements

## Purpose

Crisp, evidence-backed statements of the problems ASC will solve, derived from research — not restatements of the charter's aspirations.

## Key Questions to Answer

- What specific, recurring problem does each target segment have?
- What evidence (interview, observation) backs each problem statement?
- Which problems are big enough to build a company around?

## Important Caveat

Every problem statement below is built from desk research only (`01-research/`) — no customer discovery interviews have happened yet (`01-research/customer-discovery.md` is still not-started). Per the charter's Validation Standard, none of this should be treated as a validated recurring customer problem until real interviews confirm it. Treat this document as the specific, falsifiable hypotheses those interviews need to test — not as settled fact.

## Problem Statement 1 — Botanical gardens & nature centers (primary ICP candidate)

Operations and grounds staff at botanical gardens and nature centers currently decide which trails, garden zones, or guided-tour routes to open, restrict, close, or actively promote to visitors each day using manual judgment, informal staff communication, and static seasonal plans — not a systematic method that weighs current plant/habitat condition against current or forecasted visitor volume and flow. This plausibly creates two recurring failure modes: over-visited or fragile areas absorb avoidable ecological damage (soil compaction, plant stress, informal trail creation) because no one is systematically flagging when visitor pressure exceeds a zone's current condition threshold; and visitors experience avoidable crowding or missed peak-bloom/wildlife-viewing windows because favorable zones aren't being proactively surfaced when conditions are good.

**Supporting evidence:** the large-scale version of this exact failure mode is well documented at national parks — Yellowstone's $1.5B+ wastewater-system strain and Yosemite's crowd-driven Bridalveil Fall infrastructure rebuild (`01-research/industry-research.md`) are direct, costly instances of visitor pressure outpacing site-condition awareness. Botanical gardens and nature centers already invest in visitor-flow software (Doubleknot, Veevart) — proving they care operationally about managing visitor flow — but no evidence was found of any tool tying that visitor-flow data to real-time plant or habitat condition (`01-research/ecosystem-maps.md`). That combination gap is real; what's unconfirmed is whether garden/nature-center staff feel this specific pain acutely enough, day to day, to change a purchasing decision over it.

## Problem Statement 2 — Eco-lodges & guest ranches (secondary ICP candidate)

Guest-facing staff at eco-lodges and guest ranches recommend trails, activities, and viewing spots to guests largely from memory, tenure, and static seasonal knowledge, rather than systematically incorporating current trail condition, recent weather impact, or wildlife activity. Given that hospitality/accommodation roles in this space are disproportionately seasonal and lower-wage (~$46k average, per `01-research/industry-research.md`) relative to more stable outdoor-recreation-adjacent roles, this tacit knowledge is fragile: it doesn't reliably transfer between staff cohorts within or across seasons, and a departing staff member can take a property's accumulated situational judgment with them.

**Supporting evidence:** the eco-lodge/guest-ranch PMS/reservation software market is mature (`01-research/customer-segmentation.md`), showing these operators already invest in operational software and have a fast, single-decision-maker sales cycle — but no dedicated tool was found addressing the specific problem of transferring situational trail/wildlife/condition judgment across a high-turnover seasonal staff base. This is a plausible, evidence-informed problem, not yet confirmed by direct conversation with an owner or GM.

## Assessment: Are These Problems Big Enough to Build a Company Around?

Both problem statements describe the same underlying recurring workflow — a daily or near-daily routing/allocation decision that should weigh visitor experience against landscape condition, currently made ad hoc — appearing in some form across every segment researched (including the deprioritized public-land and conservation-org segments, per `01-research/customer-segmentation.md`). A recurring, cross-segment decision pattern is a reasonable foundation for a company if validated, rather than a one-off feature idea. The open question isn't whether the pattern exists in principle (industry-research.md and ecosystem-maps.md both support that it does), but whether it is painful and visible enough, to a specific budget-holder, to justify a new purchase — which is precisely what `01-research/customer-discovery.md` interviews need to test directly.

## Validated Knowledge

- Visitor-pressure-versus-site-condition failures are real, documented, and expensive at the largest scale researched (national parks). *(See `01-research/industry-research.md` sources.)*
- No tool was found in desk research that ties visitor-flow data to real-time ecological/habitat condition data for any researched segment. *(See `01-research/ecosystem-maps.md` and `01-research/competitive-analysis.md`.)*

## Evidence-Informed Insight

- The botanical garden/nature center problem statement is better evidenced than the eco-lodge/guest-ranch one, because the "visitor flow already digitized, ecological data still missing" pattern is more clearly established for gardens/nature centers (`01-research/ecosystem-maps.md`) than the "fragile tacit knowledge transfer" framing is for eco-lodges, which currently rests more on labor-market inference than direct evidence of the problem itself.
- Both problem statements assume operations/frontline staff *want* a system telling them what to do — an assumption worth testing directly, since experienced staff may perceive this as undermining their judgment rather than supporting it (a common failure mode for decision-support tools in expert-driven fields).

## Hypotheses / Open Questions

- Do botanical garden/nature center staff experience the visitor-flow/plant-condition tension as a recurring daily annoyance, an occasional seasonal event (e.g., only during peak bloom), or not really their problem to solve (someone else's job)?
- Is the eco-lodge/guest-ranch tacit-knowledge-transfer problem actually felt as a business problem (e.g., guest complaints, safety incidents, damaged trails) or is current informal handling considered "good enough" by owners/GMs?
- Would either group frame this as a problem they'd pay to solve, or as a nice-to-have they'd only adopt if bundled into software they already use (Doubleknot/Veevart, PMS)? Directly shapes `02-strategy/business-model.md` and `02-strategy/product-strategy.md`.

## Notes

Built from: `01-research/customer-segmentation.md`, `01-research/ecosystem-maps.md`, `01-research/industry-research.md`, `01-research/competitive-analysis.md`. No new external sources searched for this synthesis; see those docs for citations.
