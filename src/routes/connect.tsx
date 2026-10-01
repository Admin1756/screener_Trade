import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { ConnectSection } from "@/components/site/CompanySections";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  return <SiteShell><ConnectSection /></SiteShell>;
}
