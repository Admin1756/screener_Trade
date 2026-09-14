import { supabase } from "@/integrations/supabase/client";

export type ComplianceStatus =
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "UNDER_REVIEW"
  | "NOT_AVAILABLE";

export type StockRecord = {
  id: string;
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

const SELECT_COLUMNS =
  "id, company_name, symbol, nse_symbol, bse_symbol, exchange, charting_symbol, price, price_display, currency, status, compliance_date, record_updated_at, business_activity_status, financial_screening_status, notes, source";

export const STATUS_LABEL: Record<ComplianceStatus, string> = {
  COMPLIANT: "Compliant",
  NON_COMPLIANT: "Non-Compliant",
  UNDER_REVIEW: "Under Review",
  NOT_AVAILABLE: "Not Available",
};

/** Escape PostgREST `or()` filter values. */
function esc(value: string) {
  return value.replace(/[,()%*]/g, " ").trim();
}

export async function searchStocks(term: string, limit = 8): Promise<StockRecord[]> {
  const q = esc(term);
  if (q.length < 1) return [];
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from("stocks")
    .select(SELECT_COLUMNS)
    .or(
      `symbol.ilike.${like},company_name.ilike.${like},nse_symbol.ilike.${like},bse_symbol.ilike.${like}`,
    )
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as StockRecord[];
}

/** Exact-first lookup: symbol / NSE / BSE, then best partial company match. */
export async function lookupStock(term: string): Promise<StockRecord | null> {
  const q = esc(term);
  if (!q) return null;
  const { data: exact, error: exactError } = await supabase
    .from("stocks")
    .select(SELECT_COLUMNS)
    .or(`symbol.ilike.${q},nse_symbol.ilike.${q},bse_symbol.ilike.${q},charting_symbol.ilike.${q}`)
    .limit(1);
  if (exactError) throw exactError;
  if (exact && exact.length > 0) return exact[0] as StockRecord;

  const results = await searchStocks(q, 1);
  return results[0] ?? null;
}

export type ChartLinkParse =
  | { ok: true; exchange: string | null; symbol: string }
  | { ok: false; reason: string };

/**
 * Reads a ticker out of a charting platform URL.
 * Charting-link support by Zamzam Capital — no affiliation with any platform.
 */
export function parseChartLink(raw: string): ChartLinkParse {
  const value = raw.trim();
  if (!value) return { ok: false, reason: "Enter a link first." };

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return { ok: false, reason: "That does not look like a valid web link." };
  }

  const candidates: string[] = [];
  for (const key of ["symbol", "tvwidgetsymbol", "ticker", "s", "sym"]) {
    const v = url.searchParams.get(key);
    if (v) candidates.push(v);
  }
  const segments = url.pathname.split("/").filter(Boolean);
  candidates.push(...segments.slice(-3));

  for (const candidate of candidates) {
    const cleaned = decodeURIComponent(candidate).replace(/\.(html?|php)$/i, "");
    const match = cleaned.match(/^([A-Za-z]{2,6})[:\-_]([A-Za-z0-9&.\-]{1,25})$/);
    if (match && match[1] && match[2]) {
      return { ok: true, exchange: match[1].toUpperCase(), symbol: match[2].toUpperCase() };
    }
    if (/^[A-Za-z][A-Za-z0-9&.\-]{1,24}$/.test(cleaned) && !/^(chart|symbols|quote|stocks|www|in|en)$/i.test(cleaned)) {
      return { ok: true, exchange: null, symbol: cleaned.toUpperCase() };
    }
  }
  return { ok: false, reason: "No stock symbol could be read from this link." };
}

export async function lookupFromChartLink(link: string) {
  const parsed = parseChartLink(link);
  if (!parsed.ok) return { parsed, stock: null as StockRecord | null };
  const stock = await lookupStock(parsed.symbol);
  return { parsed, stock };
}

export async function getActiveDataset() {
  const { data } = await supabase
    .from("dataset_versions")
    .select("version, published_at, record_count, source_filename")
    .eq("status", "active")
    .maybeSingle();
  return data;
}

export async function getSetting<T = Record<string, string>>(key: string): Promise<T | null> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as T) ?? null;
}

export function formatPrice(stock: StockRecord) {
  if (stock.price_display && stock.price_display.trim()) return stock.price_display.trim();
  if (stock.price === null || stock.price === undefined) return null;
  const currency = (stock.currency ?? "INR").toUpperCase();
  const prefix = currency === "INR" ? "₹" : currency === "USD" ? "$" : `${currency} `;
  return `${prefix}${stock.price}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
