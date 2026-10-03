import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, ChevronLeft, ChevronRight, LineChart, ListChecks, Loader2 } from "lucide-react";
import { fetchChartinkScan } from "@/lib/chartink.functions";
import { fetchScreenerScreen } from "@/lib/screener.functions";
import { getSharedStocks } from "@/lib/ai-capital.functions";
import { checkBulk, parseSymbolList, summarise, type BulkEntry } from "@/lib/bulk";
import { STATUS_LABEL, type ComplianceStatus } from "@/lib/stocks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Mode = "chartink" | "screener" | "list";

const MODES: { id: Mode; label: string; hint: string; icon: typeof LineChart }[] = [
  { id: "chartink", label: "Chartink", hint: "Technical scan", icon: LineChart },
  { id: "screener", label: "Screener.in", hint: "Fundamental screen", icon: BarChart3 },
  { id: "list", label: "Bulk list", hint: "Your symbols", icon: ListChecks },
];

const STATUS_STYLE: Record<ComplianceStatus, string> = {
  COMPLIANT: "bg-primary/15 text-primary ring-primary/30",
  NON_COMPLIANT: "bg-destructive/15 text-destructive ring-destructive/30",
  UNDER_REVIEW: "bg-warning/15 text-warning ring-warning/30",
  NOT_AVAILABLE: "bg-muted text-muted-foreground ring-border",
};

const PAGE_SIZE = 25;

function StatusPill({ status }: { status: ComplianceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 text-[10px] font-bold uppercase ring-1",
        STATUS_STYLE[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
      <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
      <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function BulkChecker() {
  const runChartink = useServerFn(fetchChartinkScan);
  const runScreener = useServerFn(fetchScreenerScreen);
  const loadStocks = useServerFn(getSharedStocks);
  const [mode, setMode] = useState<Mode>("chartink");
  const [chartinkLink, setChartinkLink] = useState("");
  const [screenerLink, setScreenerLink] = useState("");
  const [list, setList] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<BulkEntry[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  async function run() {
    setError(null);
    setEntries(null);
    setNote(null);
    setPage(0);
    setBusy(true);
    try {
      if (mode === "chartink") {
        if (!chartinkLink.trim()) return setError("Paste a Chartink scanner link.");
        setStage("Reading Chartink scanner…");
        const r = await runChartink({ data: { link: chartinkLink.trim() } });
        if (!r.ok) return setError(r.reason);
        if (!r.rows.length) return setError("That scanner returned no stocks right now.");
        setStage("Checking Shariah status…");
        setColumns(["BSE Code", "Close", "% Chg", "Volume"]);
        setEntries(
          checkBulk(
            r.rows.map((row) => ({
              symbol: row.symbol,
              name: row.name,
              cells: [row.bse_code ?? "—", row.close ?? "—", row.percent_change ?? "—", row.volume ?? "—"],
            })),
            await loadStocks({ data: { symbols: r.rows.map((row) => row.symbol) } }),
          ),
        );
        setNote(`Chartink · ${r.slug} — sorted by % gain, highest first.`);
        return;
      }
      if (mode === "screener") {
        if (!screenerLink.trim()) return setError("Paste a Screener.in screen link.");
        setStage("Reading Screener.in screen…");
        const r = await runScreener({ data: { link: screenerLink.trim() } });
        if (!r.ok) return setError(r.reason);
        if (!r.rows.length) return setError("That screen returned no stocks right now.");
        setStage("Checking Shariah status…");
        setColumns(r.columns);
        setEntries(checkBulk(r.rows.map((row) => ({ symbol: row.symbol, name: row.name, cells: row.cells })), await loadStocks({ data: { symbols: r.rows.map((row) => row.symbol) } })));
        setNote(`Screener.in · ${r.title} — columns and order exactly as listed on the screen.`);
        return;
      }
      const symbols = parseSymbolList(list);
      if (!symbols.length) return setError("Paste at least one stock symbol.");
      setStage("Checking Shariah status…");
      setColumns([]);
      setEntries(checkBulk(symbols.map((symbol) => ({ symbol })), await loadStocks({ data: { symbols } })));
      setNote(`${symbols.length} symbols checked in the order you pasted them.`);
    } catch {
      setError(mode === "list" ? "The stock database is unavailable. Please try again." : "The screen could not be reached right now. Try again or paste its symbols in Bulk list.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }

  const stats = entries ? summarise(entries) : null;
  const pageCount = entries ? Math.ceil(entries.length / PAGE_SIZE) : 0;
  const visibleEntries = entries?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) ?? [];
  const placeholder =
    mode === "chartink" ? "https://chartink.com/screener/..." : "https://www.screener.in/screens/...";

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border glass p-2">
        <div className="grid grid-cols-3 gap-1 p-1.5">
          {MODES.map((m) => (
            <Button
              key={m.id}
              type="button"
              variant="ghost"
              onClick={() => {
                setMode(m.id);
                setError(null);
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-2.5 transition-colors sm:flex-row sm:justify-center sm:gap-2",
                mode === m.id ? "bg-panel text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <m.icon className="size-4" />
              <span className="text-[13px] font-medium">{m.label}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:inline">
                · {m.hint}
              </span>
            </Button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-4">
          {mode !== "list" ? (
            <>
              <label htmlFor="zz-scan" className="label-mono">
                 {mode === "chartink" ? "Chartink scanner link" : "Screener.in screen link"}
              </label>
              <input
                id="zz-scan"
                 value={mode === "chartink" ? chartinkLink : screenerLink}
                 onChange={(e) => mode === "chartink" ? setChartinkLink(e.target.value) : setScreenerLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void run()}
                placeholder={placeholder}
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

           <Button
            type="button"
            disabled={busy}
            onClick={() => void run()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {busy ? stage || "Working…" : mode === "list" ? "Check List" : "Analyze & Check Compliance"}
           </Button>
           <p className="mt-3 text-center text-xs text-muted-foreground">Links must be accessible without signing in. Private screens cannot be read from a link alone; paste their symbols in Bulk list instead.</p>
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
            <h3 className="text-lg font-semibold">Unable to Read Link</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              You can paste the stock symbols directly using the Bulk list tab instead.
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

            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Screen results</h2>
                {note ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
              </div>
              <p className="shrink-0 font-mono text-xs text-muted-foreground">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, entries.length)} of {entries.length}
              </p>
            </div>

            <div className="overflow-x-auto rounded-md border border-border bg-surface/90" role="region" aria-label="Screen results table" tabIndex={0}>
              <table className="w-max min-w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel text-left">
                    <th scope="col" className="sticky left-0 z-20 w-10 min-w-10 bg-panel px-2 py-3 font-mono text-[11px] text-muted-foreground">#</th>
                    <th scope="col" className="sticky left-10 z-20 w-48 min-w-48 border-r border-border bg-panel px-2 py-3 text-[11px] font-semibold uppercase text-muted-foreground sm:w-72 sm:min-w-72 sm:px-3">Stock · Shariah status</th>
                    {columns.map((c, i) => (
                      <th scope="col" key={`${c}-${i}`} className="min-w-32 px-4 py-3 text-right text-[11px] font-semibold uppercase leading-snug text-muted-foreground">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleEntries.map((e) => (
                    <tr
                      key={`${e.rank}-${e.input}`}
                      className="group border-b border-border last:border-0"
                    >
                      <td className="sticky left-0 z-10 bg-surface px-2 py-3 align-middle font-mono text-xs text-muted-foreground group-hover:bg-panel">
                        {String(e.rank).padStart(2, "0")}
                      </td>
                      <td className="sticky left-10 z-10 w-48 min-w-48 border-r border-border bg-surface px-2 py-3 align-middle group-hover:bg-panel sm:w-72 sm:min-w-72 sm:px-3">
                        <p className="truncate font-semibold text-foreground" title={e.scannerName ?? e.stock?.company_name ?? e.input}>{e.scannerName ?? e.stock?.company_name ?? e.input}</p>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                          <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground" title={e.input}>{e.input}</span>
                          <StatusPill status={e.status} />
                        </div>
                      </td>
                      {columns.map((c, i) => (
                        <td key={`${c}-${i}`} className="min-w-32 px-4 py-3 text-right align-middle font-mono text-xs tabular-nums text-foreground/80 group-hover:bg-panel">
                          {e.cells?.[i] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 ? (
              <nav className="flex items-center justify-between gap-3" aria-label="Results pages">
                <p className="font-mono text-xs text-muted-foreground">Page {page + 1} of {pageCount}</p>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" aria-label="Previous results page" title="Previous page" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft /></Button>
                  <Button type="button" variant="outline" size="icon" aria-label="Next results page" title="Next page" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}><ChevronRight /></Button>
                </div>
              </nav>
            ) : null}

            <p className="text-xs text-muted-foreground">
              Market figures are shown exactly as the source listed them. Compliance status always comes from the
               current Zamzam AI Capital stock list — stocks not in it are shown as Not Available, never estimated.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
