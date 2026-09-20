# Tech stack comparison and migration recommendations

**Date:** 20 September 2026  
**Status update:** 21 September 2026 — Phase A + MDX spine is in this repo.  
**Audience:** this repo (`RePortfolio`) vs the stack you like in `~/Developer/rv002`  
**Scope:** common engineering surfaces only. These are different products (personal site vs multi-tenant SaaS). Do not copy agents, billing, queues, or tenancy.

Legend: **[done]** landed in the 21 Sep 2026 rewrite · **[partial]** started, not finished · **[next]** do soon (hosting / GitHub) · **[deferred]** parked until a listed scenario in [`docs/deferred-tasks.md`](./deferred-tasks.md) · **[won't]** not copying on purpose.

Sources:

- This workspace (post-rewrite): Next.js 16 App Router, markdown/MDX under `content/`
- `~/Developer/rv002/ai-lab-platform` (README, `package.json`, CI, env, security, App Router)
- `~/Developer/rv002/agent-kit` (`01-PLATFORM-OVERVIEW.md`, `02-HOW-TO-BUILD-AN-AGENT.md`, `03-GUARDRAILS.md`) for process and quality rules, not product design

---

## Progress (21 Sep 2026)

### Phases

- [x] **Phase 0 — Freeze scope** — Git + MDX is the CMS; composer / `POST /api/writing` removed; `CURRENT_UX_ANALYSIS.md` is historical.
- [x] **Phase 1 — Hygiene** — folded into the Next rewrite (`.nvmrc`, Zod env, ESLint, Prettier, Vitest, Husky, CI workflow file, slug URLs, no `maximum-scale`).
- [x] **Phase 2 — Framework** — Next 16, React 19, Tailwind 4, `next/font`, SSG pages, sitemap, RSS, security headers. Image pipeline **[deferred]** (see deferred-tasks).
- [x] **Phase 3 item: MDX for writing** — `content/writing/*.mdx` + `next-mdx-remote`, `ProjectVideo` stub.
- [ ] **Phase 3 remainder** — Keystatic, drafts, related-content tags, JSON-LD, OG images, contact/Resend — all **[deferred]**.
- [ ] **Phase 4 — Polish** — analytics, Sentry, i18n **[deferred]**; **hosting/preview deploys [next]** (Vercel, not deferred).

### Copy-from-lab list

- [x] Next.js App Router + React 19 + Tailwind 4
- [x] `next/font` (IBM Plex + Fraunces only)
- [x] Zod-validated env + `.env.example` (`SITE_URL`; optional GitHub/ORCID tokens not wired)
- [x] Quality gates: ESLint, Prettier, Vitest, `typecheck`, Husky, [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- [x] `.nvmrc` (Node 22) — `engines` in `package.json` not added
- [x] Server metadata, sitemap, robots, numeric writing → slug **308**
- [x] Simple security headers (nosniff, referrer, Permissions-Policy). **Not** HSTS (needs HTTPS host) or nonce CSP
- [ ] Dependabot + secret scan **[deferred]**
- [ ] Short project `AGENTS.md` **[deferred]** (Next already generates a stub)
- [x] Viewport allows pinch-zoom
- [ ] `sharp` / `next/image` for certificates and project stills **[deferred]**
- [x] Colocated Vitest for content parsers
- [x] No more logging full API JSON bodies (Express logger gone)

### Definition of done (UX iteration is allowed)

- [x] `typecheck` / `lint` / `test` / `build` scripts exist; CI workflow is in the repo (see § CI below)
- [x] Titles / description / OG in HTML source (`generateMetadata`)
- [x] Writing URLs are slugs; MDX renders headings/lists/links
- [x] Invalid `content/` fails Vitest / `next build`
- [x] No unauthenticated write API
- [x] Sitemap + `/rss.xml`
- [x] Two self-hosted font families
- [x] Pinch-zoom works

---

## 1. What both products are

| | **RePortfolio (this repo)** | **AI Lab Platform** |
|---|---|---|
| Job | Public personal site + writing + resume-like structured content | Multi-tenant B2B product: auth, workspaces, agents, billing |
| Content | Git-backed markdown / JSON / MDX in `content/` **[done]** | Postgres rows, encrypted tenant data, marketing pages in App Router |
| Users | Anonymous visitors + you as author | Authenticated workspace members |
| Runtime | Next.js App Router (SSG + a few client islands) **[done]** | Next.js web process + BullMQ worker + Postgres + Redis |

The overlap that *matters* is: TypeScript, React UI, Tailwind, Zod, GitHub, a public web surface, and a need for content that is typed, reviewed, and deployed.

---

## 2. Stack on common surfaces

Snapshots below mix **then** (Feb prototype) and **now**. Verdict column is the original gap analysis; status is the rewrite.

### 2.1 Language and UI

| Surface | Feb prototype | Now | AI Lab |
|---|---|---|---|
| Language | TypeScript strict | same **[done]** | TypeScript strict |
| React | 18.3 | **19** **[done]** | 19.2 |
| Routing | Wouter SPA | **Next 16 App Router** **[done]** | Next 16 App Router |
| Styling | Tailwind v3 | **Tailwind v4** **[done]** | Tailwind v4 |
| Components | Full unused shadcn dump | Slim set actually used **[done]** | Product UI + brand tokens |
| Fonts | ~20 Google families | **two via `next/font`** **[done]** | next/font |

### 2.2 Content and data

| Surface | Feb | Now |
|---|---|---|
| Source of truth | `content/` markdown | same, plus MDX for writing **[done]** — still no Postgres **[won't]** |
| Schema | TS types, weak parse | Zod `safeParse` at load; build/test fail **[done]** |
| Load path | Express REST → React Query | RSC / `fs` at build **[done]** |
| CMS write | public POST → 501 + composer | removed **[done]**; Keystatic **[deferred]** |
| Images | `public/` files | still `public/` **[partial]**; `next/image` **[deferred]**; R2 **[deferred]** |

### 2.3 Backend / runtime

| Surface | Status |
|---|---|
| HTTP | Next routes **[done]**; Express gone |
| Auth / Redis / BullMQ / Stripe | **[won't]** |
| GitHub / ORCID live APIs | unused in UI; dropped with Express **[done]** to drop; re-add as build-time snapshots **[deferred]** |
| Env | `lib/env.ts` Zod + `.env.example` **[done]** |
| Node pin | `.nvmrc` 22 **[done]** |

### 2.4 Quality, process, ops

| Surface | Status |
|---|---|
| Lint / format / tests / typecheck | **[done]** |
| Husky + lint-staged | **[done]** locally (`prepare` / pre-commit) |
| GitHub Actions workflow file | **[done]** in repo; must be **on the default branch of GitHub** to run on PRs |
| Dependabot / gitleaks / npm audit gate | **[deferred]** |
| Security headers (simple) | **[done]**; HSTS + CSP nonce **[deferred]** |
| A11y viewport | **[done]** |

### 2.5 Public web / SEO

| Surface | Status |
|---|---|
| First-paint HTML | SSG **[done]** |
| Titles / OG | `generateMetadata` **[done]**; generated OG **images** **[deferred]** |
| Sitemap / robots | **[done]** |
| Canonical writing URLs | `/writing/[slug]` + 308 from numeric id **[done]** |
| Markdown | MDX **[done]** |
| Outbound RSS | `/rss.xml` **[done]** |
| JSON-LD | **[deferred]** |
| Analytics | **[deferred]** (Plausible/Umami or nothing) |

---

## 3. Same vs differ vs missing (copy list)

### Same (keep) **[done]**

- TypeScript end-to-end, strict compiler.
- React + Tailwind + a few Radix primitives.
- Zod as the validation library.
- Git as the publishing workflow for content.
- One deployable (no microservices).

### Differ (intentional — do not “fix” by cloning SaaS) **[won't]**

Do **not** bring over from AI Lab:

- PostgreSQL, Drizzle, Redis, BullMQ, Stripe, Better Auth, envelope encryption, next-intl `en`/`ar`, Hono workers, agent modules, workspace RBAC.

Agent-kit principles that *do* transfer (partially applied):

- [x] Validate at the boundary (`safeParse`, env at boot).
- [ ] Authz is code if you add any write API (Keystatic/local only for now).
- [x] Local hook + CI file; never `--no-verify` as a habit.
- [ ] Dependabot / lockfile review on GitHub.
- [x] Content schema versioning via Git, not SQL.

### Still worth copying **[deferred]** (see [`deferred-tasks.md`](./deferred-tasks.md))

8. Dependabot (weekly npm) and a basic secret scan when the repo is public.  
9. Short project `AGENTS.md`.  
11. `sharp` / `next/image`.  
JSON-LD, OG images, Keystatic. Preview deploys come with Vercel **[next]**.

---

## 4. How a well-built portfolio + CMS is usually done (2026)

Unchanged as a reference. Implementation status:

1. Git is the CMS — **[done]**
2. Structured Zod collections + MDX long-form — **[done]**
3. Stable slugs — **[done]**
4. Optional GUI (Keystatic) — **[deferred]**
5. Hosted headless (Sanity/Payload) — **[won't]** unless collaborators/phone editing appear

Delivery: SSG **[done]** · RSS/sitemap/robots **[done]** · OG images + JSON-LD **[deferred]** · preview deploys with Vercel **[next]** · R2 for blobs **[deferred]**

The February Replit prototype (SPA, client SEO, unused shadcn, composer 501, `maximum-scale=1`) is **gone**.

---

## 5. Recommended migration

### Phase 0 — Freeze product scope **[done]**

- Treat `CURRENT_UX_ANALYSIS.md` as historical.
- Git + MDX is the CMS. No Postgres unless you later add comments or a contact inbox.
- Composer and `POST /api/writing` removed.

### Phase 1 — Hygiene **[done]** (via rewrite, not on Express)

1. `.nvmrc`, `.env.example`, Zod `lib/env.ts`
2. ESLint + Prettier; unused shadcn gone with `client/`
3. Unused passport/session/Replit stack gone
4. Vitest over `content/`
5. GitHub Actions workflow in-repo
6. Viewport fix; Express body logging gone
7. Writing links use slug; numeric id 308s

### Phase 2 — Framework migration **[done]** except items marked deferred

Next 16 App Router, React 19, Tailwind 4, `next/font`, Zod collections, Vitest, Husky + CI file, sitemap, RSS, `headers()`.

- **`next/image` + sharp** — **[deferred]**
- **GitHub/ORCID build-time snapshots** — **[deferred]**
- **Production host (Vercel)** — **[next]**, not deferred

### Phase 3 — CMS that feels “full”

1. **[done]** MDX for writing + typography plugin
2. **[deferred]** Keystatic (or Decap) on `content/`
3. **[deferred]** `draft: true`; preview deploys **[next]** with Vercel
4. **[deferred]** Related content via shared tags
5. **[deferred]** JSON-LD + per-post OG images
6. **[deferred]** Contact form via Resend (optional, no DB)

### Phase 4 — Polish

- Hosting / preview deploys — **[next]** (Vercel)
- Design-token leftovers, motion — as needed during UX work
- Plausible, Sentry, i18n, R2 — **[deferred]** (see deferred-tasks)

---

## 6. Suggested “definition of done” before new features

You can iterate on UX again — this bar is met:

- [x] `npm run typecheck && npm run lint && npm run test && npm run build` exist
- [x] CI workflow file exists (enable it on GitHub; see below)
- [x] Every page’s `<title>`, description, and OG tags are in the HTML source
- [x] Writing URLs are slugs; MDX renders headings/lists/links
- [x] `content/` files fail CI if schema is wrong
- [x] No unauthenticated write API
- [x] Sitemap + RSS live
- [x] Fonts are two families, self-hosted
- [x] Pinch-zoom works

---

## 7. Mapping: lab file → portfolio equivalent

| Lab | Copy as | Portfolio | Status |
|---|---|---|---|
| `src/platform/env.ts` | Yes | `lib/env.ts` | **[done]** |
| `.env.example` / `.nvmrc` | Yes | same | **[done]** |
| `eslint.config.mjs` / `.prettierrc.json` | Yes | Next vitals + TS | **[done]** |
| `.github/workflows/ci.yml` | Yes | no `db:*` / Stripe | **[done]** file; enable on GitHub |
| `src/app/sitemap.ts` + `generateMetadata` | Yes | + writing slugs | **[done]** |
| `src/platform/security/csp.ts` | Later | `headers()` in `next.config` | **[partial]** / nonce CSP **[deferred]** |
| `drizzle/` + `docker-compose` | No | Git files | **[won't]** |
| Better Auth / Stripe / BullMQ | No | — | **[won't]** |

---

## 8. Bottom line

The Feb SPA is replaced. You now share the lab’s *web platform* (Next 16 / React 19 / Tailwind 4 / Zod env / CI file) and kept Git as the CMS, with MDX for writing.

**Next product work:**

1. **[next]** Push, PR, GitHub Actions, Vercel.
2. UX iteration on existing pages — unblocked.
3. Everything in [`deferred-tasks.md`](./deferred-tasks.md) only when its scenario is true.

---

## CI / CD — do you have to set up workflows for every PR?

**No.** You do not create a new workflow per PR.

What already exists:

- One workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- It already says `on: pull_request` and `on: push` to `main`
- Every PR (and every push to `main`) **reuses that same file**. GitHub runs the `verify` job automatically.

What *you* still do once:

1. **Push the repo** (including `.github/workflows/ci.yml`) to GitHub.
2. In the repo: **Settings → Actions → allow Actions** (usually on by default).
3. Optional but useful: **Settings → Branches → Branch protection** on `main`: require the `verify` check to pass before merge. That is how CI becomes a gate, not a suggestion.
4. **CD (deploy)** is separate from CI. The workflow today only *checks* the app. To publish:
   - Connect the GitHub repo to **Vercel** (or Cloudflare Pages): production deploy on merge to `main`, **preview URL per PR** with no extra workflow file.
   - You do not need the lab’s SSH/PM2 deploy scripts for this site.

You do **not** need Dependabot, gitleaks, or the lab’s deploy.yml to keep building. Add those later if the repo is public or you want weekly npm bumps.

Locally you already have Husky: `lint-staged` on commit. CI is the same checks on a clean machine.
