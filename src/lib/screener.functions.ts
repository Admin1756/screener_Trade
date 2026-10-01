import { createServerFn } from "@tanstack/react-start";

export type ScreenerRow = { rank: number; symbol: string; name: string; cells: string[] };
export type ScreenerResult =
  | { ok: true; title: string; columns: string[]; rows: ScreenerRow[] }
  | { ok: false; reason: string };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MAX_PAGES = 40;

function clean(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function screenUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim().startsWith("http") ? raw.trim() : `https://${raw.trim()}`);
    if (!/(^|\.)screener\.in$/i.test(url.hostname)) return null;
    if (!/^\/screens\/\d+/.test(url.pathname)) return null;
    url.protocol = "https:";
    url.hostname = "www.screener.in";
    url.searchParams.delete("page");
    return url;
  } catch {
    return null;
  }
}

function parsePage(html: string) {
  const table = html.match(/<table[^>]*data-table[\s\S]*?<\/table>/)?.[0] ?? "";
  const headerRow = table.match(/<tr>([\s\S]*?)<\/tr>/)?.[1] ?? "";
  const headers = [...headerRow.matchAll(/<th[\s\S]*?<\/th>/g)].map((m) => clean(m[0]));
  const rows: { symbol: string; name: string; cells: string[] }[] = [];
  for (const m of table.matchAll(/<tr data-row-company-id[^>]*>([\s\S]*?)<\/tr>/g)) {
    const tds = [...m[1]!.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((t) => t[1]!);
    const link = m[1]!.match(/href="\/company\/([^/"]+)\//);
    if (!link || tds.length < 2) continue;
    rows.push({
      symbol: decodeURIComponent(link[1]!).toUpperCase(),
      name: clean(tds[1]!),
      cells: tds.slice(2).map(clean),
    });
  }
  const pages = [...html.matchAll(/[?&]page=(\d+)/g)].map((p) => Number(p[1]));
  return { headers, rows, lastPage: pages.length ? Math.max(...pages) : 1 };
}

/** Reads a public Screener.in screen — every column and row, in the screen's own order. */
export const fetchScreenerScreen = createServerFn({ method: "POST" })
  .inputValidator((data: { link: string }) => {
    if (!data || typeof data.link !== "string") throw new Error("A link is required");
    return { link: data.link.slice(0, 500) };
  })
  .handler(async ({ data }): Promise<ScreenerResult> => {
    const base = screenUrl(data.link);
    if (!base) return { ok: false, reason: "That is not a Screener.in screen link (screener.in/screens/...)." };

    const get = async (page: number) => {
      const url = new URL(base);
      if (page > 1) url.searchParams.set("page", String(page));
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, signal: AbortSignal.timeout(25000) });
      if (!res.ok || new URL(res.url).pathname !== base.pathname) throw new Error(String(res.status));
      return res.text();
    };

    let first: string;
    try {
      first = await get(1);
    } catch {
      return { ok: false, reason: "That screen could not be opened. If it requires sign-in, paste its symbols in Bulk list instead." };
    }
    const title = clean(first.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "Screener.in screen");
    const p1 = parsePage(first);
    if (p1.headers.length === 0) {
      return { ok: false, reason: "No results table was found. Private screens require sign-in on Screener.in; paste their symbols in Bulk list instead." };
    }
    const rows = [...p1.rows];
    const last = Math.min(p1.lastPage, MAX_PAGES);
    if (p1.lastPage > MAX_PAGES) return { ok: false, reason: "This screen is too large to read in one request. Paste its symbols in Bulk list instead." };
    try {
      for (let start = 2; start <= last; start += 8) {
        const pages = await Promise.all(Array.from({ length: Math.min(8, last - start + 1) }, (_, i) => get(start + i).then(parsePage)));
        for (const page of pages) {
          if (!page.headers.length) throw new Error("Missing results table");
          rows.push(...page.rows);
        }
      }
    } catch {
      return { ok: false, reason: "Some pages could not be read, so no incomplete results were shown. If this screen needs sign-in, paste its symbols in Bulk list." };
    }

    return {
      ok: true,
      title,
      columns: p1.headers.slice(2),
      rows: rows.map((r, i) => ({ ...r, rank: i + 1 })),
    };
  });
