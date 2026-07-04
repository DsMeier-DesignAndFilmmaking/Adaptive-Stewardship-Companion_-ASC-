# Roadmap

This sequences the charter's 18-stage workflow into an actual near-term plan. The full lifecycle shouldn't run in parallel — early stages need to close before later ones are trustworthy. Update the status column as work progresses; add dated notes under each phase as decisions get made.

## Phase 0 — Foundation (this session)

| Step | Status |
|---|---|
| Repo scaffold, charter, templates | done — 2026-07-04 |

## Phase 1 — Research (next)

Goal: narrow the charter's 14 customer types into a real ICP, and test whether the core thesis (orgs have exploitable signal but lack the intelligence layer) holds.

| Step | File | Status |
|---|---|---|
| Industry research | `01-research/industry-research.md` | draft — 2026-07-04 (desk research; key finding: visitor/ecology trade-off is already costly and real at flagship parks, adaptive management is 50-yr-old doctrine industry already believes but under-executes) |
| Market landscape + competitive analysis | `01-research/market-landscape-analysis.md`, `01-research/competitive-analysis.md` | draft — 2026-07-04 (desk research; no direct competitor found combining visitor + ecological signal in one recommendation engine — genuine white space, unvalidated willingness-to-pay) |
| Ecosystem mapping (what systems do target orgs already run?) | `01-research/ecosystem-maps.md` | draft — 2026-07-04 (desk research; working ICP candidates: botanical gardens/nature centers, eco-lodges/guest ranches) |
| Customer segmentation → pick ICP | `01-research/customer-segmentation.md` | draft — 2026-07-04 (desk research only; needs discovery interviews to confirm) |
| Customer discovery interviews (target: 10-15 across 2-3 candidate segments) | `01-research/customer-discovery.md` | not-started — next step |
| JTBD synthesis | `01-research/jobs-to-be-done.md` | not-started |

**Exit criteria for Phase 1:** a chosen ICP, at least one recurring, evidence-backed problem statement, and a clear read on whether target customers have usable operational/ecological data today.

## Phase 2 — Strategy

Goal: turn research into a falsifiable product vision and a scoped opportunity.

| Step | File | Status |
|---|---|---|
| Problem statements | `02-strategy/problem-statements.md` | draft — 2026-07-04 (hypothesis-tier; two problem statements, gardens/nature centers + eco-lodges/ranches, pending discovery interviews) |
| Opportunity assessment (score vs. charter's 8-criteria decision framework) | `02-strategy/opportunity-assessment.md` | not-started — recommended next before locking MVP scope |
| Product vision (concrete first decision ASC improves) | `02-strategy/product-vision.md` | draft — 2026-07-04 (working vision: daily zone/trail/experience recommendation with rationale + confidence, gardens/nature centers first) |
| Product strategy + business model + pricing direction | `02-strategy/product-strategy.md`, `business-model.md` | draft — 2026-07-04 (wedge: single decision, one segment, manual data first; working ACV target $8K-$20K/yr, org-based pricing). `pricing-strategy.md` still not-started, folded into business-model.md for now |

**Exit criteria for Phase 2:** a named MVP wedge and a defensible answer to "why would someone pay for this."

## Phase 3 — Architecture & Design

Goal: design the system and experience around the MVP wedge only — not the full 18-stage vision.

| Step | File | Status |
|---|---|---|
| Systems maps + domain models | `03-systems-architecture/systems-maps.md`, `domain-models.md` | not-started |
| AI architecture (resolve rules vs. ML vs. LLM question) | `03-systems-architecture/ai-architecture.md` | not-started |
| Service blueprint + UX architecture + user flows | `04-design/service-blueprints.md`, `ux-architecture.md`, `user-flows.md` | not-started |

## Phase 4 — Build & Pilot

| Step | File | Status |
|---|---|---|
| MVP definition | `05-product/mvp-definition.md` | not-started |
| PRDs per MVP feature | `05-product/prds/` | not-started |
| Pilot strategy + customer selection | `06-pilot-and-launch/pilot-strategy.md` | not-started |

## Phase 5 — Launch & Learn

| Step | File | Status |
|---|---|---|
| Production roadmap | `06-pilot-and-launch/production-roadmap.md` | not-started |
| Launch plan | `06-pilot-and-launch/launch-plan.md` | not-started |
| Metrics tracking + learning log (ongoing, never "done") | `07-continuous-learning/` | not-started |

## Immediate Next Action

Phase 1 (all five research docs) and most of Phase 2 (problem statements, product vision, product strategy, business model) are now drafted (2026-07-04) — all desk-research-informed hypotheses, none yet tested against a real customer. Working thread across all of it: lead with botanical gardens/nature centers, MVP wedge is a single daily zone/trail/experience recommendation (rationale + confidence) built on manual staff-logged data plus existing visitor-ops data, org-based pricing in the $8K-$20K/yr range, eco-lodges/guest ranches as the second-segment generalization test.

None of this is validated knowledge — the charter's Validation Standard requires customer interviews before any of it locks in. **This is now the hard stop:** `01-research/customer-discovery.md` (10-15 interviews across the two priority segments) must happen before `02-strategy/opportunity-assessment.md`, architecture (Phase 3), or any real feature-building proceeds. Interviews should directly test: whether the problem statements are actually felt as daily pain, whether "daily" is the right decision cadence, whether staff want this at all versus feeling second-guessed, and what these orgs would actually pay.
