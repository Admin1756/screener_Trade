import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Zamzam Capital" },
      {
        name: "description",
        content:
          "Search, screen, know. How Zamzam Capital turns a stock name, symbol or charting link into a clear Shariah compliance status.",
      },
      { property: "og:title", content: "How It Works — Zamzam Capital" },
      {
        property: "og:description",
        content: "Three steps: search a stock, screen it against our dataset, know its status.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    n: "01",
    title: "Search",
    body: "Enter a stock name, symbol, NSE or BSE code — or paste a supported charting platform link. Suggestions appear as you type so you can confirm the exact company before screening.",
  },
  {
    n: "02",
    title: "Screen",
    body: "Your input is matched against the currently published Zamzam Capital screening dataset. Matching is exact-first on symbol and exchange codes, then falls back to partial company-name matching.",
  },
  {
    n: "03",
    title: "Know",
    body: "You see the recorded compliance status along with the business-activity and financial screening results, the compliance date and when the record was last updated.",
  },
];

function HowItWorks() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="How It Works"
        title="From a ticker to a clear answer."
        intro="Three steps, no guesswork. Every answer comes from the published dataset."
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
            When you paste a charting platform link, we read the stock symbol contained in the link
            and match it to our dataset. We do not retrieve restricted data from those platforms.
            Charting-link support by Zamzam Capital.
          </p>
        </div>

        <Link
          to="/check"
          className="mt-10 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check a stock
        </Link>
      </section>
    </SiteShell>
  );
}
