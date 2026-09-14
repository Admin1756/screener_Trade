import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DatabaseUploader } from "@/components/admin/DatabaseUploader";
import { formatDate } from "@/lib/stocks";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Zamzam Capital Admin" },
      { name: "description", content: "Zamzam Capital screening database administration." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Zamzam Capital Admin" },
      { property: "og:description", content: "Screening database administration." },
    ],
  }),
  component: AdminPage,
});

type Overview = {
  total_stocks?: number;
  compliant?: number;
  non_compliant?: number;
  under_review?: number;
  database_version?: number | null;
  last_update?: string | null;
  total_records?: number;
  latest_upload?: string | null;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-5">
      <p className="label-mono">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    setEmail(userData.user?.email ?? null);
    await supabase.rpc("claim_first_admin");
    const { data, error } = await supabase.rpc("admin_overview");
    if (error || !data) {
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
      setOverview(data as Overview);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth" });
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
        <div className="max-w-sm">
          <ShieldAlert className="mx-auto size-7 text-warning" />
          <h1 className="mt-4 text-xl font-semibold">Administrator access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {email ? `${email} is signed in but` : "This account"} does not have administrator
            permissions for the Zamzam Capital database.
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-6 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-panel"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const stats: [string, string][] = [
    ["Total stocks", (overview?.total_stocks ?? 0).toLocaleString()],
    ["Compliant", (overview?.compliant ?? 0).toLocaleString()],
    ["Non-compliant", (overview?.non_compliant ?? 0).toLocaleString()],
    ["Under review", (overview?.under_review ?? 0).toLocaleString()],
    ["Database version", overview?.database_version ? `v${overview.database_version}` : "—"],
    ["Last update", formatDate(overview?.last_update ?? null)],
    ["Total records", (overview?.total_records ?? 0).toLocaleString()],
    ["Latest upload", formatDate(overview?.latest_upload ?? null)],
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <span className="font-mono text-xs font-semibold text-primary">Z</span>
            </span>
            <span className="text-sm font-semibold tracking-tight">Zamzam Capital Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
              {email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:bg-panel"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-6">
        <section>
          <p className="label-mono">Dashboard</p>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {stats.map(([label, value]) => (
              <Stat key={label} label={label} value={value} />
            ))}
          </div>
        </section>

        <DatabaseUploader onPublished={() => void load()} />
      </main>
    </div>
  );
}
