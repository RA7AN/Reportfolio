# Portfolio V2 — Engineering Evidence Investigation (Batch 3)

**Date:** investigation performed 18 October 2026; all Git, Actions and filesystem observations are as-of that date. Document written 22 October 2026.
**Status:** Investigation only. No application code, content, configuration, Git history, workflow, or deployment setting was modified in either repository. This is an internal working document: it lives in `docs/`, is deliberately outside `content/` and `public/`, and is not committed — nothing here enters the published site.
**Audience it serves:** graduate admissions committees, research programs, fellowships, academic reviewers.
**Target repository:** `/Users/rayyan/Developer/rv002/ai-lab-platform` — an **employer** repository, not this portfolio. See §6 before anything in it is reused publicly.
**Predecessors:** [reconnaissance](./portfolio-v2-reconnaissance.md) → [claim-to-evidence audit](./portfolio-v2-claim-to-evidence-inventory.md) → [research evidence register (Batch 1)](./portfolio-v2-research-register-batch1.md).

**Method note.** Every finding below was verified against the actual repository, not against prior planning notes. Where a value could only be pattern-matched, that is labelled. Where evidence required production access, the gap is recorded and the investigation stopped rather than the gap being filled by inference. Code volume, commit counts and file counts are explicitly rejected as impact proxies (§3, "Not metrics").

---

## 1. Executive summary

The target repository contains **an unusually rich set of evidence-*generating* machinery, and almost no evidence-*produced* numbers that are currently obtainable without production access.** That distinction drives every recommendation below.

**What already exists and is usable in principle (code-verified):**

- A **gold-set evaluation harness with a real release gate**: `scripts/evals/run.ts` + `src/platform/evals/verdict.ts` (pure, unit-tested), 55 declared LLM phases each carrying a metric and threshold, 4 phases with committed gold sets, a `--dry-run` mode that provably touches no DB, no model and no spend, and a `--compare` mode that fails a candidate worse than its baseline on score, must-pass failures or label accuracy.
- A **decision log with provenance requirements**: `docs/llm/DECISIONS.md` is append-only and forbids a fast-tier promotion without naming the baseline and candidate `eval_runs` ids. It currently holds 4 dated rows, all with `n/a` run ids — the discipline is real; the measured application of it is not yet exercised.
- A **reliability rulebook that is pure and testable**: `src/platform/mission-control/alerts/rules.ts` centralises 16 alert rules and their thresholds, uses MAD-based robust statistics with a minimum-sample guard, and encodes an "unknown, not cleared" dependency rule specifically to prevent false recoveries and alert flapping. Its unit tests run with no database.
- A **reproducible CI gate** with two jobs — full `verify`, plus a `migrate` job that applies all 208 migrations against a fresh pgvector Postgres, runs `drizzle-kit check`, and asserts that regenerating the migration snapshot produces **no diff** (schema-drift detection).
- Two dated, rigorously self-labelling internal audits: `docs/production-readiness-audit.md` (966 lines, every line tagged `[FACT — code]` / `[INFERENCE]` / `[FACT — ext]`) and `docs/SECURITY-FACT-BASE.md` (417 lines, pinned to named commits with dated re-audits).
- A **UAT library** of authored, traceable test cases in git, with a `milestone-gate.mjs` GO/NO-GO command that has an explicit pass rule.

**What is *not* usable, and why:**

- **There is no production performance evidence, and there cannot be from this repo.** The readiness audit states it plainly: "no production telemetry exists", and its p95 and error-rate figures are k6 **acceptance targets**, not measurements. Sentry is configured with `tracesSampleRate: 0` and no-ops without a DSN. Any latency, throughput or uptime number would be invented.
- **Every operational number lives behind production credentials**: feedback volumes, used-as-is rates, spend totals, queue health, alert history, the release ledger. Per the task's constraints these gaps were documented, not reached for.
- **Health snapshots are pruned at 30 days**, so even with access there is no long-window uptime series to claim.

**The single most important finding is not about the code — it is a disclosure finding.** This is a private employer repository (`"private": true`, remote `revent-tech/ai-lab-platform`) containing confidential product names, customer-impact semantics, internal workflows, a production URL and a security fact base that itself instructs that certain dormant connectors "must not be described publicly as available". Technical access does not imply permission to publish. Nothing from this repository should reach the portfolio until disclosure clearance is established with the employer. That question is blocking, not advisory.

**Separately, Phase 2B surfaced a live defect in this portfolio's own GitHub evidence pipeline** — the daily refresh workflow is green but is a no-op, and the published dataset was 17 days stale at the time of inspection — plus a previously undocumented privacy property: the deployed JSON publishes the work GitHub handle. Details in §4.

---

## 2. Evidence inventory

External paths below are relative to the target repository root (`ai-lab-platform`). Portfolio paths link into this repository.

| Evidence category | Source/location | What it proves | Provenance | Privacy risk | Public suitability | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Eval harness CLI + gates | `scripts/evals/run.ts` (218 ln), `src/platform/evals/verdict.ts` (67 ln) | Measured pass/fail gate on LLM behaviour; regression comparison; cost ceiling | Code-read; not executed | Low (names internal phases) | Needs employer clearance | Run `npm run eval -- --all --dry-run`, capture stdout + date |
| LLM phase manifest | `src/platform/harness/manifest.ts` | 55 governed LLM phases, each with declared metric + threshold; tiered burn-in status (4 burned-in / 6 candidate / 47 never) | Counted from source 2026-10-18 | Medium — internal taxonomy | Safe as a _count_, not as a table | Confirm counting method matches intent before publishing |
| Decision log | `docs/llm/DECISIONS.md` | Dated, append-only change log requiring named baseline+candidate run ids for a promotion | 4 rows, 2026-09-25 → 2026-10-02, all run ids `n/a` | **High** — founder names, internal IDs, phase names | Curated paraphrase only | Ask whether any measured promotion row exists in a newer commit |
| Alert rulebook | `src/platform/mission-control/alerts/rules.ts` (492 ln) + its `.test.ts` | Reliability engineering with named failure modes: anti-flapping deps, robust MAD anomaly detection, page/notice routing, a documented blind spot (the evaluator lives inside the worker) | Code-read; unit tests exist, not run by me | Low-medium | Strong candidate — describe the _design_, quote nothing production-specific | Run the pure unit tests locally; capture test names |
| Health/uptime definition | `src/platform/db/schema/health-snapshots.ts` | A defensible uptime definition: share of _expected_ 5-min snapshots present AND all-ok; missing rows count as downtime by construction | Code-read | Low (definition), High (data) | Definition publishable; the number is not | Publish only as "how I defined and measured uptime", with date + source |
| CI build gate | `.github/workflows/ci.yml` | Reproducible gate: typecheck/lint/format/test/build + production-mode worker smoke; migration job applies 208 migrations from zero and asserts `db:generate` is a no-op | Code-read; local run not performed | Low-medium | Good — generalisable as a practice, no internal specifics needed | Optional: run the `verify` steps locally, capture output |
| Documented incident learning | `ci.yml` comments (PR #761 cold-tsc OOM, measured OOM at 2048 / clean at 3072; the 2026-09-19 prod worker outage while the web health gate stayed green) | A real production failure converted into a durable CI guard | Self-reported in-repo, dated, commit-linked | **High** — PR number, outage detail | Not publishable as-is; usable in an interview narrative | Ask whether incident write-ups may be generalised |
| UAT case library + gate | `docs/uat/` (63 CSVs), `scripts/uat/milestone-gate.mjs`, `docs/uat/README.md` | Authored, traceable test cases with an explicit GO/NO-GO release rule | Parsed 2026-10-18: 888 18-column master cases; +566 import-shape, +80 reserve, +53 harness, +43 SME rows | Medium — agent names, tester names | Safe as counts if the employer clears the project | Re-count with a dedup rule across overlapping libraries |
| Gold sets (evaluation data) | `evals/feedback/classify.jsonl` 47, `evals/customer-copilot/triage.jsonl` 46, `evals/ceo-brain/intent.jsonl` 37, `evals/customer-copilot/retrieval-policy-alignment.jsonl` 2 = **132 cases** | A held-out behavioural test set that gates releases; inputs are "synthetic or consented" per `eval-runs.ts` | Counted 2026-10-18 | Low if synthetic; **must verify** no customer data | The consent basis is the publishable part | Spot-check gold-set contents for PII before any screenshot |
| Security fact base | `docs/SECURITY-FACT-BASE.md` (417 ln) | Security claims audited against pinned commits with dated re-audits, plus explicit publication guardrails on dormant features | Code-read; commits `e1fb2260`, `09a581a6`, `c6762212`, PR #929 | **High** | Do not quote | Ask whether a sanitised subset may be cited |
| Production readiness audit | `docs/production-readiness-audit.md` (966 ln) | Honest gap analysis with fact/inference tagging; verdict "conditionally ready for a controlled beta" | Code-read (targeted grep) | **High** — k6 targets, risk register | Not publishable; strong interview material | Treat as internal |
| Feedback engine design | `src/platform/db/schema/feedback.ts` (369 ln), `output-feedback.ts`, `feedback-themes.ts`, `uat.ts` | A privacy-designed pipeline: DEK-encrypted bodies, hash dedup without decryption, PII link shed on account erasure, no free text in telemetry tables, human gate before build | Code-read | **High** — customer-facing semantics | Only the _architecture_ is discussable, and only with clearance | Decide what architecture detail is permitted |
| LLM cost metering | `src/platform/db/schema/llm-usage.ts` | Exact per-workspace-day token accounting with cache-aware cost in micro-USD, explicitly labelled "approximate; enforcement is token-based" | Code-read | High — spend figures | Definition publishable, values not | Requires prod DB → **blocked by the task's constraints** |
| Release ledger | `src/platform/db/schema/pr-ledger.ts` | One row per deploy that reached the health gate, with a stamped release boundary and PR attribution | Code-read | High | Not without clearance | Ask |
| Portfolio GitHub snapshot | [fetch-dev-activity.mjs](../scripts/fetch-dev-activity.mjs), [dev-activity.yml](../.github/workflows/dev-activity.yml), [dev-activity.ts](../lib/dev-activity.ts), `public/dev-activity.json` | Aggregate cross-account contribution evidence with repository names deliberately withheld | Verified end-to-end 2026-10-18 | **Live issue** — publishes the work handle `abdljwd`; dataset stale | Fixable; see §4 | See §7 steps 1–2 |
| Repository provenance | `git log`, branches | 741 commits on the current branch, 2026-04-29 → 2026-10-16, clean tree at `f9474446`; 117 remote `agent/*` branches, 15 distinct ticket ids | Measured 2026-10-18 | **High** — branch names carry employer feature codes | Commit counts are a **volume proxy**, not impact | Do not use as a metric |

---

## 3. Candidate portfolio metrics

Deliberately few numeric candidates: almost every number in this repository is either (a) a target rather than a measurement, or (b) locked behind production data that was out of scope. The file/commit/test counts were measured and are listed at the end of this section **as explicitly rejected items**.

### Tier 1 — reproducible, no production access, defensible

**M1 · Gated evaluation harness with a no-spend dry run**

- **Definition:** an evaluation command that replays a committed gold set through the same production step builder used at runtime, scores it against a declared metric and threshold, and returns exit code 1 on failure so it can gate a manual release. `--dry-run` validates the gold set and prints coverage without DB, model or spend. `--compare` fails a candidate worse than its baseline on score, must-pass failures, or label accuracy.
- **Source:** `scripts/evals/run.ts`, `src/platform/evals/verdict.ts`.
- **Collection period:** harness Wave 1 onward; decision-log rows dated 2026-09-25 → 2026-10-02.
- **Verification status:** **directly observed in source**; gate semantics additionally covered by unit tests.
- **Reproducible:** yes — `--dry-run` and the pure verdict tests need no credentials. **Not executed during this investigation.**
- **Disclosure status:** blocked on employer clearance; the command references internal phase names.

**M2 · Governed LLM phases with explicit quality bars**

- **Definition:** the number of LLM call sites modelled as named phases, each carrying a declared metric and numeric threshold in a single manifest.
- **Source:** `src/platform/harness/manifest.ts`. Measured 2026-10-18: 55 phase entries; metric kinds — schema-pass-rate 17, judge-score 13, used-as-is-rate 10, faithfulness-rate 9, field-exact 5; thresholds observed in the 0.6–0.95 range; fastTier — 4 burned-in, 6 candidate, 47 never.
- **Verification status:** **calculated from source by pattern match**, not by an authoritative tool. The regex could over- or under-count; verify against `ALL_PHASES`.
- **Reproducible:** yes, with the caveat above.
- **Disclosure status:** the count is far more publishable than the table. "47 of 55 phases are not yet trusted enough to run on the fast tier" is a more honest and more interesting claim than "55 phases governed".

**M3 · Authored evaluation cases held in version control**

- **Definition:** 132 gold-set cases across 4 phases (47 / 46 / 37 / 2), each a JSONL case with pinned expected fields and must-pass marking; inputs are synthetic or consented by design.
- **Source:** `evals/**/*.jsonl`, counted 2026-10-18; the consent rule is stated in `src/platform/db/schema/eval-runs.ts`.
- **Verification status:** **directly observed**; reproducible.
- **Missing information:** the case contents were not opened. Before any count or screenshot is published, someone must confirm no customer data slipped into a gold set.

**M4 · Release-blocking migration-drift assertion**

- **Definition:** CI applies every committed migration against a fresh Postgres + pgvector, runs the schema checker, then regenerates the migration snapshot and fails if `git status` shows any diff — i.e. migrations and schema are provably in lockstep.
- **Source:** `.github/workflows/ci.yml`, `migrate` job; 208 SQL migration files counted locally.
- **Verification status:** **directly observed in the workflow definition**; the count is a filesystem measure.
- **Reproducible:** yes, locally, Docker permitting.

**M5 · An availability definition with an explicit denominator**

- **Definition:** uptime over a window = share of _expected_ 5-minute health snapshots that exist and report all probes OK; a dead worker writes nothing, so absence counts as downtime by construction.
- **Source:** `src/platform/db/schema/health-snapshots.ts`.
- **Verification status:** **the definition is directly observed; the resulting number is not obtainable** — and snapshots are pruned at 30 days, so no long-window claim is possible even with access.
- **Recommendation:** publish the definition and the pruning limit as an engineering-judgment item, never a percentage.

### Tier 2 — exists but unverifiable without production access (documented, not used)

**M6 · Feedback throughput and disposition rates.** The pipeline records capture source, LLM classification, dedup verdict, human disposition, priority and pipeline stage. No aggregate is computable from code; all values require the production DB. **Blocked by the task's constraints.**

**M7 · Outcome-chip quality rates.** `used-as-is-rate` is a real manifest metric with thresholds on 10 phases, sourced from a three-state chip (used as-is / used with edits / not usable) with a time-saved bucket sampled 1-in-5 on positive outcomes, upserted one row per (workspace, agent, output, user). The **measurement design** has a clear denominator, definition and window; the **values** need production. This is the strongest publishable claim available _if_ the employer later permits a curated dated snapshot.

**M8 · LLM spend metering.** Exact token counts with cache-read/cache-write separated, cost in micro-USD from list prices, self-labelled approximate with enforcement on tokens rather than price. Values require production.

**M9 · Alert history.** `alert_events` carries a partial unique index enforcing one open alert per (rule, subject) with notify-on-open semantics — a genuinely good anti-notification-storm design. Counts require production.

### Not metrics — do not publish

Test-file count (1,246), test-occurrence count (≈11,397, a grep proxy), TS/TSX file count (5,514), API route count (164), agent-slug count (15), script count (33), commit count (741 on-branch / ≈3,580 across all refs), branch count (117 `agent/*`). Each is **volume, not impact**, and the task's rules prohibit using them as proxies for impact. They are recorded here so it is clear they were measured and deliberately rejected.

**Rejected on evidence, not assumption:** any latency, p95, error-rate or uptime figure. `docs/production-readiness-audit.md` labels them `[INFERENCE]` and states that no production telemetry exists; the p95 numbers are k6 acceptance targets. Publishing them would be fabrication.

---

## 4. GitHub snapshot audit

Verified against the actual files and the live Actions history — not against prior planning notes.

**Data flow.** [fetch-dev-activity.mjs](../scripts/fetch-dev-activity.mjs) reads three account credentials from env (`GH_ACTIVITY_USER_1..3` / `GH_ACTIVITY_TOKEN_1..3`), issues one GraphQL `contributionsCollection` query per account for a rolling 52-week window plus one query per calendar year per account back to the oldest account's creation year, merges daily counts across accounts, and writes `public/dev-activity.json`. [lib/dev-activity.ts](../lib/dev-activity.ts) (`server-only`) reads it at render time and returns `null` when the file is absent, so the section hides itself. [dev-activity.yml](../.github/workflows/dev-activity.yml) schedules the refresh at `17 4 * * *` plus manual dispatch, then commits and pushes the file as `github-actions[bot]` with `permissions: contents: write`.

**Privacy properties — one good, two bad.**

- ✅ **Repository names are fetched and then deliberately withheld.** The query requests `nameWithOwner` for all four contribution breakdowns, the script ranks them, and the emitted object contains only `repoCount: ranked.length`. The script's comment at lines 303–305 states the reason: private and employer repos must never leak through the deployed site. `restrictedContributionsCount` is fetched for diagnostics and likewise never written to the output. **The invariant holds** — the committed JSON's top-level keys were confirmed to be exactly `generatedAt, windowFrom, windowTo, total, accounts, types, repoCount, weeks, previousTotal, years`.
- ⚠️ **The `accounts` array publishes GitHub logins, including the work handle.** The deployed file contains `["RA7AN", "abdljwd", "AbdulJ-7"]`. This is an unredacted link between a personal identity and an employer account, shipped in a public artifact, and it lets a reader attribute the aggregate contribution total to a named work account. This is the leak vector the withheld-repo-names rule was written to protect against, sitting one field away from it. **A disclosure decision is required.**
- ⚠️ **A hard-coded manual correction is baked into the shipped code.** `MANUAL_REVIEWS = { abdljwd: 30 }` elevates the rolling-window review count to a profile-radar figure because the API returned 1 review even with `read:user` and zero restricted contributions. The rationale is honestly documented (the radar counts review activity the API omits) and the instruction "update when the user shares a fresh radar" makes this a **manually reported, screenshot-sourced number, not an observed one**. Two consequences: the published review figure silently goes stale as the radar changes, and the rolling total now disagrees with the per-year totals, which stay raw — the same `reviews` field means two different things inside one file.

**Reproducibility and dating.** The file is self-describing: `generatedAt` (full ISO timestamp), `windowFrom` / `windowTo`, and per-year grids. The script derives the window from UTC, so a rerun is reproducible modulo GitHub's own counts. There is no checksum and no source-of-truth annotation, and the manual override carries no date — those are the reproducibility weak points.

**Update cadence — evidenced defect.** The workflow is **not** updating the data. Verified with read-only queries on 18 October:

- Eight consecutive scheduled runs from 2026-10-10 through 2026-10-17, **all `success`**.
- The newest run's step list: `skipped — Run npm run dev-activity`; the commit step then succeeds by design (`git diff --cached --quiet && exit 0`).
- Latest commit touching `public/dev-activity.json` on `main`: `b6dd115`, 2026-10-01, authored by **`abdljwd`** — a human, not the bot.
- Local dataset `generatedAt`: `2026-10-01T00:45:59Z` → **17 days stale as of 18 October**, and its 52-week window (`2025-10-05 → 2026-10-03`) no longer ends at the current week, contradicting the file's own stated purpose.

The `if: vars.GH_ACTIVITY_USER_1 != ''` guard was written precisely so an unconfigured repo "does not fail red every night" — so a green, silently-skipping schedule is the _designed_ failure mode of a missing variable. The cause could not be confirmed: listing repository Actions variables with the active account returned **HTTP 403** ("you must have repository read permissions … or the repository variables fine-grained permission"), and no account switch was performed for this. The published dataset is therefore currently refreshed only when `npm run dev-activity` is run locally and committed — which is what the 2026-10-01 history shows.

**Does the workflow need maintenance?** Yes, on evidence: a daily job that produced zero commits in 17 days while reporting success; a published field that names a work account; and an undated manual override. None of this requires new machinery — it requires configuring one variable and three secrets, deciding what `accounts` should contain, and dating the review override.

**Remediation, 23 October 2026.** The silent-skip guard and the no-change success path were removed from `dev-activity.yml`; a scheduled run now fails when configuration is missing, and a run that rewrites nothing fails. The manual review override is emitted into the dataset's `provenance.manualAdjustments` with its as-of date (`2026-10-01`, PR #14, derived from `git log -S`) and the api-observed value it replaced, and a half-configured account pair is now a hard error rather than a silent under-report. A `concurrency` group prevents two runs racing for the same push. The dataset was regenerated locally: `generatedAt` 2026-10-22, window 2025-10-26 → 2026-10-24, total 652 across 3 accounts. A shape/privacy guard was added at `lib/dev-activity.test.ts`.

**Decision recorded (owner):** the account handles **stay in** `public/dev-activity.json` and are removed from the rendered card only — the `[handle]` pill row was replaced by a visible as-of date line. So the finding above is **mitigated in presentation, not closed**: the handles remain directly fetchable at `/dev-activity.json`, they remain in two earlier committed revisions of that file, and — discovered during verification — they are also serialized into the homepage's React Server Components payload (`index.html`, `index.rsc`) because the full dataset object is passed as props to the client component. Stripping `accounts` before that hand-off is the outstanding step if the goal is "not visible in the page source" rather than "not visible on screen". The `restricted`/private-activity caveat above (private-repo contributions are counted in the published totals and cannot be separated from a contribution calendar) is unchanged.

---

## 5. Feedback and telemetry audit

**What feedback is actually collected — four distinct kinds that must not be conflated in a portfolio claim.**

1. **Human user feedback** (`feedback_items`, 369-line schema). Per-workspace, open to any member, captured via note / voice / upload / one-tap reaction / moment-of-friction / flag-an-artifact. The **body is DEK-encrypted at rest** (`bodyCiphertext bytea`), justified in-comment: a report can quote private screens. A `contentHash` of the plaintext (computed pre-encryption) powers exact dedup **without decryption**. Non-sensitive routing context (`route`, `agentSlug`, `itemRef`) stays plaintext for querying. The `userId` FK is `set null` on deletion so the workspace keeps the signal while shedding the PII link.
2. **Automated evaluation of that feedback** — an LLM classification job fills `type / severity / sentiment / area / theme / classifierConfidence / isSpamAbuse`; a Voyage 1024-dim embedding plus cosine threshold drives dedup with a human-review gray band; an AI dedupe resolver records `merged / distinct / uncertain` with a rationale shown when the model steps aside; a vision analyst pass produces `attachmentObservation`, `verificationVerdict` (`confirmed / not_reproducible / uncertain`) and `verificationCitations` **filtered to files actually supplied**, so a hallucinated path never persists.
3. **Human developer/operator judgement** — `priority` is explicitly "the board OUTPUT — never a classifier field"; `disposition` (accepted / declined / snoozed / awaiting_info) carries `dispositionBy` / `dispositionAt` audit; an append-only `builderQa` thread records maintainer↔analyst rounds; `adminDirection` is treated as **trusted operator intent** while the reporter's clarification is untrusted. A DB trigger (migration 0077) writes `feedback_pipeline_events` on every stage change — the append-only log is enforced at the storage layer, not by app code.
4. **Outcome telemetry** (`output_feedback`) — three-state chips plus an optional reason plus a 1-in-5 sampled time-saved bucket, **upserted per (workspace, agent, output, user)** so volume is bounded by outputs actually rated, with "no free-text column by design: prose feedback goes through the DEK-encrypted feedback pipeline, never into plaintext telemetry". Plus `product_events` (`export` / `download` / `regenerate`) as an implicit quality signal.

**Which aggregates exist.** The pipeline is built so aggregates _can_ be derived: `requesterCount` is literally "distinct rank-eligible requesters in this cluster" with low-confidence items excluded (a documented denominator rule); `used-as-is-rate`, `faithfulness-rate`, `field-exact`, `schema-pass-rate` and `judge-score` are manifest metrics with numeric thresholds; the UAT board reports `passed N / M` per milestone; the twice-daily Slack digest emits `<passed>/<total> passed · ✗ N failed · N to retest · N open`. **Each of those has a definition, a denominator and a time window — exactly the properties required of a publishable measurement.**

**Not one value is obtainable from the repository.** All of them are SQL reads against a production database. No script exports them, no static artifact contains them, and no committed snapshot exists. Nothing was queried.

**Admin and telemetry surfaces — all production-gated.** `/admin/mission-control` (alert + queue + spend dashboards, gated by an `ADMIN_EMAILS` allowlist), a Bull Board queue UI, `alert_events`, `platform_releases`, `llm_usage_daily` (+ detail), `audit_log`, `user_data_exports`, UptimeRobot 5-minute checks on `/api/health` and `/api/ready`, and Sentry. Sentry's configuration is itself a finding: `tracesSampleRate: 0`, `sendDefaultPii: false`, release pinned at build, the entire SDK no-ops without a DSN, source-map upload disabled pending an ops token — i.e. **error and performance monitoring is deliberately minimal, so there is no APM data to mine.** Dedicated runbooks exist (`sentry-production-credentials.md`, `harness-breaker-drill.md`, `manual-dsar-fulfillment.md`, `backup-purge-after-erasure.md`, `production-rollback.md`); they were enumerated, and no figures were extracted from them.

**Could a privacy-safe, manually curated summary support a public claim?** Yes, and it is the only viable path here: a dated, aggregate-only snapshot — e.g. "N feedback items in window [a, b]; disposition split accepted/declined/snoozed; X% of outputs rated 'used as-is'; must-pass eval cases failed: 0" — authored by someone with production access, containing zero identifiers, no per-customer breakdown, no absolute spend, and carrying its own definition + window + denominator. Three conditions must all hold: employer permission, aggregation **before** writing (never export-then-redact), and a stated as-of date. Even then the claim should be about **how the measurement was made**, not about the number.

**Cannot be verified without production access — stated as gaps, not filled with guesses:** any feedback volume, disposition rate, used-as-is rate, alert count, uptime percentage, token or spend figure, UAT pass rate, release count, or eval score. `eval_runs` rows live in the production database; `--dry-run` proves the _gold sets_ are valid but produces no score.

---

## 6. Evidence gaps

**Blocking — needs a decision, in Q1 possibly from the employer:**

1. **Disclosure clearance for the employer repository.** May any part of `ai-lab-platform` appear in a public portfolio at all — project name, repo existence, architecture, metric names, the production URL? Nothing else in this batch is actionable until this is answered.
2. **Confidential entity list.** Agent/product slugs (15), the production domain, customer-impact semantics, founder names in `DECISIONS.md`, PR numbers, outage details. Which are non-negotiable?
3. **Whether performance figures may be published at all.** They are targets; publishing them as results would be fabrication. Confirm they are omitted entirely.

**Unresolved by design (constraints, not code):**

4. Every production-sourced metric in §5 — requires an authorised person to run an aggregate query and hand over the summary.
5. Uptime over any window longer than 30 days is **structurally impossible**; snapshots are pruned.
6. The root cause of the dev-activity skip — repository Actions variables are not readable by the active account (HTTP 403). Needs the repo owner's own session to check Settings → Secrets and variables → Actions.
7. The 55-phase count and the ≈11,397 test-occurrence count are pattern-match measurements from this investigation, not tool-certified. Verify before publishing.
8. Whether the gold-set JSONL files are in fact synthetic-or-consented — the schema comment asserts the rule; their contents were not read.

**Needs input that cannot be inferred:**

9. Should `accounts` in the public JSON keep the work handle, be anonymised to a count, or be limited to public handles only?
10. What is the as-of date and provenance for `MANUAL_REVIEWS = { abdljwd: 30 }`, and should it be dated/annotated in the file?
11. Are there already-authored internal artifacts permitted for reuse — e.g. the breaker-drill report, a milestone-gate `GO` output — which would be the cheapest defensible evidence?

---

## 7. Recommended next steps

Ordered by value per unit of risk. **Step 1 gates everything after it.**

1. **Get the disclosure decision, in writing, before any implementation.** Ask the employer which of these may be described publicly: the system's existence, its architecture, its metric definitions, and any aggregate number. Record the answer with a date. Nothing below is worth doing if the answer is "no". _(Blocking.)_
2. **Fix the portfolio snapshot pipeline — it is this repository, so it needs no clearance.** Configure `GH_ACTIVITY_USER_1..3` plus the three read-only secrets so the scheduled job stops silently skipping; decide the fate of the `accounts` field (§4) and, if it should be masked, note that as an approved change; add an as-of date next to the manual review override. Verify with one successful bot commit. _(Highest value per unit of effort; touches only the portfolio, and only after the edits are approved.)_
3. **Capture the zero-cost, code-only evidence as dated snapshots.** Run locally, in this order, and archive stdout with the commit SHA and date: `npm run eval -- --all --dry-run` (gold-set coverage, no spend); the pure eval unit tests (`verdict`, `score`, `signals`, `gold-sets`, `nightly`); `node scripts/uat/milestone-gate.mjs --milestone <id>`; `npm run worker:smoke`. These are reproducible, credential-free, and are the only _measurements_ this repository can currently yield without production access. _(No new scripts, no writes outside the investigator's own artifacts.)_
4. **Write the two or three architecture claims that survive anonymisation**: the availability definition (M5), the eval gate semantics including the three regression criteria (M1), and the migration-drift assertion (M4). Each becomes one claim with a source path, a date and a reproduction command — no numbers, no names. _(Depends on step 1's scope answer.)_
5. **Request one curated aggregate snapshot from someone with production access**, with a fixed schema: metric name, definition, denominator, time window, value, as-of date, author. Never export raw rows in order to aggregate locally. Attach it to the portfolio as a dated snapshot, not a live claim. _(Depends on steps 1 and 11.)_
6. **Only then** update the [claim-to-evidence inventory](./portfolio-v2-claim-to-evidence-inventory.md) with the newly sourced claims, and decide which of them merit a UI slot.

Steps 2–6 were not performed. Step 3 alone would require executing the target repository's scripts, which is outside a read-only remit, and step 2 edits the portfolio working tree.

---

## 8. Accountability statement

**Active GitHub CLI account:** `abdljwd` — already the active account at the time of the preflight, so **no switch was performed and no credential state was changed**. Authenticated via the macOS keyring against `github.com`, scopes `admin:public_key, gist, read:org, read:user, repo, workflow`. `RA7AN` and `AbdulJ-7` remain present and inactive; nothing was revoked, overwritten or exported. No token was requested, printed, copied or stored; every `gh` invocation was piped through a redacting filter. Note: the work profile was specified as `abdjwd`; the authenticated account is `abdljwd`, and since it was already active the investigation proceeded rather than treating a one-character discrepancy as a blocker.

**Repository inspected:** `/Users/rayyan/Developer/rv002/ai-lab-platform` — resolved and verified before any file read. Its Git root is the same path, its remote is `git@github.com-work:revent-tech/ai-lab-platform.git` (an SSH host alias, which is why the GitHub CLI was not needed for it at all), HEAD `f9474446` dated 2026-10-16, branch `agent/offer-letter/afs-007-post-generation-send`, working tree clean. No other employer repository was enumerated, queried or inspected.

**Commands run (all read-only):** `gh auth status`; `git rev-parse --show-toplevel`, `remote -v`, `branch --show-current`, `status --short`, `log`, `rev-list --count`, `shortlog -sn`, `branch -r`; `find`, `grep`, `sed`, `ls`, `wc`; Python line/CSV parsing for gold-set and UAT case counts; `gh run list` / `gh run view` / `gh api` against the **public** portfolio repository.

**Files examined — target repository:** `package.json`, `AGENTS.md`, `vitest.config.ts`, `.github/workflows/ci.yml`, `scripts/evals/run.ts`, `src/platform/evals/{verdict,nightly,store,signals}.ts`, `src/platform/harness/manifest.ts`, `src/platform/mission-control/alerts/rules.ts`, `src/platform/db/schema/{feedback,eval-runs,health-snapshots,output-feedback,feedback-attachments,feedback-themes,_encrypted-text,uat,alert-events,pr-ledger,llm-usage,product-events}.ts`, `docs/uat/README.md`, `docs/llm/DECISIONS.md`, `docs/llm/HARNESS.md` (structure), `docs/production-readiness-audit.md` (targeted grep), `docs/SECURITY-FACT-BASE.md` (head), `docs/mission-control/AUTO-FIX-LADDER.md` (head), `evals/**/*.jsonl`, `docs/uat/**/*.csv`, `src/instrumentation.ts`, `sentry.server.config.ts`.
**Files examined — this portfolio repository (read-only, for §4):** `scripts/fetch-dev-activity.mjs`, `.github/workflows/dev-activity.yml`, `lib/dev-activity.ts`, `public/dev-activity.json`.

**Not read, by constraint:** any `.env*` file, credential store, private key or token file; no database connection of any kind was opened; no production system was contacted; no secrets appear in this document.

**Blocked by access limitations:** repository Actions variables for the portfolio repo (HTTP 403 with the active work account — needs the personal account's own session); all production-sourced metrics (§5); the full text of the paywalled IEEE article (from Batch 1, unchanged).

**State left behind:** nothing at investigation time. Both repositories were byte-identical to how they were found — this portfolio's working tree showed only the untracked `docs/portfolio-v2-*.md` working documents, and the target repository remained clean at `f9474446`. This document is the first and only file written during Batch 3, added to `docs/` on 22 October 2026 at the owner's request.
