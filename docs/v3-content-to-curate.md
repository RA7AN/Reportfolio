# V3 landing — content still to curate

This is the punch list of **data, links, files, and copy** needed before every surface feels finished. The layout is in; most of this is you, not code.

Keep real facts only. If a section should not exist, say so and we remove the placeholder instead of filling it.

## Profile and identity

- [ ] Short **bio** (`content/profile/index.md` is `bio: null`). Used on About and can feed the hero.
- [ ] **Location string** for the clock line (Jeddah is hardcoded today). Confirm city + timezone label (`AST` vs `Asia/Riyadh`).
- [ ] **Availability** line: keep “open to freelance and full time work” or replace with something true.
- [ ] Confirm **email**, GitHub, LinkedIn, ORCID. Add/remove X (`@abdljwwd` is still on About / start-here).
- [ ] Wordmark: keep `jawwad` or use `abdul` / full name.
- [ ] Headshot (optional, not on the current landing).
- [ ] Favicon + Open Graph image (site currently has no custom social preview for this visual system).

## Hero

- [ ] Hero **one-liner** vs resume-style `objective` — the landing concatenates headline + objective and it reads long.
- [ ] **Book a call** target: Cal.com / Calendly URL, or keep mailto only and drop the fake calendar.
- [ ] **Stats row**: today it counts CMS rows (roles / projects / papers / talks). Supply the four numbers and labels you actually want, or confirm the counts are fine.
- [ ] Real **stack icons** for the circular row (Figma-style marks). Today they are two-letter initials from `content/skills`.

## Experience (`content/experiences/`)

- [ ] Confirm Deccan AI dates (index vs file disagree in older extracts).
- [ ] Add **Revent** (or current role) if it is missing from this branch’s CMS.
- [ ] Company **logos** (square PNG/SVG) for the list avatars.
- [ ] One-line summary per role, separate from the highlight bullets.
- [ ] Timeline copy if you want that view to show years/months you care about.

## Selected work (`content/projects/` + `/projects`)

- [ ] **Problem / role** blurbs per project (landing uses highlight[0] / highlight[1] as a stand-in).
- [ ] Short **one-liners** and 2–3 **tags** per card.
- [ ] Public URL vs GitHub vs “talk through it on a call” / NDA chip.
- [ ] Screenshots, posters, or demo video for project pages (no visual case studies yet).
- [ ] Featured four vs “more shipped things” order.
- [ ] SafeSight / Anthar / other V2 projects if they should appear on this branch (main CMS still has the older five).

## Ventures (homepage block)

All rows are placeholders. For each real venture, provide:

- [ ] Name, one-line description, start–end (or “now”), live vs wound down, URL, logo.
- [ ] Drop the block entirely if you do not want a ventures section.

## Off-screen / polaroids

- [ ] 8–16 **photos** you are willing to publish (travel, desk, lab).
- [ ] Caption per photo (`place, year`).
- [ ] Or delete the filmstrip.

## Globe

- [ ] Confirm **Jeddah** as the home pin.
- [ ] Optional extra pins (cities that matter). Visitor city already comes from IP.
- [ ] If Open-Meteo temperature is unwanted, say so.

## Posts / social embeds

- [ ] 4–8 **post URLs** (X and/or LinkedIn) that should appear under “posts worth keeping”.
- [ ] Or remove the section.

## Writing (`content/writing/`)

- [ ] Replace **The Architecture of Curiosity** placeholder body with a real essay or unpublish it.
- [ ] Confirm the other two pieces (Anthar, Moonlight) should stay on `/blog`.
- [ ] Dates in a consistent format, summaries, tags.
- [ ] Optional: more posts.

## Reels / beats / cassette

- [ ] Instagram (or other) **reel URLs** + titles, or remove “moving pictures”.
- [ ] Decide **`/beats`**: keep as a music page, redirect, or delete from nav.
- [ ] Footer cassette: a real audio file, a link, or remove the player.

## Booking

- [ ] Cal.com (or equivalent) **embed URL** and timezone.
- [ ] Meeting length and title.
- [ ] Fallback copy if you only want email.

## Other pages still on the old chrome

These inherit the new nav/tokens but were not rebuilt:

- [ ] `/about` — rewrite to the new voice; it still has Twitter compose links.
- [ ] `/resume` — confirm PDF/file and that CMS experience/education/honors are current.
- [ ] `/writing`, `/musings`, `/reads`, `/certificates`, `/start-here`, `/contact`.
- [ ] Certificates: AWS file is in CMS; upload any others you want shown.
- [ ] Musings and reads: keep, restyle, or hide from nav.

## Links page (`/links`)

- [ ] Ordered list of public links (email, GitHub, LinkedIn, CV, papers, Cal, socials).
- [ ] Optional: personal site aliases, Google Scholar, Hugging Face, etc.

## Legal / meta

- [ ] Site title / description in `app/layout.tsx` (currently name + headline).
- [ ] Whether “Event Horizon” should appear anywhere (it does not on this landing).

When a batch is ready, drop files under `content/` or `public/` and we can wire them without inventing copy.
