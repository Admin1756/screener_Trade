import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";

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
      <img src={zamzamLogo.url} alt="Zamzam Capital" className="mx-auto size-16 rounded-sm border border-border object-contain" />
      <h1 className="mt-6 text-xl font-semibold">Stock uploads are managed in Zamzam AI Capital</h1>
      <p className="mt-2 text-sm text-muted-foreground">Opening the admin upload page…</p>
      <Button asChild className="mt-6"><a href={uploadUrl}>Open stock uploads <ExternalLink className="size-4" /></a></Button>
    </div>
  </main>;
}