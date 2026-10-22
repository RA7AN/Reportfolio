# Portfolio V2 — Research Evidence Register (Batch 1: Publications & Research Projects)

**Date:** 17 October 2026 — all external sources accessed 2026-10-17
**Status:** Data collection only. No application code, public content, schemas, configuration, or deployment settings were modified. This is an internal working register: it lives in `docs/`, is deliberately outside `content/` and `public/`, and is not committed — nothing here enters the published site.
**Audience it serves:** graduate admissions committees, research programs, fellowships, academic reviewers.
**Predecessors:** [reconnaissance](./portfolio-v2-reconnaissance.md) → [claim-to-evidence audit](./portfolio-v2-claim-to-evidence-inventory.md). This batch resolves several items marked unverified there.

**Method note.** Primary/authoritative sources used: publisher-registered **Crossref DOI metadata**, the **IEEE Xplore** record and its indexed abstract via **Semantic Scholar**, the author's own **ORCID** record (public API), the **official conference sites**, and the employer's **public research page**. Nothing is upgraded to verified because it appears in this repository. Where a source was inaccessible, that is stated with the exact manual check needed.

---

## 1. Publication metadata register

### Pub-1 — Cross-Attention-Based Intelligent Video Temporal Grounding for CCTV-Based Crime Identification in Smart Cities

Record: [content/publications/cross-attention-…md](../content/publications/cross-attention-based-intelligent-video-temporal-grounding-for-cctv-based-crime-identification-in-smart-cities.md) (id 1)

| Field | Collected value | Strength |
|---|---|---|
| Canonical title | "Cross-Attention-Based Intelligent Video Temporal Grounding for CCTV-Based Crime Identification in Smart Cities" — identical to the record | Verified |
| Full author list & order | **1. Abdul Jawwad** (`sequence: "first"`), **2. Akil Krishna**, **3. Ch. Madhavi Sudha** — publisher-deposited Crossref author array | **Verified** (Crossref; corroborated by Semantic Scholar + Google Scholar "A Jawwad, A Krishna, CM Sudha") |
| My authorship position | **First author** | Verified (Crossref `sequence` field) |
| Registered affiliation (all three authors) | Chaitanya Bharathi Institute of Technology, Computer Science & Engineering, Hyderabad, India | Verified (Crossref affiliation array) |
| Publication type | **Conference paper** — Crossref `type: "proceedings-article"`; ORCID `conference-paper` | **Verified — corrects the record** (`kind: "Journal"`, L10, is wrong) |
| Venue / publisher | *2026 ASU International Conference in Emerging Technologies for Sustainability and Intelligent Systems (ICETSIS)*, proceedings published by **IEEE** | **Verified — the record's "Published IEEE Access 2026" (L14) is wrong** |
| Venue identity corroboration | Conference organized by Applied Science University, Bahrain; official site titles it "ICETSIS – May 6-7, 2026 (Hybrid), Applied Science University in Bahrain"; site states previous editions' proceedings are IEEE-published | Verified |
| Event date | 6–7 May 2026, Manama, Bahrain (Crossref `event.start/end`) | Verified |
| Publication date | 2026-05-06 (Crossref `published-print` / `issued`); Xplore article registered in Crossref 2026-06-12, deposited/indexed 2026-06-13. ORCID lists 2026-06-12 | Verified (two date conventions — see Q7) |
| DOI / canonical URL | `10.1109/ICETSIS68266.2026.11548957` → [ieeexplore.ieee.org/document/11548957/](https://ieeexplore.ieee.org/document/11548957/) | Verified (matches record L15/L18) |
| Official proceedings record | IEEE Xplore proceedings volume **11548694** (issue 11548708): `https://ieeexplore.ieee.org/xpl/conhome/11548694/proceeding`; proceedings copyright line observed on a sibling article: `979-8-3315-7229-7/26/$31.00 ©2026 IEEE`; article **pages 189–195** | Verified (Crossref page range + Xplore sibling PDF copyright) |
| Identifier already owned | ORCID work put-code **202228236** (`https://orcid.org/0009-0008-1838-7713`) — already registered with correct DOI, type `conference-paper`, and correct proceedings title. Record's `orcidId` is `null` (L21) | Verified |
| Citations | `is-referenced-by-count: 0` (Crossref), `citationCount: 0` (Semantic Scholar) | Verified as of access date |
| Abstract (public) | Proposes a two-stage **Multimodal Video Temporal Grounding (MMVTG)** framework: Retrieval-Augmented Generation used as a *context-aware query refinement* system + frozen cross-attention multimodal transformers (**SlowFast R50 + CLIP**) as fine-grained temporal localizer; addresses sparse events, query bias, cross-domain generalization; experimental analysis on the **UCA dataset** reporting gains in temporal localization accuracy, tIoU, incident-detection accuracy (86–90%) and response latency vs baselines | Verified that this is the published abstract (Semantic Scholar index of the IEEE record); see §2 for the number-level caveat |
| Full text access | **Paywalled / unreachable to me:** IEEE Xplore document page returned an anti-bot error (HTTP 202); the Crossref deposit link (`xplorestaging.ieee.org/…11548957.pdf`) returned HTTP 418; Semantic Scholar `openAccessPdf.status: "CLOSED"`; **no arXiv record** (arXiv API query for MMVTG / "temporal grounding"+"CCTV"+"crime" → `totalResults: 0`) | Stated explicitly — see Manual checks |
| Related project | **MMVTG (project id 4)** — see §3 | **Verified** (was "needs confirmation" in the audit) |
| Research metrics in the record | "R1@0.5 of 60.5 and mAP of 61.55, past prior SOTA" appears only in the project card; **not present in any public source I could reach** | Unverified — §2 |
| Verification status | **Verified** (venue, type, authorship, dates, DOI, pages, proceedings record) | — |
| Likely origin of the "IEEE Access" error | The paper's own reference list cites multiple IEEE Access articles (`10.1109/access.2025.*` — refs 1, 9, 10), so the mislabel is plausibly a copy-forward from citations rather than a fabricated claim | Inference, labeled |

**Correction to the audit:** the audit's P0-1 said the venue was "structurally contradicted" (inferred from DOI format). It is now **confirmed wrong by publisher-registered metadata** — the container is ICETSIS 2026, not IEEE Access. The audit also flagged `tools: ["RAG"]` as "contradicted by its own evidence"; that finding needs softening — the *published abstract itself* describes RAG as a component (query refinement), while the repo README disclaims only that it is "not a full RAG pipeline." The tag is defensible if phrased precisely; the two artifacts disagree in emphasis and that disagreement is preserved here, not resolved by assertion.

### Pub-2 — Anthar Study: Evaluating AI Coding Agents Beyond Benchmarks

Record: [content/publications/anthar-study-…md](../content/publications/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks.md) (id 2)

| Field | Collected value | Strength |
|---|---|---|
| Canonical title | **"Anthar Study: Evaluating AI Coding Agents Beyond Benchmarks"** — page title/H1 of the live employer page; identical in the ORCID deposit | Verified |
| "Verified" title variant | The published page title does **not** contain "Verified". In-page text calls it "the Deccan AI Anthar Study". "Verified" attaches to a related artifact: a Deccan AI team member's announcement refers to "**the Verified Anthar Study**" / "**Verified Anthar dataset**" | Source-reported; meaning requires your answer (Q4) |
| Full author list & order | Publicly visible byline on the employer page, as indexed: "**A. Jawwad. Advaith. Akshit. Aniketh. Ashwin. Chiranjeevi. Divyansh. Joel. Manideep …**" — you appear **first**; the remaining names are truncated by the search index and appear to be ordered independently of seniority | **Partly verified** — presence of a public byline is verified; the complete ordered list is unresolved (my direct fetches could not render the contributor block; see Manual checks) |
| My authorship position | First-listed contributor on the public byline | Supported (byline index); **not** taken from the experience record — per your rule, [deccan-ai.md](../content/experiences/deccan-ai.md#L17) was used only as a cross-reference, not as authorship evidence |
| Publication type | Industry **case study / published research post** (record `kind: "Blog"`, ORCID `research-technique`) — not peer reviewed, no DOI | Verified as to classification |
| Venue / publisher | **Deccan AI** public research section (`deccan.ai/research/…`); corporate identity in page footer: Deccan.ai, Inc, 257 Castro Street, Suite #107, Mountain View, CA 94041 | Verified (employer-controlled public page) |
| Publication date | **2025-05-14** per your ORCID deposit (put-code 202230667, self-reported); approx. mid-2025 corroborated independently by the team LinkedIn announcement's activity-id timestamp. Record `year: "2025"` ✓ | Self-reported + approximate corroboration — confirm (Q5) |
| DOI / canonical URL | No DOI. Canonical URL: [deccan.ai/research/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks](https://www.deccan.ai/research/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks) — live, title matches exactly | Verified |
| Official record | None (no proceedings/registry). The employer page *is* the record of publication | Stated |
| Study's own description | "A human evaluation benchmark measuring how well autonomous coding agents perform in real development workflows and security-critical scenarios." | Verified (page text, indexed) |
| Metrics | The "6 AI coding agents / 43 real-world GitHub PRs" figures exist **only** in [content/experiences/deccan-ai.md L17](../content/experiences/deccan-ai.md) — **not** located in any machine-readable part of the study page. Do not publish them as the study's own claims until read off the page | Unverified |
| Related projects | None in `content/projects/` (employer code/datasets are not portfolio artifacts) | Stated |
| Privacy | Linking an employer-published public page is fine. Do **not** import study internals (rubrics, QC layers, client data) into V2 | Constraint recorded |
| Verification status | Publication **verified**; byline **partly verified**; date and internal figures **unresolved** | — |

### Pub-3 — A Review on Cross Temporal Video Grounding and Moment Localization

Record: [content/publications/a-review-…md](../content/publications/a-review-on-cross-temporal-video-grounding-and-moment-localization.md) (id 3)

| Field | Collected value | Strength |
|---|---|---|
| Canonical title | "A Review on Cross Temporal Video Grounding and Moment Localization" — identical in the record, the ORCID deposit, and the proceedings PDF title | Consistent across artifacts |
| Full author list & order | **Unknown from public indexes.** Your ORCID deposit (put-code 205159352, created 2026-02-09) lists exactly one contributor: Abdul Jawwad — self-deposited, so it corroborates your involvement and *suggests* sole authorship but does not establish it | **Unverified externally** — read the printed author line (Q6) |
| My authorship position | Cannot be stated | Unresolved |
| Publication type | Conference-proceedings article (a review/survey). Record `kind: "Conference"` ✓; ORCID `conference-proceedings` | Verified as classification |
| Venue / publisher | *2nd International Conference on Data Analytics and Intelligence Computing (**ICDAIC'25**) hosted by **Velammal Institute of Technology**, "Velammal Knowledge Park", Chennai–Kolkata Highway, Thiruvallur District, Tamil Nadu*; official sites: [icdaic25.vercel.app](https://icdaic25.vercel.app/), [host announcement](https://velammalitech.edu.in/icdaic-25-by-aids-on-9th-april-2025/) | **Verified** (institution's own page + brochure + third-party listings) |
| Proceedings registration | Proceedings carry **ISBN 978-81-985448-6-5** (brochure text, your ORCID subtitle field, and independent institutional-repository listings of other ICDAIC'25 papers). The brochure also states extended papers were "recommended for inclusion in Scopus-indexed journals" — i.e. the proceedings itself is **not DOI-registered** | **Verified** (ISBN confirmed by sources other than this repo) |
| Event date | **9 April 2025** (conference schedule; ORCID publication-date 2025-04-09) | Verified |
| Publication date | Same as event date in the sources located; no separate registration date found | Verified to the day |
| DOI / canonical URL | **No DOI.** Current evidence link is a self-hosted Google Drive file (record L15) — resolves publicly to "Conference Proceedings ICDAIC25.pdf" but is a durability/authority risk | Verified as reachable; weak link |
| Official publisher/proceedings record | No publisher registry located (not in Crossref — title query returned no match; not in IEEE Xplore; no Semantic Scholar/arXiv record). Nearest quasi-official index: participating institutions' repositories listing ICDAIC'25 papers under that ISBN | Stated explicitly |
| Related project | MMVTG (id 4) and/or Pub-1 — **topical overlap only** (same research line: temporal grounding/moment localization survey). No artifact-level evidence links them | Assumption-level — flagged, not asserted (Q6) |
| Metrics | None claimed | N/A |
| Verification status | Conference + ISBN-registered proceedings **verified independently**; your paper's inclusion, printed author line, and page range **unverified** | — |

### Pub-4 — The Model That Deceives

Record: [content/publications/the-model-that-deceives.md](../content/publications/the-model-that-deceives.md) (id 4)

| Field | Collected value | Strength |
|---|---|---|
| Canonical title | "The Model That Deceives"; published subhead: "and why that might soon be our only safeguard left." | Verified (live page) |
| Author / order | **Abdul Jawwad** — sole, explicit byline on the post | Verified (self-controlled venue) |
| My position | Sole author | Verified |
| Publication type | **Blog post / newsletter essay** (self-published; no editorial or peer review; no DOI) | Verified |
| Venue / publisher | "Abdul Jawwad" Substack (`ra7an.substack.com`), author handle `@ra7an` | Verified |
| Publication date | **26 February 2026** (page shows "Feb 26, 2026"); record `year: "2026"` ✓ | Verified |
| DOI / canonical URL | No DOI. [ra7an.substack.com/p/the-model-that-deceives](https://ra7an.substack.com/p/the-model-that-deceives) | Verified |
| Official record | N/A (self-published) | Stated |
| Evidential care taken in the piece | Six numbered citations: Greenblatt et al., *Alignment Faking in LLMs*, arXiv:2412.14093 (Dec 2024); NBC News (20 Feb 2026); New Scientist (25 Feb 2026); Anthropic RSP v3.0 (effective 24 Feb 2026); BBC (24 Feb 2026); Claude Opus 4.6 System Card / Sabotage Risk Report (5 Feb 2026) | Verified that these are the citations printed on the page (the underlying news claims are current-affairs assertions, not verified here) |
| Research metrics | None. Engagement is low (page shows "2 shares") — for a committee audience, present this as published writing/commentary, not as a research output | Self-reported / not applicable |
| Related project | None | Stated |
| Verification status | **Verified** (title, byline, date, venue) | — |

### Pub-5 — Do not gentle into that Moonlight

Record: [content/publications/do-not-gentle-into-that-moonlight.md](../content/publications/do-not-gentle-into-that-moonlight.md) (id 5)

| Field | Collected value | Strength |
|---|---|---|
| Canonical title | "Do not gentle into that Moonlight" | Self-reported (no public artifact located) |
| Author / order | Guest author: Abdul Jawwad (site assertion). No byline located in any public index | Unverified externally |
| Publication type | Newsletter / annual-magazine article (creative writing). Record `kind: "Magazine"` ✓ | Self-reported |
| Venue | *Transcendent* Annual Newsletter, Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad, India — print, no online archive located | Self-reported; institution matches the affiliation registered on Pub-1 (CBIT CSE) — consistent, not confirmatory |
| Publication date | 2022 (record); the linked honor says Feb 2022 | Internally supported |
| DOI / canonical URL | `url: null` (L15) — none exists | Stated |
| Official record | None public. Internal corroboration: [honors/first-prize-best-creative-article.md](../content/honors/first-prize-best-creative-article.md) — first prize, journalistic writing, "Write Angle'22", same publication | Internally supported |
| Related project | None | Stated |
| Metrics | N/A | — |
| Verification status | **Internally supported, externally unverified** | — |
| Note | Also duplicated as a stub in the writing collection ([content/writing/do-not-gentle-into-that-moonlight.mdx](../content/writing/do-not-gentle-into-that-moonlight.mdx)) with an unfinished body — unresolved from the audit, still open | Stated |

---

## 2. MMVTG research-metrics evidence table

Claim under examination, verbatim from [content/projects/mmvtg-…md L21](../content/projects/mmvtg-multi-modal-video-temporal-grounding.md): "Built the retrieval model: **R1@0.5 of 60.5** and **mAP of 61.55**, **past prior SOTA**, published in IEEE."

| Metric / claim | Exact source searched | Result | Strength | Publishable? |
|---|---|---|---|---|
| R1@0.5 = 60.5 | Crossref abstract/metadata; Semantic Scholar abstract; IEEE Xplore (blocked); arXiv API; web search for the exact figures; MMVTG repo README | **Not found in any source.** The published abstract does not mention R1@0.5 at all | **Unverified** | **No** — not as a verified metric |
| mAP = 61.55 | Same | **Not found in any source.** Abstract reports tIoU/accuracy instead | **Unverified** | **No** |
| "past prior SOTA" | Same | No baseline, dataset, split, or comparison table identified publicly | **Unverified** | No |
| Metric family / benchmark context | [MMVTG repo README](https://github.com/RA7AN/MMVTG) (fetched today) | Repo states it **extends Moment-DETR** (Lei, Berg, Bansal, CVPR 2021) and **fine-tunes on QVHighlights**; R1@0.5 and mAP are QVHighlights moment-retrieval metrics — consistent with the figures' form, but the repo's **Results section is still `TODO: Populate benchmark results once paper is uploaded`** | Internally supported *context*, no numbers | Use only to explain what the metrics mean; never as corroboration of the values |
| The only published numbers located | Abstract as indexed by Semantic Scholar from the IEEE record | Experimental analysis on the **UCA dataset** reporting gains in temporal-localization accuracy, tIoU, incident-detection accuracy (86–90%) and response latency over baselines. **Caveat:** the indexed abstract text renders two values as "(7388%)" and "(tIoU 7889%)" — the publisher's abstract as indexed has lost the decimal separators; the intended values are almost certainly 73.88% and 78.89%, but I am not correcting a source I cannot read | Verified that the abstract says this; numerically garbled | Cite only after confirming against the PDF |
| Dataset identity | Crossref reference list of the paper: ref31 "UCA-UCF crime annotation dataset", Reddy, 2026, Kaggle; abstract names "UCA dataset"; repo names "QVHighlights" + "FIR Dataset (documentation coming soon)" | The paper and the repo describe **different evaluation assets** — the public results appear to be on a crime dataset (UCA), while the portfolio numbers belong to the QVHighlights-style metric family | Stated; interpretation flagged | Do not conflate |
| Repo internal inconsistency | README "News" claims "[2026] Paper released", "[2026] Model checkpoints released on Hugging Face" and a Released-Checkpoints table exists, **while** the Roadmap still lists "Upload paper PDF and supplementary" and "Release pretrained and fine-tuned checkpoints" as unchecked TODOs and Results is empty | Contradiction **within** the repo — reproduced, not resolved | Flagged | Ask you which is true (Q1) |
| Citation block | README `@article{mmvtg2025, title={MMVTG: Multimodal Video Temporal Grounding}, author={}, journal={}, year={2025}}` — empty authors/journal, year 2025, and a title that is **not** the IEEE paper title | Now fixable with verified metadata: `@inproceedings{}` with Jawwad/Krishna/Sudha, ICETSIS 2026, pp. 189–195, DOI | Verified (this audit) | Recommend the corrected block (content change, not made) |

**Bottom line:** R1@0.5 = 60.5 and mAP = 61.55 remain **self-reported and publicly unsourced**. The paper body (pages 189–195) is the only realistic source, and it is paywalled; you hold it. Until the values are read from a table in the PDF with dataset and split named, they must not appear as verified metrics anywhere in Portfolio V2.

---

## 3. Verified relationships (projects ↔ publications ↔ identifiers)

| # | Relationship | Evidence | Status |
|---|---|---|---|
| R1 | **MMVTG (project id 4) ↔ Pub-1** — the project *is* the paper's implementation | Published abstract names the framework "**Multimodal Video Temporal Grounding (MMVTG)**"; repo README calls itself "the official research companion for our published paper" and includes a "CCTV Crime Temporal Grounding Application"; author of the paper is the site owner | **Verified** — upgrades the audit's "needs your confirmation" |
| R2 | Pub-1 ↔ ORCID work 202228236 (DOI registered, type `conference-paper`) | Public ORCID record fetched from `pub.orcid.org` | Verified |
| R3 | Pub-2 ↔ ORCID work 202230667; Pub-3 ↔ ORCID work 205159352 | Same | Verified as deposits (self-reported content) |
| R4 | Pub-4 and Pub-5 ↔ **absent from ORCID** | Works list contains exactly three groups | Gap recorded (collection finding) |
| R5 | Site records ↔ ORCID iD | Profile already stores `orcidUrl` [content/profile/index.md L14](../content/profile/index.md); `orcidId` is `null` on all five publication records [schemas.ts](../lib/content/schemas.ts) | Gap recorded |
| R6 | Pub-1 ↔ Google Scholar profile `ECIJhkcAAAAJ` (name "Abdul Jawwad", homepage → your ORCID, labels Agentic AI / AI Evaluation / AI Safety / Enterprise AI Systems / Vision-Language Models; the ICETSIS paper is the visible entry) | Scholar page fetched today (partially — Google returned "The system can't perform the operation now" for the full list) | Verified presence; ownership/curatorship needs your confirmation (Q9) |
| R7 | Pub-5 ↔ Honor id 4 (First Prize, Best Creative Article, "Write Angle'22") | Both records name the same publication, year and institution | Internally supported |
| R8 | Pub-1 ↔ Pub-3 (survey accompanying the grounding work) | Topic overlap only; no shared artifact, no author-list evidence | **Unverified — explicitly not asserted** |
| R9 | MMVTG record's `url` → repo | Recorded `MMVTG_UI.git` now redirects to `RA7AN/MMVTG` | Verified (redirect) |
| R10 | Pub-1 ↔ MMVTG **backbone description** | Abstract says SlowFast R50 + CLIP; README says Moment-DETR (I3D + BERT features) | Contradiction preserved — your clarification needed (Q3) |

**Audit items closed by this batch:** P0-1 (venue mislabel — now confirmed wrong, true venue established), P0-2's relationship half and 4.3/4.4 nuance (same-work identity — verified; RAG framing — corrected), P1-8 partially (Pub-1 authorship now externally verified with order), question 1 of the audit's unresolved list (fully answered).

---

## 4. Blocked / unreachable sources, with the exact manual check

| Source | What happened | Manual verification needed from you |
|---|---|---|
| [IEEE Xplore document 11548957](https://ieeexplore.ieee.org/document/11548957/) | HTTP 202 anti-bot response | Open it logged-in; screenshot the metadata panel (authors with order, "Date of Conference: 06-07 May 2026", "Date of Added to Xplore", pages 189-195, eISBN) |
| Full text (Crossref deposit PDF) | HTTP 418 | From your own PDF: the results table(s) — dataset, split, and the exact R1@0.5 / mAP values, plus the baseline rows the "prior SOTA" comparison uses |
| [deccan.ai Anthar study page](https://www.deccan.ai/research/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks) body | Webflow client-rendered: fetches returned nav/footer and a *different* research card, never the article body or contributor block | Open the page; copy the byline block **verbatim and in order** (and its label — "Authors" vs "Contributors"), the publication date if shown, and the exact sentences containing the "6 agents / 43 PRs" figures |
| Google Drive ICDAIC'25 proceedings PDF | JS viewer exposes only the filename to a fetch | Open it: front matter (organizer/publisher, ISBN page, date), then your paper's **printed author line and page range**; keep a local copy as the artifact |
| Wayback Machine CDX (Anthar first-capture date) | HTTP 429 twice | Optional: `web.archive.org` earliest capture for the Anthar URL, to pin the date independently of ORCID |
| Semantic Scholar profile/paper page | API rate-limited (429) before the successful retry; TLDR elided by publisher | Optional: claim/sync your S2 author profile (ids `2442157791` = you, per this fetch) |
| ResearchGate record [407017178](https://www.researchgate.net/publication/407017178_Cross-Attention_Based_Intelligent_Video_Temporal_Grounding_for_CCTV-Based_Crime_Identification_in_Smart_Cities) | Not fetched (bot-blocked venue) | Optional: claim it so the record is author-attributed |
| Your LinkedIn post announcing the paper | Auth-walled | Optional: the post's public URL as an additional "impact/dissemination" artifact |

---

## 5. Unresolved questions only you can answer

1. **The two numbers.** Do R1@0.5 = 60.5 / mAP = 61.55 appear in the paper (table no.?, dataset?, split?), or do they come from your own QVHighlights runs in the repo? Which is the honest provenance?
2. **"Past prior SOTA."** Against which named baseline(s) and which table? (Moment-DETR's own published QVHighlights numbers are the likeliest reference point, but I will not put words in your paper's mouth.)
3. **Backbone wording.** SlowFast R50 + CLIP (abstract) vs Moment-DETR with I3D/BERT features (repo) — what did the published system actually use, and should the site's `tools` list say "RAG" (abstract framing) or "retrieval-augmented query refinement" (repo framing)?
4. **Anthar naming.** What does "Verified" denote — the "Verified Anthar dataset", a study phase, or a separate publication? Which name do you want on the site, and as "first-listed contributor" or "co-author (Deccan AI team)"?
5. **Anthar date.** Is 14 May 2025 (your ORCID) the real publication date?
6. **Pub-3 authorship + record.** Sole-authored? What is the printed author line and page range? Is there any chance of an official/Scopus journal version (the brochure mentions extended papers being recommended) that would give it a DOI?
7. **Pub-1 date convention.** Publish 6 May 2026 (event/print date, IEEE style) or 12 June 2026 (Xplore registration, your ORCID)? Recommendation: event date, with DOI.
8. **Moonlight.** Can you supply a scan of the printed page and/or the Write Angle'22 certificate? And should the writing-collection stub be deleted?
9. **Profiles.** Do you control and want to publicly link Google Scholar (`ECIJhkcAAAAJ`) and the S2 author id? Scholar currently lists only one work and shows "Independent Researcher / no verified email".
10. **ORCID completeness.** Add Pub-4/Pub-5 to ORCID, and correct Pub-1's registered date if you choose 6 May?
11. **MMVTG repo state.** Which is true: paper/checkpoints "released" (News) or still TODO (Roadmap + empty Results + `@article` citation stub)? This decides whether the repo can serve as a public artifact for the metrics.

---

## 6. Prioritized next collection batch

**Batch 2 — close the research line (small, high value)**

1. Paper-PDF data entry for Pub-1: results tables → structured `metrics[]` (name, value, dataset, split, baseline, source table), corrected IEEE citation block, abstract verbatim. Turns the site's weakest record into its strongest.
2. Anthar byline + date capture (verbatim block + screenshot artifact), and settle the "Verified Anthar" naming.
3. ICDAIC'25 proceedings front matter (ISBN page, printed author line, page range); then decide whether to replace the Drive link with a conference-site/institutional-repository URL.
4. Identifier hygiene: populate `orcidId` on all five publication records (field already exists), add missing ORCID works, link Scholar/S2.
5. Replace the audit's inferred findings with the verified ones above so no stale "IEEE Access" or "RAG contradiction" text survives into V2 copy.

**Batch 3 — project evidence (deliberately not started now):** Kanz AI Training Hackathon 2026 official listing/results, SIH 2023 official listing, CogniConverse's correct public URL, Revent/SafeSight public product artifacts, employer-clearance decisions for kyc-revent / Slack Export / AgentSmith.

**Batch 4 — honors and aggregate telemetry (explicitly out of scope this phase):** GWR registry entry, Deccan Dynamite and Toastmasters certificates, then dev-activity/ORCID/citation snapshots as build-time data.

---

*No implementation, schema, content, configuration, or dependency changes were made. Collection only.*
