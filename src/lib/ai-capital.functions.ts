import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ComplianceStatus } from "./stocks";

type PublicStock = {
  stock_symbol: string;
  company_name: string;
  compliance_status: string;
};

export type SharedStock = { symbol: string; company_name: string; status: ComplianceStatus };

const statusOf = (value: string): ComplianceStatus => {
  switch (value.toLowerCase()) {
    case "compliant": return "COMPLIANT";
    case "non_compliant": return "NON_COMPLIANT";
    case "under_review": return "UNDER_REVIEW";
    default: return "NOT_AVAILABLE";
  }
};

export const getSharedStocks = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ symbols: z.array(z.string().regex(/^[A-Za-z0-9&.-]{1,30}$/)).max(3000) }).parse(data))
  .handler(async ({ data }): Promise<SharedStock[]> => {
    const { aiCapitalPublicUrl, aiCapitalPublishableKey } = await import("./ai-capital-public.server");
    const symbols = [...new Set(data.symbols.map((s) => s.toUpperCase()))];
    const results: SharedStock[] = [];
    for (let i = 0; i < symbols.length; i += 150) {
      const chunk = symbols.slice(i, i + 150);
      const params = new URLSearchParams({
        select: "stock_symbol,company_name,compliance_status",
        stock_symbol: `in.(${chunk.map((symbol) => `"${symbol}"`).join(",")})`,
        limit: "150",
      });
      const response = await fetch(`${aiCapitalPublicUrl}/rest/v1/stocks?${params}`, {
        headers: { apikey: aiCapitalPublishableKey },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error("The stock database is unavailable. Please try again.");
      const rows = (await response.json()) as PublicStock[];
      for (const row of rows) {
        if (!row.stock_symbol || !row.company_name) continue;
        results.push({ symbol: row.stock_symbol.toUpperCase(), company_name: row.company_name, status: statusOf(row.compliance_status ?? "") });
      }
    }
    return results;
  });