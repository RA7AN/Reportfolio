'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/content/schemas';

function problemOf(project: Project) {
  // the cms problem row; falls back to the tagline when the field is left out
  return project.problem ?? project.highlights[0] ?? 'details on a call.';
}

function roleOf(project: Project) {
  return project.highlights[1] ?? project.highlights[0] ?? '';
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const tags = project.tools.slice(0, 3);
  const href = project.url || project.githubRepo;
  const nda = !href;

  return (
    <article className="border-border hover:bg-muted/60 group flex h-full flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3a3a3a]">
      <div className="text-muted-foreground flex items-baseline justify-between gap-3 font-mono text-[11px]">
        {/* the index picks up the amber accent on card hover, like the reference cards */}
        <span className="group-hover:text-note transition-colors">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="lowercase">{project.dateLabel}</span>
      </div>
      <h3 className="mt-4 text-lg font-medium tracking-tight">{project.title}</h3>
      <p className="mt-1.5 text-[15px] leading-6">
        <span className="text-note mr-1.5" aria-hidden>
          ↳
        </span>
        {project.highlights[0]}
      </p>
      {/* bordered one-liner rows keep every card the same height */}
      <dl className="border-border/70 mt-6 border-t">
        <div className="border-border/70 grid grid-cols-[64px_1fr] gap-3 border-b py-3">
          <dt className="text-muted-foreground pt-0.5 font-mono text-[10px] tracking-widest uppercase">
            problem
          </dt>
          <dd className="text-muted-foreground text-sm leading-6">{problemOf(project)}</dd>
        </div>
        <div className="border-border/70 grid grid-cols-[64px_1fr] gap-3 border-b py-3">
          <dt className="text-muted-foreground pt-0.5 font-mono text-[10px] tracking-widest uppercase">
            role
          </dt>
          <dd className="text-muted-foreground text-sm leading-6">{roleOf(project)}</dd>
        </div>
      </dl>
      <div className="text-muted-foreground mt-auto flex items-end justify-between gap-3 pt-5 text-[11px]">
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
  const visible = useMemo(
    () => projects.filter((project) => project.showOnLanding !== 'no'),
    [projects],
  );
  const featured = useMemo(() => visible.slice(0, 4), [visible]);
  const rest = useMemo(() => visible.slice(4), [visible]);
  const shown = expanded ? visible : featured;

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
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
            className={cn('h-full', index >= 4 && 'rise-in')}
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
