# Adaptive Stewardship Companion (ASC)

This repo is the source of truth for building ASC: an adaptive operational intelligence layer for outdoor organizations, balancing visitor experience, ecological stewardship, and operational effectiveness.

Start here:

- **`00-charter/PROJECT_CHARTER.md`** — mission, principles, boundaries, decision framework. Read this first; everything else should trace back to it.
- **`00-charter/charter-review-2026-07-04.md`** — open risks and assumptions flagged in the charter that need validating through research.
- **`ROADMAP.md`** — what's actually being worked on right now, in what order.

## Folder Structure

Organized by discipline, with each folder's contents sequenced to match the charter's product development workflow (Research → Strategy → Architecture → Design → Product → Pilot/Launch → Continuous Learning).

| Folder | Contents |
|---|---|
| `00-charter/` | The canonical charter and its review |
| `01-research/` | Industry research, market landscape, competitive analysis, customer discovery, JTBD, ecosystem maps |
| `02-strategy/` | Problem statements, opportunity assessment, product vision/strategy, business model, pricing, GTM |
| `03-systems-architecture/` | Systems maps, domain models, technical architecture, information architecture, AI architecture, decision models |
| `04-design/` | Service blueprints, UX architecture, user flows, product design, design system, interaction models |
| `05-product/` | MVP definition, PRDs, prototypes |
| `06-pilot-and-launch/` | Pilot strategy, production roadmap, product roadmap, launch plan |
| `07-continuous-learning/` | Learning log, metrics tracking against charter success metrics |

## How Docs Work

Every doc has frontmatter:

```
status: not-started | in-progress | draft | validated
last_updated: YYYY-MM-DD
owner:
related_stage: [charter workflow stage]
```

Every doc separates **Validated Knowledge**, **Evidence-Informed Insight**, and **Hypotheses / Open Questions** — per the charter's rule not to present speculation as fact. Fill these in as research and pilots produce real evidence; don't skip straight to conclusions.

## Sequencing

Don't work all 18 charter stages in parallel. See `ROADMAP.md` for the current priority order and status of each near-term step.
