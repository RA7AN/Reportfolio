'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/lib/content/schemas';

function problemOf(project: Project) {
  return project.highlights[0] ?? 'details on a call.';
}

function roleOf(project: Project) {
  return project.highlights[1] ?? project.highlights[0] ?? '';
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const tags = project.tools.slice(0, 3);
  const href = project.url || project.githubRepo;
  const nda = !href;

  return (
    <article className="border-border flex flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3a3a3a]">
      <div className="text-muted-foreground flex items-start justify-between gap-3 text-[11px]">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{project.dateLabel}</span>
      </div>
      <h3 className="mt-6 text-lg font-medium tracking-tight">{project.title}</h3>
      <p className="text-note mt-1 text-sm">↳ {project.highlights[0]}</p>
      <dl className="mt-6 space-y-3 text-sm leading-relaxed">
        <div>
          <dt className="text-muted-foreground text-xs tracking-widest uppercase">problem</dt>
          <dd className="text-muted-foreground mt-1">{problemOf(project)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-widest uppercase">role</dt>
          <dd className="text-muted-foreground mt-1">{roleOf(project)}</dd>
        </div>
      </dl>
      <div className="text-muted-foreground mt-auto flex items-end justify-between gap-3 pt-6 text-[11px]">
        <p>{tags.join(' · ').toLowerCase()}</p>
        {nda ? (
          <span className="border-border rounded-full border px-2 py-0.5">nda</span>
        ) : (
          <a href={href} className="hover:text-foreground" rel="noreferrer">
            link
          </a>
        )}
      </div>
    </article>
  );
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState(false);
  const featured = useMemo(() => projects.slice(0, 4), [projects]);
  const rest = useMemo(() => projects.slice(4), [projects]);
  const shown = expanded ? projects : featured;

  return (
    <section
      className="pt-20 sm:pt-24"
      id="work"
      data-nerd="selected work: git cms cards, hover lift 2px"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        selected work
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">proof of shipped things</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        recent client work is mixed with public builds. here is the shape of it: problem, role,
        details on a call.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {shown.map((project, index) => (
          <div
            key={project.id}
            className={index >= 4 ? 'rise-in' : undefined}
            style={index >= 4 ? { animationDelay: `${(index - 4) * 0.06}s` } : undefined}
          >
            <WorkCard project={project} index={index} />
          </div>
        ))}
      </div>
      {rest.length > 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            className="border-border bg-background text-muted-foreground hover:text-foreground rounded-full border px-5 py-2 text-[13px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'show less' : 'more shipped things'}
          </button>
          <a href="/projects" className="link-draw text-muted-foreground text-[13px]">
            or see them all with visuals →
          </a>
        </div>
      ) : (
        <p className="text-muted-foreground mt-8 text-center text-[13px]">
          <a href="/projects" className="link-draw hover:text-foreground">
            or see them all with visuals →
          </a>
        </p>
      )}
    </section>
  );
}
