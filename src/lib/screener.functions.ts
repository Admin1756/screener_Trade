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
    // Share links may carry tracking or a page/limit choice; read the full
    // public screen from its default first page instead.
    url.search = "";
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
  const pager = html.match(/<div data-paging="true">([\s\S]*?)<\/div>\s*<\/div>/)?.[1] ?? "";
  const pages = [...pager.replace(/&amp;/g, "&").matchAll(/<a\b[^>]*href="[^"]*[?&]page=(\d+)[^"]*"/g)].map((match) => Number(match[1]));
  return { headers, rows, lastPage: Math.max(1, ...pages) };
}

function readCookies(res: Response, jar: Map<string, string>) {
  const list = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [res.headers.get("set-cookie") ?? ""];
  for (const c of list) {
    const m = c.match(/^\s*([^=;\s]+)=([^;]*)/);
    if (m) jar.set(m[1]!, m[2]!);
  }
}

/** Signs in with the site owner's Screener.in account (if configured) so private screens can be read. */
async function screenerLogin(): Promise<string | null> {
  const email = process.env["SCREENER_EMAIL"];
  const password = process.env["SCREENER_PASSWORD"];
  if (!email || !password) return null;
  try {
    const jar = new Map<string, string>();
    const loginUrl = "https://www.screener.in/login/";
    const page = await fetch(loginUrl, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(20000) });
    readCookies(page, jar);
    const html = await page.text();
    const token = html.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/)?.[1] ?? jar.get("csrftoken");
    if (!token) return null;
    const res = await fetch(loginUrl, {
      method: "POST",
      redirect: "manual",
      headers: {
        "user-agent": UA,
        "content-type": "application/x-www-form-urlencoded",
        referer: loginUrl,
        origin: "https://www.screener.in",
        cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "),
      },
      body: new URLSearchParams({ csrfmiddlewaretoken: token, username: email, password }),
      signal: AbortSignal.timeout(20000),
    });
    readCookies(res, jar);
    if (!jar.get("sessionid")) return null;
    return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  } catch {
    return null;
  }
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

    const cookie = await screenerLogin();
    const get = async (page: number) => {
      const url = new URL(base);
      if (page > 1) url.searchParams.set("page", String(page));
      let res: Response | undefined;
      for (let attempt = 0; attempt < 4; attempt++) {
        res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml", "accept-language": "en-US,en;q=0.9", ...(cookie ? { cookie } : {}) }, signal: AbortSignal.timeout(25000) });
        if (res.status !== 429) break;
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
      if (!res) throw new Error("no response");
      if (res.status === 429) throw new Error("rate-limited");
       if (!res.ok || new URL(res.url).pathname.replace(/\/$/, "") !== base.pathname.replace(/\/$/, "")) throw new Error(String(res.status));
      return res.text();
    };

    let first: string;
    try {
      first = await get(1);
    } catch (error) {
      return { ok: false, reason: error instanceof Error && error.message === "rate-limited" ? "Screener.in is limiting requests right now. Please try again later." : "That screen could not be opened. If it requires sign-in, paste its symbols in Bulk list instead." };
    }
    const title = clean(first.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "Screener.in screen");
    const p1 = parsePage(first);
    if (p1.headers.length === 0) {
      return { ok: false, reason: "No results table was found. Private screens require sign-in on Screener.in; paste their symbols in Bulk list instead." };
    }
    const rows = [...p1.rows];
    if (p1.lastPage > MAX_PAGES) return { ok: false, reason: "This screen is too large to read in one request. Paste its symbols in Bulk list instead." };
    try {
      for (let start = 2; start <= p1.lastPage; start += 3) {
        const pages = await Promise.all(Array.from({ length: Math.min(3, p1.lastPage - start + 1) }, (_, i) => get(start + i).then(parsePage)));
        for (const page of pages) {
          if (!page.headers.length || page.headers.join("|") !== p1.headers.join("|")) throw new Error("Missing or changed results table");
          rows.push(...page.rows);
        }
        if (rows.length > 3000) return { ok: false, reason: "This screen has more than 3,000 stocks. Paste a smaller screen or its symbols in Bulk list." };
      }
    } catch (error) {
      return { ok: false, reason: error instanceof Error && error.message === "rate-limited" ? "Screener.in is limiting requests for this screen. No incomplete results were shown; please try again later." : "Some pages could not be read, so no incomplete results were shown. If this screen needs sign-in, paste its symbols in Bulk list." };
    }

    return {
      ok: true,
      title,
      columns: p1.headers.slice(2),
      rows: rows.map((r, i) => ({ ...r, rank: i + 1 })),
    };
  });
