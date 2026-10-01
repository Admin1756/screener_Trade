import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { AboutSection } from "@/components/site/CompanySections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zamzam Capital" },
      {
        name: "description",
        content:
          "Meet Zamzam Capital, a SEBI-registered research analyst bringing market research and Shariah screening together.",
      },
      { property: "og:title", content: "About Zamzam Capital" },
      {
        property: "og:description",
        content: "Learn about Zamzam Capital's research and Shariah-compliant investing approach.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <SiteShell><AboutSection /></SiteShell>;
}
