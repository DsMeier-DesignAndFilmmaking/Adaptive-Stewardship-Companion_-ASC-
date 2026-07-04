---
status: draft
last_updated: 2026-07-04
owner: Dan
---

# Charter Review & Critique (2026-07-04)

Initial critique of the Project Charter, done before any research began. These are open risks to test during 01-research and 02-strategy, not settled conclusions.

## Strengths

Clear mission, well-articulated principles (landscape as active participant), good decision framework, clear boundaries (not PMS/CRM/GIS), phased operating model, and explicit epistemic hygiene (validated knowledge / evidence-informed insight / hypothesis).

## Open Risks to Validate

**No forced customer segment.** *Status: in progress — desk research done 2026-07-04.* Segment-by-segment desk research (`01-research/customer-segmentation.md`) points to botanical gardens/nature centers and mid-size eco-lodges/guest ranches as the strongest near-term ICP candidates (fastest sales cycle or best thesis fit); state/national parks and regenerative agriculture are deprioritized for now (procurement timeline; unproven fit, respectively). Still needs discovery interviews to move from evidence-informed insight to validated.

**Core thesis assumes data that may not exist.** *Status: partially addressed — desk research done 2026-07-04.* `01-research/ecosystem-maps.md` finds no segment has visitor-flow and ecological-condition data already combined — the gap is real but means ASC must help customers start capturing data, not just synthesize what exists. Botanical gardens/nature centers have the best starting position (visitor data already digitized via Doubleknot/Veevart-type systems).

**Boundary paradox.** *Status: partially addressed.* Desk research confirms mature existing systems in 3 of 5 segments (PMS in hospitality, reservation+GIS in public land, ticketing/membership in gardens/nature centers) — real integration surfaces exist for the two priority ICP candidates. Still needs a technical spike to confirm actual API/export access (see `01-research/ecosystem-maps.md` open questions).

**Vague mission language.** *Status: addressed, pending validation — draft done 2026-07-04.* `02-strategy/product-vision.md` now names a concrete, falsifiable first decision: a daily zone/trail/experience recommendation (open/restrict/close/promote) with rationale and confidence, for botanical gardens/nature centers first. This resolves the "no falsifiable day-one feature" gap on paper — but it's an unvalidated hypothesis, not a tested vision. It should be treated as provisional until `01-research/customer-discovery.md` confirms or contradicts it, per the explicit "What Would Falsify This Vision" section in that doc.

**Willingness-to-pay risk.** *Status: sharpened, not resolved — desk research done 2026-07-04.* Public/nonprofit segments (state parks, land trusts) often have constrained budgets and slow procurement, in tension with decision-framework priority #3. `01-research/competitive-analysis.md` adds a second layer to this risk: every adjacent point-solution category (visitor-ops, GIS, compliance monitoring, revenue management) already solves its own narrow slice of the problem cheaply, so a buyer could satisfy each half separately without ever paying for ASC's combined "balance both" framing. No product found doing what ASC proposes (real white space), but that also means there's no existing budget line for it — discovery interviews need to test willingness to pay directly, not just assume the white space implies demand.

**19-stage lifecycle risk.** Sequential gating through all stages risks paralysis for a venture-stage team; stages should run in tight, overlapping loops with permission to revisit earlier stages.

**Ecological metrics are hard to attribute to software.** Multi-year, multi-causal outcomes. Pair each with a shorter-cycle, directly attributable leading indicator — see `07-continuous-learning/metrics-tracking.md`.

**"AI" is underspecified.** Rules-based vs. ML vs. LLM-based approaches have different implications for the "every recommendation explains why it exists" principle — see `03-systems-architecture/ai-architecture.md`.

## How to Use This

Each risk above links to the doc where it should get resolved with real evidence. Update this file's status to `validated` or `resolved` per item as research closes the gap — don't just delete the risk, record what was learned.
