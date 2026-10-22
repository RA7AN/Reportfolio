import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { getDevActivity } from './dev-activity';

// guards the shape and the privacy invariants of the committed dataset.
// account handles are allowed in the dataset (the ui simply doesn't render them), so
// we check for repository name leaks and provenance freshness, not handle absence.
//
// deliberately NO assertion on generatedAt recency: a test that goes red with the
// passage of time is a worse version of the silent-staleness bug this pipeline had.
// Freshness is the scheduled workflow's job (it now fails instead of succeeding
// silently when the generator produces no data).

const RAW = readFileSync(join(process.cwd(), 'public', 'dev-activity.json'), 'utf-8');
const data = getDevActivity();

describe('dev-activity dataset', () => {
  it('parses and is present', () => {
    expect(data).not.toBeNull();
  });

  it('emits the rolling grid as 52 columns of 7 days', () => {
    expect(data?.weeks).toHaveLength(52);
    for (const week of data?.weeks ?? []) expect(week.days).toHaveLength(7);
  });

  it('orders calendar years newest-first', () => {
    const years = (data?.years ?? []).map((entry) => entry.year);
    expect(years.length).toBeGreaterThan(0);
    expect([...years].sort((a, b) => b - a)).toEqual(years);
  });

  it('keeps repository identities out of the public file — count only', () => {
    // the script requests nameWithOwner for every breakdown and drops it on write
    expect(RAW).not.toMatch(/nameWithOwner/);
    expect(typeof data?.repoCount).toBe('number');
  });

  it('emits provenance and dates every manually supplied figure', () => {
    expect(data?.provenance).toBeDefined();
    expect(typeof data?.provenance.reviewsApiObserved).toBe('number');
    for (const adjustment of data?.provenance.manualAdjustments ?? []) {
      expect(adjustment.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(adjustment.source.length).toBeGreaterThan(0);
      expect(adjustment.reported).toBeGreaterThanOrEqual(adjustment.apiObserved);
    }
  });
});
