import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { MarketBackground } from "@/components/site/MarketBackground";
import { BulkChecker } from "@/components/screener/BulkChecker";
import { BrandLockup } from "@/components/site/BrandLockup";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Scanner & Bulk Check — Zamzam Capital" },
      {
        name: "description",
        content:
          "Paste a public Chartink scanner link or a bulk list of stocks to see the Shariah compliance status of every stock, in the scanner's own order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Scanner & Bulk Check — Zamzam Capital" },
      {
        property: "og:description",
        content:
          "Check an entire Chartink scanner or a pasted stock list against the Zamzam Capital Shariah screening database.",
      },
    ],
  }),
  component: ScannerPage,
});

function ScannerPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <MarketBackground />
        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
          <BrandLockup />
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Screen a whole scanner at once.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Paste a public Chartink scanner link and every stock it returns is checked against the
            Zamzam Capital database — kept in the scanner&apos;s own sequence, top mover first. Or
            paste your own bulk list of symbols.
          </p>
          <div className="mt-10">
            <BulkChecker />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
