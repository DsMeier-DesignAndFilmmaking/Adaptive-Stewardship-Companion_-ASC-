type EvidenceListProps = {
  evidence: string[];
  missingEvidence?: string;
};

export function EvidenceList({ evidence, missingEvidence }: EvidenceListProps) {
  return (
    <section aria-labelledby="evidence-title">
      <h3
        id="evidence-title"
        className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground"
      >
        Supporting evidence
      </h3>
      <ul className="mt-2.5 grid gap-2">
        {evidence.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm leading-6 text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
      {missingEvidence ? (
        <div className="mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm leading-6 text-foreground/70">
          <span className="font-semibold text-foreground">Missing:</span>{" "}
          {missingEvidence}
        </div>
      ) : null}
    </section>
  );
}
