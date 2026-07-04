---
status: draft
last_updated: 2026-07-04
owner: Dan
related_stage: 1. Industry Research
---

# Ecosystem Maps

## Purpose

Map what systems (PMS, reservation, GIS, spreadsheets) target customers already run, so ASC's integration surface is grounded in reality rather than assumption.

## Key Questions to Answer

- What systems does each ICP segment typically already have in place?
- Where do those systems have APIs / export capability ASC could integrate with?
- For segments with no existing systems, what does that imply for MVP scope?

## Findings by Segment (desk research, no interviews yet)

### Private hospitality (guest ranches, eco-lodges, resorts, adventure operators)

Already runs: a PMS/central-reservation system (mature $8.71B market in 2025) handling bookings, occupancy, and often POS. What's typically *missing*: any systematic capture of ecological condition (trail wear, wildlife disturbance, vegetation health) or visitor-flow-vs-landscape data — occupancy is digitized, land condition usually is not. Implication: ASC likely needs to introduce lightweight data capture (staff-logged observations, simple sensors) rather than assuming this data already exists, at least at smaller operators.

### Public land management (state parks, national parks)

Already runs: large-scale reservation/ticketing platforms (Aspira across multiple state systems, Tyler Technologies, federally Recreation.gov) and Esri ArcGIS for trail and capital-project planning. Also already runs a *conceptual* decision framework — Visitor Use Management (VUM), Limits of Acceptable Change (LAC), VERP — that manually approximates what ASC would automate. Data exists but is often collected via periodic manual surveys/monitoring rather than continuous signal streams. Implication: strong conceptual product-market fit, weak near-term go-to-market fit (see customer-segmentation.md on procurement timelines); any future integration should target ArcGIS and the incumbent reservation platforms rather than replacing them.

### Conservation organizations, land trusts, wildlife preserves

Already runs: geospatial/compliance-focused monitoring tools — SMART (1,100+ sites, 95 countries, originally anti-poaching/ranger-focused), Skytec Ranger, Landscape (land-trust-specific stewardship tracking, acquisition-to-stewardship lifecycle), and ArcGIS. These systems are strong on ecological/compliance monitoring but not built to weigh visitor experience against ecological condition — they assume little to no visitor-management concern. Implication: for conservation-org customers, ASC would sit *alongside* SMART/Landscape/ArcGIS as an operational-decision layer, likely needing to ingest their outputs rather than duplicate ecological monitoring from scratch.

### Botanical gardens, nature centers, outdoor education organizations

Already runs: an integrated ticketing/membership/donor/event platform — Doubleknot, Veevart (Salesforce-based), ACME Ticketing, Parker Ticketing, TicketSpice — meaning visitor volume, membership, and revenue data is already digitized and centralized. What's typically separate: curatorial or natural-area health records (plant collection condition, habitat health), usually tracked outside these visitor-ops platforms. Implication: this is the strongest existing-data-maturity segment on the visitor side; ASC's clearest immediate integration point is pulling visitor/attendance data from Doubleknot/Veevart-type systems and pairing it with whatever ecological/collection records already exist (likely spreadsheets or separate curatorial databases).

### Regenerative agriculture properties open to visitors

Already runs (where adopted): precision-ag / farm-management software (21% overall adoption, higher among North American adopters) focused on production — soil, yield, input use — not visitor experience. No dedicated agritourism-visitor system identified in research. Implication: lowest data maturity on the visitor side of any segment; MVP scope here would likely require building visitor-tracking from near-zero, which raises cost/complexity for a segment that's already lower-priority per customer-segmentation.md.

## Validated Knowledge

- Mature, purpose-built visitor-ops software already exists and is adopted in three of five segments researched: private hospitality (PMS/reservation), public land (reservation + GIS), and gardens/nature centers (ticketing/membership). *(vendor/product sources below)*
- Ecological/compliance monitoring tools (SMART, Skytec Ranger, Landscape, ArcGIS) are mature and widely deployed in the conservation/land-trust segment specifically for monitoring and compliance, not for balancing visitor experience against ecological condition. *(SMART/ZSL, Land Trust Alliance sources)*
- The public-land segment already has a decades-old conceptual framework (VUM/LAC/VERP) for exactly the trade-off ASC is designed to help with — this is the strongest conceptual validation of the charter's product thesis found in desk research, independent of any specific segment's near-term buyability.

## Evidence-Informed Insight

- No segment researched has an existing system that already combines granular visitor-flow data with ecological-condition data — this gap is real across the market, not segment-specific, and supports the charter's white-space claim, but it also means ASC will need to help customers *start* capturing this data, not just synthesize data that already exists everywhere.
- Botanical gardens/nature centers likely have the best "half the data already exists" starting position (visitor/revenue side digitized via Doubleknot/Veevart) of any near-term segment, which lowers MVP data-integration risk relative to guest ranches or regenerative ag.
- For conservation/land-trust customers, ASC's positioning should be explicitly "layers on top of SMART/ArcGIS/Landscape," not "replaces them" — this matches the charter's stated boundary but needs concrete integration/API validation, not just a policy statement.

## Hypotheses / Open Questions

- Do Doubleknot/Veevart/Aspira/Tyler/SMART/ArcGIS expose usable APIs or export formats for integration, or would data access require manual export/CSV workflows at MVP stage? (Needs technical spike, not just desk research.)
- For segments where ecological/visitor-flow correlation data doesn't exist yet (private hospitality, regenerative ag), would customers tolerate a "start capturing data with ASC" onboarding period, or does that kill the pitch of "adaptive intelligence" if there's no data on day one?
- Does the charter's principle "recommendations degrade gracefully when data quality is low" need to be the MVP's central design constraint, given how thin ecological/visitor-flow data is across every segment researched?

## Notes

Sources: [Hotel Property Management Software Market](https://www.grandviewresearch.com/industry-analysis/hotel-hospitality-management-software-market-report), [Aspira Connect State Parks](https://aspiraconnect.com/state-park-reservation-system), [Oklahoma State Parks / Aspira](https://www.govtech.com/civic/nevada-state-parks-brings-new-technology-to-reservations), [Esri Parks & Recreation Software](https://www.esri.com/en-us/industries/environment-natural-resources/focus-areas/parks-recreation), [Visitor Use Management Framework (NPS)](https://visitorusemanagement.nps.gov/Content/documents/VUM_Framework_Edition%201_508%20Compliant_IVUMC.pdf), [SMART Conservation Software](https://www.zsl.org/what-we-do/conservation/protecting-species/monitoring-and-technology/smart-spatial-monitoring-and-reporting-tool), [Land Trust Alliance — Remote Monitoring](https://landtrustalliance.org/resources/learn/explore/remote-monitoring-grant-program-technology-options), [HAMS Wildlife/Land Management Software](https://hams.online/en), [Doubleknot Nature Center / Botanic Garden Software](https://www.doubleknot.com/nature-center-software-botanic-garden-software), [Veevart Parks & Attractions](https://veevart.com/parks-attractions), [Ecosystem Management Decision Support (EMDS)](https://research.fs.usda.gov/pnw/products/dataandtools/ecosystem-management-decision-support-emds-system), [Global AgTech Initiative](https://www.globalagtechinitiative.com/digital-farming/top-5-agtech-trends-for-2025-whats-next-for-regenerative-agriculture/)
