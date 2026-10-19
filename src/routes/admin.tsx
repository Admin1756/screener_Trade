import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zamzamLogo } from "@/lib/media";
import { zamzamDarkLogo } from "@/lib/media";

const uploadUrl = "https://zamzamcapitalai.lovable.app/admin/stocks";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Stock Upload — Zamzam Capital" },
    { name: "description", content: "Manage Zamzam Capital stock uploads in Zamzam AI Capital's admin." },
    { property: "og:title", content: "Stock Upload — Zamzam Capital" },
    { property: "og:description", content: "Manage stock uploads in the shared Zamzam AI Capital stock list." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminRedirect,
});

function AdminRedirect() {
  useEffect(() => { window.location.replace(uploadUrl); }, []);

  return <main className="grid min-h-screen place-items-center bg-background px-5">
    <div className="text-center">
      <span className="mx-auto flex h-16 items-center overflow-hidden rounded-sm border border-border px-3">
        <img src={zamzamDarkLogo.url} alt="Zamzam Capital" className="h-full w-auto object-contain light:hidden" />
        <img src={zamzamLogo.url} alt="Zamzam Capital" className="hidden h-full w-auto object-contain light:block" />
      </span>
      <h1 className="mt-6 text-xl font-semibold">Stock uploads are managed in Zamzam AI Capital</h1>
      <p className="mt-2 text-sm text-muted-foreground">Opening the admin upload page…</p>
      <Button asChild className="mt-6"><a href={uploadUrl}>Open stock uploads <ExternalLink className="size-4" /></a></Button>
    </div>
  </main>;
}