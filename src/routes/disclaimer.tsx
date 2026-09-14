import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Risk & Information Disclaimer — Zamzam Capital" },
      {
        name: "description",
        content:
          "Zamzam Capital provides informational Shariah-compliance screening tools, not investment advice or guarantees of performance.",
      },
      { property: "og:title", content: "Risk & Information Disclaimer — Zamzam Capital" },
      {
        property: "og:description",
        content: "Informational screening tools — not investment advice or performance guarantees.",
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Legal" title="Risk &amp; Information Disclaimer" />
      <section className="mx-auto max-w-3xl space-y-5 px-5 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>
          Zamzam Capital provides informational tools for Shariah-compliance screening. The
          information provided by this platform should not be considered a guarantee of investment
          performance, financial return or personalized investment advice.
        </p>
        <p>
          Users should conduct their own research and make decisions according to their individual
          circumstances, objectives and risk tolerance, and may wish to consult a qualified
          professional.
        </p>
        <p>
          Shariah classifications may change as company activities, financial information or
          screening criteria change. A classification reflects the data recorded in the dataset
          published at the time you view it.
        </p>
        <p>
          Where a stock is not present in the current dataset, its status is shown as NOT AVAILABLE.
          Zamzam Capital does not estimate or generate classifications for stocks it has not
          screened.
        </p>
      </section>
    </SiteShell>
  );
}
