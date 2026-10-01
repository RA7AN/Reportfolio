// Merges contribution data from the three GitHub accounts into one static dataset
// for the development activity section: a rolling 52-week window that feeds the
// radar, plus full calendar-year grids from the oldest account's creation year to
// now for the year switcher. Runs via `npm run dev-activity` locally (reads
// .env.local / .env) and from .github/workflows/dev-activity.yml daily.
//
// Expected env: GH_ACTIVITY_USER_1..3 + GH_ACTIVITY_TOKEN_1..3. Tokens need the
// read:user scope and must query their own account: without read:user, GitHub counts
// private-repo contributions but collapses them into an untyped "restricted" number,
// so the commits/issues/prs/reviews split silently under-reports.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://api.github.com/graphql';
const OUT = join(process.cwd(), 'public', 'dev-activity.json');
const WEEKS = 52;
const DAY_MS = 24 * 60 * 60 * 1000;

// Manual correspondence for metrics the api under-reports: github's profile radar
// shows abdljwd at 7% code review (~30 of 434 contributions in the last year), but
// contributionsCollection returns only 1 review even with read:user and zero
// restricted contributions — the radar counts review activity the api leaves out.
// The rolling window's review total is elevated to the radar figure (per-year
// entries stay raw). Update when the user shares a fresh radar.
const MANUAL_REVIEWS = { abdljwd: 30 };

const QUERY = `query ($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
      commitContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
      issueContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
      pullRequestContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
      pullRequestReviewContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
    }
  }
}`;

const USER_QUERY = `query ($login: String!) {
  user(login: $login) {
    createdAt
  }
}`;

function configuredAccounts() {
  const accounts = [];
  for (let index = 1; index <= 3; index += 1) {
    const user = process.env[`GH_ACTIVITY_USER_${index}`]?.trim();
    const token = process.env[`GH_ACTIVITY_TOKEN_${index}`]?.trim();
    if (user && token) accounts.push({ user, token });
    else if (user || token) {
      console.warn(`account ${index}: user and token must be set together — skipping`);
    }
  }
  return accounts;
}

async function gql(user, token, query, variables) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'reportfolio-dev-activity',
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${user}: unexpected response (${res.status}) ${text.slice(0, 200)}`);
  }
  if (!res.ok || body.errors) {
    throw new Error(`${user}: ${JSON.stringify(body.errors ?? body).slice(0, 400)}`);
  }
  return body.data;
}

async function fetchCollection(user, token, from, to) {
  const data = await gql(user, token, QUERY, { login: user, from, to });
  return data.user.contributionsCollection;
}

async function fetchCreatedYear(user, token) {
  const data = await gql(user, token, USER_QUERY, { login: user });
  return new Date(data.user.createdAt).getUTCFullYear();
}

async function main() {
  const accounts = configuredAccounts();
  if (accounts.length === 0) {
    console.error(
      'no accounts configured — set GH_ACTIVITY_USER_1/TOKEN_1 ... USER_3/TOKEN_3 (see .env.example)',
    );
    process.exit(1);
  }

  const to = new Date();
  const weekStart = Date.UTC(
    to.getUTCFullYear(),
    to.getUTCMonth(),
    to.getUTCDate() - to.getUTCDay(),
  );
  const from = weekStart - (WEEKS - 1) * 7 * DAY_MS;

  const collections = [];
  for (const { user, token } of accounts) {
    const collection = await fetchCollection(
      user,
      token,
      new Date(from).toISOString(),
      to.toISOString(),
    );
    collections.push(collection);
    const typed =
      collection.totalCommitContributions +
      collection.totalIssueContributions +
      collection.totalPullRequestContributions +
      collection.totalPullRequestReviewContributions;
    // restricted > 0 means those contributions are excluded from the type split —
    // usually a token missing read:user, so print the numbers for easy diagnosis
    console.log(
      `fetched ${user} — calendar ${collection.contributionCalendar.totalContributions}, typed ${typed}, restricted ${collection.restrictedContributionsCount}`,
    );
  }

  // calendar-year grids for the switcher: one query per year per account, from the
  // current year back to the creation year of the oldest account
  let firstYear = to.getUTCFullYear();
  for (const { user, token } of accounts) {
    firstYear = Math.min(firstYear, await fetchCreatedYear(user, token));
  }
  const years = [];
  for (let year = to.getUTCFullYear(); year >= firstYear; year -= 1) years.push(year);

  const yearCollections = new Map(years.map((year) => [year, []]));
  for (const { user, token } of accounts) {
    for (const year of years) {
      const collection = await fetchCollection(
        user,
        token,
        new Date(Date.UTC(year, 0, 1)).toISOString(),
        year === to.getUTCFullYear()
          ? to.toISOString()
          : new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString(),
      );
      yearCollections.get(year).push(collection);
    }
  }

  // daily counts summed by calendar date across every account
  const byDate = new Map();
  for (const collection of collections) {
    for (const week of collection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        byDate.set(day.date, (byDate.get(day.date) ?? 0) + day.contributionCount);
      }
    }
  }

  // exactly 52 columns of 7 days, ending with the current week
  const weeks = [];
  for (let index = 0; index < WEEKS; index += 1) {
    const start = from + index * 7 * DAY_MS;
    const days = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start + day * DAY_MS).toISOString().slice(0, 10);
      days.push(byDate.get(date) ?? 0);
    }
    weeks.push({ start: new Date(start).toISOString().slice(0, 10), days });
  }

  const types = { commits: 0, issues: 0, prs: 0, reviews: 0 };
  const repos = new Map();
  const repoFields = [
    'commitContributionsByRepository',
    'issueContributionsByRepository',
    'pullRequestContributionsByRepository',
    'pullRequestReviewContributionsByRepository',
  ];
  for (let index = 0; index < collections.length; index += 1) {
    const collection = collections[index];
    const { user } = accounts[index];
    types.commits += collection.totalCommitContributions;
    types.issues += collection.totalIssueContributions;
    types.prs += collection.totalPullRequestContributions;
    const rawReviews = collection.totalPullRequestReviewContributions;
    const manualReviews = MANUAL_REVIEWS[user] ?? 0;
    if (manualReviews > rawReviews) {
      console.log(
        `${user}: api reports ${rawReviews} review(s) — using profile-radar figure ${manualReviews}`,
      );
    }
    types.reviews += Math.max(rawReviews, manualReviews);
    for (const field of repoFields) {
      for (const entry of collection[field] ?? []) {
        const name = entry.repository.nameWithOwner;
        repos.set(name, (repos.get(name) ?? 0) + entry.contributions.totalCount);
      }
    }
  }

  const ranked = [...repos.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
  const total = weeks.reduce((sum, week) => sum + week.days.reduce((s, d) => s + d, 0), 0);
  const windowTo = new Date(from + (WEEKS * 7 - 1) * DAY_MS).toISOString().slice(0, 10);

  // one entry per year, newest first: merged daily counts, totals and type splits
  const yearData = years.map((year) => {
    const yearByDate = new Map();
    const yearTypes = { commits: 0, issues: 0, prs: 0, reviews: 0 };
    for (const collection of yearCollections.get(year)) {
      for (const week of collection.contributionCalendar.weeks) {
        for (const day of week.contributionDays) {
          // edge weeks carry days from neighboring years — keep only this year
          if (!day.date.startsWith(String(year))) continue;
          yearByDate.set(day.date, (yearByDate.get(day.date) ?? 0) + day.contributionCount);
        }
      }
      yearTypes.commits += collection.totalCommitContributions;
      yearTypes.issues += collection.totalIssueContributions;
      yearTypes.prs += collection.totalPullRequestContributions;
      yearTypes.reviews += collection.totalPullRequestReviewContributions;
    }

    // columns run from the week containing jan 1 through the week containing dec 31,
    // so the grid is the full github-style year even while the year is still running
    const first = Date.UTC(year, 0, 1);
    const last = Date.UTC(year, 11, 31);
    const gridStart = first - new Date(first).getUTCDay() * DAY_MS;
    const gridEnd = last + (6 - new Date(last).getUTCDay()) * DAY_MS;
    const yearWeeks = [];
    for (let start = gridStart; start <= gridEnd; start += 7 * DAY_MS) {
      const days = [];
      for (let offset = 0; offset < 7; offset += 1) {
        const date = new Date(start + offset * DAY_MS).toISOString().slice(0, 10);
        days.push(date.startsWith(String(year)) ? (yearByDate.get(date) ?? 0) : 0);
      }
      yearWeeks.push({ start: new Date(start).toISOString().slice(0, 10), days });
    }
    const yearTotal = yearWeeks.reduce(
      (sum, week) => sum + week.days.reduce((s, d) => s + d, 0),
      0,
    );
    return { year, total: yearTotal, types: yearTypes, weeks: yearWeeks };
  });

  const data = {
    generatedAt: to.toISOString(),
    windowFrom: weeks[0].start,
    windowTo,
    total,
    accounts: accounts.map((account) => account.user),
    types,
    // repository names stay out of the public JSON: private and employer repos
    // must never leak through the deployed site — only the aggregate count
    repoCount: ranked.length,
    // newest first; the ui switches the calendar between these
    years: yearData,
  };
  writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`wrote ${OUT}`);
  console.log(
    `${total} contributions across ${accounts.length} account(s); ${ranked.length} repos touched; years ${firstYear}–${years[0]}`,
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
