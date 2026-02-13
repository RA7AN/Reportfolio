import { z } from "zod";
import {
  insertWritingSchema,
  insertCertificateSchema,
  type GetPortfolioResponse,
  type GetWritingListResponse,
  type GetWritingResponse,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  portfolio: {
    get: {
      method: "GET" as const,
      path: "/api/portfolio" as const,
      responses: {
        200: z.custom<GetPortfolioResponse>(),
      },
    },
  },
  writing: {
    list: {
      method: "GET" as const,
      path: "/api/writing" as const,
      input: z
        .object({
          q: z.string().optional(),
          tag: z.string().optional(),
          kind: z.string().optional(),
        })
        .optional(),
      responses: {
        200: z.custom<GetWritingListResponse>(),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/writing/:id" as const,
      responses: {
        200: z.custom<GetWritingResponse>(),
        404: errorSchemas.notFound,
      },
    },
    getBySlug: {
      method: "GET" as const,
      path: "/api/writing/slug/:slug" as const,
      responses: {
        200: z.custom<GetWritingResponse>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/writing" as const,
      input: insertWritingSchema,
      responses: {
        201: z.custom<GetWritingResponse>(),
        400: errorSchemas.validation,
      },
    },
  },
  certificates: {
    list: {
      method: "GET" as const,
      path: "/api/certificates" as const,
      responses: {
        200: z.array(z.any()),
      },
    },  
  },
  featured: {
    get: {
      method: "GET" as const,
      path: "/api/featured" as const,
      responses: {
        200: z.object({
          featuredProjects: z.array(z.string()),
          featuredPublications: z.array(z.string()),
        }),
      },
    },
  },
  github: {
    repositories: {
      method: "GET" as const,
      path: "/api/github/repositories" as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    pinned: {
      method: "GET" as const,
      path: "/api/github/pinned" as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    stats: {
      method: "GET" as const,
      path: "/api/github/stats" as const,
      responses: {
        200: z.object({
          totalRepos: z.number(),
          totalStars: z.number(),
          languages: z.array(z.string()),
        }),
      },
    },
  },
  orcid: {
    publications: {
      method: "GET" as const,
      path: "/api/orcid/publications" as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    stats: {
      method: "GET" as const,
      path: "/api/orcid/stats" as const,
      responses: {
        200: z.object({
          totalPublications: z.number(),
          byType: z.record(z.number()),
          years: z.array(z.string()),
        }),
      },
    },
  },
  rss: {
    sync: {
      method: "POST" as const,
      path: "/api/rss/sync" as const,
      responses: {
        200: z.object({
          success: z.number(),
          errors: z.array(z.string()),
        }),
      },
    },
  },
} as const;

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }
  return url;
}

export type PortfolioResponse = z.infer<typeof api.portfolio.get.responses[200]>;
export type WritingListResponse = z.infer<typeof api.writing.list.responses[200]>;
export type WritingResponse = z.infer<typeof api.writing.get.responses[200]>;
export type WritingCreateInput = z.infer<typeof api.writing.create.input>;
