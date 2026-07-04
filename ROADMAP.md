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
| Industry research | `01-research/industry-research.md` | not-started |
| Market landscape + competitive analysis | `01-research/market-landscape-analysis.md`, `01-research/competitive-analysis.md` | not-started |
| Ecosystem mapping (what systems do target orgs already run?) | `01-research/ecosystem-maps.md` | draft — 2026-07-04 (desk research; working ICP candidates: botanical gardens/nature centers, eco-lodges/guest ranches) |
| Customer segmentation → pick ICP | `01-research/customer-segmentation.md` | draft — 2026-07-04 (desk research only; needs discovery interviews to confirm) |
| Customer discovery interviews (target: 10-15 across 2-3 candidate segments) | `01-research/customer-discovery.md` | not-started — next step |
| JTBD synthesis | `01-research/jobs-to-be-done.md` | not-started |

**Exit criteria for Phase 1:** a chosen ICP, at least one recurring, evidence-backed problem statement, and a clear read on whether target customers have usable operational/ecological data today.

## Phase 2 — Strategy

Goal: turn research into a falsifiable product vision and a scoped opportunity.

| Step | File | Status |
|---|---|---|
| Problem statements | `02-strategy/problem-statements.md` | not-started |
| Opportunity assessment (score vs. charter's 8-criteria decision framework) | `02-strategy/opportunity-assessment.md` | not-started |
| Product vision (concrete first decision ASC improves) | `02-strategy/product-vision.md` | not-started |
| Product strategy + business model + pricing direction | `02-strategy/product-strategy.md`, `business-model.md`, `pricing-strategy.md` | not-started |

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

Desk research on customer segmentation and ecosystem mapping is done (2026-07-04) — see both files for findings and sources. Working recommendation: prioritize discovery interviews with botanical gardens/nature centers and mid-size eco-lodges/guest ranches; deprioritize state/national parks (procurement timeline) and regenerative agriculture (unproven visitor-experience fit) for now.

This is desk research only, not validated knowledge — the charter's Validation Standard requires customer interviews before any of this locks into `02-strategy/product-vision.md`. Next step: `01-research/customer-discovery.md` — recruit and interview 10-15 orgs across the two priority segments.
