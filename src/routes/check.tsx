import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { MarketBackground } from "@/components/site/MarketBackground";
import { StockChecker } from "@/components/screener/StockChecker";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Check a Stock — Zamzam Capital" },
      {
        name: "description",
        content:
          "Search a stock by company name, symbol, NSE or BSE code — or paste a charting link — to see its Shariah compliance status.",
      },
      { property: "og:title", content: "Check a Stock — Zamzam Capital" },
      {
        property: "og:description",
        content:
          "Search by company name, symbol, NSE or BSE code, or paste a charting link to see the recorded Shariah status.",
      },
    ],
  }),
  component: CheckPage,
});

function CheckPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <MarketBackground />
        <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
          <p className="label-mono">Check Stock</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Check a stock&apos;s Shariah status.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Search by company name, stock symbol, NSE symbol or BSE symbol — or paste a supported
            charting link.
          </p>
          <div className="mt-10">
            <StockChecker autoFocus />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
