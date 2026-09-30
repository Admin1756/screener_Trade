import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Instagram, Linkedin, Send, Youtube } from "lucide-react";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";
import { getSetting } from "@/lib/stocks";

type Social = { instagram?: string; youtube?: string; linkedin?: string; telegram?: string };

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect With Zamzam Capital" },
      {
        name: "description",
        content:
          "Follow Zamzam Capital on Instagram, YouTube, LinkedIn and Telegram for Shariah-focused stock research updates.",
      },
      { property: "og:title", content: "Connect With Zamzam Capital" },
      {
        property: "og:description",
        content: "Instagram, YouTube, LinkedIn and Telegram — follow our research updates.",
      },
    ],
  }),
  component: ConnectPage,
});

const PLATFORMS = [
  { key: "instagram", name: "Instagram", Icon: Instagram, blurb: "Research snapshots and updates." },
  { key: "youtube", name: "YouTube", Icon: Youtube, blurb: "Longer explainers and walkthroughs." },
  { key: "linkedin", name: "LinkedIn", Icon: Linkedin, blurb: "Company news and announcements." },
  { key: "telegram", name: "Telegram", Icon: Send, blurb: "Fast updates as the dataset changes." },
] as const;

// Public profiles listed on zamzam-capital.com.
const OFFICIAL_LINKS: Record<keyof Social, string> = {
  instagram: "https://www.instagram.com/zamzamcapitalindia",
  youtube: "https://www.youtube.com/@zamzamcapital",
  linkedin: "https://www.linkedin.com/company/zamzam-capital",
  telegram: "https://t.me/zamzamcapital",
};

function ConnectPage() {
  const { data } = useQuery({
    queryKey: ["settings", "social"],
    queryFn: () => getSetting<Social>("social"),
  });

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Connect"
        title="Connect With Zamzam Capital"
        intro="Follow along for updates to our screening data and research."
      />
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {PLATFORMS.map(({ key, name, Icon, blurb }) => {
             const url = data?.[key] || OFFICIAL_LINKS[key];
            const inner = (
              <>
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-5" />
                </span>
                <span className="mt-4 block text-base font-semibold tracking-tight">{name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{blurb}</span>
                <span className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  {url ? "Open profile" : "Link not yet published"}
                  {url ? (
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  ) : null}
                </span>
              </>
            );

            return url ? (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="group rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-primary/40 hover:bg-panel"
              >
                {inner}
              </a>
            ) : (
              <div
                key={key}
                className="group rounded-xl border border-border bg-surface/30 p-6 opacity-70"
              >
                {inner}
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">Profiles listed on zamzam-capital.com.</p>
      </section>
    </SiteShell>
  );
}
