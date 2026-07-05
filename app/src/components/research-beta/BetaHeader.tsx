import type { Scenario } from "@/lib/research-beta/types";

type BetaHeaderProps = {
  propertyName: string;
  scenario: Scenario;
};

export function BetaHeader({ propertyName, scenario }: BetaHeaderProps) {
  return (
    <header className="border-b border-border bg-card/90 py-4 shadow-[0_1px_0_rgba(27,24,19,0.04)] backdrop-blur">
      <div className="mx-auto flex w-[calc(100vw-2rem)] max-w-7xl flex-col gap-4 md:w-[calc(100vw-3rem)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Research Beta
            </p>
            <span className="inline-flex min-h-6 shrink-0 items-center whitespace-nowrap rounded-full border border-border bg-secondary px-2.5 text-xs font-medium text-muted-foreground">
              {scenario.theme}
            </span>
          </div>
          <h1 className="mt-1 max-w-full break-words font-serif text-[1.8rem] font-semibold leading-tight text-foreground [overflow-wrap:anywhere] md:text-3xl">
            {propertyName}
          </h1>
          {/* min-h + line-clamp reserve constant height across scenarios so
              switching scenarios (scene text lengths vary 83-116 chars) never
              reflows the header or anything anchored below it. */}
          <p className="mt-1 line-clamp-2 min-h-12 max-w-2xl break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">
            {scenario.scene}
          </p>
        </div>
        <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:min-w-[560px]">
          <div className="rounded-md border border-border bg-secondary/65 px-3 py-2">
            <dt className="text-xs font-semibold uppercase text-muted-foreground">
              Operating moment
            </dt>
            <dd
              className="mt-1 truncate font-medium text-foreground"
              title={scenario.day}
            >
              {scenario.day}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-secondary/65 px-3 py-2">
            <dt className="text-xs font-semibold uppercase text-muted-foreground">
              Weather
            </dt>
            <dd
              className="mt-1 truncate font-medium text-foreground"
              title={scenario.weather}
            >
              {scenario.weather}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-secondary/65 px-3 py-2">
            <dt className="text-xs font-semibold uppercase text-muted-foreground">
              Decision owner
            </dt>
            <dd
              className="mt-1 truncate font-medium text-foreground"
              title={scenario.decisionOwner}
            >
              {scenario.decisionOwner}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
