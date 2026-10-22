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

// how the numbers were produced; `manualAdjustments` names any figure the api did
// not observe, with the date it was supplied
export type DevActivityManualAdjustment = {
  account: string;
  field: string;
  reported: number;
  apiObserved: number;
  method: string;
  asOf: string;
  source: string;
};

export type DevActivityProvenance = {
  source: string;
  reviewsApiObserved: number;
  manualAdjustments: DevActivityManualAdjustment[];
};

export type DevActivityData = {
  generatedAt: string;
  windowFrom: string;
  windowTo: string;
  total: number;
  // handles stay in the dataset and are deliberately NOT rendered by the ui
  accounts: string[];
  provenance: DevActivityProvenance;
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

// the shape handed to the client component. account handles live in `accounts` and
// inside `provenance.manualAdjustments[].account`; both are dropped here so nothing
// that reaches the browser (props are serialized into the RSC payload) names an
// account. the UI only needs the count, not the handles.
export type DevActivityClientData = Omit<DevActivityData, 'accounts' | 'provenance'> & {
  accountCount: number;
};

export function toClientDevActivity(data: DevActivityData): DevActivityClientData {
  const { accounts, provenance, ...rest } = data;
  void provenance; // names accounts; never rendered on the client
  return { ...rest, accountCount: accounts.length };
}

const FILE = join(process.cwd(), 'public', 'dev-activity.json');

// the dataset is written by scripts/fetch-dev-activity.mjs (daily workflow or
// `npm run dev-activity`); the section hides itself while the file is absent
export function getDevActivity(): DevActivityData | null {
  if (!existsSync(FILE)) return null;
  return JSON.parse(readFileSync(FILE, 'utf-8')) as DevActivityData;
}
