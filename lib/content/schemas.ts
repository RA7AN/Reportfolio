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
  // landing card one-liner: the problem row under the tagline; falls back to
  // highlights[0] when left out
  problem: nullableString,
  sortOrder: z.number().optional(),
  isResearch: nullableString,
  showOnLanding: z.enum(['yes', 'no']).optional(),
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
  // landing-card extras, scaffolded for manual curation in the content files
  excerpt: nullableString,
  image: nullableString,
  doi: nullableString,
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
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
  // award photo under /public/achievements; the dashed stand-in shows until one is set
  image: nullableString,
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

export const communitySchema = z.object({
  id: z.number(),
  title: z.string(),
  org: z.string(),
  dateLabel: z.string(),
  url: nullableString,
  logo: nullableString,
  // "yes" lets an opaque logo cover its whole rounded frame instead of sitting inset
  logoFill: z.enum(['yes', 'no']).optional(),
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

// links page (content/links/index.md). The two kinds of link stay apart in the
// content file: `cards` render as the stacked list, `socials` as the icon row
// underneath. Both keep the order they are written in.
export const socialIconNames = [
  'github',
  'linkedin',
  'twitter',
  'orcid',
  'mail',
  'rss',
  'instagram',
  'youtube',
  'facebook',
] as const;

export const linkCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  href: z.string(),
});

export const socialLinkSchema = z.object({
  // must be one of socialIconNames; the icon component maps every name, so a
  // new value here without a matching icon is a type error
  icon: z.enum(socialIconNames),
  label: z.string(),
  href: z.string(),
});

export const linksSchema = z.object({
  intro: nullableString,
  cards: z.array(linkCardSchema).default([]),
  socials: z.array(socialLinkSchema).default([]),
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

// "on the timeline / posts worth keeping" landing section (content/posts/index.md).
// One object per post; `sortOrder` is the display order (unique), `anonymous`
// overlays the embed to mask the author's identity (avatar, name, handle) and
// block clicks through to the post.
export const timelinePostSchema = z.object({
  sortOrder: z.number(),
  url: z.string(),
  anonymous: z.boolean(),
});

export const timelinePostsSchema = z.array(timelinePostSchema).superRefine((posts, ctx) => {
  const seen = new Set<number>();
  for (const post of posts) {
    if (seen.has(post.sortOrder)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate sortOrder ${post.sortOrder}`,
      });
    }
    seen.add(post.sortOrder);
  }
});

export type TimelinePost = {
  platform: 'x' | 'linkedin';
  url: string;
  anonymous: boolean;
  sortOrder: number;
};

export type TimelinePostInput = z.infer<typeof timelinePostSchema>;

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type Talk = z.infer<typeof talkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Honor = z.infer<typeof honorSchema>;
export type Leadership = z.infer<typeof leadershipSchema>;
export type Community = z.infer<typeof communitySchema>;
export type WritingFrontmatter = z.infer<typeof writingFrontmatterSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type Featured = z.infer<typeof featuredSchema>;
export type SocialIconName = (typeof socialIconNames)[number];
export type LinkCard = z.infer<typeof linkCardSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Links = z.infer<typeof linksSchema>;
export type MusingNotebook = z.infer<typeof musingNotebookSchema>;
export type ReadItem = z.infer<typeof readItemSchema>;

export type WritingListItem = WritingFrontmatter & { content: string };
