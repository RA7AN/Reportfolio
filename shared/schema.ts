import { z } from "zod";

// Pure TypeScript types (no database dependencies)
// These types match the structure used in the GitHub CMS markdown files

export type Profile = {
  id: number;
  fullName: string;
  headline: string;
  location: string;
  email: string;
  phonePrimary?: string | null;
  phoneSecondary?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  orcidUrl?: string | null;
  objective: string;
  bio?: string | null;
};

export type Experience = {
  id: number;
  company: string;
  companyUrl?: string | null;
  location: string;
  role: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  sortOrder?: number;
};

export type Education = {
  id: number;
  institution: string;
  location: string;
  program: string;
  startDate: string;
  endDate: string;
  details: string[];
  sortOrder?: number;
};

export type Project = {
  id: number;
  title: string;
  url?: string | null;
  tools: string[];
  dateLabel: string;
  highlights: string[];
  sortOrder?: number;
  isResearch?: string | null;
  githubRepo?: string | null;
};

export type Publication = {
  id: number;
  kind: string;
  code: string;
  year: string;
  title: string;
  venue?: string | null;
  url?: string | null;
  sortOrder?: number;
  orcidId?: string | null;
};

export type Talk = {
  id: number;
  title: string;
  venue: string;
  dateLabel: string;
  sortOrder?: number;
};

export type Skill = {
  id: number;
  category: string;
  items: string[];
  sortOrder?: number;
};

export type Honor = {
  id: number;
  title: string;
  org: string;
  dateLabel: string;
  highlights: string[];
  sortOrder?: number;
};

export type Leadership = {
  id: number;
  title: string;
  org: string;
  dateLabel: string;
  highlights: string[];
  sortOrder?: number;
};

export type Writing = {
  id: number;
  title: string;
  kind: string;
  source?: string | null;
  publishedAt?: string | null;
  url?: string | null;
  summary?: string | null;
  contentMd?: string | null;
  tags: string[];
  readTime?: string | null;
  slug?: string | null;
  createdAt: string;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  dateLabel: string;
  fileUrl: string;
  credentialId?: string | null;
  verificationUrl?: string | null;
  year: string;
};

// Zod schemas for validation (replacing drizzle insert schemas)
export const insertProfileSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  location: z.string(),
  email: z.string(),
  phonePrimary: z.string().optional(),
  phoneSecondary: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  orcidUrl: z.string().optional(),
  objective: z.string(),
  bio: z.string().optional(),
});

export const insertExperienceSchema = z.object({
  company: z.string(),
  companyUrl: z.string().optional(),
  location: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const insertEducationSchema = z.object({
  institution: z.string(),
  location: z.string(),
  program: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  details: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const insertProjectSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
  tools: z.array(z.string()),
  dateLabel: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
  isResearch: z.string().optional(),
  githubRepo: z.string().optional(),
});

export const insertPublicationSchema = z.object({
  kind: z.string(),
  code: z.string(),
  year: z.string(),
  title: z.string(),
  venue: z.string().optional(),
  url: z.string().optional(),
  sortOrder: z.number().optional(),
  orcidId: z.string().optional(),
});

export const insertTalkSchema = z.object({
  title: z.string(),
  venue: z.string(),
  dateLabel: z.string(),
  sortOrder: z.number().optional(),
});

export const insertSkillSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const insertHonorSchema = z.object({
  title: z.string(),
  org: z.string(),
  dateLabel: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const insertLeadershipSchema = z.object({
  title: z.string(),
  org: z.string(),
  dateLabel: z.string(),
  highlights: z.array(z.string()),
  sortOrder: z.number().optional(),
});

export const insertWritingSchema = z.object({
  title: z.string(),
  kind: z.string(),
  source: z.string().optional(),
  publishedAt: z.string().optional(),
  url: z.string().optional(),
  summary: z.string().optional(),
  contentMd: z.string().optional(),
  tags: z.array(z.string()),
  readTime: z.string().optional(),
  slug: z.string().optional(),
});

export const insertCertificateSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  dateLabel: z.string(),
  fileUrl: z.string(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().optional(),
  year: z.string(),
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type InsertTalk = z.infer<typeof insertTalkSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertHonor = z.infer<typeof insertHonorSchema>;
export type InsertLeadership = z.infer<typeof insertLeadershipSchema>;
export type InsertWriting = z.infer<typeof insertWritingSchema>;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export type GetPortfolioResponse = {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  publications: Publication[];
  talks: Talk[];
  skills: Skill[];
  honors: Honor[];
  leadership: Leadership[];
  certificates: Certificate[];
};

export type WritingListItem = Pick<Writing, "id" | "title" | "kind" | "source" | "publishedAt" | "url" | "summary" | "tags" | "readTime" | "slug">;
export type GetWritingListResponse = WritingListItem[];
export type GetWritingResponse = Writing;
