import type {
  RecommendationCard,
  Scenario,
} from "@/lib/research-beta/types";

export const propertyProfile = {
  name: "Willow Creek Nature Center & Botanic Preserve",
  facilitatorNote:
    "Scripted Research Beta. Fictional property, hand-authored recommendations, no live integrations.",
};

// Each scenario is a self-contained operating moment. Switching scenarios in the
// rail swaps the header context, the Today feed, and the observation glimpse so
// any scenario can be demonstrated independently during an interview.
export const scenarios: Scenario[] = [
  {
    id: "rain",
    label: "Morning after rain",
    theme: "Weather & recovery",
    libraryRef: "Library A1",
    day: "Saturday, 7:15 AM",
    weather: "Clearing after 0.8 in overnight rain",
    scene:
      "Peak spring weekend. Overnight rain has passed and a clear, busy day is forecast.",
    decisionOwner: "Maria Okonkwo, Operations Director",
    observation: {
      areaName: "Wetland Boardwalk",
      condition: "Standing water",
      severity: "Moderate",
      note: "Water covering the east approach after overnight rain. Recommend checking again before the 11 AM family program.",
    },
  },
  {
    id: "bloom",
    label: "Peak bloom surge",
    theme: "Crowding & demand",
    libraryRef: "Library B1",
    day: "Sunday, 8:30 AM",
    weather: "Warm and dry, 74°F by noon",
    scene:
      "Peak pollinator bloom on a warm weekend. Demand is concentrating on the garden and parking fills by 11.",
    decisionOwner: "Maria Okonkwo, Operations Director",
    observation: {
      areaName: "Pollinator Garden Zone",
      condition: "Soft bed edges",
      severity: "Watch",
      note: "Bed margins soft after Friday rain; visitors stepping off-path for photos along the east bed.",
    },
  },
  {
    id: "stale-signal",
    label: "The stale signal",
    theme: "Data quality & trust",
    libraryRef: "Library E1",
    day: "Wednesday, 7:40 AM",
    weather: "Overcast, light wind",
    scene:
      "An ordinary mid-week day. North Meadow has normal demand but no fresh condition report.",
    decisionOwner: "Maria Okonkwo, Operations Director",
    observation: {
      areaName: "North Meadow Trail",
      condition: "Unverified",
      severity: "Unknown",
      note: "No condition entry logged since last week. The last note predates this week's rain.",
    },
  },
  {
    id: "override",
    label: "The override",
    theme: "Human accountability",
    libraryRef: "Library E2 / Blueprint S4",
    day: "Saturday, 7:20 AM",
    weather: "Clear after midweek rain",
    scene:
      "ASC recommends closing Creekside Path for erosion — but the weekend lead knows a repair crew is already scheduled.",
    decisionOwner: "Maria Okonkwo, Operations Director",
    observation: {
      areaName: "Creekside Path",
      condition: "Bank erosion",
      severity: "High",
      note: "Undercut bank near the second footbridge after rain. Volunteer crew scheduled 9 AM.",
    },
  },
];

export const recommendationCards: RecommendationCard[] = [
  // --- Scenario: rain -------------------------------------------------------
  {
    id: "wetland-boardwalk",
    scenarioId: "rain",
    areaName: "Wetland Boardwalk",
    areaType: "Boardwalk / habitat edge",
    action: "rest",
    title: "Rest Wetland Boardwalk this morning",
    shortReason:
      "Standing water was reported after overnight rain, and the wetland edge is sensitive to foot traffic while saturated.",
    landscapeCondition:
      "Saturated. Standing water across the east approach and soft habitat-edge soil that compacts and widens under foot traffic when wet.",
    confidence: "medium",
    confidenceReason:
      "Recent field note and weather signal agree, but no second staff observation has confirmed the full boardwalk length.",
    evidence: [
      "Field note at 8:10 AM: standing water across the east approach.",
      "Weather log: 0.8 inches of rain since midnight.",
      "Stewardship profile: wetland edge compacts quickly after heavy rain.",
    ],
    alternative:
      "Promote Ridge View Loop for birders and morning walkers until the boardwalk is checked again.",
    visitorView:
      "Front desk: “The Wetland Boardwalk is resting this morning after last night's rain to protect the marsh edge — Ridge View Loop has the best views today and we'd point you there first.”",
    stewardshipView:
      "Wet habitat-edge use is the classic trail-widening and soil-compaction driver. A short morning rest costs little visitor experience and prevents cumulative damage. Leading indicator: repeat wet-morning rest flags on this same segment.",
    decisionOwner: "Maria Okonkwo",
    interviewPrompt:
      "Tell me about the last time rain changed where you sent visitors. Who made that call?",
    initialStatus: "unreviewed",
  },
  {
    id: "ridge-view-loop",
    scenarioId: "rain",
    areaName: "Ridge View Loop",
    areaType: "Trail loop",
    action: "promote",
    title: "Promote Ridge View Loop as the morning alternative",
    shortReason:
      "The loop was clear yesterday, handles wet conditions better, and gives staff a positive place to send visitors.",
    landscapeCondition:
      "Firm, well-drained tread. Signage clear as of yesterday afternoon; surface sheds rain quickly.",
    confidence: "high",
    confidenceReason:
      "Recent trail check, resilient surface, and lower forecast pressure all support the alternative.",
    evidence: [
      "Yesterday 4:40 PM: trail check reported firm tread and clear signage.",
      "Visitor services note: families asked for short scenic loops last weekend.",
      "Capacity estimate: can absorb the boardwalk detour without crowding.",
    ],
    alternative:
      "If Ridge View starts crowding, route families to Oak Grove for the first hour.",
    visitorView:
      "Front desk: “Ridge View Loop is in great shape today — firm footing and the best morning views. Perfect for families and birders.”",
    stewardshipView:
      "Ridge View's resilient surface absorbs redirected demand without degrading, making it the responsible place to concentrate visitors while the wetland rests. Watch for crowding if the boardwalk stays closed past midday.",
    decisionOwner: "Maria Okonkwo",
    interviewPrompt:
      "When you restrict one area, do staff already have a trusted alternative ready?",
    initialStatus: "unreviewed",
  },

  // --- Scenario: bloom ------------------------------------------------------
  {
    id: "pollinator-garden",
    scenarioId: "bloom",
    areaName: "Pollinator Garden Zone",
    areaType: "Garden zone",
    action: "restrict",
    title: "Use timed entry at Pollinator Garden",
    shortReason:
      "Peak bloom is drawing visitor demand, but bed edges are soft after rain and likely to degrade under crowding.",
    landscapeCondition:
      "Peak bloom. Bed margins soft after Friday rain and vulnerable to trampling where visitors queue and step off-path.",
    confidence: "medium",
    confidenceReason:
      "Bloom and attendance signals are strong; bed-edge condition is based on one stewardship note.",
    evidence: [
      "Horticulture note: peak bloom expected through Sunday afternoon.",
      "Ticketing forecast: 430 visitors today, with a 10:00 AM school group.",
      "Last spring: trampling increased when visitors queued along the east bed.",
    ],
    alternative:
      "Promote Oak Grove beds as the first stop for overflow visitors during peak windows.",
    visitorView:
      "Front desk: “The Pollinator Garden is on timed entry today to keep the beds healthy at peak bloom — grab a window at the desk. The Oak Grove beds are also blooming and far less crowded right now.”",
    stewardshipView:
      "Peak-bloom demand concentrates foot traffic on soft bed edges — the popularity-degrades-the-asset loop. Timed distribution protects the very bloom visitors came for, rather than closing it. Leading indicator: off-path incursions logged at the east bed.",
    decisionOwner: "Maria Okonkwo",
    interviewPrompt:
      "Does popularity ever become a stewardship problem at your site? What do you do before damage happens?",
    initialStatus: "unreviewed",
  },
  {
    id: "oak-grove-beds",
    scenarioId: "bloom",
    areaName: "Oak Grove Beds",
    areaType: "Garden / picnic grove",
    action: "promote",
    title: "Promote Oak Grove beds as the second bloom stop",
    shortReason:
      "A durable, shaded second bloom area that pulls pressure off the main Pollinator Garden during peak demand.",
    landscapeCondition:
      "Durable turf and gravel paths. Secondary bloom opening now with low current use and shaded seating capacity.",
    confidence: "high",
    confidenceReason:
      "Recent grounds check, resilient surface, and clear spare capacity all support actively steering visitors here.",
    evidence: [
      "Grounds check this morning: beds opening, paths firm.",
      "Ticketing: Oak Grove sees a fraction of the main garden's demand.",
      "Capacity: shaded seating absorbs overflow comfortably.",
    ],
    alternative:
      "If Oak Grove fills, stage arrivals through the Ridge View Loop entrance.",
    visitorView:
      "Front desk: “While you wait for a garden window, the Oak Grove beds are blooming too — shadier, quieter, and a two-minute walk.”",
    stewardshipView:
      "Giving demand a genuine second destination is what makes timed entry humane rather than restrictive — it relieves the fragile beds without a flat ‘no.’ Rotating the promoted alternative keeps pressure from simply moving to the next fragile spot.",
    decisionOwner: "Maria Okonkwo",
    interviewPrompt:
      "When you steer visitors away from a crowded spot, do you have a second place good enough that it doesn't feel like a downgrade?",
    initialStatus: "unreviewed",
  },

  // --- Scenario: stale-signal ----------------------------------------------
  {
    id: "north-meadow",
    scenarioId: "stale-signal",
    areaName: "North Meadow Trail",
    areaType: "Meadow trail",
    action: "open",
    title: "Keep North Meadow open, but send a field check",
    shortReason:
      "Visitor demand is moderate, but the latest condition report is 9 days old, so ASC should not recommend a stronger action.",
    landscapeCondition:
      "Unverified. The last condition note is 9 days old and predates this week's rain, so current tread condition is unknown.",
    confidence: "low",
    confidenceReason:
      "The recommendation is based on visitor data only. No recent condition observation is available.",
    evidence: [
      "Ticketing forecast: normal morning demand, no scheduled groups.",
      "Last condition report: 9 days old, before this week's rain.",
      "No recent stewardship note confirms meadow edge condition.",
    ],
    missingEvidence:
      "Current tread condition and meadow-edge sensitivity after overnight rain.",
    alternative:
      "Ask Jamie to check North Meadow before staff actively recommend it.",
    visitorView:
      "Front desk: “North Meadow is open — we're double-checking trail conditions this morning, so we'll confirm before steering groups there.”",
    stewardshipView:
      "No recent eyes on the restoration meadow, and this week's rain may have changed the tread. ASC holds at ‘open, low confidence’ and asks for a check rather than promoting traffic onto an unverified restoration surface.",
    decisionOwner: "Maria Okonkwo",
    interviewPrompt:
      "Would a low-confidence recommendation like this help you, or would it create noise?",
    initialStatus: "unreviewed",
  },

  // --- Scenario: override ---------------------------------------------------
  {
    id: "creekside-path",
    scenarioId: "override",
    areaName: "Creekside Path",
    areaType: "Streamside path",
    action: "close",
    title: "Close Creekside Path for bank erosion",
    shortReason:
      "An undercut bank near the second footbridge worsened after rain — a safety and erosion risk under foot traffic.",
    landscapeCondition:
      "Actively eroding. Undercut bank and soft edge near the second footbridge after this week's rain.",
    confidence: "medium",
    confidenceReason:
      "A dated field photo and the erosion-history profile agree, but ASC does not know a volunteer repair crew is already scheduled — local context a human must add.",
    evidence: [
      "Field photo, yesterday 5:10 PM: undercut bank near the second footbridge.",
      "Stewardship profile: this segment erodes fast after rain.",
      "Weather log: 0.6 inches of rain over the last two days.",
    ],
    alternative:
      "Route walkers to Ridge View Loop until the bank is stabilized.",
    visitorView:
      "Front desk: “Creekside Path is closed today for a streambank repair — Ridge View Loop is the best alternative and just as scenic.”",
    stewardshipView:
      "Erosion at the footbridge undercut threatens both the bank and visitor safety. But this recommendation is a candidate for override: the weekend lead knows a repair crew arrives at 9, which may change ‘close all day’ to ‘closed until repaired.’ The override reason is the signal worth capturing.",
    decisionOwner: "Maria Okonkwo",
    interviewPrompt:
      "When a recommendation misses local context you have — like a crew already on the way — how would you want to correct it?",
    initialStatus: "unreviewed",
  },
];
