import 'server-only';

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { z, type ZodTypeAny } from 'zod';
import { slugify } from '@/lib/utils';
import {
  certificateSchema,
  educationSchema,
  experienceSchema,
  featuredSchema,
  honorSchema,
  leadershipSchema,
  musingNotebookSchema,
  nowSchema,
  profileSchema,
  projectSchema,
  publicationSchema,
  readItemSchema,
  skillSchema,
  talkSchema,
  writingFrontmatterSchema,
  type Certificate,
  type Education,
  type Experience,
  type Featured,
  type Honor,
  type Leadership,
  type MusingNotebook,
  type NowContent,
  type Profile,
  type Project,
  type Publication,
  type ReadItem,
  type Skill,
  type Talk,
  type WritingListItem,
} from './schemas';

export const CONTENT_DIR = join(process.cwd(), 'content');

function parseJsonBody(raw: string, filePath: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Invalid JSON body in ${filePath}`);
  }
}

function loadJsonCollection<S extends ZodTypeAny>(directory: string, schema: S): z.infer<S>[] {
  const dirPath = join(CONTENT_DIR, directory);
  if (!existsSync(dirPath)) return [];

  const files = readdirSync(dirPath).filter((file) => file.endsWith('.md') && file !== 'index.md');

  const items: z.infer<S>[] = [];
  for (const file of files) {
    const filePath = join(dirPath, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { content } = matter(raw);
    const parsed = schema.safeParse(parseJsonBody(content, filePath));
    if (!parsed.success) {
      throw new Error(
        `Invalid content in ${filePath}: ${parsed.error.issues.map((i) => i.message).join('; ')}`,
      );
    }
    items.push(parsed.data);
  }

  return items.sort((a, b) => {
    const ao = (a as { sortOrder?: number; id?: number }).sortOrder ?? (a as { id?: number }).id ?? 0;
    const bo = (b as { sortOrder?: number; id?: number }).sortOrder ?? (b as { id?: number }).id ?? 0;
    return ao - bo;
  });
}

export function getProfile(): Profile {
  const filePath = join(CONTENT_DIR, 'profile', 'index.md');
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const parsed = profileSchema.safeParse(parseJsonBody(content, filePath));
  if (!parsed.success) {
    throw new Error(`Invalid profile: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }
  return parsed.data;
}

export function getExperiences(): Experience[] {
  return loadJsonCollection('experiences', experienceSchema);
}

export function getEducation(): Education[] {
  return loadJsonCollection('education', educationSchema);
}

export function getProjects(): Project[] {
  return loadJsonCollection('projects', projectSchema);
}

export function projectSlug(project: Project) {
  return project.slug || slugify(project.title);
}

export function hrefForProject(project: Project) {
  const slug = projectSlug(project);
  return project.kind === 'research' ? `/research/${slug}` : `/projects/${slug}`;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => projectSlug(project) === slug);
}

export function getPublications(): Publication[] {
  return loadJsonCollection('publications', publicationSchema);
}

export function getTalks(): Talk[] {
  return loadJsonCollection('talks', talkSchema);
}

export function getSkills(): Skill[] {
  return loadJsonCollection('skills', skillSchema);
}

export function getHonors(): Honor[] {
  return loadJsonCollection('honors', honorSchema);
}

export function getLeadership(): Leadership[] {
  return loadJsonCollection('leadership', leadershipSchema);
}

export function getCertificates(): Certificate[] {
  const dirPath = join(CONTENT_DIR, 'certificates');
  if (!existsSync(dirPath)) return [];
  const files = readdirSync(dirPath).filter((file) => file.endsWith('.md') && file !== 'index.md');
  return files
    .map((file) => {
      const filePath = join(dirPath, file);
      const raw = readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      const parsed = certificateSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid certificate ${filePath}: ${parsed.error.issues.map((i) => i.message).join('; ')}`,
        );
      }
      return parsed.data;
    })
    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id));
}

export function getFeatured(): Featured {
  const filePath = join(CONTENT_DIR, 'featured.md');
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const parsed = featuredSchema.safeParse(parseJsonBody(content, filePath));
  if (!parsed.success) {
    throw new Error(`Invalid featured.md: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }
  return parsed.data;
}

export function getWriting(): WritingListItem[] {
  const dirPath = join(CONTENT_DIR, 'writing');
  const files = readdirSync(dirPath).filter((file) => file.endsWith('.mdx') && file !== 'index.md');

  return files
    .map((file, index) => {
      const filePath = join(dirPath, file);
      const raw = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const slugFromFile = file.replace(/\.(mdx|md)$/, '');
      const parsed = writingFrontmatterSchema.safeParse({
        ...data,
        slug: data.slug ?? slugFromFile,
      });
      if (!parsed.success) {
        throw new Error(
          `Invalid writing ${filePath}: ${parsed.error.issues.map((i) => i.message).join('; ')}`,
        );
      }
      return {
        ...parsed.data,
        id: parsed.data.id ?? index + 1,
        content: content.trim(),
      };
    })
    .sort((a, b) => {
      const da = a.publishedAt ?? '';
      const db = b.publishedAt ?? '';
      return db.localeCompare(da);
    });
}

export function getWritingList() {
  return getWriting().map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...rest } = item;
    return rest;
  });
}

export function getWritingBySlug(slug: string): WritingListItem | undefined {
  return getWriting().find((item) => item.slug === slug);
}

export function getWritingById(id: number): WritingListItem | undefined {
  return getWriting().find((item) => item.id === id);
}

export function getMusings(): MusingNotebook[] {
  const filePath = join(CONTENT_DIR, 'musings', 'index.md');
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const parsed = z.array(musingNotebookSchema).safeParse(parseJsonBody(content, filePath));
  if (!parsed.success) {
    throw new Error(`Invalid musings: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }
  return parsed.data;
}

export function getReads(): ReadItem[] {
  const filePath = join(CONTENT_DIR, 'reads', 'index.md');
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const parsed = z.array(readItemSchema).safeParse(parseJsonBody(content, filePath));
  if (!parsed.success) {
    throw new Error(`Invalid reads: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }
  return parsed.data;
}

export function getNow(): NowContent {
  const filePath = join(CONTENT_DIR, 'now', 'index.md');
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);
  const parsed = nowSchema.safeParse(parseJsonBody(content, filePath));
  if (!parsed.success) {
    throw new Error(`Invalid now: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }
  return parsed.data;
}

export function getFeaturedProjects(): Project[] {
  return getProjects()
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function getResearchProjects(): Project[] {
  return getProjects().filter((project) => project.kind === 'research');
}

export function getPortfolio() {
  return {
    profile: getProfile(),
    experiences: getExperiences(),
    education: getEducation(),
    projects: getProjects(),
    publications: getPublications(),
    talks: getTalks(),
    skills: getSkills(),
    honors: getHonors(),
    leadership: getLeadership(),
    certificates: getCertificates(),
    now: getNow(),
  };
}
