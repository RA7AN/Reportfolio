import Parser from "rss-parser";

// RSS service for fetching external content
// Note: Currently configured for monitoring RSS feeds
// For GitHub CMS approach, consider adding new content as markdown files manually

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
    return {
      success: 0,
      errors: ['RSS sync disabled - using GitHub CMS approach. Add new content manually as markdown files.']
    };
  }

  static async syncRSSOnDemand(): Promise<{success: number, errors: string[]}> {
    console.log('RSS sync disabled - using GitHub CMS approach');
    return {
      success: 0,
      errors: ['RSS sync disabled - using GitHub CMS approach. Add new content manually as markdown files.']
    };
  }
}