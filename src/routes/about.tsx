import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";
import { getSetting } from "@/lib/stocks";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zamzam Capital" },
      {
        name: "description",
        content:
          "Zamzam Capital is focused on making Shariah-focused stock research simpler, faster and more accessible.",
      },
      { property: "og:title", content: "About Zamzam Capital" },
      {
        property: "og:description",
        content: "Making Shariah-focused stock research simpler, faster and more accessible.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useQuery({
    queryKey: ["settings", "about"],
    queryFn: () => getSetting<{ body?: string }>("about"),
  });

  return (
    <SiteShell>
      <PageHeader
        eyebrow="About"
        title="About Zamzam Capital"
        intro="Making Shariah-focused stock research simpler."
      />
      <section className="mx-auto max-w-3xl space-y-5 px-5 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        {data?.body?.trim() ? (
          <p className="whitespace-pre-line">{data.body}</p>
        ) : (
          <>
            <p>
              Zamzam Capital is a SEBI-registered research analyst focused on Shariah-compliant equity
              research in India (registration INH000016199). Its work brings together capital-market
              research and Islamic finance to help investors assess listed companies.
            </p>
            <p>
              This screener lets you paste a public Chartink technical screen, a Screener.in
              fundamental screen, or your own list of symbols. It preserves the source order and
              available figures, while Shariah classifications come from our maintained dataset.
            </p>
            <p>
              Every result shown is read directly from the currently published dataset. We do not
              estimate, generate or infer classifications. Where a stock is not present, we say so.
            </p>
          </>
        )}
        <p className="border-t border-border pt-5 text-xs">
          Zamzam Capital does not provide guarantees of investment performance or financial return,
          and nothing on this platform constitutes personalized investment advice.
        </p>
        <p className="text-xs">
          <a href="https://zamzam-capital.com/about/" target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">Read more on the official Zamzam Capital website ↗</a>
        </p>
      </section>
    </SiteShell>
  );
}
