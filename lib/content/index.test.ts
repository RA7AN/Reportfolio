import { describe, expect, it } from 'vitest';
import {
  getCertificates,
  getEducation,
  getExperiences,
  getFeatured,
  getFeaturedProjects,
  getHonors,
  getLeadership,
  getMusings,
  getNow,
  getPortfolio,
  getProfile,
  getProjectBySlug,
  getProjects,
  getPublications,
  getReads,
  getSkills,
  getTalks,
  getWriting,
} from './index';

describe('content collections', () => {
  it('parses profile', () => {
    const profile = getProfile();
    expect(profile.fullName).toBeTruthy();
    expect(profile.email).toContain('@');
  });

  it('parses all structured collections', () => {
    expect(getExperiences().length).toBeGreaterThan(0);
    expect(getEducation().length).toBeGreaterThan(0);
    expect(getProjects().length).toBeGreaterThan(0);
    expect(getPublications().length).toBeGreaterThan(0);
    expect(getTalks().length).toBeGreaterThan(0);
    expect(getSkills().length).toBeGreaterThan(0);
    expect(getHonors().length).toBeGreaterThan(0);
    expect(getLeadership().length).toBeGreaterThan(0);
    expect(getCertificates().length).toBeGreaterThan(0);
  });

  it('parses featured config', () => {
    const featured = getFeatured();
    expect(Array.isArray(featured.featuredEssays)).toBe(true);
  });

  it('parses writing with slugs', () => {
    const writing = getWriting();
    expect(writing.length).toBeGreaterThan(0);
    for (const item of writing) {
      expect(item.slug).toBeTruthy();
      expect(item.title).toBeTruthy();
    }
  });

  it('parses musings and reads', () => {
    expect(getMusings().length).toBeGreaterThan(0);
    expect(getReads().length).toBeGreaterThan(0);
  });

  it('parses now and featured work', () => {
    const now = getNow();
    expect(now.period).toBeTruthy();
    expect(now.building).toBeTruthy();
    expect(now.reading.startsWith('[PLACEHOLDER')).toBe(true);

    const featured = getFeaturedProjects();
    expect(featured.map((item) => item.slug)).toEqual([
      'safesight',
      'anthar-study',
      'mmvtg',
      'kyc-automation',
    ]);
    expect(getExperiences()[0]?.company).toBe('Revent');
    expect(getProfile().headline).toContain('AI Engineer');
    const slugs = getProjects().map((item) => item.slug).filter(Boolean);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getProjectBySlug('safesight')?.title).toBe('SafeSight');
    expect(getProjectBySlug('anthar-study')?.kind).toBe('research');
  });

  it('aggregates portfolio', () => {
    const portfolio = getPortfolio();
    expect(portfolio.profile.fullName).toBeTruthy();
    expect(portfolio.projects.length).toBeGreaterThan(0);
    expect(portfolio.now.period).toBeTruthy();
  });
});
