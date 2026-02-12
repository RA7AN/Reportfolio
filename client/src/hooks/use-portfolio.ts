import { useQuery } from "@tanstack/react-query";
import { api, type PortfolioResponse } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function usePortfolio() {
  return useQuery<PortfolioResponse>({
    queryKey: [api.portfolio.get.path],
    queryFn: async () => {
      const res = await fetch(api.portfolio.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      const json = await res.json();
      return parseWithLogging(api.portfolio.get.responses[200], json, "portfolio.get");
    },
  });
}
