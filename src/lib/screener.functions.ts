import { createServerFn } from "@tanstack/react-start";

export type ScreenerRow = { rank: number; symbol: string; name: string; cells: string[] };
export type ScreenerResult =
  | { ok: true; title: string; columns: string[]; rows: ScreenerRow[] }
  | { ok: false; reason: string };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MAX_PAGES = 120;

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
    const trimmed = raw.trim();
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/\//, "")}`);
    if (!/(^|\.)screener\.in$/i.test(url.hostname)) return null;
    if (!/^\/screens\/\d+\/[^/]+\/?$/.test(url.pathname)) return null;
    url.protocol = "https:";
    url.hostname = "www.screener.in";
    if (!url.pathname.endsWith("/")) url.pathname += "/";
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
  // Screener.in only displays a *window* of page numbers, not the final page.
  // The Next link is the reliable indication that more results exist.
  const pager = html.match(/<div data-paging="true">([\s\S]*?)<\/div>\s*<\/div>/)?.[1] ?? "";
  const nextPage = [...pager.matchAll(/<a\b[^>]*href="[^"]*[?&]page=(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)]
    .find((match) => /\bNext\b/i.test(clean(match[2] ?? "")));
  return { headers, rows, nextPage: nextPage ? Number(nextPage[1]) : null };
}

/** Reads a public Screener.in screen — every column and row, in the screen's own order. */
export const fetchScreenerScreen = createServerFn({ method: "POST" })
  .validator((data: { link: string }) => {
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
       if (!res.ok || new URL(res.url).pathname.replace(/\/$/, "") !== base.pathname.replace(/\/$/, "")) throw new Error(String(res.status));
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
    try {
      let next = p1.nextPage;
      for (let count = 1; next && count < MAX_PAGES; count++) {
        const page = parsePage(await get(next));
        if (!page.headers.length || page.headers.join("|") !== p1.headers.join("|")) throw new Error("Missing or changed results table");
        rows.push(...page.rows);
        if (rows.length > 3000) return { ok: false, reason: "This screen has more than 3,000 stocks. Paste a smaller screen or its symbols in Bulk list." };
        if (page.nextPage && page.nextPage <= next) throw new Error("Invalid pagination");
        next = page.nextPage;
      }
      if (next) return { ok: false, reason: "This screen is too large to read in one request. Paste its symbols in Bulk list instead." };
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
