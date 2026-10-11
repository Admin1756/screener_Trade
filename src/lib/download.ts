import * as XLSX from "xlsx";
import { STATUS_LABEL, type ComplianceStatus } from "./stocks";
import type { BulkEntry } from "./bulk";

function safeName(part: string) {
  return part.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 40);
}

function buildRows(entries: BulkEntry[], columns: string[]) {
  const header = ["#", "Stock", "Symbol", "Shariah status", ...columns];
  const rows = entries.map((e) => [
    e.rank,
    e.scannerName ?? e.stock?.company_name ?? e.input,
    e.input,
    STATUS_LABEL[e.status as ComplianceStatus] ?? e.status,
    ...(columns.map((_, i) => e.cells?.[i] ?? "") ?? []),
  ]);
  return [header, ...rows];
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadResults(
  format: "xlsx" | "csv",
  entries: BulkEntry[],
  columns: string[],
  source: string,
) {
  if (!entries.length) return;
  const rows = buildRows(entries, columns);
  const date = new Date().toISOString().slice(0, 10);
  const base = `zamzam-${safeName(source)}-${date}`;

  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.aoa_to_sheet(rows));
    triggerDownload(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }), `${base}.csv`);
    return;
  }

  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 5 },
    { wch: 32 },
    { wch: 14 },
    { wch: 16 },
    ...columns.map(() => ({ wch: 14 })),
  ];
  sheet["!freeze"] = { xSplit: 0, ySplit: 1 };
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Screen results");
  const out = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  triggerDownload(
    new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${base}.xlsx`,
  );
}
