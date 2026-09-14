import * as XLSX from "xlsx";
import Papa from "papaparse";
import type { ComplianceStatus } from "./stocks";

export const FIELDS = [
  "company_name",
  "symbol",
  "nse_symbol",
  "bse_symbol",
  "exchange",
  "charting_symbol",
  "price",
  "currency",
  "status",
  "compliance_date",
  "record_updated_at",
  "business_activity_status",
  "financial_screening_status",
  "notes",
  "source",
] as const;

export type Field = (typeof FIELDS)[number];

export const FIELD_LABEL: Record<Field, string> = {
  company_name: "Company Name",
  symbol: "Symbol",
  nse_symbol: "NSE Symbol",
  bse_symbol: "BSE Symbol",
  exchange: "Exchange",
  charting_symbol: "Charting Symbol",
  price: "Price",
  currency: "Currency",
  status: "Compliance Status",
  compliance_date: "Compliance Date",
  record_updated_at: "Last Updated",
  business_activity_status: "Business Activity Status",
  financial_screening_status: "Financial Screening Status",
  notes: "Notes",
  source: "Source",
};

export const REQUIRED_FIELDS: Field[] = ["company_name", "symbol", "status"];

/** Header aliases used for automatic column detection. */
const ALIASES: Record<Field, string[]> = {
  company_name: ["company name", "company", "name", "companyname", "stock name", "security name"],
  symbol: ["symbol", "ticker", "stock symbol", "code", "scrip", "tradingsymbol"],
  nse_symbol: ["nse symbol", "nse", "nse code", "nsesymbol"],
  bse_symbol: ["bse symbol", "bse", "bse code", "bsesymbol", "scrip code"],
  exchange: ["exchange", "listed on", "market"],
  charting_symbol: ["charting symbol", "chart symbol", "tv symbol", "tradingview symbol"],
  price: ["price", "market price", "ltp", "close", "cmp", "reference price"],
  currency: ["currency", "ccy"],
  status: ["compliance status", "status", "shariah status", "shariah", "compliance", "halal"],
  compliance_date: ["compliance date", "screening date", "as of", "date"],
  record_updated_at: ["last updated", "updated", "updated at", "last update"],
  business_activity_status: ["business activity status", "business activity", "activity screen", "business screen"],
  financial_screening_status: ["financial screening status", "financial screening", "financial screen", "ratio screen"],
  notes: ["notes", "note", "reason", "remarks", "comment", "explanation"],
  source: ["source", "data source", "provider"],
};

export type RawRow = Record<string, unknown>;

export type ParsedFile = {
  headers: string[];
  rows: RawRow[];
};

export async function parseFile(file: File): Promise<ParsedFile> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) {
    const text = await file.text();
    const out = Papa.parse<RawRow>(text, { header: true, skipEmptyLines: true });
    const headers = (out.meta.fields ?? []).map((h) => h.trim());
    return { headers, rows: out.data as RawRow[] };
  }
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return { headers: [], rows: [] };
  const sheet = wb.Sheets[sheetName]!;
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "", raw: false });
  const headerRow = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, range: 0 })[0] ?? [];
  const headers = headerRow.map((h) => String(h ?? "").trim()).filter(Boolean);
  return { headers, rows };
}

const norm = (s: string) => s.toLowerCase().replace(/[_\-.]+/g, " ").replace(/\s+/g, " ").trim();

export function autoMap(headers: string[]): Partial<Record<Field, string>> {
  const map: Partial<Record<Field, string>> = {};
  const used = new Set<string>();
  for (const field of FIELDS) {
    const candidates = ALIASES[field];
    const hit =
      headers.find((h) => !used.has(h) && candidates.includes(norm(h))) ??
      headers.find((h) => !used.has(h) && candidates.some((c) => norm(h).includes(c)));
    if (hit) {
      map[field] = hit;
      used.add(hit);
    }
  }
  return map;
}

export function normalizeStatus(value: unknown): ComplianceStatus | null {
  const v = String(value ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (!v) return null;
  if (["compliant", "halal", "pass", "yes", "permissible", "shariahcompliant"].includes(v)) {
    return "COMPLIANT";
  }
  if (
    ["noncompliant", "haram", "fail", "no", "notcompliant", "nonhalal", "impermissible"].includes(v)
  ) {
    return "NON_COMPLIANT";
  }
  if (["underreview", "review", "pending", "doubtful", "mashbooh", "unclear"].includes(v)) {
    return "UNDER_REVIEW";
  }
  if (["notavailable", "na", "unknown", "none"].includes(v)) return "NOT_AVAILABLE";
  return null;
}

function toISODate(value: unknown): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2]!.padStart(2, "0")}-${dmy[1]!.padStart(2, "0")}`;
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export type StockInsert = {
  company_name: string;
  symbol: string;
  nse_symbol: string | null;
  bse_symbol: string | null;
  exchange: string | null;
  charting_symbol: string | null;
  price: number | null;
  price_display: string | null;
  currency: string | null;
  status: ComplianceStatus;
  compliance_date: string | null;
  record_updated_at: string | null;
  business_activity_status: string | null;
  financial_screening_status: string | null;
  notes: string | null;
  source: string | null;
};

export type ValidationIssue = { row: number; message: string; level: "error" | "warning" };

export type ValidationResult = {
  records: StockInsert[];
  issues: ValidationIssue[];
  totalRows: number;
  validRows: number;
  errorCount: number;
  warningCount: number;
  duplicateCount: number;
};

export function validateRows(
  rows: RawRow[],
  mapping: Partial<Record<Field, string>>,
): ValidationResult {
  const records: StockInsert[] = [];
  const issues: ValidationIssue[] = [];
  const seen = new Map<string, number>();
  let duplicateCount = 0;

  const pick = (row: RawRow, field: Field): string => {
    const key = mapping[field];
    if (!key) return "";
    const value = row[key];
    return value === null || value === undefined ? "" : String(value).trim();
  };

  rows.forEach((row, index) => {
    const lineNo = index + 2;
    const company = pick(row, "company_name");
    const symbol = pick(row, "symbol").toUpperCase();
    const statusRaw = pick(row, "status");

    if (!company && !symbol && !statusRaw) return; // fully blank line

    let rowHasError = false;
    if (!company) {
      issues.push({ row: lineNo, message: "Missing company name", level: "error" });
      rowHasError = true;
    }
    if (!symbol) {
      issues.push({ row: lineNo, message: "Missing symbol", level: "error" });
      rowHasError = true;
    }
    const status = normalizeStatus(statusRaw);
    if (!status) {
      issues.push({
        row: lineNo,
        message: statusRaw
          ? `Unrecognised compliance status "${statusRaw}"`
          : "Missing compliance status",
        level: "error",
      });
      rowHasError = true;
    }

    const key = symbol || company.toUpperCase();
    if (key) {
      const first = seen.get(key);
      if (first) {
        duplicateCount += 1;
        issues.push({
          row: lineNo,
          message: `Duplicate of "${key}" first seen on row ${first} — the later row wins`,
          level: "warning",
        });
      } else {
        seen.set(key, lineNo);
      }
    }

    if (rowHasError || !status) return;

    const priceDisplay = pick(row, "price");
    const priceNumber = priceDisplay ? Number(priceDisplay.replace(/[^0-9.\-]/g, "")) : Number.NaN;
    if (priceDisplay && Number.isNaN(priceNumber)) {
      issues.push({ row: lineNo, message: `Price "${priceDisplay}" is not numeric`, level: "warning" });
    }

    records.push({
      company_name: company,
      symbol,
      nse_symbol: pick(row, "nse_symbol") || null,
      bse_symbol: pick(row, "bse_symbol") || null,
      exchange: pick(row, "exchange") || null,
      charting_symbol: pick(row, "charting_symbol") || null,
      price: Number.isNaN(priceNumber) ? null : priceNumber,
      price_display: priceDisplay || null,
      currency: pick(row, "currency") || null,
      status,
      compliance_date: toISODate(pick(row, "compliance_date")),
      record_updated_at: toISODate(pick(row, "record_updated_at")),
      business_activity_status: pick(row, "business_activity_status") || null,
      financial_screening_status: pick(row, "financial_screening_status") || null,
      notes: pick(row, "notes") || null,
      source: pick(row, "source") || null,
    });
  });

  // Last row wins for duplicates.
  const deduped = new Map<string, StockInsert>();
  for (const record of records) deduped.set(record.symbol, record);

  const errorCount = issues.filter((i) => i.level === "error").length;
  const warningCount = issues.filter((i) => i.level === "warning").length;

  return {
    records: [...deduped.values()],
    issues,
    totalRows: rows.length,
    validRows: deduped.size,
    errorCount,
    warningCount,
    duplicateCount,
  };
}
