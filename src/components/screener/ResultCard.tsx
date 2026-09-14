import { STATUS_LABEL, formatDate, formatPrice, type StockRecord } from "@/lib/stocks";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  COMPLIANT: "border-success/30 bg-success/10 text-success",
  NON_COMPLIANT: "border-destructive/30 bg-destructive/10 text-destructive",
  UNDER_REVIEW: "border-warning/30 bg-warning/10 text-warning",
  NOT_AVAILABLE: "border-border bg-muted/40 text-muted-foreground",
};

const WHY_TEXT: Record<string, string> = {
  COMPLIANT:
    "This stock currently meets the Shariah screening criteria used by Zamzam Capital, based on the business-activity and financial-screening results recorded in the published dataset.",
  NON_COMPLIANT:
    "This stock does not meet the Shariah screening criteria used by Zamzam Capital, based on the business-activity and financial-screening results recorded in the published dataset.",
  UNDER_REVIEW:
    "This stock is currently marked as under review in the Zamzam Capital dataset. A final classification has not been recorded.",
  NOT_AVAILABLE:
    "No classification is recorded for this stock in the current Zamzam Capital dataset.",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-mono">{label}</p>
      <p className="mt-1 font-mono text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ResultCard({
  stock,
  datasetNote,
}: {
  stock: StockRecord;
  datasetNote?: string | null;
}) {
  const price = formatPrice(stock);
  const status = stock.status ?? "NOT_AVAILABLE";
  const exchange = stock.exchange ?? (stock.nse_symbol ? "NSE" : stock.bse_symbol ? "BSE" : "—");

  return (
    <article className="animate-rise overflow-hidden rounded-2xl border border-border glass">
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <span className="label-mono">Screening Result</span>
        <span className="h-px flex-1 bg-border" />
        <span className="label-mono">{stock.source ? stock.source : "Zamzam Capital dataset"}</span>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">{stock.symbol}</h2>
            <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {exchange}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{stock.company_name}</p>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            <Field label="Reference price" value={price ?? "Not provided"} />
            <Field label="Currency" value={(stock.currency ?? "—").toUpperCase()} />
            <Field label="Compliance date" value={formatDate(stock.compliance_date)} />
            <Field label="Last updated" value={formatDate(stock.record_updated_at)} />
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 rounded-xl border px-6 py-5 text-center",
            STATUS_STYLES[status] ?? STATUS_STYLES["NOT_AVAILABLE"],
          )}
        >
          <p className="label-mono !text-current opacity-80">Shariah Status</p>
          <p className="mt-2 flex items-center justify-center gap-2.5 text-2xl font-bold tracking-tight">
            <span className="animate-status size-2.5 rounded-full bg-current" />
            {STATUS_LABEL[status].toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-3">
        <div className="bg-surface/60 p-4">
          <p className="label-mono">Business activity screening</p>
          <p className="mt-1 text-sm">{stock.business_activity_status || "Not recorded"}</p>
        </div>
        <div className="bg-surface/60 p-4">
          <p className="label-mono">Financial screening</p>
          <p className="mt-1 text-sm">{stock.financial_screening_status || "Not recorded"}</p>
        </div>
        <div className="bg-surface/60 p-4">
          <p className="label-mono">Symbols</p>
          <p className="mt-1 font-mono text-sm">
            {[stock.nse_symbol && `NSE: ${stock.nse_symbol}`, stock.bse_symbol && `BSE: ${stock.bse_symbol}`]
              .filter(Boolean)
              .join(" · ") || stock.symbol}
          </p>
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <p className="text-sm font-medium">Why is this stock classified this way?</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {stock.notes?.trim() ? stock.notes : WHY_TEXT[status]}
        </p>
        {datasetNote ? (
          <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
            {datasetNote}
          </p>
        ) : null}
      </div>
    </article>
  );
}
