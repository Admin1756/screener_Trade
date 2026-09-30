import type { ComplianceStatus } from "./stocks";
import type { SharedStock } from "./ai-capital.functions";

export type BulkEntry = {
  rank: number;
  input: string;
  /** Extra columns kept from a scanner, shown as-is. */
  scannerName?: string | null;
  scannerClose?: string | null;
  scannerChange?: string | null;
  /** Source columns shown exactly as the source listed them. */
  cells?: string[] | undefined;
  stock: SharedStock | null;
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

/** Match source symbols to the live AI Capital rows without changing source order. */
export function checkBulk(
  items: { symbol: string; name?: string | null; close?: string | null; change?: string | null; cells?: string[] | undefined }[],
  stocks: SharedStock[],
): BulkEntry[] {
  const map = new Map(stocks.map((stock) => [stock.symbol.toUpperCase(), stock]));
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
