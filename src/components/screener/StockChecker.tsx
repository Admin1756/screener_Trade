import { useEffect, useRef, useState } from "react";
import { Link2, Loader2, Search } from "lucide-react";
import { ResultCard } from "./ResultCard";
import {
  getSetting,
  lookupFromChartLink,
  lookupStock,
  searchStocks,
  type StockRecord,
} from "@/lib/stocks";
import { cn } from "@/lib/utils";

type Mode = "search" | "link";
type Phase = "idle" | "analyzing" | "matching" | "checking" | "done" | "empty" | "badlink";

const PHASE_TEXT: Record<string, string> = {
  analyzing: "Analyzing stock…",
  matching: "Matching database…",
  checking: "Checking Shariah status…",
};

function ResultSkeleton({ phase }: { phase: Phase }) {
  return (
    <div className="animate-rise rounded-2xl border border-border glass p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        {PHASE_TEXT[phase]}
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export function StockChecker({ autoFocus = false }: { autoFocus?: boolean }) {
  const [mode, setMode] = useState<Mode>("search");
  const [term, setTerm] = useState("");
  const [link, setLink] = useState("");
  const [suggestions, setSuggestions] = useState<StockRecord[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<StockRecord | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [sourceNote, setSourceNote] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSetting<{ label?: string }>("data_source").then((v) => setSourceNote(v?.label ?? null));
  }, []);

  useEffect(() => {
    if (mode !== "search" || term.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(() => {
      searchStocks(term.trim())
        .then((rows) => {
          if (!cancelled) setSuggestions(rows);
        })
        .catch(() => {
          if (!cancelled) setSuggestions([]);
        });
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [term, mode]);

  async function runStages(load: () => Promise<StockRecord | null>) {
    setResult(null);
    setErrorText(null);
    setShowSuggestions(false);
    setPhase("analyzing");
    const started = Date.now();
    let stock: StockRecord | null = null;
    try {
      setTimeout(() => setPhase((p) => (p === "analyzing" ? "matching" : p)), 260);
      setTimeout(() => setPhase((p) => (p === "matching" ? "checking" : p)), 560);
      stock = await load();
    } catch {
      stock = null;
    }
    const wait = Math.max(0, 820 - (Date.now() - started));
    setTimeout(() => {
      if (stock) {
        setResult(stock);
        setPhase("done");
        requestAnimationFrame(() =>
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        );
      } else {
        setPhase("empty");
      }
    }, wait);
  }

  function handleCheck() {
    if (mode === "search") {
      if (!term.trim()) return;
      void runStages(() => lookupStock(term.trim()));
      return;
    }
    if (!link.trim()) return;
    setErrorText(null);
    void (async () => {
      setPhase("analyzing");
      const { parsed, stock } = await lookupFromChartLink(link);
      if (!parsed.ok) {
        setErrorText(parsed.reason);
        setPhase("badlink");
        return;
      }
      setResult(null);
      void runStages(async () => stock);
    })();
  }

  function pickSuggestion(stock: StockRecord) {
    setTerm(stock.symbol);
    setSuggestions([]);
    setShowSuggestions(false);
    void runStages(async () => stock);
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border glass p-2 shadow-[0_40px_120px_-50px_oklch(0.1_0.02_172)]">
        <div className="flex items-center gap-1 p-1.5">
          <button
            type="button"
            onClick={() => setMode("search")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              mode === "search"
                ? "bg-panel text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Search className="size-3.5" /> Search Stock
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              mode === "link"
                ? "bg-panel text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Link2 className="size-3.5" /> Paste Charting Link
          </button>
        </div>

        <div className="relative rounded-xl border border-border bg-background/50 p-4">
          {mode === "search" ? (
            <>
              <label htmlFor="zz-search" className="label-mono">
                Company / Symbol / NSE / BSE
              </label>
              <input
                id="zz-search"
                autoFocus={autoFocus}
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="e.g. RELIANCE or Reliance Industries"
                className="mt-2 w-full bg-transparent text-lg font-medium tracking-tight placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {showSuggestions && suggestions.length > 0 ? (
                <ul className="absolute inset-x-4 top-[86px] z-20 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors hover:bg-panel"
                      >
                        <span className="font-mono text-sm">{s.symbol}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {s.company_name} · {s.exchange ?? "—"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <>
              <label htmlFor="zz-link" className="label-mono">
                Charting platform link
              </label>
              <input
                id="zz-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="Paste your charting platform link here..."
                className="mt-2 w-full bg-transparent text-base tracking-tight placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </>
          )}

          <button
            type="button"
            onClick={handleCheck}
            className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {mode === "search" ? "Check Compliance" : "Analyze Stock"}
          </button>
          <p className="label-mono mt-3 text-center">
            {mode === "search"
              ? "Fast • Simple • Shariah-Focused"
              : "Charting-link support by Zamzam Capital"}
          </p>
        </div>
      </div>

      <div ref={resultRef} className="mt-6">
        {phase === "analyzing" || phase === "matching" || phase === "checking" ? (
          <ResultSkeleton phase={phase} />
        ) : null}

        {phase === "done" && result ? (
          <>
            <ResultCard stock={result} datasetNote={sourceNote} />
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setResult(null);
                setTerm("");
                setLink("");
              }}
              className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Search another stock
            </button>
          </>
        ) : null}

        {phase === "empty" ? (
          <div className="animate-rise rounded-2xl border border-border glass p-6">
            <h3 className="text-lg font-semibold">Stock Not Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn&apos;t find this stock in the current Zamzam Capital database. Its status is
              recorded as <span className="font-mono text-foreground">NOT AVAILABLE</span> rather
              than estimated.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>· Company name</li>
              <li>· Stock symbol</li>
              <li>· NSE symbol</li>
              <li>· BSE symbol</li>
            </ul>
          </div>
        ) : null}

        {phase === "badlink" ? (
          <div className="animate-rise rounded-2xl border border-border glass p-6">
            <h3 className="text-lg font-semibold">Unable to Read Link</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn&apos;t identify a supported stock from this link. Please enter the stock
              symbol manually.
            </p>
            {errorText ? (
              <p className="mt-3 font-mono text-xs text-muted-foreground">{errorText}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
