import 'server-only';

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type DevActivityWeek = {
  start: string;
  days: number[];
};

export type DevActivityYear = {
  year: number;
  total: number;
  types: { commits: number; issues: number; prs: number; reviews: number };
  weeks: DevActivityWeek[];
};

export type DevActivityData = {
  generatedAt: string;
  windowFrom: string;
  windowTo: string;
  total: number;
  accounts: string[];
  types: { commits: number; issues: number; prs: number; reviews: number };
  // names are intentionally not emitted (private/employer repos); count only
  repoCount: number;
  // the default calendar view: rolling 52 weeks ending with the current week
  weeks: DevActivityWeek[];
  // total of the 52 weeks preceding the window — the rolling view's delta base
  previousTotal: number;
  // newest first; the calendar switcher picks one of these
  years: DevActivityYear[];
};

const FILE = join(process.cwd(), 'public', 'dev-activity.json');

// the dataset is written by scripts/fetch-dev-activity.mjs (daily workflow or
// `npm run dev-activity`); the section hides itself while the file is absent
export function getDevActivity(): DevActivityData | null {
  if (!existsSync(FILE)) return null;
  return JSON.parse(readFileSync(FILE, 'utf-8')) as DevActivityData;
}
