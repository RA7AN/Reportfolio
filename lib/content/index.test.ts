import { describe, expect, it } from 'vitest';
import {
  getCertificates,
  getCommunities,
  getEducation,
  getExperiences,
  getFeatured,
  getHonors,
  getLeadership,
  getLinks,
  getMusings,
  getPortfolio,
  getProfile,
  getProjects,
  getPublications,
  getReads,
  getSkills,
  getTalks,
  getTimelinePosts,
  getWriting,
} from './index';
import { socialIconNames } from './schemas';

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
    expect(Array.isArray(getLeadership())).toBe(true);
    expect(getCommunities().length).toBeGreaterThan(0);
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

  it('parses timeline posts with detected platforms', () => {
    const posts = getTimelinePosts();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(['x', 'linkedin']).toContain(post.platform);
      expect(post.url).toMatch(/^https:/);
      expect(typeof post.anonymous).toBe('boolean');
      expect(typeof post.sortOrder).toBe('number');
    }
    const orders = posts.map((post) => post.sortOrder);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it('parses links, keeping cards and socials apart', () => {
    const links = getLinks();
    expect(links.cards.length).toBeGreaterThan(0);
    expect(links.socials.length).toBeGreaterThan(0);
    for (const card of links.cards) {
      expect(card.title).toBeTruthy();
      expect(card.subtitle).toBeTruthy();
      expect(card.href).toBeTruthy();
    }
    for (const social of links.socials) {
      expect(socialIconNames).toContain(social.icon);
      expect(social.label).toBeTruthy();
      expect(social.href).toBeTruthy();
    }
  });

  it('aggregates portfolio', () => {
    const portfolio = getPortfolio();
    expect(portfolio.profile.fullName).toBeTruthy();
    expect(portfolio.projects.length).toBeGreaterThan(0);
  });
});
