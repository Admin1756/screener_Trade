import { createServerFn } from "@tanstack/react-start";

export type ScreenerRow = { rank: number; symbol: string; name: string; cells: string[] };
export type ScreenerResult =
  | { ok: true; title: string; columns: string[]; rows: ScreenerRow[] }
  | { ok: false; reason: string };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MAX_PAGES = 10;

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
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" } });
      if (!res.ok) throw new Error(String(res.status));
      return res.text();
    };

    let first: string;
    try {
      first = await get(1);
    } catch {
      return { ok: false, reason: "That screen could not be opened. Is it public?" };
    }
    const title = clean(first.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "Screener.in screen");
    const p1 = parsePage(first);
    if (p1.headers.length === 0) {
      return { ok: false, reason: "No results table was found on this screen. Only public screens work." };
    }
    const rows = [...p1.rows];
    const last = Math.min(p1.lastPage, MAX_PAGES);
    const rest = await Promise.all(
      Array.from({ length: last - 1 }, (_, i) => get(i + 2).then(parsePage).catch(() => null)),
    );
    for (const p of rest) if (p) rows.push(...p.rows);

    return {
      ok: true,
      title,
      columns: p1.headers.slice(2),
      rows: rows.map((r, i) => ({ ...r, rank: i + 1 })),
    };
  });
