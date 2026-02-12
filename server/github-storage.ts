import {
  type GetPortfolioResponse,
  type GetWritingListResponse,
  type GetWritingResponse,
  type InsertWriting,
  type WritingListItem,
} from "@shared/schema";
import { GitHubCMS } from "./github-cms";

export interface IStorage {
  getPortfolio(): Promise<GetPortfolioResponse>;

  getWritingList(params?: {
    q?: string;
    tag?: string;
    kind?: string;
  }): Promise<GetWritingListResponse>;

  getWriting(id: number): Promise<GetWritingResponse | undefined>;
  getWritingBySlug(slug: string): Promise<GetWritingResponse | undefined>;

  createWriting(input: InsertWriting): Promise<GetWritingResponse>;
}

export class GitHubCMSStorage implements IStorage {
  private cms = GitHubCMS.getInstance();

  async getPortfolio(): Promise<GetPortfolioResponse> {
    try {
      return this.cms.getPortfolioData();
    } catch (error) {
      console.error('Error fetching portfolio data from GitHub CMS:', error);
      throw new Error('Failed to load portfolio data');
    }
  }

  async getWritingList(params?: {
    q?: string;
    tag?: string;
    kind?: string;
  }): Promise<GetWritingListResponse> {
    try {
      let writing = this.cms.getWritingForList();

      // Apply filters if provided
      if (params?.q) {
        const searchTerm = params.q.toLowerCase();
        writing = writing.filter(item =>
          item.title?.toLowerCase().includes(searchTerm) ||
          item.summary?.toLowerCase().includes(searchTerm)
        );
      }

      if (params?.kind) {
        writing = writing.filter(item => item.kind === params.kind);
      }

      if (params?.tag) {
        writing = writing.filter(item => 
          item.tags && item.tags.includes(params.tag!)
        );
      }

      // Sort by publishedAt (most recent first)
      return writing.sort((a, b) => {
        const dateA = new Date(a.publishedAt || '1970-01-01').getTime();
        const dateB = new Date(b.publishedAt || '1970-01-01').getTime();
        return dateB - dateA;
      });

    } catch (error) {
      console.error('Error fetching writing list from GitHub CMS:', error);
      throw new Error('Failed to load writing list');
    }
  }

  async getWriting(id: number): Promise<GetWritingResponse | undefined> {
    try {
      const writing = this.cms.getWriting();
      const item = writing.find(w => w.frontmatter.id === id || parseInt(w.slug) === id);
      
      if (!item) return undefined;

      // Convert ContentItem to GetWritingResponse format
      return {
        id: item.frontmatter.id || parseInt(item.slug) || 0,
        title: item.frontmatter.title,
        kind: item.frontmatter.kind,
        source: item.frontmatter.source,
        publishedAt: item.frontmatter.publishedAt,
        url: item.frontmatter.url,
        summary: item.frontmatter.summary,
        contentMd: item.content,
        tags: item.frontmatter.tags || [],
        readTime: item.frontmatter.readTime,
        slug: item.frontmatter.slug || item.slug,
        createdAt: new Date(item.frontmatter.lastUpdated || Date.now()).toISOString()
      };

    } catch (error) {
      console.error('Error fetching writing by ID from GitHub CMS:', error);
      return undefined;
    }
  }

  async getWritingBySlug(slug: string): Promise<GetWritingResponse | undefined> {
    try {
      const item = this.cms.getWritingBySlug(slug);
      
      if (!item) return undefined;

      // Convert ContentItem to GetWritingResponse format
      return {
        id: item.frontmatter.id || 0,
        title: item.frontmatter.title,
        kind: item.frontmatter.kind,
        source: item.frontmatter.source,
        publishedAt: item.frontmatter.publishedAt,
        url: item.frontmatter.url,
        summary: item.frontmatter.summary,
        contentMd: item.content,
        tags: item.frontmatter.tags || [],
        readTime: item.frontmatter.readTime,
        slug: item.frontmatter.slug || item.slug,
        createdAt: new Date(item.frontmatter.lastUpdated || Date.now()).toISOString()
      };

    } catch (error) {
      console.error('Error fetching writing by slug from GitHub CMS:', error);
      return undefined;
    }
  }

  async createWriting(input: InsertWriting): Promise<GetWritingResponse> {
    // For GitHub CMS, we can't create content dynamically
    // This would require creating a new markdown file
    throw new Error('Creating writing through API is not supported with GitHub CMS. Please create markdown files directly.');
  }
}

export const storage = new GitHubCMSStorage();