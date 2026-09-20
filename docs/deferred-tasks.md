# Deferred tasks

Work that is **not** on the critical path for UX iteration or a first Vercel deploy. Take an item up only when its **when** line is true. Status labels match [`tech-stack-comparison-and-migration.md`](./tech-stack-comparison-and-migration.md): **[deferred]**.

Hosting on Vercel is **not** deferred — do that after this branch is on GitHub (see the README).

---

## Image pipeline (`next/image` + sharp) **[deferred]**

Don’t ship huge photos as raw `<img src="/foo.png">`. Use Next’s `Image` component (`next/image`). On Vercel it resizes and serves modern formats via **sharp** (already a Next dependency).

Today the site barely has photos — certificates use a fallback `<img>` that often isn’t even an image (it’s a PDF). That is **not** blocking UX.

**When:** you add project stills, a portrait, or generated OG images.

---

## Production host **[not deferred]**

Vercel Hobby. Preview URLs per PR; custom domain later. See the root README.

**When:** immediately after the rewrite is on GitHub (`beta` PR → `main`, or whatever you merge).

---

## GitHub / ORCID build-time snapshots **[deferred]**

The old Express app had live GitHub/ORCID REST routes that the UI did not really use. Do not call those APIs on every page load.

**When:** a page should show stars, pinned repos, or ORCID publications. Then fetch **at `next build`** (or a GitHub Action) and commit or cache JSON. Skip until that UI exists.

---

## Keystatic (or Decap) on `content/` **[deferred]**

Local visual editor over the same Git files. Replaces the deleted composer dialog honestly.

**When:** editing markdown in the repo feels slower than a form (frequent small edits, or you want a GUI without a hosted CMS).

---

## Drafts (`draft: true`) + preview deploys **[deferred]**

Unpublished posts excluded from prod sitemap/RSS, visible on Vercel preview deployments.

**When:** you write posts that must not be public until a ship date, and preview deploys already exist.

---

## Related content (shared tags) **[deferred]**

Projects ↔ writing ↔ skills.

**When:** there is enough tagged content that “related” is useful, and the IA needs it.

---

## JSON-LD (`Person`, `BlogPosting`) **[deferred]**

Structured data for search engines.

**When:** the site is on a stable public URL and you care about rich results. Cheap to add; not needed for local UX work.

---

## Generated OG images (`next/og`) **[deferred]**

Per-post social cards. Complements (and often triggers) the image pipeline.

**When:** you share writing on social and the default `generateMetadata` title/description is not enough visually.

---

## Contact form (Resend, no DB) **[deferred]**

**When:** mailto is no longer enough and you want submissions in email. Needs a Resend API key on Vercel. No Postgres.

---

## Dependabot + secret scan **[deferred]**

Weekly npm PRs; gitleaks or GitHub secret scanning.

**When:** the GitHub repo is public, or you want automated dependency bumps. Not required to merge the rewrite.

---

## HSTS + nonce CSP **[deferred]**

Simple headers already ship (nosniff, referrer, Permissions-Policy).

**When:** the site is on HTTPS with a real domain (HSTS). CSP nonce is a later hardening pass, not a Vercel blocker.

---

## `next/image` for certificates **[deferred]**

Same as the image pipeline. PDFs should stay iframes/links, not `Image`.

**When:** certificate **previews** are real raster images (WebP/PNG), not PDFs.

---

## Object storage (Cloudflare R2 or Supabase Storage) **[deferred]**

Git stays the CMS. Bytes for video / large GLB / heavy stills go in a bucket; content files store URLs.

**When:** you add a live project demo video, large photography, or 3D assets that should not live in git. Not Neon (that is Postgres). Cloudflare Stream/Mux only if playback quality of long video matters.

---

## Analytics (Plausible/Umami or nothing) **[deferred]**

**When:** you want traffic numbers on the public site. Skip until there is a public URL you care about.

---

## Sentry **[deferred]**

**When:** production has real visitors and you need error visibility. Not for the first deploy.

---

## i18n (`next-intl`) **[deferred]**

**When:** you will actually maintain a second locale (e.g. English + Arabic). Do not copy the lab’s i18n because the lab has it.

---

## Custom `AGENTS.md` beyond Next’s stub **[deferred]**

Next already writes a short `AGENTS.md` for framework docs. A project-specific one (content rules, don’t add Postgres, etc.) is optional.

**When:** agents keep inventing a second architecture.

---

## `engines` in `package.json` **[deferred]**

`.nvmrc` already pins Node 22.

**When:** you want npm to warn on the wrong Node without reading `.nvmrc`.
