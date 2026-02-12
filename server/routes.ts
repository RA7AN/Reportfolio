import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api, errorSchemas } from "@shared/routes";
import { storage } from "./github-storage";
import { RSSService } from "./rss-service";
import { GitHubService } from "./github-service";
import { ORCIDService } from "./orcid-service";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // No database seeding needed - content comes from markdown files

  app.get(api.portfolio.get.path, async (_req, res) => {
    try {
      const data = await storage.getPortfolio();
      res.json(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ message: "Failed to load portfolio data" });
    }
  });

  app.get(api.writing.list.path, async (req, res) => {
    try {
      const input = api.writing.list.input?.safeParse(req.query);
      const params = input?.success ? input.data : undefined;
      const list = await storage.getWritingList(params);
      res.json(list);
    } catch (error) {
      console.error('Error fetching writing list:', error);
      res.status(500).json({ message: "Failed to load writing list" });
    }
  });

  app.get(api.writing.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(404).json({ message: "Not found" });
      }

      const item = await storage.getWriting(id);
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }

      res.json(item);
    } catch (error) {
      console.error('Error fetching writing:', error);
      res.status(500).json({ message: "Failed to load writing" });
    }
  });

  app.post(api.writing.create.path, async (req, res) => {
    try {
      const body = api.writing.create.input.parse(req.body);
      const created = await storage.createWriting(body);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      if (err instanceof Error && err.message.includes('not supported with GitHub CMS')) {
        return res.status(501).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.writing.getBySlug.path, async (req, res) => {
    try {
      const item = await storage.getWritingBySlug(req.params.slug);
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching writing by slug:', error);
      res.status(500).json({ message: "Failed to load writing" });
    }
  });

  app.get(api.certificates.list.path, async (_req, res) => {
    try {
      const data = await storage.getPortfolio();
      res.json(data.certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ message: "Failed to load certificates" });
    }
  });

  // RSS sync endpoint
  app.post(api.rss.sync.path, async (_req, res) => {
    try {
      const result = await RSSService.syncRSSOnDemand();
      res.json(result);
    } catch (error) {
      console.error('RSS sync failed:', error);
      res.status(500).json({ message: "RSS sync failed" });
    }
  });

  // GitHub API endpoints
  app.get(api.github.repositories.path, async (_req, res) => {
    try {
      const repositories = await GitHubService.getTopRepositories(20);
      res.json(repositories);
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  app.get(api.github.pinned.path, async (_req, res) => {
    try {
      const pinned = await GitHubService.getPinnedRepositories();
      res.json(pinned);
    } catch (error) {
      console.error('Failed to fetch pinned repositories:', error);
      res.status(500).json({ message: "Failed to fetch pinned repositories" });
    }
  });

  app.get(api.github.stats.path, async (_req, res) => {
    try {
      const stats = await GitHubService.getRepositoryStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
      res.status(500).json({ message: "Failed to fetch GitHub stats" });
    }
  });

  // ORCID API endpoints
  app.get(api.orcid.publications.path, async (_req, res) => {
    try {
      const publications = await ORCIDService.fetchORCIDPublications();
      res.json(publications);
    } catch (error) {
      console.error('Failed to fetch ORCID publications:', error);
      res.status(500).json({ message: "Failed to fetch ORCID publications" });
    }
  });

  app.get(api.orcid.stats.path, async (_req, res) => {
    try {
      const stats = await ORCIDService.getPublicationStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to fetch ORCID stats:', error);
      res.status(500).json({ message: "Failed to fetch ORCID stats" });
    }
  });

  // Basic error handler response shape consistency
  app.use((err: unknown, _req: unknown, res: any, _next: any) => {
    console.error(err);
    res.status(500).json(errorSchemas.internal.parse({ message: "Internal error" }));
  });

  return httpServer;
}