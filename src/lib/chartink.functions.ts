import { createServerFn } from "@tanstack/react-start";

export type ScanRow = {
  rank: number;
  symbol: string;
  name: string | null;
  bse_code: string | null;
  close: string | null;
  percent_change: string | null;
  volume: string | null;
};

export type ScanResult =
  | { ok: true; slug: string; rows: ScanRow[] }
  | { ok: false; reason: string };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

function slugFromLink(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (!/(^|\.)chartink\.com$/i.test(url.hostname)) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("screener");
  const slug = idx >= 0 ? parts[idx + 1] : parts[parts.length - 1];
  return slug ? decodeURIComponent(slug) : null;
}

function collectCookies(res: Response): string {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  const list = headers.getSetCookie?.() ?? (res.headers.get("set-cookie") ?? "").split(/,(?=[^;]+?=)/);
  return list
    .map((c) => c.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

function firstMatch(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function decodeClause(value: string): string {
  return value
    .replace(/\\u0028/gi, "(")
    .replace(/\\u0029/gi, ")")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\\"/g, '"')
    .replace(/\\\//g, "/")
    .replace(/\\n/g, " ")
    .replace(/\\\\/g, "\\")
    .trim();
}

function readScanJson(html: string): { atlas_query?: string; scan_run_token?: string } | null {
  const raw = html.match(/:scan-json="([\s\S]*?)"\s*(?:\n|>)/)?.[1];
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeClause(raw));
    if (parsed && typeof parsed === "object") return parsed as { atlas_query?: string; scan_run_token?: string };
  } catch {
    // Older Chartink pages may expose only the legacy clause below.
  }
  return null;
}

/**
 * Reads a public Chartink screener and returns its rows in the exact order the
 * scanner produced them (top mover first). Public scan pages only.
 */
export const fetchChartinkScan = createServerFn({ method: "POST" })
  .inputValidator((data: { link: string }) => {
    if (!data || typeof data.link !== "string") throw new Error("A link is required");
    return { link: data.link.slice(0, 500) };
  })
  .handler(async ({ data }): Promise<ScanResult> => {
    const slug = slugFromLink(data.link);
    if (!slug) {
      return { ok: false, reason: "That is not a Chartink screener link." };
    }
    const pageUrl = `https://chartink.com/screener/${encodeURIComponent(slug)}`;

    let page: Response;
    try {
      page = await fetch(pageUrl, { headers: { "user-agent": UA, accept: "text/html" }, signal: AbortSignal.timeout(25000) });
    } catch {
      return { ok: false, reason: "Could not reach the scanner right now." };
    }
    if (!page.ok || new URL(page.url).pathname !== `/screener/${slug}`) {
      return { ok: false, reason: "That scanner could not be opened from this site. If it needs your Chartink sign-in, paste its symbols in Bulk list." };
    }

    const cookies = collectCookies(page);
    const html = await page.text();

    const csrf = firstMatch(html, [
      /<meta name="csrf-token" content="([^"]+)"/i,
      /csrfToken['"]?\s*[:=]\s*['"]([^'"]+)['"]/i,
    ]);
    const xsrf = decodeURIComponent(cookies.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
    const scanJson = readScanJson(html);
    const scanRunToken = typeof scanJson?.scan_run_token === "string" ? scanJson.scan_run_token : null;
    const clauseRaw = scanJson?.atlas_query || firstMatch(html, [
      /&quot;atlas_query&quot;:&quot;([\s\S]*?)&quot;,/,
      /"atlas_query"\s*:\s*"((?:[^"\\]|\\.)*)"/,
      /"scan_clause"\s*:\s*"((?:[^"\\]|\\.)*)"/,
    ]);

    if (!csrf || (!clauseRaw && !scanRunToken)) {
      return {
        ok: false,
        reason: "This scanner's conditions could not be read. If it requires sign-in, paste its symbols in Bulk list instead.",
      };
    }

    let res: Response;
    try {
      const body = new URLSearchParams();
      if (scanRunToken) body.set("scan_run_token", scanRunToken);
      if (clauseRaw) body.set("scan_clause", scanJson?.atlas_query ? clauseRaw : decodeClause(clauseRaw));
      res = await fetch("https://chartink.com/screener/process", {
        method: "POST",
        headers: {
          "user-agent": UA,
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-csrf-token": csrf,
          ...(xsrf ? { "x-xsrf-token": xsrf } : {}),
          "x-requested-with": "XMLHttpRequest",
          accept: "*/*",
          referer: pageUrl,
          origin: "https://chartink.com",
          ...(cookies ? { cookie: cookies } : {}),
        },
        body,
        signal: AbortSignal.timeout(25000),
      });
    } catch {
      return { ok: false, reason: "Could not reach the scanner right now." };
    }

    if (!res.ok) {
      return { ok: false, reason: `The scanner refused the request (${res.status}).` };
    }

    let json: { data?: Record<string, unknown>[] };
    try {
      json = (await res.json()) as { data?: Record<string, unknown>[] };
    } catch {
      return { ok: false, reason: "The scanner returned an unreadable response." };
    }

    const str = (v: unknown) => (v === null || v === undefined || v === "" ? null : String(v));
    const rows: ScanRow[] = (json.data ?? []).map((row, index) => ({
      rank: index + 1,
      symbol: String(row['nsecode'] ?? row['symbol'] ?? "").toUpperCase(),
      name: str(row['name']),
      bse_code: str(row['bsecode']),
      close: str(row['close']),
      percent_change: str(row['per_chg']),
      volume: str(row['volume']),
    }));

    return { ok: true, slug, rows: rows.filter((r) => r.symbol) };
  });
