import { supabase } from "@/integrations/supabase/client";
import type { ComplianceStatus, StockRecord } from "./stocks";

const SELECT_COLUMNS =
  "id, company_name, symbol, nse_symbol, bse_symbol, exchange, charting_symbol, price, price_display, currency, status, compliance_date, record_updated_at, business_activity_status, financial_screening_status, notes, source";

export type BulkEntry = {
  rank: number;
  input: string;
  /** Extra columns kept from a scanner, shown as-is. */
  scannerName?: string | null;
  scannerClose?: string | null;
  scannerChange?: string | null;
  /** Source columns shown exactly as the source listed them. */
  cells?: string[];
  stock: StockRecord | null;
  status: ComplianceStatus | "NOT_AVAILABLE";
};

/** Splits a pasted bulk list (commas, spaces, new lines) into symbols, order kept. */
export function parseSymbolList(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of text.split(/[\s,;|]+/)) {
    const value = piece.trim().replace(/^[^A-Za-z0-9&.-]+|[^A-Za-z0-9&.-]+$/g, "").toUpperCase();
    if (!value || value.length > 30) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

/** Looks up many symbols at once and returns them in the SAME order given. */
export async function lookupMany(symbols: string[]): Promise<Map<string, StockRecord>> {
  const found = new Map<string, StockRecord>();
  const chunkSize = 200;
  for (let i = 0; i < symbols.length; i += chunkSize) {
    const chunk = symbols.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("stocks")
      .select(SELECT_COLUMNS)
      .or(
        `symbol.in.(${chunk.join(",")}),nse_symbol.in.(${chunk.join(",")}),charting_symbol.in.(${chunk.join(",")}),bse_symbol.in.(${chunk.join(",")})`,
      );
    if (error) throw error;
    for (const row of (data ?? []) as StockRecord[]) {
      for (const key of [row.symbol, row.nse_symbol, row.charting_symbol, row.bse_symbol]) {
        if (key) found.set(key.toUpperCase(), row);
      }
    }
  }
  return found;
}

export async function checkBulk(
  items: { symbol: string; name?: string | null; close?: string | null; change?: string | null; cells?: string[] }[],
): Promise<BulkEntry[]> {
  const map = await lookupMany(items.map((i) => i.symbol));
  return items.map((item, index) => {
    const stock = map.get(item.symbol.toUpperCase()) ?? null;
    return {
      rank: index + 1,
      input: item.symbol,
      scannerName: item.name ?? null,
      scannerClose: item.close ?? null,
      scannerChange: item.change ?? null,
      cells: item.cells,
      stock,
      status: stock?.status ?? "NOT_AVAILABLE",
    };
  });
}

export function summarise(entries: BulkEntry[]) {
  return {
    total: entries.length,
    compliant: entries.filter((e) => e.status === "COMPLIANT").length,
    nonCompliant: entries.filter((e) => e.status === "NON_COMPLIANT").length,
    underReview: entries.filter((e) => e.status === "UNDER_REVIEW").length,
    notAvailable: entries.filter((e) => e.status === "NOT_AVAILABLE").length,
  };
}
