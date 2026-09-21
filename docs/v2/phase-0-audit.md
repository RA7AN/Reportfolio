# Phase 0 — Repository audit

PRD: §41, §42, §52 Phase 0.

## Snapshot (21–22 Sep 2026)

- **App:** Next.js 16 App Router, React 19, Tailwind v4, Zod Git CMS under `content/`.
- **Loaders:** [`lib/content/index.ts`](../../lib/content/index.ts), schemas in [`lib/content/schemas.ts`](../../lib/content/schemas.ts).
- **Chrome:** [`components/layout/TopNav.tsx`](../../components/layout/TopNav.tsx), [`PageShell.tsx`](../../components/layout/PageShell.tsx), light-first tokens in [`app/globals.css`](../../app/globals.css).
- **Fonts (pre-V2):** IBM Plex Sans + Fraunces via `next/font`.
- **Routes:** `/`, `/about`, `/projects`, `/writing`, `/writing/[slug]`, `/musings`, `/reads`, `/resume`, `/certificates`, `/contact`, `/start-here`.
- **Production:** GitHub `main` → Vercel Hobby. Do not touch.

## Decision

No stack rewrite. Keep Git CMS. All V2 UI on `redesign/event-horizon-v2` + localhost.
