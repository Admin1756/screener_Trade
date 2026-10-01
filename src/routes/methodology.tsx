import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { MethodologySection } from "@/components/site/MethodologySection";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Shariah Screening Methodology — Zamzam Capital" },
      { name: "description", content: "Zamzam Capital's published three-stage Shariah screening framework: business sector, five financial ratios, and qualitative review." },
      { property: "og:title", content: "Shariah Screening Methodology — Zamzam Capital" },
      { property: "og:description", content: "Read Zamzam Capital's published three-stage Shariah screening framework and financial ratio criteria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MethodologyPage,
});

function MethodologyPage() {
  return <SiteShell><MethodologySection /></SiteShell>;
}