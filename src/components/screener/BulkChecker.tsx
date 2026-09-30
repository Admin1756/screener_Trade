import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, LineChart, ListChecks, Loader2 } from "lucide-react";
import { fetchChartinkScan } from "@/lib/chartink.functions";
import { fetchScreenerScreen } from "@/lib/screener.functions";
import { checkBulk, parseSymbolList, summarise, type BulkEntry } from "@/lib/bulk";
import { STATUS_LABEL, type ComplianceStatus } from "@/lib/stocks";
import { cn } from "@/lib/utils";

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

function StatusPill({ status }: { status: ComplianceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide ring-1",
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
  const [mode, setMode] = useState<Mode>("chartink");
  const [link, setLink] = useState("");
  const [list, setList] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<BulkEntry[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function run() {
    setError(null);
    setEntries(null);
    setNote(null);
    setBusy(true);
    try {
      if (mode === "chartink") {
        if (!link.trim()) return;
        setStage("Reading Chartink scanner…");
        const r = await runChartink({ data: { link: link.trim() } });
        if (!r.ok) return setError(r.reason);
        if (!r.rows.length) return setError("That scanner returned no stocks right now.");
        setStage("Checking Shariah status…");
        setColumns(["BSE Code", "Close", "% Chg", "Volume"]);
        setEntries(
          await checkBulk(
            r.rows.map((row) => ({
              symbol: row.symbol,
              name: row.name,
              cells: [row.bse_code ?? "—", row.close ?? "—", row.percent_change ?? "—", row.volume ?? "—"],
            })),
          ),
        );
        setNote(`Chartink · ${r.slug} — order kept exactly as the scanner returned it (top mover first).`);
        return;
      }
      if (mode === "screener") {
        if (!link.trim()) return;
        setStage("Reading Screener.in screen…");
        const r = await runScreener({ data: { link: link.trim() } });
        if (!r.ok) return setError(r.reason);
        if (!r.rows.length) return setError("That screen returned no stocks right now.");
        setStage("Checking Shariah status…");
        setColumns(r.columns);
        setEntries(await checkBulk(r.rows.map((row) => ({ symbol: row.symbol, name: row.name, cells: row.cells }))));
        setNote(`Screener.in · ${r.title} — columns and order exactly as listed on the screen.`);
        return;
      }
      const symbols = parseSymbolList(list);
      if (!symbols.length) return setError("Paste at least one stock symbol.");
      setStage("Checking Shariah status…");
      setColumns([]);
      setEntries(await checkBulk(symbols.map((symbol) => ({ symbol }))));
      setNote(`${symbols.length} symbols checked in the order you pasted them.`);
    } catch {
      setError("Something went wrong while checking these stocks. Please try again.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }

  const stats = entries ? summarise(entries) : null;
  const placeholder =
    mode === "chartink" ? "https://chartink.com/screener/..." : "https://www.screener.in/screens/...";

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border glass p-2">
        <div className="grid grid-cols-3 gap-1 p-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
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
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-4">
          {mode !== "list" ? (
            <>
              <label htmlFor="zz-scan" className="label-mono">
                {mode === "chartink" ? "Public Chartink scanner link" : "Public Screener.in screen link"}
              </label>
              <input
                id="zz-scan"
                value={link}
                onChange={(e) => setLink(e.target.value)}
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

          <button
            type="button"
            disabled={busy}
            onClick={() => void run()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {busy ? stage || "Working…" : mode === "list" ? "Check List" : "Analyze & Check Compliance"}
          </button>
          <p className="label-mono mt-3 text-center">Link support by Zamzam Capital · order preserved</p>
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

            {note ? <p className="label-mono">{note}</p> : null}

            <div className="overflow-x-auto rounded-2xl border border-border glass">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="label-mono sticky left-0 bg-surface px-4 py-2.5">#</th>
                    <th className="label-mono sticky left-10 bg-surface px-4 py-2.5">Stock</th>
                    <th className="label-mono px-4 py-2.5">Shariah</th>
                    {columns.map((c) => (
                      <th key={c} className="label-mono whitespace-nowrap px-4 py-2.5 text-right">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr
                      key={`${e.rank}-${e.input}`}
                      className="border-b border-border transition-colors last:border-0 hover:bg-panel/60"
                    >
                      <td className="sticky left-0 bg-surface/95 px-4 py-3 font-mono text-xs text-muted-foreground">
                        {e.rank}
                      </td>
                      <td className="sticky left-10 max-w-[16rem] bg-surface/95 px-4 py-3">
                        <p className="truncate font-medium">{e.scannerName ?? e.stock?.company_name ?? e.input}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{e.input}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={e.status} />
                      </td>
                      {columns.map((c, i) => (
                        <td key={c} className="whitespace-nowrap px-4 py-3 text-right font-mono text-muted-foreground">
                          {e.cells?.[i] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground">
              Market figures are shown exactly as the source listed them. Compliance status always comes from the
              current Zamzam Capital database — stocks not in it are shown as Not Available, never estimated.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
