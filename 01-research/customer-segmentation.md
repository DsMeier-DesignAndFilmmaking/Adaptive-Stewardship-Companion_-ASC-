---
status: draft
last_updated: 2026-07-04
owner: Dan
related_stage: 3. Customer Discovery
---

# Customer Segmentation

## Purpose

Narrow the charter's broad customer list into a prioritized ICP and secondary segments, based on budget authority, data maturity, and sales-cycle length.

## Key Questions to Answer

- Which segment has real budget authority and a fast-enough sales cycle for an early-stage company?
- Which segments already have baseline data (visitor counts, ecological monitoring) vs. none?
- What disqualifies a segment for now (e.g., government procurement timelines)?

## Segment-by-Segment Findings (desk research, no interviews yet)

### Private hospitality — guest ranches, eco-lodges, outdoor resorts, adventure tourism operators, working ranches

Highly fragmented: businesses range from ~30-person family-owned eco-lodges to adventure operators with 1,000+ employees. Owner take-home for smaller eco-tourism operators is often modest ($50k-$150k/year), and staff costs run 25-35% of fixed expenses at eco-lodges — margins are thin at the small end.

The PMS/reservation software market serving this segment is large and mature ($8.71B in 2025, projected $17.18B by 2032, ~10% CAGR), with central reservation systems the fastest-growing piece. That means most operators already have a booking/PMS system and a software budget line — but it also means "another software subscription" competes for the same limited budget, and ecological/stewardship features are not what that budget was justified on.

Decision-maker is typically a single owner or GM — fast sales cycle (can decide on a call), which is attractive for an early-stage company.

### Public land management — state parks, national parks

Reservation and visitor-management technology is already deeply embedded: Aspira and Tyler Technologies run multi-park, multi-state reservation systems (e.g., Oklahoma's 35-park system, Nevada's cloud reservation rollout), and Esri ArcGIS is standard for trail and capital-project planning. Conceptually, this segment already thinks in ASC's terms — the NPS-originated Visitor Use Management (VUM) framework and its predecessors (Limits of Acceptable Change, VERP) are essentially a manual, decades-old version of "balance visitor experience against ecological carrying capacity."

The procurement barrier is severe: state procurement cycles typically run 90-180 days from RFP to award, with 6-18 months of pre-RFP planning common, and some agencies take a year or more before a formal RFP is even issued. Cooperative purchasing vehicles and pre-qualified vendor pools can cut this to 4-6 weeks, but that requires already being on a state contract vehicle — not viable for a first pilot. National parks add federal acquisition rules on top of this.

### Conservation organizations, land trusts, wildlife preserves

Nonprofit and grant-funded. Budgeting for technology is an explicitly recognized challenge in this sector — funders increasingly expect a technology line item but grant sizes for tech adoption are modest (e.g., a 2025 Land Trust Alliance / Nature Conservancy program awarded $219,000 across 18 land trust projects nationwide, averaging ~$12,000 per project). Existing tools (SMART — used across 1,100 sites in 95 countries, Skytec Ranger, Landscape, ArcGIS) already own compliance/monitoring workflows, mostly geospatial and anti-poaching/compliance focused rather than blending visitor experience with ecological condition.

Decision-maker is typically an Executive Director or Stewardship Director, with board-level budget approval — a moderate sales cycle, constrained further by grant funding cycles.

### Botanical gardens, nature centers, outdoor education organizations

This segment already runs a mature ticketing/membership/donor software stack — Doubleknot, Veevart (built on Salesforce), ACME Ticketing, Parker Ticketing, TicketSpice — unifying admissions, memberships, donations, and events on one platform. That's a strong signal: these organizations already pay for software tied directly to visitor operations, and admissions/membership revenue gives them a recurring, non-grant-dependent budget line.

Their core mission already blends visitor experience with a living collection or habitat that needs stewardship (plant collections, natural areas, wildlife) — arguably the closest natural fit to ASC's specific thesis of any segment researched. Decision-maker is typically an Executive Director or Operations Director — moderate, not glacial, sales cycle.

### Regenerative agriculture properties open to visitors

Precision agriculture / farm-management software adoption is real but modest (21% overall adoption of farm-management software, 61% among North American adopters using digital agronomy tools specifically), driven by production/profit motives, not visitor experience. High upfront technology costs and data-ownership concerns are cited barriers. No evidence found of tools addressing the *visitor* side of agritourism specifically — this segment is closer to a greenfield extension than a near-term ICP, and the core "visitor experience + ecological outcome" thesis is unproven here since agritourism is typically a side activity, not the primary business.

## Validated Knowledge

- Guest ranches/eco-lodges/resorts operate on thin margins with an already-mature PMS/reservation software market; a single owner/GM typically makes purchasing decisions. *(Grand View Research, 360iResearch, financial model/industry sources — see sources below)*
- State and national park technology procurement runs 90-180+ days at minimum, often 6-18 months of pre-RFP planning, and is dominated by incumbent vendors (Aspira, Tyler Technologies) with existing multi-year contracts. *(Civic IQ, TechnologyMatch, GovTech sources)*
- Botanical gardens and nature centers already operate mature, integrated ticketing/membership/donor software and generate recurring admissions revenue, not solely grant funding. *(Doubleknot, Veevart, ACME, Parker, TicketSpice product pages)*
- Land trusts and conservation nonprofits treat technology budgeting as a distinct, funder-scrutinized line item, with grant-funded tech adoption running in the low tens of thousands of dollars per project. *(Land Trust Alliance)*

## Evidence-Informed Insight

- Botanical gardens/nature centers are the closest analog fit to ASC's thesis (visitor experience + living-resource stewardship combined) of the segments researched, based on their existing software spend pattern and mission structure — not yet confirmed by direct customer conversations.
- Guest ranches/eco-lodges offer the fastest sales cycle of any segment (single decision-maker), which matters more for an early-stage company than segment size — but whether they'll prioritize ecological/stewardship spend over guest-facing spend is unproven.
- Public land agencies are conceptually the best philosophical fit (VUM/LAC frameworks already mirror ASC's premise) but the procurement timeline makes them a poor first-pilot segment regardless of fit; more realistic as a Phase 2+ segment via cooperative purchasing vehicles once ASC has proof points elsewhere.
- Regenerative agriculture should be deprioritized for now — the visitor-experience half of the thesis is unvalidated in this segment, and the closest existing tech adoption behavior (precision ag) is production-focused, not visitor-focused.

## Hypotheses / Open Questions

- Which named companies/orgs, in guest ranch/eco-lodge and botanical garden/nature center segments, will actually take a discovery call? (Test in `01-research/customer-discovery.md`.)
- Do sustainability-branded eco-lodges/ranches (vs. generic resorts) show materially higher willingness to pay for ecological-stewardship features specifically?
- Does a botanical garden's or nature center's existing Doubleknot/Veevart vendor relationship help or block an ASC pilot (would ASC need to integrate with it, or replace parts of it)?
- Is there a "beachhead within a segment" — e.g., mid-size (50-150 employee) operators — that has both budget authority and enough operational complexity to need ASC?

## Recommendation (working, pending discovery interviews)

Primary ICP candidates for Phase 1 discovery interviews, in priority order: (1) botanical gardens and nature centers — best thesis fit and proven software spend; (2) mid-size eco-lodges/guest ranches with sustainability-forward branding — fastest sales cycle. Treat land trusts/conservation orgs as a secondary segment (real ecological alignment, but funding-constrained). Deprioritize state/national parks (procurement timeline) and regenerative agriculture (unproven visitor-experience fit) as near-term ICPs; revisit both once ASC has pilot traction elsewhere.

This is an evidence-informed hypothesis based on desk research only — it should be tested, not assumed, in `01-research/customer-discovery.md` before locking the ICP into `02-strategy/product-vision.md`.

## Notes

Sources: [Hotel Property Management Software Market](https://www.grandviewresearch.com/industry-analysis/hotel-hospitality-management-software-market-report), [Resort Management Software Market](https://www.verifiedmarketreports.com/product/resort-management-software-market/), [Eco-Tourism Agency Owner Income](https://financialmodelslab.com/blogs/how-much-makes/eco-tourism-travel-agency), [Eco Lodge Operating Costs](https://businessplan-templates.com/blogs/running-costs/eco-lodge), [Aspira Connect State Parks](https://aspiraconnect.com/state-park-reservation-system), [Nevada State Parks / Tyler Technologies](https://www.govtech.com/civic/nevada-state-parks-brings-new-technology-to-reservations), [Government Procurement Guide](https://blogs.civiciq.com/2026/04/22/the-ultimate-guide-to-government-procurement-how-cities-counties-schools-buy-technology/), [RFP Process Timeline](https://technologymatch.com/blog/rfp-process-timeline-how-long-should-an-it-vendor-rfp-take), [Land Trust Alliance — Remote Monitoring Grants](https://landtrustalliance.org/resources/learn/explore/remote-monitoring-grant-program-technology-options), [Land Trust Alliance — Capital Budgets](https://preview.landtrustalliance.org/resources/learn/explore/capital-budgets), [Doubleknot Nature Center / Botanic Garden Software](https://www.doubleknot.com/nature-center-software-botanic-garden-software), [Veevart Parks & Attractions](https://veevart.com/parks-attractions), [Global AgTech Initiative — Regenerative Ag Trends](https://www.globalagtechinitiative.com/digital-farming/top-5-agtech-trends-for-2025-whats-next-for-regenerative-agriculture/), [McKinsey — Agtech Farmer Adoption](https://www.mckinsey.com/industries/agriculture/our-insights/agtech-breaking-down-the-farmer-adoption-dilemma)
