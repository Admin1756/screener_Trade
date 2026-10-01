const ratios = [
  { name: "Interest-bearing debt", rule: "Less than 33% of total assets" },
  { name: "Non-compliant investments", rule: "Less than 33% of total assets" },
  { name: "Non-Halal revenue", rule: "Less than 5% of total revenue" },
  { name: "Non-liquid assets", rule: "At least 20% of total assets" },
  { name: "Market capitalization", rule: "Greater than net liquid assets" },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="method-section scroll-mt-16 overflow-hidden border-b border-method-rule bg-method-bg py-16 text-method-copy sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="label-mono text-method-signal">Methodology / 01—03</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl">Our Shariah <span className="text-method-signal">Screening</span> Framework</h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-method-muted lg:justify-self-end">
          Zamzam Capital&apos;s published approach reviews business activities, financial ratios and qualitative factors.
          </p>
        </div>

        <div className="mt-12 border-t border-method-rule sm:mt-16">
          <div className="method-stage grid gap-4 border-b border-method-rule py-8 md:grid-cols-[12rem_1fr] md:gap-10 md:py-12">
            <div><span aria-hidden="true" className="block text-7xl font-semibold leading-none text-method-signal sm:text-8xl">01</span><p className="label-mono mt-3 text-method-signal">Business activities</p></div>
            <div>
              <h3 className="text-2xl font-semibold sm:text-3xl">Business sector check</h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-method-muted sm:text-base">
                The published framework checks whether the company&apos;s main business sector or industry (more than 50%) is Halal. It lists banking and finance, investments, insurance, alcohol, impermissible entertainment, pork, gambling and tobacco as non-Halal sectors.
              </p>
            </div>
          </div>
          <div className="method-stage grid gap-4 border-b border-method-rule py-8 md:grid-cols-[12rem_1fr] md:gap-10 md:py-12">
            <div><span aria-hidden="true" className="block text-7xl font-semibold leading-none text-method-secondary sm:text-8xl">02</span><p className="label-mono mt-3 text-method-secondary">Financial criteria</p></div>
            <div>
              <h3 className="text-2xl font-semibold sm:text-3xl">Financial ratio check</h3>
              <p className="mt-4 text-sm leading-relaxed text-method-muted sm:text-base">Companies that pass the sector check must satisfy all five published financial criteria.</p>
              <dl className="mt-6 divide-y divide-method-rule border-t border-method-rule">
                {ratios.map((ratio) => (
                  <div key={ratio.name} className="grid gap-1 py-3.5 text-sm sm:grid-cols-2 sm:gap-6">
                    <dt className="font-medium text-method-copy">{ratio.name}</dt>
                    <dd className="text-method-muted">{ratio.rule}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="method-stage grid gap-4 border-b border-method-rule py-8 md:grid-cols-[12rem_1fr] md:gap-10 md:py-12">
            <div><span aria-hidden="true" className="block text-7xl font-semibold leading-none text-method-tertiary sm:text-8xl">03</span><p className="label-mono mt-3 text-method-tertiary">Deeper review</p></div>
            <div>
              <h3 className="text-2xl font-semibold sm:text-3xl">Qualitative screening check</h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-method-muted sm:text-base">
                The final review looks deeper into business activities that may be Shariah non-compliant. Zamzam Capital says it takes the cautious approach when there is doubt or insufficient information. A company may be classified non-Halal at the sector, financial or qualitative stage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}