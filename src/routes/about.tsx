import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zamzam Capital" },
      {
        name: "description",
        content:
          "Meet Zamzam Capital, a SEBI-registered research analyst bringing market research and Shariah screening together.",
      },
      { property: "og:title", content: "About Zamzam Capital" },
      {
        property: "og:description",
        content: "Learn about Zamzam Capital's research and Shariah-compliant investing approach.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="About"
        title="About Zamzam Capital"
        intro="Research and Shariah screening for investors in Indian equities."
      />
      <section className="mx-auto max-w-3xl space-y-5 px-5 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>
          Zamzam Capital is a SEBI-registered Research Analyst (INH000016199; BSE enlistment
          6158). Founded by Saif Ahmed, the firm brings together market research and
          Shariah-compliant investing.
        </p>
        <p>
          Its published approach combines fundamental and technical analysis with Shariah
          screening. The firm also offers research-led stock plans and long-term model portfolios.
          It says its Shariah screening follows three stages: business sector, financial ratios,
          and qualitative review.
        </p>
        <p>
          On this site, you can paste a public Chartink technical scan, a Screener.in fundamental
          screen, or a list of symbols. Stocks stay in the source order, with the recorded
          compliance status shown beside each name. Results come only from the current uploaded
          Zamzam Capital dataset; stocks absent from it are marked Not Available.
        </p>
        <p className="border-t border-border pt-5 text-xs">
          Zamzam Capital does not provide guarantees of investment performance or financial return,
          and nothing on this platform constitutes personalized investment advice.
        </p>
        <p className="text-xs">
          <a href="https://zamzam-capital.com/" target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">Visit the official Zamzam Capital website ↗</a>
        </p>
      </section>
    </SiteShell>
  );
}
