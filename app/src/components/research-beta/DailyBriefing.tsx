type DailyBriefingProps = {
  day: string;
  weather: string;
  decisionOwner: string;
  paragraphs: string[];
};

// Phase A — the hero of Home. Plain-language morning intelligence, not
// analytics. The lead line is the headline "what changed"; the rest carry the
// recommendation and what needs a human.
//
// Split-pane layout: prose (lead + rest) is the master column and keeps its
// full prominence — it's the most operationally important content in the
// card. Day/weather/decision-owner form a full-height detail rail instead of
// a single truncating meta line, which closes the dead space a max-w'd prose
// block left in a full-width card and removes a hover-only disclosure
// (`title` tooltip) that touch devices couldn't reach.
//
// Carries the operating-moment context (day/weather/decision owner) that used
// to live in the page header. It belongs here, not above the scenario tabs:
// this is scenario-dependent content, and a tab control should precede what
// it affects, not follow it.
export function DailyBriefing({
  day,
  weather,
  decisionOwner,
  paragraphs,
}: DailyBriefingProps) {
  const [lead, ...rest] = paragraphs;
  const [ownerName, ownerTitle] = decisionOwner.split(/,\s*/);

  return (
    <section
      aria-labelledby="daily-briefing-label"
      className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-5"
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <p
            id="daily-briefing-label"
            className="text-[10px] font-mono uppercase tracking-[0.16em] text-accent"
          >
            Daily briefing
          </p>
          <p className="mt-2.5 max-w-2xl font-serif text-xl font-light leading-snug text-foreground md:text-2xl">
            {lead}
          </p>
          {rest.length > 0 ? (
            <div className="mt-2.5 grid max-w-2xl gap-1.5">
              {rest.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-7 text-foreground/75 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Day / time
            </p>
            <p className="mt-0.5 text-sm text-foreground">{day}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Weather
            </p>
            <p className="mt-0.5 text-sm text-foreground">{weather}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Decision owner
            </p>
            <p className="mt-0.5 text-sm text-foreground">{ownerName}</p>
            {ownerTitle ? (
              <p className="text-xs text-muted-foreground">{ownerTitle}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
