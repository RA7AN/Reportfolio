import { and, desc, eq, ilike, sql } from "drizzle-orm";
import {
  education,
  experiences,
  honors,
  leadership,
  profile,
  projects,
  publications,
  skills,
  talks,
  writing,
  certificates,
  type GetPortfolioResponse,
  type GetWritingListResponse,
  type GetWritingResponse,
  type InsertWriting,
  type WritingListItem,
} from "@shared/schema";
import { db } from "./db";

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

export class DatabaseStorage implements IStorage {
  async getPortfolio(): Promise<GetPortfolioResponse> {
    const [p] = await db.select().from(profile).limit(1);
    if (!p) {
      throw new Error("Profile not seeded");
    }

    const [exp, edu, proj, pub, t, sk, hon, lead, certs] = await Promise.all([
      db.select().from(experiences).orderBy(desc(experiences.startDate), desc(experiences.id)),
      db.select().from(education).orderBy(desc(education.endDate), desc(education.id)),
      db.select().from(projects).orderBy(desc(projects.dateLabel), desc(projects.id)),
      db.select().from(publications).orderBy(desc(publications.year), desc(publications.id)),
      db.select().from(talks).orderBy(desc(talks.dateLabel), desc(talks.id)),
      db.select().from(skills).orderBy(desc(skills.id)),
      db.select().from(honors).orderBy(desc(honors.dateLabel), desc(honors.id)),
      db.select().from(leadership).orderBy(desc(leadership.dateLabel), desc(leadership.id)),
      db.select().from(certificates).orderBy(desc(certificates.year), desc(certificates.dateLabel)),
    ]);

    return {
      profile: p,
      experiences: exp,
      education: edu,
      projects: proj,
      publications: pub,
      talks: t,
      skills: sk,
      honors: hon,
      leadership: lead,
      certificates: certs,
    };
  }

  async getWritingList(params?: {
    q?: string;
    tag?: string;
    kind?: string;
  }): Promise<GetWritingListResponse> {
    const where = [];

    if (params?.q) {
      where.push(
        sql`(${ilike(writing.title, `%${params.q}%`)} OR ${ilike(
          sql`COALESCE(${writing.summary}, '')`,
          `%${params.q}%`,
        )})`,
      );
    }

    if (params?.kind) {
      where.push(eq(writing.kind, params.kind));
    }

    if (params?.tag) {
      where.push(sql`${writing.tags} @> ARRAY[${params.tag}]::text[]`);
    }

    const rows = await db
      .select({
        id: writing.id,
        title: writing.title,
        kind: writing.kind,
        source: writing.source,
        publishedAt: writing.publishedAt,
        url: writing.url,
        summary: writing.summary,
        tags: writing.tags,
        readTime: writing.readTime,
        slug: writing.slug,
      })
      .from(writing)
      .where(where.length ? and(...where) : undefined)
      .orderBy(desc(writing.publishedAt), desc(writing.createdAt), desc(writing.id));

    return rows as unknown as WritingListItem[];
  }

  async getWriting(id: number): Promise<GetWritingResponse | undefined> {
    const [row] = await db.select().from(writing).where(eq(writing.id, id)).limit(1);
    return row;
  }

  async getWritingBySlug(slug: string): Promise<GetWritingResponse | undefined> {
    const [row] = await db.select().from(writing).where(eq(writing.slug, slug)).limit(1);
    return row;
  }

  async createWriting(input: InsertWriting): Promise<GetWritingResponse> {
    const [created] = await db.insert(writing).values(input).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
