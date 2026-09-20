# Event Horizon

Personal site for Abdul Jawwad: portfolio, writing, and resume-shaped content. Git is the CMS (markdown / MDX under `content/`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod · Vitest

## Local development

Node 22 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # SITE_URL=http://localhost:3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script                            | Purpose                    |
| --------------------------------- | -------------------------- |
| `npm run dev`                     | Dev server                 |
| `npm run build` / `npm start`     | Production build and serve |
| `npm run typecheck`               | `tsc --noEmit`             |
| `npm run lint`                    | ESLint                     |
| `npm run format` / `format:check` | Prettier                   |
| `npm run test`                    | Vitest (content schemas)   |

## Content

Edit files in `content/`. Structured collections (profile, projects, experience, …) are markdown with a JSON body; writing is MDX. Invalid frontmatter/JSON fails `npm test` and `npm run build`.

Public URLs for posts are `/writing/[slug]`. Numeric ids 308 to the slug.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs typecheck, lint, format, test, and build on every pull request and on push to `main`. You do not add a new workflow per PR.

## Deploy

Vercel (Hobby is enough). Set `SITE_URL` to the deployment origin (e.g. `https://your-project.vercel.app`) so sitemap, RSS, and metadata are correct. Attach a custom domain later in the Vercel project.

Parked follow-ups (image pipeline, Keystatic, R2, …) live in [`docs/deferred-tasks.md`](docs/deferred-tasks.md).
