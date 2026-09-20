import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type WritingCreateInput, type WritingListResponse, type WritingResponse } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export type WritingListFilters = {
  q?: string;
  tag?: string;
  kind?: string;
};

function toQueryString(filters?: WritingListFilters) {
  if (!filters) return "";
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  if (filters.tag) sp.set("tag", filters.tag);
  if (filters.kind) sp.set("kind", filters.kind);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function useWritingList(filters?: WritingListFilters) {
  const input = filters ? api.writing.list.input?.parse(filters) : undefined;
  const key = [api.writing.list.path, input?.q ?? "", input?.tag ?? "", input?.kind ?? ""];

  return useQuery<WritingListResponse>({
    queryKey: key,
    queryFn: async () => {
      const url = `${api.writing.list.path}${toQueryString(input)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch writing");
      const json = await res.json();
      return parseWithLogging(api.writing.list.responses[200], json, "writing.list");
    },
  });
}

export function useWriting(id: number) {
  return useQuery<WritingResponse | null>({
    queryKey: [api.writing.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.writing.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch writing item");
      const json = await res.json();
      return parseWithLogging(api.writing.get.responses[200], json, "writing.get");
    },
  });
}

export function useCreateWriting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: WritingCreateInput) => {
      const validated = api.writing.create.input.parse(data);
      const res = await fetch(api.writing.create.path, {
        method: api.writing.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          const parsed = parseWithLogging(api.writing.create.responses[400], errJson, "writing.create.400");
          throw new Error(parsed.message);
        }
        throw new Error("Failed to create writing item");
      }

      const json = await res.json();
      return parseWithLogging(api.writing.create.responses[201], json, "writing.create.201");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.writing.list.path] });
    },
  });
}
