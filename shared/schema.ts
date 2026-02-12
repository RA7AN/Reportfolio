import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  headline: text("headline").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  phonePrimary: text("phone_primary"),
  phoneSecondary: text("phone_secondary"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  orcidUrl: text("orcid_url"),
  objective: text("objective").notNull(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  companyUrl: text("company_url"),
  location: text("location").notNull(),
  role: text("role").notNull(),
  startDate: varchar("start_date", { length: 32 }).notNull(),
  endDate: varchar("end_date", { length: 32 }).notNull(),
  highlights: text("highlights").array().notNull().default([]),
  sortOrder: serial("sort_order"),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  location: text("location").notNull(),
  program: text("program").notNull(),
  startDate: varchar("start_date", { length: 32 }).notNull(),
  endDate: varchar("end_date", { length: 32 }).notNull(),
  details: text("details").array().notNull().default([]),
  sortOrder: serial("sort_order"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url"),
  tools: text("tools").array().notNull().default([]),
  dateLabel: varchar("date_label", { length: 64 }).notNull(),
  highlights: text("highlights").array().notNull().default([]),
  sortOrder: serial("sort_order"),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  kind: varchar("kind", { length: 16 }).notNull(),
  code: varchar("code", { length: 16 }).notNull(),
  year: varchar("year", { length: 8 }).notNull(),
  title: text("title").notNull(),
  venue: text("venue"),
  url: text("url"),
  sortOrder: serial("sort_order"),
});

export const talks = pgTable("talks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  venue: text("venue").notNull(),
  dateLabel: varchar("date_label", { length: 64 }).notNull(),
  sortOrder: serial("sort_order"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  items: text("items").array().notNull().default([]),
  sortOrder: serial("sort_order"),
});

export const honors = pgTable("honors", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  org: text("org").notNull(),
  dateLabel: varchar("date_label", { length: 64 }).notNull(),
  highlights: text("highlights").array().notNull().default([]),
  sortOrder: serial("sort_order"),
});

export const leadership = pgTable("leadership", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  org: text("org").notNull(),
  dateLabel: varchar("date_label", { length: 64 }).notNull(),
  highlights: text("highlights").array().notNull().default([]),
  sortOrder: serial("sort_order"),
});

export const writing = pgTable("writing", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  kind: varchar("kind", { length: 24 }).notNull(),
  source: text("source"),
  publishedAt: varchar("published_at", { length: 32 }),
  url: text("url"),
  summary: text("summary"),
  contentMd: text("content_md"),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experiences).omit({ id: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertPublicationSchema = createInsertSchema(publications).omit({ id: true });
export const insertTalkSchema = createInsertSchema(talks).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertHonorSchema = createInsertSchema(honors).omit({ id: true });
export const insertLeadershipSchema = createInsertSchema(leadership).omit({ id: true });
export const insertWritingSchema = createInsertSchema(writing).omit({ id: true, createdAt: true });

export type Profile = typeof profile.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type Talk = typeof talks.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Honor = typeof honors.$inferSelect;
export type Leadership = typeof leadership.$inferSelect;
export type Writing = typeof writing.$inferSelect;

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
};

export type WritingListItem = Pick<Writing, "id" | "title" | "kind" | "source" | "publishedAt" | "url" | "summary" | "tags">;
export type GetWritingListResponse = WritingListItem[];
export type GetWritingResponse = Writing;
