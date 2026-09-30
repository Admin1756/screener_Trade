import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Zamzam Capital" },
      {
        name: "description",
        content:
          "How the Zamzam Capital screener checks Chartink and Screener.in lists against its Shariah compliance database.",
      },
      { property: "og:title", content: "How It Works — Zamzam Capital" },
      {
        property: "og:description",
        content: "Three steps: paste a screen, match its stocks, and review their recorded Shariah status.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    n: "01",
    title: "Paste",
    body: "Paste a public Chartink technical scanner link, a Screener.in fundamental screen link, or your own list of symbols.",
  },
  {
    n: "02",
    title: "Screen",
    body: "Stocks are kept in the same order as the source, with the source's available columns intact. Their symbols are matched against Zamzam Capital's current screening dataset.",
  },
  {
    n: "03",
    title: "Know",
    body: "See each stock's recorded Shariah status beside its name. Stocks absent from the active dataset are marked Not Available, never guessed.",
  },
];

function HowItWorks() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Product"
        title="From your screen to a clear status."
        intro="Bring your technical or fundamental screen; review every stock in its original order."
      />
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6">
        <ol className="space-y-4">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-primary/40 sm:p-8"
            >
              <span className="font-mono text-sm text-primary">{step.n}</span>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-xl border border-border glass p-6">
          <p className="label-mono">Charting links</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Chartink and Screener.in links are read as public screens. Market figures come from the
            source screen; Shariah statuses come only from Zamzam Capital&apos;s published dataset.
            Link support by Zamzam Capital does not imply a partnership with either platform.
          </p>
        </div>

        <Link
          to="/"
          className="mt-10 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open screener
        </Link>
      </section>
    </SiteShell>
  );
}
