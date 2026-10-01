const ratios = [
  { name: "Interest-bearing debt", rule: "Less than 33% of total assets" },
  { name: "Non-compliant investments", rule: "Less than 33% of total assets" },
  { name: "Non-Halal revenue", rule: "Less than 5% of total revenue" },
  { name: "Non-liquid assets", rule: "At least 20% of total assets" },
  { name: "Market capitalization", rule: "Greater than net liquid assets" },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="scroll-mt-16 border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <p className="label-mono text-primary">Methodology</p>
        <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Our Shariah Screening Framework</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Zamzam Capital&apos;s published approach reviews business activities, financial ratios and qualitative factors.
        </p>

        <div className="mt-10 border-t border-border">
          <div className="grid gap-3 border-b border-border py-8 md:grid-cols-[10rem_1fr]">
            <p className="label-mono pt-1">Stage 01</p>
            <div>
              <h3 className="text-xl font-semibold">Business sector check</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The published framework checks whether the company&apos;s main business sector or industry (more than 50%) is Halal. It lists banking and finance, investments, insurance, alcohol, impermissible entertainment, pork, gambling and tobacco as non-Halal sectors.
              </p>
            </div>
          </div>
          <div className="grid gap-3 border-b border-border py-8 md:grid-cols-[10rem_1fr]">
            <p className="label-mono pt-1">Stage 02</p>
            <div>
              <h3 className="text-xl font-semibold">Financial ratio check</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Companies that pass the sector check must satisfy all five published financial criteria.</p>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {ratios.map((ratio) => (
                  <div key={ratio.name} className="grid gap-1 py-3 text-sm sm:grid-cols-2 sm:gap-6">
                    <dt className="font-medium">{ratio.name}</dt>
                    <dd className="text-muted-foreground">{ratio.rule}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="grid gap-3 border-b border-border py-8 md:grid-cols-[10rem_1fr]">
            <p className="label-mono pt-1">Stage 03</p>
            <div>
              <h3 className="text-xl font-semibold">Qualitative screening check</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The final review looks deeper into business activities that may be Shariah non-compliant. Zamzam Capital says it takes the cautious approach when there is doubt or insufficient information. A company may be classified non-Halal at the sector, financial or qualitative stage.
              </p>
            </div>
          </div>
          <div className="grid gap-3 py-8 md:grid-cols-[10rem_1fr]">
            <p className="label-mono pt-1">Current screening data</p>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This screener displays classifications from the stock list maintained in Zamzam AI Capital. It does not recalculate the framework from Chartink or Screener.in figures, or infer a status when no record exists.
              </p>
              <a href="https://zamzam-capital.com/" target="_blank" rel="noreferrer noopener" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
                Read the framework on Zamzam Capital&apos;s website ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}