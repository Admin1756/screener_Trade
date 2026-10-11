import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Terms of Use — Zamzam Capital" },
      {
        name: "description",
        content: "Terms governing use of the Zamzam Capital Shariah stock screening platform.",
      },
      { property: "og:title", content: "Terms of Use — Zamzam Capital" },
      {
        property: "og:description",
        content: "Terms governing use of the Zamzam Capital screening platform.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Legal" title="Terms of Use" />
      <section className="mx-auto max-w-3xl space-y-5 px-5 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>
          By using this platform you agree that the Shariah classifications and related information
          are provided for informational purposes only and without warranty of any kind.
        </p>
        <p>
          You may not use automated means to extract the screening dataset in bulk, resell it, or
          present it as your own screening output.
        </p>
        <p>
          Charting-link support is provided by Zamzam Capital and reads only the stock symbol
          contained in a link you paste. Zamzam Capital is not affiliated with, endorsed by, or
          partnered with any charting platform.
        </p>
        <p>
          Zamzam Capital may update the screening dataset, methodology and these terms at any time.
        </p>
      </section>
    </SiteShell>
  );
}
