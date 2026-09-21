# Event Horizon V2 — implementation index

Source of truth: [Event-Horizon-Portfolio-V2.md](../Event-Horizon-Portfolio-V2.md) (PRD). These files are checklists, not a rewrite of the PRD.

## Safety

- Branch: `redesign/event-horizon-v2` (local).
- Do **not** push `main`, change Vercel, DNS, or production env.
- Preview with `npm run dev` on localhost until the user approves a later merge.

## This pass (BUILD)

| Phase | Doc | Status |
| --- | --- | --- |
| 0 Audit | [phase-0-audit.md](./phase-0-audit.md) | This pass |
| 1 Content | [phase-1-content.md](./phase-1-content.md) | This pass |
| 2 Design system | [phase-2-design-system.md](./phase-2-design-system.md) | This pass |
| 3 Homepage | [phase-3-homepage.md](./phase-3-homepage.md) | This pass |

Stop after Phase 3 for visual review on localhost.

## Deferred (document only)

| Phase | Doc | When |
| --- | --- | --- |
| 4 Work + Research | [phase-4-work-research.md](./phase-4-work-research.md) | After homepage approval |
| 5 Explore | [phase-5-explore.md](./phase-5-explore.md) | After Phase 4 |
| 6 Live elements | [phase-6-live.md](./phase-6-live.md) | After core IA; GitHub API still deferred |
| 7 Polish | [phase-7-polish.md](./phase-7-polish.md) | Before production review |
| 8 Production | [phase-8-production.md](./phase-8-production.md) | Only with explicit user approval |

Also deferred (PRD §54 / [deferred-tasks.md](../deferred-tasks.md)): Mission Control, AI assistant, GitHub live API, WebGL, `next/image` pipeline, Keystatic.

## Nav map (Phase 3)

Until Phase 4–5 pages exist:

- Work → `/projects`
- Research → `/#research`
- Explore → `/writing`
- About → `/about`
- CV → `/resume`
