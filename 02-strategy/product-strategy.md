---
status: draft
last_updated: 2026-07-04
owner: Dan
related_stage: 7. Product Strategy
---

# Product Strategy

## Purpose

Strategic sequencing: what gets built first, what's deferred, and why.

## Key Questions to Answer

- What's the smallest wedge that proves the core thesis?
- What sequencing avoids building infrastructure customers don't have (see ecosystem-maps.md)?

## Important Caveat

This sequencing is a plan to *test* `02-strategy/product-vision.md`, not a build plan to execute blindly. Step 1 below (discovery interviews) gates everything after it — the charter's Validation Standard requires a recurring, evidence-backed problem before MVP planning, and that evidence doesn't exist yet.

## Sequencing

### Step 1 — Validate before building: customer discovery (gates everything below)

Run `01-research/customer-discovery.md` — 10-15 interviews across botanical gardens/nature centers and eco-lodges/guest ranches — before writing product code beyond the current infrastructure scaffold (`app/`). Directly test the problem statements, the "daily decision" cadence assumption, and willingness to pay. If this step contradicts `02-strategy/product-vision.md`, revise the vision before proceeding — do not carry an invalidated vision into architecture and design work.

### Step 2 — Smallest wedge: one decision, one segment, manual data first

The smallest falsifiable proof of the core thesis is not a full platform — it's a single working instance of the daily recommendation (per `product-vision.md`) running at one pilot site, built on staff-entered condition data rather than sensors. `01-research/ecosystem-maps.md` found no segment has combined visitor-flow and ecological-condition data today; building sensor/IoT ingestion before proving the recommendation itself is valuable would be solving the wrong problem first. Lead with botanical gardens/nature centers (per `customer-segmentation.md` and `product-vision.md`) given their stronger thesis fit and already-digitized visitor data via Doubleknot/Veevart-type systems — lower integration risk for the visitor-flow half of the input data.

Concretely, the wedge is: pull visitor/attendance data from the pilot site's existing ticketing/membership system (or a manual CSV export if API access isn't available — see open question in `01-research/ecosystem-maps.md`), pair it with staff-logged condition observations (a simple structured form, not sensors), and generate a daily recommendation feed with rationale and confidence for a defined set of zones/trails.

### Step 3 — Prove the wedge works before expanding scope

Success gate before adding scope: at least one pilot site where staff act on a recommendation in a live operational decision and self-report it as more useful than the status quo (per `product-vision.md`'s 12-month success definition). Resist adding features, segments, or data sources until this gate is met — consistent with the charter's principle that every feature must improve a measurable operational outcome, not just add capability.

### Step 4 — Test generalization: second segment, same wedge

Once the wedge works at one botanical garden/nature center pilot, test a second pilot with an eco-lodge/guest ranch (per `product-vision.md`) before assuming the product generalizes. This tests whether the underlying decision pattern (visitor flow + condition → routing recommendation) is truly cross-segment, or whether the botanical-garden version was solving a narrower, more specific problem that doesn't transfer.

### What's Explicitly Deferred, and Why

- **Sensor/IoT-based data capture** — deferred until the manual-data version of the recommendation proves valuable; no researched segment has this infrastructure today (`01-research/ecosystem-maps.md`), so building for it first risks solving a data-engineering problem before validating the recommendation itself matters.
- **Sophisticated ML/statistical modeling** — deferred in favor of simple, explainable rules/heuristics for the first recommendations. This directly serves the charter principle "every recommendation explains why it exists" and "simplicity is preferred over unnecessary complexity," and avoids committing to an AI architecture (`03-systems-architecture/ai-architecture.md`, still open) before the recommendation *concept* is validated.
- **State/national parks and regenerative agriculture segments** — deferred per `01-research/customer-segmentation.md` (procurement timeline; unproven visitor-experience fit, respectively). Revisit once ASC has pilot traction and a case study to shorten public-sector sales cycles or via cooperative purchasing vehicles.
- **Building a new PMS, GIS, ticketing, or reservation system** — explicitly out of scope per the charter's Product Boundaries; the wedge is designed to integrate with existing visitor-ops systems (Doubleknot/Veevart-type), not replace them.
- **Multi-property / enterprise features (roles, permissions, portfolio-wide dashboards)** — deferred until single-site value is proven; premature for a pre-pilot product per the charter's Validation Standard.

## Validated Knowledge

- No segment researched has visitor-flow and ecological-condition data already combined, meaning any MVP must start with manual/lightweight data capture rather than assuming rich existing datasets. *(`01-research/ecosystem-maps.md`)*

## Evidence-Informed Insight

- Leading with the segment that has the most existing digitized visitor data (botanical gardens/nature centers) reduces integration risk for the first pilot relative to starting with a segment where even visitor data is fragmented (e.g., regenerative agriculture, per `01-research/customer-segmentation.md`).
- Starting with simple, explainable heuristics rather than statistical/ML models is consistent with how the smart-building industry analog (`01-research/market-landscape-analysis.md`) matured — rules-based systems first, sophistication added once the operational loop is trusted.

## Hypotheses / Open Questions

- Will the botanical garden/nature center wedge actually generalize to eco-lodges/guest ranches, or does each segment need a meaningfully different first feature? Only Step 4 will answer this.
- Is manual staff-logged condition data reliable/consistent enough to power a trustworthy recommendation, or will data quality itself become the first-found problem? Directly tests the charter principle "recommendations degrade gracefully when data quality is low."
- Should the second pilot segment (Step 4) run in parallel with the first, or strictly sequentially? Running in parallel is faster but risks splitting a small team's attention before the first wedge is proven — leaning toward sequential unless discovery interviews reveal urgency in both segments simultaneously.

## Notes

Depends on: `02-strategy/product-vision.md`, `02-strategy/problem-statements.md`, `01-research/customer-segmentation.md`, `01-research/ecosystem-maps.md`, `01-research/competitive-analysis.md`.
