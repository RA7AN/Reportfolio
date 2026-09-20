import Parser from "rss-parser";
import { db } from "./db";
import { writing as writingTable } from "../shared/schema";
import { eq } from "drizzle-orm";

const parser = new Parser({
  customFields: {
    feed: [],
    item: ['description', 'summary', 'content', 'content:encoded'],
  }
});

interface RSSSource {
  name: string;
  url: string;
  kind: string;
}

const RSS_SOURCES: RSSSource[] = [
  {
    name: "Medium",
    url: "https://medium.com/@hey.jawwad/feed",
    kind: "blog"
  },
  // Add more RSS sources here as needed
  // {
  //   name: "Substack",
  //   url: "https://yoursubstack.substack.com/feed",
  //   kind: "newsletter"
  // }
];

export class RSSService {
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private static extractReadTime(content: string): string | undefined {
    // Estimate read time based on word count (average 200 words per minute)
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes > 1 ? `${minutes} min read` : "1 min read";
  }

  static async fetchAndSyncRSSFeeds(): Promise<{success: number, errors: string[]}> {
    let success = 0;
    const errors: string[] = [];

    for (const source of RSS_SOURCES) {
      try {
        console.log(`Fetching RSS from ${source.name}: ${source.url}`);
        const feed = await parser.parseURL(source.url);

        for (const item of feed.items) {
          if (!item.title || !item.link) continue;

          const slug = this.generateSlug(item.title);
          
          // Check if article already exists
          const existing = await db
            .select()
            .from(writingTable)
            .where(eq(writingTable.url, item.link))
            .limit(1);

          if (existing.length > 0) {
            continue; // Skip if already exists
          }

          // Extract content and metadata
          const content = item['content:encoded'] || item.content || item.description || item.summary || '';
          const cleanContent = content.replace(/<[^>]*>/g, ''); // Strip HTML for read time calculation
          const summary = item.description || item.summary || cleanContent.substring(0, 200) + '...';

          const articleData = {
            title: item.title,
            kind: source.kind,
            source: source.name,
            publishedAt: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : null,
            url: item.link,
            summary: summary.length > 500 ? summary.substring(0, 500) + '...' : summary,
            slug: slug,
            readTime: this.extractReadTime(cleanContent),
            tags: item.categories || []
          };

          await db.insert(writingTable).values(articleData);
          success++;
          console.log(`Synced: ${item.title}`);
        }
      } catch (error) {
        const errorMsg = `Failed to sync ${source.name}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { success, errors };
  }

  static async syncRSSOnDemand(): Promise<{success: number, errors: string[]}> {
    console.log('Starting manual RSS sync...');
    return await this.fetchAndSyncRSSFeeds();
  }
}