import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected builds, research, and shipped software.',
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            projects
          </p>
          <h1 className="text-3xl tracking-tight">everything I have shipped</h1>
          <p className="text-muted-foreground mt-2 text-[13px]">
            same cards as the landing, in a list.
          </p>
          <div className="mt-10 grid gap-4">
            {projects.map((project, index) => (
              <article key={project.id} className="border-border rounded-2xl border p-5">
                <div className="text-muted-foreground flex justify-between text-[11px]">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{project.dateLabel}</span>
                </div>
                <h2 className="mt-4 text-lg font-medium tracking-tight">{project.title}</h2>
                <p className="text-note mt-1 text-[13px]">↳ {project.highlights[0]}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-[#c4c2ba]">
                  {project.highlights[1] ?? project.highlights[0]}
                </p>
                <p className="text-muted-foreground mt-4 text-[11px]">
                  {project.tools.slice(0, 6).join(' · ').toLowerCase()}
                </p>
                {project.url ? (
                  <a href={project.url} className="mt-3 inline-block text-[13px]" rel="noreferrer">
                    open ↗
                  </a>
                ) : null}
              </article>
            ))}
          </div>
          <Link href="/" className="text-muted-foreground mt-10 inline-block text-[13px]">
            ← back
          </Link>
        </HomeInner>
      </main>
    </PageShell>
  );
}
