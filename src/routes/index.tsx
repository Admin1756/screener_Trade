import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { MarketBackground } from "@/components/site/MarketBackground";
import { BulkChecker } from "@/components/screener/BulkChecker";
import { AboutSection, ConnectSection } from "@/components/site/CompanySections";
import { MethodologySection } from "@/components/site/MethodologySection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zamzam Capital — Stock Analysis Screener" },
      { name: "description", content: "Screen a Chartink technical scan, Screener.in fundamental screen, or pasted stock list against Zamzam Capital's Shariah compliance database." },
      { property: "og:title", content: "Zamzam Capital — Stock Analysis Screener" },
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
      <section id="screener" className="scroll-mt-16 relative overflow-hidden border-b border-border">
        <MarketBackground />
          <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-6 sm:px-6 sm:pb-16 sm:pt-14">
            <h1 className="text-3xl font-bold leading-tight sm:text-2xl md:whitespace-nowrap md:text-3xl lg:text-4xl xl:text-[2.5rem]">Stock Analysis Screener by <span className="text-primary">Zamzam Capital</span></h1>
            <p className="mt-5 max-w-3xl text-xl font-medium leading-snug sm:text-2xl">Screen your stocks. <span className="font-bold text-pale-gold">See their Shariah status.</span></p>
           <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
             Bring technical and fundamental screens together. Paste a Chartink or Screener.in link, or a list of symbols, to see source-ordered market data alongside the recorded Shariah status.
          </p>
           <div className="mt-6 border-t border-border pt-5 sm:mt-10 sm:pt-6">
            <BulkChecker />
          </div>
        </div>
      </section>
       <MethodologySection />
      <AboutSection />
      <ConnectSection />
    </SiteShell>
  );
}