import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Privacy Policy — Zamzam Capital" },
      {
        name: "description",
        content: "How Zamzam Capital handles information when you use the Shariah stock screener.",
      },
      { property: "og:title", content: "Privacy Policy — Zamzam Capital" },
      {
        property: "og:description",
        content: "How Zamzam Capital handles information on the stock screening platform.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl space-y-5 px-5 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>
          Searching a stock on this platform does not require an account. Search terms and pasted
          links are used only to match a record in the current screening dataset.
        </p>
        <p>
          Stock uploads and administrator accounts are managed in Zamzam AI Capital.
          Administrator credentials are stored securely and passwords are never stored in plain
          text.
        </p>
        <p>
          Administrative actions such as dataset uploads and publications are recorded in an audit
          log for integrity purposes.
        </p>
        <p>
          This page is maintained by Zamzam Capital and will be expanded with jurisdiction-specific
          details as they are finalised.
        </p>
      </section>
    </SiteShell>
  );
}
