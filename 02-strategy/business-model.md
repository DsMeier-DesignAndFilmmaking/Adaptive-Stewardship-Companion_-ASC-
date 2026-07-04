---
status: draft
last_updated: 2026-07-04
owner: Dan
related_stage: 7. Product Strategy
---

# Business Model

## Purpose

How ASC captures value: who pays, how much, and for what unit of value.

## Key Questions to Answer

- Is this seat-based, org-based, outcome-based, or usage-based pricing?
- What's the realistic ACV for the chosen ICP?

## Important Caveat

Pricing and unit economics below are grounded in researched analogous benchmarks, not confirmed willingness-to-pay from the target ICP — that test happens in `01-research/customer-discovery.md`. Treat every number here as a working hypothesis to price-test, not a rate card.

## Who Pays

Org-based, not seat-based. The charter states this directly ("Organizations purchase software. People adopt software.") and the value ASC creates — better daily routing/allocation decisions — accrues to the organization's operations as a whole, not to an individual staff member's productivity. Seat-based pricing would also work against adoption in a segment with high seasonal-staff turnover (`01-research/industry-research.md`), where per-seat costs would fluctuate with headcount that isn't the actual unit of value.

## Pricing Model (working hypothesis)

A tiered annual subscription, priced by a value/scale metric tied to the customer's operational footprint — most likely number of managed zones/trails/acres, or a visitor-volume band, rather than raw seat count. This mirrors how the closest analogous vendors already price: Doubleknot and Veevart both use custom, quote-based pricing scaled to organizational size rather than published self-serve tiers, and hotel PMS vendors commonly price per room (a footprint metric) rather than per user. An annual contract (not monthly self-serve) fits both nonprofit and hospitality budget-cycle norms in this space.

The specific scaling metric (acres vs. zones vs. visitor volume) is not yet decided — this should be tested directly in discovery interviews, since it needs to be a metric the customer already tracks and understands, not one ASC invents for pricing convenience.

## Realistic ACV for the Chosen ICP

Grounded in researched benchmarks rather than invented from scratch:

- Vertical SaaS overall carries a median ACV of $25K-$50K, well above horizontal SaaS ($8K-$15K) but below enterprise security ($100K-$300K).
- SMB-focused SaaS specifically (a closer proxy for mid-size gardens/nature centers and eco-lodges) averages $5K-$15K ACV.
- Small hotels already spend $600-$1,500/month (~$7.2K-$18K/year) on their existing PMS-plus-stack software, showing real, comparable annual software budget capacity in the eco-lodge/guest-ranch segment specifically.
- Nonprofit technology spending guidance suggests 3-6% of operating budget for established organizations (small nonprofits sometimes spend a higher percentage, but off a much smaller base) — bounding what a nonprofit garden or nature center could plausibly allocate to a new software category without board-level budget re-negotiation.

Working target: an early-pilot ACV in the $8K-$20K/year range per organization — below vertical-SaaS median (appropriate for an unproven new product category and mid-size org budgets) but above bottom-tier SMB SaaS (justified if the decision-support value is demonstrated, not just claimed). This should flex upward via expansion revenue (charter's NRR/CLV metrics) as trust builds and scope expands (e.g., more zones, more properties in a portfolio), not be assumed as a flat number across all pilots.

## Revenue Model

Recurring annual subscription (supports the charter's ARR/NRR/CLV success metrics directly). Given `01-research/ecosystem-maps.md`'s finding that no segment has ready-to-use combined data, an implementation/onboarding fee for the initial data-capture setup (staff training on condition-logging, connecting the existing visitor-ops system) is a reasonable adjunct to the subscription — this is common practice in vertical SaaS serving operationally lean organizations, and honestly prices in the real cost of bootstrapping data that doesn't exist yet.

## An Open Strategic Question: Outcome-Linked Pricing

The charter's own Decision Framework ranks ecological impact (priority 2) above customer willingness to pay (priority 3). A pricing model with a component tied to demonstrated ecological outcomes (e.g., reduced repeat closures of a stressed trail segment) would align incentives elegantly with that framework — but it's complex to administer for an early-stage company and runs directly into the attribution problem already flagged in `00-charter/charter-review-2026-07-04.md` (ecological outcomes are multi-causal and slow to observe). Recommendation: do not build outcome-linked pricing into the initial pilot commercial terms, but track leading indicators (per `product-vision.md`'s 12-month success definition) that could support an outcome-linked tier later once attribution is better understood.

## Validated Knowledge

- Doubleknot and Veevart, the closest analogous vendors serving the primary ICP candidate, use custom/quote-based pricing rather than published self-serve tiers. *(SoftwareAdvice, Capterra)*
- Small hotels already spend roughly $7.2K-$18K/year on their PMS-plus-stack software, establishing a real comparable software budget in the eco-lodge/guest-ranch segment. *(Hotelogix, Mews, hotel PMS pricing guides)*
- Nonprofit technology spending commonly runs 3-6% of operating budget for established organizations, with small nonprofits often spending a higher percentage off a smaller base. *(Nonprofit Technology Network / entechus research)*

## Evidence-Informed Insight

- Vertical SaaS ACV benchmarks ($25K-$50K median, $5K-$15K for SMB-focused) suggest ASC's realistic early pricing sits toward the lower end of vertical SaaS or the upper end of SMB SaaS, not at enterprise pricing — consistent with targeting mid-size organizations rather than large multi-property portfolios at this stage.
- Org-based (not seat-based) pricing is reinforced by the high seasonal-staff-turnover finding in `01-research/industry-research.md` — seat-based pricing would be operationally awkward for customers whose headcount fluctuates by season.

## Hypotheses / Open Questions

- What specific footprint metric (acres, zones, visitor volume, property count) will target customers actually recognize and consider fair? Needs direct discovery-interview testing.
- Is $8K-$20K/year the right early-pilot range, or will real conversations reveal a lower "prove it free/cheap first" expectation given this is a new, unproven product category? Pilot pricing may need to start below eventual list price specifically to de-risk a first purchase.
- Would an implementation/onboarding fee help or hurt early pilot conversion — does it signal seriousness, or add friction to an already-unproven purchase?
- Should pilot customers get a reduced or waived rate in exchange for case-study rights and product feedback, standard practice for early-stage vertical SaaS building initial proof points?

## Notes

Sources: [SoftwareAdvice — Doubleknot Pricing](https://www.softwareadvice.com/nonprofit/doubleknot-profile/), [Capterra — Veevart Pricing](https://www.capterra.com/p/155877/Veevart/), [Optifai — B2B SaaS ACV Benchmarks](https://optif.ai/learn/questions/b2b-saas-acv-benchmark/), [GetMonetizely — SaaS Pricing Benchmark Study 2025](https://www.getmonetizely.com/articles/saas-pricing-benchmark-study-2025-key-insights-from-100-companies-analyzed), [Hotelogix — Hotel PMS Pricing Guide 2026](https://www.hotelogix.com/blog/hotel-pms-pricing), [RoomMaster — Hotel Software Pricing 2026](https://www.roommaster.com/blog/hotel-software-pricing-guide), [Entechus — Nonprofit IT Infrastructure on a Budget 2026](https://www.entechus.com/blogs/nonprofit-it-infrastructure-on-a-budget-in-2026), [Land Trust Alliance — Capital Budgets](https://landtrustalliance.org/resources/learn/explore/capital-budgets)
