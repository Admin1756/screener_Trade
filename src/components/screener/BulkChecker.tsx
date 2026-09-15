import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Radar } from "lucide-react";
import { fetchChartinkScan } from "@/lib/chartink.functions";
import { checkBulk, parseSymbolList, summarise, type BulkEntry } from "@/lib/bulk";
import { STATUS_LABEL, formatPrice, type ComplianceStatus } from "@/lib/stocks";
import { cn } from "@/lib/utils";

type Mode = "scanner" | "list";

const STATUS_STYLE: Record<ComplianceStatus, string> = {
  COMPLIANT: "bg-primary/15 text-primary ring-primary/30",
  NON_COMPLIANT: "bg-destructive/15 text-destructive ring-destructive/30",
  UNDER_REVIEW: "bg-warning/15 text-warning ring-warning/30",
  NOT_AVAILABLE: "bg-muted text-muted-foreground ring-border",
};

function StatusPill({ status }: { status: ComplianceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide ring-1",
        STATUS_STYLE[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
      <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
      <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
    </div>
  );
}

export function BulkChecker() {
  const runScan = useServerFn(fetchChartinkScan);
  const [mode, setMode] = useState<Mode>("scanner");
  const [link, setLink] = useState("");
  const [list, setList] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<BulkEntry[] | null>(null);
  const [scanNote, setScanNote] = useState<string | null>(null);

  async function run() {
    setError(null);
    setEntries(null);
    setScanNote(null);
    setBusy(true);
    try {
      if (mode === "scanner") {
        if (!link.trim()) return;
        setStage("Reading scanner…");
        const result = await runScan({ data: { link: link.trim() } });
        if (!result.ok) {
          setError(result.reason);
          return;
        }
        if (result.rows.length === 0) {
          setError("That scanner returned no stocks right now.");
          return;
        }
        setStage("Checking Shariah status…");
        const checked = await checkBulk(
          result.rows.map((r) => ({
            symbol: r.symbol,
            name: r.name,
            close: r.close,
            change: r.percent_change,
          })),
        );
        setScanNote(`Chartink scan "${result.slug}" — order kept exactly as the scanner returned it.`);
        setEntries(checked);
        return;
      }

      const symbols = parseSymbolList(list);
      if (symbols.length === 0) {
        setError("Paste at least one stock symbol.");
        return;
      }
      setStage("Checking Shariah status…");
      setEntries(await checkBulk(symbols.map((symbol) => ({ symbol }))));
      setScanNote(`${symbols.length} symbols checked in the order you pasted them.`);
    } catch {
      setError("Something went wrong while checking these stocks. Please try again.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }

  const stats = entries ? summarise(entries) : null;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border glass p-2">
        <div className="flex items-center gap-1 p-1.5">
          <button
            type="button"
            onClick={() => setMode("scanner")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              mode === "scanner"
                ? "bg-panel text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Radar className="size-3.5" /> Chartink Scanner Link
          </button>
          <button
            type="button"
            onClick={() => setMode("list")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              mode === "list"
                ? "bg-panel text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ListChecks className="size-3.5" /> Bulk Stock List
          </button>
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-4">
          {mode === "scanner" ? (
            <>
              <label htmlFor="zz-scan" className="label-mono">
                Public Chartink scanner link
              </label>
              <input
                id="zz-scan"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void run()}
                placeholder="https://chartink.com/screener/..."
                className="mt-2 w-full bg-transparent text-base tracking-tight placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </>
          ) : (
            <>
              <label htmlFor="zz-list" className="label-mono">
                Paste symbols — commas, spaces or one per line
              </label>
              <textarea
                id="zz-list"
                value={list}
                onChange={(e) => setList(e.target.value)}
                rows={5}
                placeholder={"RELIANCE\nTCS\nINFY"}
                className="mt-2 w-full resize-y bg-transparent font-mono text-sm tracking-tight placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void run()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {busy ? stage || "Working…" : mode === "scanner" ? "Analyze Scanner" : "Check List"}
          </button>
          <p className="label-mono mt-3 text-center">
            Scanner-link support by Zamzam Capital · order preserved
          </p>
        </div>
      </div>

      <div className="mt-6">
        {busy ? (
          <div className="overflow-hidden rounded-2xl border border-border glass">
            {[0, 1, 2, 3, 4].map((i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {error && !busy ? (
          <div className="animate-rise rounded-2xl border border-border glass p-6">
            <h3 className="text-lg font-semibold">Unable to Read Scanner</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              You can paste the stock symbols directly using the Bulk Stock List tab instead.
            </p>
          </div>
        ) : null}

        {entries && !busy ? (
          <div className="animate-rise space-y-4">
            {stats ? (
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-5">
                {[
                  ["Stocks", stats.total],
                  ["Compliant", stats.compliant],
                  ["Non-compliant", stats.nonCompliant],
                  ["Under review", stats.underReview],
                  ["Not available", stats.notAvailable],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-surface p-4">
                    <p className="label-mono">{label}</p>
                    <p className="mt-1.5 font-mono text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {scanNote ? <p className="label-mono">{scanNote}</p> : null}

            <div className="overflow-hidden rounded-2xl border border-border glass">
              <div className="hidden grid-cols-[3rem_9rem_1fr_7rem_9rem] gap-3 border-b border-border px-4 py-2.5 sm:grid">
                <span className="label-mono">#</span>
                <span className="label-mono">Symbol</span>
                <span className="label-mono">Company</span>
                <span className="label-mono">Price</span>
                <span className="label-mono">Status</span>
              </div>
              {entries.map((entry) => (
                <div
                  key={`${entry.rank}-${entry.input}`}
                  className="grid grid-cols-1 gap-2 border-b border-border px-4 py-3 last:border-0 transition-colors hover:bg-panel/60 sm:grid-cols-[3rem_9rem_1fr_7rem_9rem] sm:items-center sm:gap-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">{entry.rank}</span>
                  <span className="font-mono text-sm font-medium">{entry.input}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {entry.stock?.company_name ?? entry.scannerName ?? "—"}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {entry.stock ? (formatPrice(entry.stock) ?? entry.scannerClose ?? "—") : (entry.scannerClose ?? "—")}
                  </span>
                  <span className="sm:justify-self-start">
                    <StatusPill status={entry.status} />
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Compliance status always comes from the current Zamzam Capital database. Stocks not in
              the database are shown as Not Available — never estimated.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
