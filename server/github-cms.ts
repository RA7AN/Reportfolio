import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = resolve(process.cwd(), 'content');

export interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
  data: any; // Parsed JSON data for non-writing content
}

export class GitHubCMS {
  private static instance: GitHubCMS;
  private cache: Map<string, ContentItem[]> = new Map();

  static getInstance(): GitHubCMS {
    if (!GitHubCMS.instance) {
      GitHubCMS.instance = new GitHubCMS();
    }
    return GitHubCMS.instance;
  }

  private parseContentFile(filePath: string): ContentItem | null {
    try {
      if (!existsSync(filePath)) return null;
      
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      
      // For non-writing content, the main content is usually JSON
      let parsedData = null;
      if (frontmatter.type !== 'writing') {
        try {
          parsedData = JSON.parse(content.trim());
        } catch (e) {
          // If not JSON, keep as string
          parsedData = content.trim();
        }
      }

      const slug = frontmatter.slug || filePath.split('/').pop()?.replace('.md', '') || '';
      
      return {
        slug,
        frontmatter,
        content: content.trim(),
        data: parsedData
      };
    } catch (error) {
      console.error(`Error parsing content file ${filePath}:`, error);
      return null;
    }
  }

  private loadDirectoryContent(directory: string): ContentItem[] {
    const dirPath = resolve(CONTENT_DIR, directory);
    if (!existsSync(dirPath)) return [];

    const files = readdirSync(dirPath)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => resolve(dirPath, file));

    const content: ContentItem[] = [];
    
    for (const filePath of files) {
      const item = this.parseContentFile(filePath);
      if (item) {
        content.push(item);
      }
    }

    // Sort by sortOrder if available, otherwise by slug
    return content.sort((a, b) => {
      const aOrder = a.frontmatter.sortOrder || 99999;
      const bOrder = b.frontmatter.sortOrder || 99999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.slug.localeCompare(b.slug);
    });
  }

  // Public methods to replace database queries
  getProfile(): any {
    const profilePath = resolve(CONTENT_DIR, 'profile', 'index.md');
    const profileContent = this.parseContentFile(profilePath);
    return profileContent?.data || null;
  }

  getExperiences(): any[] {
    if (!this.cache.has('experiences')) {
      this.cache.set('experiences', this.loadDirectoryContent('experiences'));
    }
    return this.cache.get('experiences')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getEducation(): any[] {
    if (!this.cache.has('education')) {
      this.cache.set('education', this.loadDirectoryContent('education'));
    }
    return this.cache.get('education')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getProjects(): any[] {
    if (!this.cache.has('projects')) {
      this.cache.set('projects', this.loadDirectoryContent('projects'));
    }
    return this.cache.get('projects')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getPublications(): any[] {
    if (!this.cache.has('publications')) {
      this.cache.set('publications', this.loadDirectoryContent('publications'));
    }
    return this.cache.get('publications')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getTalks(): any[] {
    if (!this.cache.has('talks')) {
      this.cache.set('talks', this.loadDirectoryContent('talks'));
    }
    return this.cache.get('talks')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getSkills(): any[] {
    if (!this.cache.has('skills')) {
      this.cache.set('skills', this.loadDirectoryContent('skills'));
    }
    return this.cache.get('skills')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getHonors(): any[] {
    if (!this.cache.has('honors')) {
      this.cache.set('honors', this.loadDirectoryContent('honors'));
    }
    return this.cache.get('honors')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getLeadership(): any[] {
    if (!this.cache.has('leadership')) {
      this.cache.set('leadership', this.loadDirectoryContent('leadership'));
    }
    return this.cache.get('leadership')?.map(item => item.data).filter(item => item && item.id) || [];
  }

  getCertificates(): any[] {
    if (!this.cache.has('certificates')) {
      this.cache.set('certificates', this.loadDirectoryContent('certificates'));
    }
    return this.cache.get('certificates')?.map(item => item.frontmatter).filter(item => item.id) || [];
  }

  getWriting(): ContentItem[] {
    if (!this.cache.has('writing')) {
      this.cache.set('writing', this.loadDirectoryContent('writing'));
    }
    return this.cache.get('writing') || [];
  }

  getWritingForList(): any[] {
    return this.getWriting().map(item => ({
      id: item.frontmatter.id || item.slug,
      title: item.frontmatter.title,
      kind: item.frontmatter.kind,
      source: item.frontmatter.source,
      publishedAt: item.frontmatter.publishedAt,
      url: item.frontmatter.url,
      summary: item.frontmatter.summary,
      tags: item.frontmatter.tags || [],
      readTime: item.frontmatter.readTime,
      slug: item.frontmatter.slug || item.slug
    }));
  }

  getWritingBySlug(slug: string): ContentItem | null {
    const writing = this.getWriting();
    return writing.find(item => item.slug === slug || item.frontmatter.slug === slug) || null;
  }

  // Portfolio data aggregation (replacing the database portfolio endpoint)
  getPortfolioData(): any {
    return {
      profile: this.getProfile(),
      experiences: this.getExperiences(),
      education: this.getEducation(),
      projects: this.getProjects(),
      publications: this.getPublications(),
      talks: this.getTalks(),
      skills: this.getSkills(),
      honors: this.getHonors(),
      leadership: this.getLeadership(),
      certificates: this.getCertificates(),
    };
  }

  // Clear cache (useful for development)
  clearCache(): void {
    this.cache.clear();
  }
}