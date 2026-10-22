# Portfolio V2 — Claim-to-Evidence Inventory

**Date:** 17 October 2026
**Status:** Read-only content audit. No code, content, schema, configuration, or dependencies were modified, and no implementation was started.
**Purpose:** Audit every factual claim in the 7 project, 5 publication, and 6 honor records against the evidence that exists today, so Portfolio V2 can present claims that are accurate, verifiable, and ready for a structured, committee-facing dashboard. This is the audit proposed in section 7 of [portfolio-v2-reconnaissance.md](./portfolio-v2-reconnaissance.md).
**Scope:** 7 projects, 5 publications, 6 honors (18 records). External links were followed once each for liveness/content confirmation only (no repo contents, commits, or history were inspected). Per the audit constraint, **nothing below is treated as true merely because it exists in the repository** — repository presence never earned better than "internally supported."

**Evidence strength legend**

| Label | Meaning |
|---|---|
| **Verified** | Confirmed during this audit against a live external source; who controls the source is noted |
| **Internally supported** | Corroborated by another record/artifact inside the repository |
| **Self-reported** | Stated by the site only (a fetched self-controlled repo may corroborate, but is still your own artifact) |
| **Unverified** | No evidence located; needs action or may be unverifiable |

---

## 1. Executive summary

The content baseline is **healthy mechanically** (all 18 records parse; `npm test` green; `index.md` duplicates currently match their individual files field-for-field) but **weak evidentially for a committee audience**, with three systemic problems:

1. **The flagship research record is self-defeating.** MMVTG (id 4) is the strongest research story on the site — IEEE-published, metrics beating prior SOTA — yet it is categorized `isResearch: "no"`, its metrics (R1@0.5 60.5, mAP 61.55) exist only in prose with **no public source** (its own repo's Results section is a TODO and the paper PDF is not yet uploaded per the repo roadmap), its `tools` list claims "RAG" which its own repo README explicitly disclaims, and the record never links to its publication. The linked repo (renamed `MMVTG_UI` → `MMVTG`) even carries an incomplete citation block (empty author/journal, year 2025 vs the publication record's 2026).
2. **One venue claim is structurally contradicted.** Publication id 1 says "Published IEEE Access 2026" / `kind: "Journal"`, but its DOI `10.1109/ICETSIS68266.2026.11548957` matches IEEE **conference-proceedings** DOI format (`10.1109/<conference><meeting-id>.<year>.<article>`, i.e., ICETSIS 2026), not the IEEE Access journal pattern (`10.1109/ACCESS.<year>.<id>`). My automated check was blocked (HTTP 406), so this needs a two-minute manual look — but a mislabeled venue on the one indexed publication is exactly what an admissions reviewer would catch.
3. **Employer-confidential material is published on the public `/projects` page.** The Slack Export card narrates an employer incident ("platform migration," "administrative permission and ownership transfer issues," "150+ employees") with an unsourced counterfactual impact claim; the `kyc-revent` public repo documents a proprietary UAE KYC system whose README sample paths include **real-looking document types and a real bank's name**; the AgentSmith repo README's install instructions still reference `github.com/deccanAI/tool-call-interface` (an employer repo). All three need clearance or sanitization before V2 points evaluators at them.

Also notable: **one evidence link is dead** (CogniConverse → 404), **no publication record anywhere carries author names** (the single largest schema gap for this audience), two publications are **duplicated into the writing collection as stubs** (one stub body is a note addressed to you), and the Revent project contradicts its own experience record on start date (Apr vs Jun 2026).

---

## 2. Claim-to-evidence inventory

### 2.1 Projects (`content/projects/*.md`, loaded by `getProjects()` → [lib/content/index.ts](../lib/content/index.ts#L103-L105))

#### P-1 · KYC Automation using OCR and NER models (id 1) — [kyc-automation-using-ocr-and-ner-models.md](../content/projects/kyc-automation-using-ocr-and-ner-models.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 1.1 | "KYC decisions from document upload to approve, review or reject, automated." (`highlights[0]`, L24) | contribution | [Repo](https://github.com/RA7AN/kyc-revent) live (fetched); README documents `/kyc/evaluate` with `AUTO_APPROVE`/`manual_review`/`AUTO_REJECT` thresholds | Self-reported, repo-corroborated | Demo or write-up link | **HIGH** — repo is a proprietary-licensed system named "kyc-revent"; README references UAE passports, trade licenses, bank statements, and a real bank's name in a sample file path; `sample-documents/` may contain real customer documents → audit before sharing | verify + sanitize check |
| 1.2 | "Architected the platform: OCR extraction, weighted risk scoring and decision services." (`highlights[1]`, L25) | role / contribution | Same repo README (Node/Express + Python/FastAPI OCR service) | Self-reported, repo-corroborated | Clarify solo vs team, and your role title at the time | Same as 1.1; confirm employer disclosure approval | clarify |
| 1.3 | "Designed weighted risk scoring engine combining identity matching, document completeness, financial strength, and document quality signals…" (`highlights[2]`, L26) | contribution | Repo README documents **exactly these four signals** with weights (0.25/0.25/0.30/0.20) in `risk-config.yaml` | Self-reported, **strongly** repo-corroborated (exact content match) | None on content | Same as 1.1 | keep (substantiated) |
| 1.4 | `dateLabel: "Feb 2026"` (L22) | other (date) | README example response timestamped Feb 2026 | Internally consistent | **Contradiction risk:** predates the Revent employment start ("Jun 2026" in [revent-lab.md](../content/experiences/revent-lab.md#L14)) though the repo is named "kyc-revent" | — | clarify (employer relationship + dates) |

#### P-2 · Slack Export Utility (id 2) — [slack-export-utility-organization-wide-data-archival-tool.md](../content/projects/slack-export-utility-organization-wide-data-archival-tool.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 2.1 | "Python-based internal utility… enabling secure export of Slack messages and media during platform migration." (`highlights[0]`, L20) | contribution | [Repo](https://github.com/AbdulJ-7/Slack_Exporter) live (fetched); its README is a generic, sanitized personal-tool guide with **no employer named** — the employer context exists only in this card | Self-reported | — | **HIGH** — the card (not the repo) narrates an employer event ("internal," "platform migration"); repo published under a personal account; confirm employer approval for both | sanitize pending review |
| 2.2 | "Enabled 150+ employees to securely archive critical operational data, preventing large-scale data loss due to administrative permission and ownership transfer issues." (`highlights[1]`, L21) | impact (number + counterfactual) | None | **Unverified** | Source for "150+"; the counterfactual ("preventing") is nearly impossible to evidence — rephrase as scope with approval | **HIGH** — org headcount + incident specifics (permission/ownership transfer) | substantiate or sanitize |
| 2.3 | "Produced technical documentation and walkthrough video…" (`highlights[2]`, L22) | artifact | None linked | Unverified | Link public-safe versions of docs/video, or drop the mention | MEDIUM (video may show employer workspace) | omit pending review |
| 2.4 | `showOnLanding: "no"` (L26) | visibility | — | — | Note: hides from home grid **only**; the card still renders on `/projects` | — | clarify (visibility intent) |

#### P-3 · AgentSmith: Multi-LLM AI Agent Hub (id 3) — [agentsmith-multi-llm-ai-agent-hub.md](../content/projects/agentsmith-multi-llm-ai-agent-hub.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 3.1 | "Unified orchestration across 20+ APIs, from tool calls to multi-step workflows." (`highlights[1]`, L25) | contribution (**metric in prose**) | [Repo](https://github.com/RA7AN/Tool_call_mirror) live (fetched); README is titled "AgentSmith" but enumerates ~5 LLM providers + ~11 tool API configs — I could not count 20+ from it | Self-reported; **number under-supported by linked evidence** | Define the count basis (providers? endpoints? tools?) or adjust; make it a structured metric | **MEDIUM** — README install instructions still say `git clone https://github.com/deccanAI/tool-call-interface` (employer repo leak); `dateLabel` "Jun 2025" falls inside Deccan AI tenure (Dec 2024–Feb 2026) | clarify + substantiate; sanitize README / confirm attribution |
| 3.2 | "Implemented persistent memory and dynamic context management." (`highlights[2]`, L26) | technical | README: "Persistent chat history with SQLite" supports the memory half | Self-reported, partially corroborated | "dynamic context management" not evidenced in README | Same attribution question as 3.1 | keep (clarify) |
| 3.3 | Project name "AgentSmith" vs repo named `Tool_call_mirror` (L11) | other | Fetch confirms the repo's README is titled "AgentSmith" | Internally consistent | Rename the repo or note the mapping | — | clarify |

#### P-4 · MMVTG: Video Temporal Grounding (id 4) — [mmvtg-multi-modal-video-temporal-grounding.md](../content/projects/mmvtg-multi-modal-video-temporal-grounding.md) — _flagship research record_

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 4.1 | "Built the retrieval model: R1@0.5 of 60.5 and mAP of 61.55" (`highlights[1]`, L21) | research result (**metrics in prose**) | **No source.** The repo README's Results section is a TODO ("Populate benchmark results once paper is uploaded"); paper PDF not uploaded per repo roadmap | Self-reported; numerically **unverified** | State dataset/split; publish a results table or cite the paper's table; note the README's News section claims checkpoints on Hugging Face — reconcile with the roadmap's "release checkpoints" TODO | — | **substantiate (top priority)** |
| 4.2 | "…past prior SOTA" (`highlights[1]`, L21) | research result | None | Unverified | Name the prior SOTA, dataset, and delta | — | clarify + substantiate |
| 4.3 | "Paper accepted for publication in IEEE." (`highlights[2]`, L22) | publication | Publication id 1 (IEEE DOI) + repo README: "official research companion for our published paper," incl. a "CCTV Crime Temporal Grounding Application" that matches Pub-1's title domain | **Internally supported** (strong alignment; same-work identity needs your confirmation) | Confirm Pub-1 is this paper; then wire a relationship field | — | verify + substantiate |
| 4.4 | `tools` includes "RAG" (L15) | technical | Repo README explicitly: "**This is not a full Retrieval-Augmented Generation (RAG) pipeline** — retrieval is only used for prompt augmentation during inference" | **Contradicted by its own evidence** | Replace with an accurate label (e.g., "FIR-grounded inference") | — | clarify (accuracy) |
| 4.5 | `url` → `MMVTG_UI.git` (L11) | other | Fetch resolves via redirect to the renamed `RA7AN/MMVTG` | Verified (redirect works) | Update to canonical URL; drop the `.git` suffix | — | keep (fix link) |
| 4.6 | `isResearch: "no"` (L26) | categorization | Contradicts 4.1–4.3; `/projects` shows eyebrow "pytorch" instead of "research" ([page.tsx L25-27](../app/projects/page.tsx#L24-L28)) | — | — | — | **correct** (research) |
| 4.7 | Repo citation block: `year={2025}`, empty author/journal | other | Fetched README citation vs Pub-1 year 2026 | Inconsistent across artifacts | Reconcile work year (2025) vs publication year (2026); fill citation metadata | — | clarify |

#### P-5 · CogniConverse: Offline AI Assistant (id 5) — [cogniconverse-offline-ai-assistant.md](../content/projects/cogniconverse-offline-ai-assistant.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 5.1 | "Developed offline assistant improving agricultural accessibility." (`highlights[0]`, L19) | impact (vague) | None — evidence link 404s | **Unverified** | Fix/replace the evidence link; define what "improving accessibility" meant | — | verify (link broken) |
| 5.2 | "Model deployed on a remote server and made accessible to rural users through SMS." (`highlights[1]`, L20) | contribution / deployment | None (link dead) | Unverified | Deployment note, screenshot, or essay | — | substantiate or soften |
| 5.3 | "Selected as official entry to Smart India Hackathon 2023." (`highlights[2]`, L21) | recognition | None; SIH publishes official listings | Unverified | Official SIH 2023 listing/press URL | — | verify |
| 5.4 | `url` → `RA7AN/CogniConverse/tree/model` (L11) | other | **Fetch returned 404** — repo private, deleted, renamed, or branch removed | Broken evidence link | Restore a public URL or remove the field | — | **verify (dead link on a public page)** |
| 5.5 | `showOnLanding: "no"` (L25) | visibility | Still renders on `/projects` | — | Confirm intent | — | clarify |

#### P-6 · Revent AI Lab (id 6) — [revent-ai-lab-platform.md](../content/projects/revent-ai-lab-platform.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 6.1 | "AI Engineer on the platform: company onboarding, per-agent subscription plans, billing through Stripe." (`highlights[1]`, L24) | role | [revent-lab.md](../content/experiences/revent-lab.md#L13) role "AI Engineer" matches; but its highlights describe **different duties** (HITL automations, Workspace/Teams/Slack integrations, browser extension) | Internally supported (title only; duties mismatch) | Align the two descriptions; state which is current | MEDIUM — employer platform; confirm public-disclosure approval | clarify |
| 6.2 | "AI agents as a subscription product: multi-tenant, billable, alive in production." (`highlights[0]`, L23) | impact | [ailab.revent.store](https://ailab.revent.store) live (fetched): "Revent AI Lab," product copy "CEO Brain — Your company's memory, briefed every morning…" | Liveness **verified**; "multi-tenant/billable" not verifiable from the public landing; the landing copy tells a different product story than the card | Approved usage metric if shareable; or align card copy with what evaluators will see on click-through | MEDIUM | keep (clarify product story) |
| 6.3 | "Multi-tenant B2B SaaS on Next.js 16 and Postgres with Drizzle, Redis and BullMQ…, envelope-encrypted secrets, Better Auth…, Stripe subscription items per agent." (`highlights[2]`, L25) | technical | None public; the experience record lists a partially different stack (pgvector, Redis, TS/Next) | Self-reported | — | **MEDIUM-HIGH** — reveals employer platform internals (auth provider, encryption approach, billing architecture); confirm approval or soften specifics | sanitize pending review |
| 6.4 | `dateLabel: "Apr 2026 - Present"` (L22) vs experience `startDate: "Jun 2026"` | other (date) | Two repository records disagree | **Contradiction** | Pick the true date | — | clarify |

#### P-7 · SafeSight: Safety Inspection Copilot (id 7) — [safesight-construction-safety-copilot.md](../content/projects/safesight-construction-safety-copilot.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 7.1 | "Designed and shipped the inspection pipeline end to end for the Kanz AI hackathon 2026." (`highlights[1]`, L25) | contribution + event | [Repo](https://github.com/RA7AN/Safesightv1) live (fetched); README: "Built during the Kanz AI Training Hackathon 2026 **by Abdul Jawwad**" — direct corroboration with named attribution | Self-reported, strongly repo-corroborated | Official hackathon listing/results URL (independent source); note exact event name "Kanz AI **Training** Hackathon 2026" | LOW | verify + substantiate |
| 7.2 | "Grounded findings in OSHA, NEBOSH and company SOPs with pgvector retrieval, behind a provider-agnostic layer (Gemini, OpenRouter, Mistral, Ollama)… human review and PDF export." (`highlights[2]`, L26) | technical | Repo exists with demo video + screenshots sections (not audited in depth) | Self-reported | — | LOW ("company SOPs" is generic — confirm no real client is identifiable) | keep |

### 2.2 Publications (`content/publications/*.md`, loaded by `getPublications()`, schema at [schemas.ts L59-74](../lib/content/schemas.ts#L59-L74))

#### Pub-1 · Cross-Attention-Based… CCTV-Based Crime Identification (id 1) — [cross-attention-…md](../content/publications/cross-attention-based-intelligent-video-temporal-grounding-for-cctv-based-crime-identification-in-smart-cities.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 1.1 | `venue: "Published IEEE Access 2026"` (L14), `kind: "Journal"` (L10) | publication | DOI `10.1109/ICETSIS68266.2026.11548957` (L18) — **my fetch was blocked (HTTP 406)**; structurally, the DOI matches IEEE **conference-proceedings** format (ICETSIS 2026), not IEEE Access (`10.1109/ACCESS.*`) | Unverified externally; **structurally contradicted** | Open the DOI manually; record the true container; fix `venue` + `kind` | — | **verify + correct (high priority)** |
| 1.2 | Authorship of the paper | contribution | **No author field exists in the schema**; MMVTG repo's citation block has empty author fields | Unverified | Add authors + your position; populate `orcidId` (null today, L21; profile schema already has `orcidUrl`) | — | clarify + substantiate |
| 1.3 | Same-work relationship to MMVTG (P-4) | other | MMVTG repo README ("official research companion," CCTV crime application) + domain/venue alignment | Internally supported (needs confirmation) | Confirm, then wire `relatedProjectIds` / `relatedPublicationIds` | — | verify |
| 1.4 | `image: /publications/cctv-crime-identification.svg` (L17) | artifact | File exists (glob-verified) | Internally supported | — | — | keep |

#### Pub-2 · Anthar Study (id 2) — [anthar-study-…md](../content/publications/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 2.1 | "Case study published online" at `deccan.ai/research/anthar-study…` (L14-15) | publication | Page live (fetched); title matches exactly | **Verified** (employer-controlled site) | — | LOW — published by the employer publicly; linking is fine | keep |
| 2.2 | Co-authorship | contribution | [deccan-ai.md](../content/experiences/deccan-ai.md#L17): "Co-authored and launched Anthar Study Verified, benchmarking 6 AI coding agents across 43 real-world GitHub PRs" | **Internally supported**; byline not visible in my fetch (may be client-rendered) | Confirm the byline on the live page; add an authors field | LOW | verify + substantiate |
| 2.3 | Title: record says "Anthar Study…" vs experience's "Anthar Study **Verified**" | other | Two records name it differently | Inconsistency | Use the canonical published title everywhere | — | clarify |
| 2.4 | The 6-agents / 43-PRs figures exist only in the experience record, not here | other | Cross-collection | Internally supported (elsewhere) | Move into structured metrics on this record | — | substantiate (structured metric) |

#### Pub-3 · A Review on Cross Temporal Video Grounding and Moment Localization (id 3) — [a-review-…md](../content/publications/a-review-on-cross-temporal-video-grounding-and-moment-localization.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 3.1 | "Proceedings of the 2nd International Conference on Data Analytics and Intelligence Computing" (2025) (L14) | publication | Drive link (L15) resolves publicly (fetched) to a file titled **"Conference Proceedings ICDAIC25.pdf"** — consistent with the claimed venue/year | Venue existence **verified via a self-hosted proceedings copy**; not an official registry | Official proceedings/DOI/publisher page | — | substantiate |
| 3.2 | Evidence link is a Google Drive file | other | Same | Weak-link/durability risk | Replace with DOI or publisher URL when located | — | verify |
| 3.3 | Authorship | contribution | No authors field | Unverified | Add authors + your position | — | clarify |
| 3.4 | Relationship to MMVTG/Pub-1 (same research line) | other | Topic overlap only | Assumption-level — flagged, **not asserted** | Confirm whether the review accompanies the CCTV work (a survey is its own work, not a duplicate) | — | clarify |

#### Pub-4 · The Model That Deceives (id 4) — [the-model-that-deceives.md](../content/publications/the-model-that-deceives.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 4.1 | Published on "RA7AN on Substack" (L14), year 2026 (L12) | publication | [Post](https://ra7an.substack.com/p/the-model-that-deceives) live (fetched): title matches, byline "Abdul Jawwad," dated Feb 26, 2026 | **Verified** (self-controlled venue) | — | — | keep |
| 4.2 | Excerpt's alignment-faking framing (L16) | other | Post cites Greenblatt et al., arXiv:2412.14093 (real), plus 2026 news links | Content spot-checked | — | — | keep |

#### Pub-5 · Do not gentle into that Moonlight (id 5) — [do-not-gentle-into-that-moonlight.md](../content/publications/do-not-gentle-into-that-moonlight.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 5.1 | "Guest Author article published in Transcendent Annual Newsletter, CBIT, Hyderabad, India" (L14), 2022 | publication | `url: null` (L15); image exists ✓; corroborated by Honor id 4 (same publication, `Write Angle'22`, Feb 2022) | Internally supported; externally unverified | Scan/photo of the printed piece (optional) | — | substantiate (optional) |
| 5.2 | **Duplicate:** [writing/do-not-gentle-into-that-moonlight.mdx](../content/writing/do-not-gentle-into-that-moonlight.mdx) (id 2) | other | Same title/source/year in the writing collection; the MDX body is a stub, including a sentence addressed to you ("If you'd like, I can expand this page…") | Duplication **confirmed** | Decide the canonical home (publications is the aligned blog surface per the repo's own history: the landing writing section was removed in favor of publications) and remove the stub | — | omit pending review (the stub) |

### 2.3 Honors (`content/honors/*.md`, loaded by `getHonors()`, schema at [schemas.ts L91-100](../lib/content/schemas.ts#L91-L100))

#### H-6 · Guinness World Record (id 6, first in grid) — [guinness-world-record.md](../content/honors/guinness-world-record.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 6.1 | "Part of a team recognized for setting a Guinness World Record." (L14); org "Guinness World Records"; `dateLabel: "2026"` (year only, L12) | recognition | Image `/achievements/Guinness.jpeg` exists ✓ — no record name, no team context, no link (GWR keeps a public records registry) | Self-reported (image artifact only) | The official GWR record entry + record title + date; team naming rights | **UNKNOWN** — team context unstated; if employer/university-affiliated, confirm naming approval | verify + substantiate |
| 6.2 | Year-only dateLabel | other | — | — | Month for the grid | — | clarify |

#### H-1 · Deccan Dynamite — Q3 2025 (id 1) — [deccan-dynamite-q3-2025.md](../content/honors/deccan-dynamite-q3-2025.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 1.1 | "Awarded organization-wide recognition for exceptional research contributions, technical leadership, and positive client feedback…" (L14); org "Deccan AI" | recognition | Image `/achievements/deccan.jpeg` ✓; award falls within the Deccan AI tenure (Dec 2024–Feb 2026) | Internally supported | Certificate or award URL if any; confirm approval to publish an internal employer award name | LOW-MEDIUM — "client feedback" is mentioned without naming clients (good) | keep (confirm approval) |
| 1.2 | Title "Q3 2025" (L10) vs `dateLabel: "May 2025"` (L12) | other | Calendar Q3 2025 = Jul–Sep; May is Q2 | **Contradiction** | Fiscal-quarter convention or date typo — pick one | — | clarify |

#### H-2 · Financial Leadership Award (id 2) — [financial-leadership-award.md](../content/honors/financial-leadership-award.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 2.1 | "Awarded for leadership and financial management contributions." (L14); Toastmasters International, District 126, Jun 2024 | recognition | Image `/achievements/FInancial.jpeg` exists ✓ (the reference matches the file's exact casing, including the "FInancial" typo — renders fine; cosmetic only) | Self-reported (artifact) | Optional: district award listing | — | keep |

#### H-3 · Toastmaster of the Quarter — Q1 2024 (id 3) — [toastmaster-of-the-quarter-q1-2024.md](../content/honors/toastmaster-of-the-quarter-q1-2024.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 3.1 | "Recognized for outstanding leadership, mentorship, and service contributions at club, area, and division levels…" (L14) | recognition | **`image: null` (L16) — no artifact**, unlike its two sibling Toastmasters honors | Self-reported | Add the certificate image | — | substantiate (add artifact) |
| 3.2 | Title "Q1 2024" vs `dateLabel: "May 2024"` (L12) | other | Q1 ends March; awarded May = plausible lag | Minor ambiguity | Confirm the convention | — | clarify (minor) |

#### H-4 · First Prize — Best Creative Article (id 4) — [first-prize-best-creative-article.md](../content/honors/first-prize-best-creative-article.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 4.1 | First place for journalistic writing in "Write Angle'22" (L14); Transcendent CBIT, Feb 2022 | recognition | `image: null`; cross-collection consistency with Pub-5 (guest author in the same Transcendent CBIT publication, 2022) | Internally supported (adjacent records) | Optional scan/certificate | — | keep |

#### H-5 · Runner-Up — National Education Day Quiz Competition (id 5) — [runner-up-national-education-day-quiz-competition.md](../content/honors/runner-up-national-education-day-quiz-competition.md)

| # | Claim (faithful) | Category | Evidence available | Strength | Missing evidence / action | Privacy risk | Recommendation |
|---|---|---|---|---|---|---|---|
| 5.1 | Second place at regional quiz, National Education Day (L14); Indian Social Forum, Jeddah, Nov 2017 | recognition | None (`image: null`) | Self-reported | Optional artifact; separately: decide its relevance weight for a research/fellowship audience | — | keep or omit pending review (your call) |

---

## 3. Prioritized evidence gaps and privacy risks

**P0 — credibility-critical (fix before anything points evaluators at these)**

1. **Pub-1 venue mislabel** — "IEEE Access 2026" + `kind: "Journal"` vs ICETSIS-format DOI ([L10/L14 vs L18](../content/publications/cross-attention-based-intelligent-video-temporal-grounding-for-cctv-based-crime-identification-in-smart-cities.md#L10-L18)). Automated check blocked; 2-minute manual check resolves it.
2. **MMVTG metrics have no public source** — R1@0.5 60.5 / mAP 61.55 exist only in prose; repo Results is a TODO and the paper PDF is unuploaded; plus `isResearch: "no"` miscategorization, the self-contradicted "RAG" tag, and the unlinked paper relationship.
3. **Dead evidence link** — CogniConverse URL 404s on the public `/projects` page ([L11](../content/projects/cogniconverse-offline-ai-assistant.md#L11)).
4. **Slack Export card** — employer-incident narrative, unsourced "150+" headcount, counterfactual impact, on a public page ([L20-21](../content/projects/slack-export-utility-organization-wide-data-archival-tool.md#L20-L21)). Sanitize or remove pending employer approval.
5. **kyc-revent public repo** — proprietary UAE KYC system; README sample paths reference real document types and a real bank's name; `sample-documents/` may contain real customer documents. Audit contents and confirm clearance before V2 links it anywhere.

**P1 — important**

6. AgentSmith: README leaks employer repo (`deccanAI/tool-call-interface`) in install instructions; "20+ APIs" unsupported by the README; dated inside Deccan tenure → attribution clarification.
7. Revent: project-vs-experience start-date contradiction (Apr vs Jun 2026) + architecture-detail disclosure approval; card copy vs live-site product story ("CEO Brain").
8. **No authorship metadata on any publication** — the biggest schema gap for committees (Pub-1, Pub-2, Pub-3 all affected).
9. GWR honor: no record identity, no registry link, unstated team context.
10. Pub-3: Google Drive link instead of official ICDAIC proceedings/DOI.

**P2 — hygiene**

11. Anthar byline + "Verified" title variant; 6-agents/43-PRs figures stranded in the experience record.
12. Deccan Dynamite Q3-vs-May date contradiction.
13. Writing-collection stub duplicates of Anthar and Moonlight (one contains a note addressed to you).
14. Missing artifacts: H-3, H-4, H-5 certificates/images; SIH 2023 + Kanz AI official listing links; `MMVTG_UI` → `MMVTG` rename + `.git` suffix hygiene; `featured.md` uses string ids (`"1"`) against numeric schema ids (unrendered today).

---

## 4. Unresolved questions requiring your input

1. **Pub-1 identity:** Open the DOI — is the container ICETSIS 2026 (conference) or genuinely IEEE Access? Who are the authors, and what is your position? Is this **the** MMVTG paper?
2. **MMVTG metrics:** Which evaluation do 60.5 / 61.55 come from, on which dataset — and can they be publicly sourced now (paper isn't uploaded yet)?
3. **Revent dates + disclosure:** Apr or Jun 2026 start? Is the platform-architecture sentence (BullMQ/Better Auth/envelope encryption/Stripe) cleared for public disclosure?
4. **Employer clearance:** kyc-revent repo (and its `sample-documents/`), Slack Export card + repo, AgentSmith (fork provenance from `deccanAI/tool-call-interface`) — which are approved for public portfolio use?
5. **Anthar:** Canonical title (with or without "Verified")? Can you confirm the byline credits you?
6. **GWR:** Which record, which team, and may we link the official GWR entry?
7. **Deccan Dynamite:** Fiscal or calendar quarters (resolve "Q3 2025" vs "May 2025")?
8. **External listings:** Do you have URLs for the SIH 2023 entry and Kanz AI Training Hackathon 2026 results?
9. **Writing stubs:** Remove the Anthar/Moonlight MDX duplicates, or fill them with full local text?
10. **CogniConverse:** What is the correct public repo URL?
11. **H-5 relevance:** Keep the 2017 school-era quiz honor for a research/fellowship audience, or drop it?

---

## 5. Proposed schema additions (proposed only — nothing implemented)

Proposed as **additive, all-optional extensions** in [lib/content/schemas.ts](../lib/content/schemas.ts), mirroring existing conventions (`nullableString`, optional `sortOrder`, the `verificationUrl`/`fileUrl` precedent in `certificateSchema`, and the "scaffolded for manual curation" comment style already used on `publicationSchema`):

```ts
// ---- shared building blocks (new) ----
const evidenceSchema = z.object({
  kind: z.enum(['doi', 'paper', 'repo', 'site', 'certificate', 'image', 'video', 'document', 'listing', 'other']),
  label: z.string(),                          // "IEEE Xplore record", "official SIH 2023 listing"
  url: z.string().url().nullable().optional(),
  artifact: z.string().nullable().optional(), // path under public/, e.g. "/achievements/Guinness.jpeg"
  source: z.string().optional(),              // "IEEE", "GitHub (self)", "Deccan AI (employer)"
  status: z.enum(['verified', 'internal', 'self-reported', 'unverified']).default('unverified'),
  asOf: z.string().optional(),                // ISO date this evidence was last checked
});

const metricSchema = z.object({
  name: z.string(),                           // "R1@0.5", "agents evaluated", "employees served"
  value: z.number(),
  unit: z.string().optional(),                // "%", "count"
  dataset: z.string().optional(),             // "QVHighlights test split"
  definition: z.string().optional(),
  baseline: z.string().optional(),            // prior SOTA compared against
  evidence: evidenceSchema.optional(),
});

// ---- projectSchema (keep every existing field; these are additions) ----
category: z.enum(['research', 'applied-ai', 'product', 'internal-tool', 'hackathon', 'open-source']).optional(),
status: z.enum(['live', 'shipped', 'archived', 'wip']).optional(),
role: z.string().optional(),                  // explicit; deprecates the highlights[1]-as-role convention in WorkGrid
startDate: z.string().optional(),
endDate: z.string().nullable().optional(),
metrics: z.array(metricSchema).optional(),    // relocates "R1@0.5 60.5", "20+ APIs", "150+ employees"
evidence: z.array(evidenceSchema).optional(),
relatedPublicationIds: z.array(z.number()).optional(),
relatedWritingSlugs: z.array(z.string()).optional(),
reviewStatus: z.enum(['approved', 'pending-review', 'sanitized']).optional(), // employer-clearance gate

// ---- publicationSchema additions ----
authors: z.array(z.object({ name: z.string(), isSelf: z.boolean().optional() })).optional(),
selfPosition: z.number().nullable().optional(), // 1 = first author
eventDate: z.string().optional(),
metrics: z.array(metricSchema).optional(),      // e.g. 6 agents, 43 PRs for Anthar
evidence: z.array(evidenceSchema).optional(),
relatedProjectIds: z.array(z.number()).optional(),

// ---- honorSchema additions ----
evidence: z.array(evidenceSchema).optional(),   // GWR registry link, certificate scans
date: z.string().optional(),                    // ISO month alongside display-only dateLabel
```

**Necessary for the V2 dashboard:** `evidence[]`, `metrics[]`, `publicationSchema.authors` + `selfPosition`, `projectSchema.category` + `role` + real dates, the relationship-id fields, and `status`/`asOf` on evidence. **Optional/later:** the `reviewStatus` clearance workflow (only if you want a formal gate), citation counts, a tag taxonomy, and slugs-in-body for projects (derive from filename like `getWriting()` does, only if `/projects/[slug]` happens).

Two implementation cautions (for whoever does the work later): **(a)** Zod objects strip unknown keys, so content files must not carry new fields before the schema extends — schema first, content second; **(b)** keep `isResearch` in place during migration (it drives the live `/projects` eyebrow) and derive `category` alongside it until the UI reads the new field.

---

## 6. `npm test` result

**PASS** — `vitest run`: 1 file, **8/8 tests passed** in 321ms (`lib/content/index.test.ts`, the only test file matched by `vitest.config.ts`'s `lib/**/*.test.ts` include). No dependencies installed, no files changed. The current content baseline is green, so every fix above can land with CI protection.

---

## 7. Single most useful next action

**Resolve Pub-1's identity by opening the DOI in a browser** ([`10.1109/ICETSIS68266.2026.11548957`](https://doi.org/10.1109/ICETSIS68266.2026.11548957) — my automated check was blocked, so this is a two-minute manual step only you can do): record the **true container** (ICETSIS 2026 proceedings vs IEEE Access), the **full author list with your position**, and confirm whether it is **the MMVTG paper**. That one check simultaneously fixes the venue mislabel (P0-1), supplies the authorship metadata committees require (P1-8), settles the MMVTG↔publication relationship (P-4 c3), and tells us whether the 60.5/61.55 metrics can be publicly sourced from the paper — after which the rest of this inventory is mechanical data entry against the proposed schema. No implementation has been started.
