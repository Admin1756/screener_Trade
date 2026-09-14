import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { MarketBackground, TickerStrip } from "@/components/site/MarketBackground";
import { StockChecker } from "@/components/screener/StockChecker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zamzam Capital — Shariah Stock Screener" },
      {
        name: "description",
        content:
          "Check the Shariah compliance status of a stock by company name, symbol, NSE/BSE code or a charting link. Fast, simple, Shariah-focused research.",
      },
      { property: "og:title", content: "Zamzam Capital — Shariah Stock Screener" },
      {
        property: "og:description",
        content:
          "Know before you invest. Check the Shariah status of a stock in seconds using Zamzam Capital's maintained screening database.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    n: "01",
    title: "Search",
    body: "Enter a stock name, symbol or a supported charting link.",
  },
  {
    n: "02",
    title: "Screen",
    body: "We check it against Zamzam Capital's maintained screening database.",
  },
  {
    n: "03",
    title: "Know",
    body: "Get a clear compliance status with the relevant screening information.",
  },
];

function Home() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <MarketBackground />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <p className="label-mono">Shariah Stock Screening</p>
            <h1 className="mt-5 text-[44px] font-bold leading-[1.03] tracking-tight sm:text-6xl">
              Know Before
              <br />
              You Invest.
            </h1>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
              Instantly check whether a stock is Shariah-compliant, based on Zamzam Capital&apos;s
              maintained screening database. Search by name, symbol or paste a charting link.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/how-it-works"
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-panel"
              >
                How it works
              </Link>
              <Link
                to="/methodology"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Screening methodology
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <StockChecker />
          </div>
        </div>
      </section>

      <TickerStrip />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        <p className="label-mono">How It Works</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps to clarity.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="group rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-primary/40"
            >
              <span className="font-mono text-sm text-primary">{step.n}</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="label-mono">About Zamzam Capital</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Shariah research, made simpler.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Zamzam Capital is focused on making Shariah-focused stock research simpler, faster and
              more accessible. Every classification shown on this platform comes from our maintained
              screening dataset — never estimated or generated.
            </p>
            <p>
              Where a stock is not present in the current dataset, we show it as{" "}
              <span className="font-mono text-foreground">NOT AVAILABLE</span> rather than guessing.
            </p>
            <Link
              to="/about"
              className="inline-block font-medium text-primary transition-opacity hover:opacity-80"
            >
              Read more about us →
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
