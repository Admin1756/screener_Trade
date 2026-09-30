import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";
import { getActiveDataset, formatDate } from "@/lib/stocks";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Shariah Screening Methodology — Zamzam Capital" },
      { name: "description", content: "Zamzam Capital's published three-stage Shariah screening framework: business sector, five financial ratios, and qualitative review." },
      { property: "og:title", content: "Shariah Screening Methodology — Zamzam Capital" },
      { property: "og:description", content: "Read Zamzam Capital's published three-stage Shariah screening framework and financial ratio criteria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MethodologyPage,
});

const ratios = [
  { name: "Interest-bearing debt", rule: "Less than 33% of total assets" },
  { name: "Non-compliant investments", rule: "Less than 33% of total assets" },
  { name: "Non-Halal revenue", rule: "Less than 5% of total revenue" },
  { name: "Non-liquid assets", rule: "At least 20% of total assets" },
  { name: "Market capitalization", rule: "Greater than net liquid assets" },
];

function MethodologyPage() {
  const { data: dataset } = useQuery({
    queryKey: ["dataset", "active"],
    queryFn: getActiveDataset,
  });

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Methodology"
        title="Our Shariah Screening Framework"
        intro="Zamzam Capital's published approach reviews business activities, financial ratios and qualitative factors."
      />
      <div className="mx-auto max-w-4xl px-5 pb-20 sm:px-6">
        <section className="border-t border-border py-9">
          <p className="label-mono">Stage 01</p>
          <h2 className="mt-3 text-xl font-semibold">Business sector check</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The published framework checks whether the company&apos;s main business sector or industry
            (more than 50%) is Halal. It lists banking and finance, investments, insurance, alcohol,
            impermissible entertainment, pork, gambling and tobacco as non-Halal sectors.
          </p>
        </section>

        <section className="border-t border-border py-9">
          <p className="label-mono">Stage 02</p>
          <h2 className="mt-3 text-xl font-semibold">Financial ratio check</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Companies that pass the sector check must satisfy all five published financial criteria.
          </p>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {ratios.map((ratio) => (
              <div key={ratio.name} className="grid gap-1 py-3 text-sm sm:grid-cols-2 sm:gap-6">
                <dt className="font-medium">{ratio.name}</dt>
                <dd className="text-muted-foreground">{ratio.rule}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-border py-9">
          <p className="label-mono">Stage 03</p>
          <h2 className="mt-3 text-xl font-semibold">Qualitative screening check</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The final review looks deeper into business activities that may be Shariah non-compliant.
            Zamzam Capital says it takes the cautious approach when there is doubt or insufficient
            information. A company may be classified non-Halal at the sector, financial or
            qualitative stage.
          </p>
        </section>

        <section className="border-t border-border py-9">
          <p className="label-mono">Current screening data</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This screener displays classifications from the currently published Zamzam Capital
            dataset. It does not recalculate the framework from Chartink or Screener.in figures,
            or infer a status when no record exists.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <div><dt className="label-mono">Version</dt><dd className="mt-1 font-mono">{dataset?.version ?? "—"}</dd></div>
            <div><dt className="label-mono">Records</dt><dd className="mt-1 font-mono">{dataset?.record_count ?? "—"}</dd></div>
            <div><dt className="label-mono">Published</dt><dd className="mt-1 font-mono">{formatDate(dataset?.published_at)}</dd></div>
          </dl>
          <a href="https://zamzam-capital.com/" target="_blank" rel="noreferrer noopener" className="mt-7 inline-block text-sm font-medium text-primary hover:underline">
            Read the framework on Zamzam Capital&apos;s website ↗
          </a>
        </section>
      </div>
    </SiteShell>
  );
}