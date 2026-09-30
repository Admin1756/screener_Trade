import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { MarketBackground } from "@/components/site/MarketBackground";
import { BulkChecker } from "@/components/screener/BulkChecker";
import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zamzam Capital — Shariah Scanner" },
      { name: "description", content: "Screen a Chartink technical scan, Screener.in fundamental screen, or pasted stock list against Zamzam Capital's Shariah compliance database." },
      { property: "og:title", content: "Zamzam Capital — Shariah Scanner" },
      { property: "og:description", content: "Paste a Chartink or Screener.in link, or a list of stocks, to see their recorded Shariah compliance status in source order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <MarketBackground />
        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-sm border border-border bg-panel p-1 sm:size-20">
              <img src={zamzamLogo.url} alt="Zamzam Capital logo" className="size-full object-contain" />
            </span>
            <div>
              <p className="text-lg font-semibold sm:text-xl">Zamzam Capital</p>
              <p className="label-mono mt-1">Shariah stock screening</p>
            </div>
          </div>
          <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Screen your stocks. See their Shariah status.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Paste a Chartink technical scanner link, a Screener.in fundamental screen link, or your own list of stock symbols. We keep the source order and columns, with Zamzam Capital&apos;s compliance status beside each stock.
          </p>
          <div className="mt-8 border-t border-border pt-6 sm:mt-10">
            <BulkChecker />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}