import { z } from 'zod';

const nullableString = z.union([z.string(), z.null()]).optional();

export const profileSchema = z.object({
  id: z.number().optional(),
  fullName: z.string(),
  headline: z.string(),
  location: z.string().optional(),
  email: z.string(),
  phonePrimary: nullableString,
  phoneSecondary: nullableString,
  linkedinUrl: nullableString,
  githubUrl: nullableString,
  orcidUrl: nullableString,
  objective: z.string(),
  bio: nullableString,
});

export const experienceSchema = z.object({
  id: z.number(),
  company: z.string(),
  companyUrl: nullableString,
  location: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const educationSchema = z.object({
  id: z.number(),
  institution: z.string(),
  location: z.string(),
  program: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  details: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: nullableString,
  tools: z.array(z.string()),
  dateLabel: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
  isResearch: nullableString,
  githubRepo: nullableString,
});

export const publicationSchema = z.object({
  id: z.number(),
  kind: z.string(),
  code: z.string().optional(),
  year: z.string(),
  title: z.string(),
  venue: nullableString,
  url: nullableString,
  sortOrder: z.number().optional(),
  orcidId: nullableString,
});

export const talkSchema = z.object({
  id: z.number(),
  title: z.string(),
  venue: z.string(),
  dateLabel: z.string(),
  sortOrder: z.number().optional(),
});

export const skillSchema = z.object({
  id: z.number(),
  category: z.string(),
  items: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const honorSchema = z.object({
  id: z.number(),
  title: z.string(),
  org: z.string(),
  dateLabel: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const leadershipSchema = z.object({
  id: z.number(),
  title: z.string(),
  org: z.string(),
  dateLabel: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const writingFrontmatterSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  kind: z.string(),
  source: nullableString,
  publishedAt: nullableString,
  url: nullableString,
  summary: nullableString,
  tags: z.array(z.string()).default([]),
  readTime: nullableString,
  slug: z.string(),
  type: z.string().optional(),
  createdAt: z.string().optional(),
  lastUpdated: z.string().optional(),
});

export const certificateSchema = z.object({
  id: z.number(),
  title: z.string(),
  issuer: z.string(),
  dateLabel: z.string(),
  fileUrl: z.string(),
  credentialId: nullableString,
  verificationUrl: nullableString,
  year: z.string(),
  sortOrder: z.number().optional(),
});

export const featuredSchema = z.object({
  featuredProjects: z.array(z.string()).default([]),
  featuredPublications: z.array(z.string()).default([]),
  featuredEssays: z.array(z.string()).default([]),
});

export const musingEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  preview: z.string(),
  body: z.string().optional(),
});

export const musingNotebookSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  entries: z.array(musingEntrySchema),
});

export const readItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  authors: z.array(z.string()),
  type: z.enum(['book', 'paper', 'article']),
  year: z.number(),
  rating: z.number().min(0).max(5),
  url: z.string(),
  myReview: z.string(),
  tags: z.array(z.string()),
  dateRead: z.string(),
  category: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type Talk = z.infer<typeof talkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Honor = z.infer<typeof honorSchema>;
export type Leadership = z.infer<typeof leadershipSchema>;
export type WritingFrontmatter = z.infer<typeof writingFrontmatterSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type Featured = z.infer<typeof featuredSchema>;
export type MusingNotebook = z.infer<typeof musingNotebookSchema>;
export type ReadItem = z.infer<typeof readItemSchema>;

export type WritingListItem = WritingFrontmatter & { content: string };
