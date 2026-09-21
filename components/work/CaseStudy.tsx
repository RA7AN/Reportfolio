import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionLabel } from '@/components/home/SectionLabel';
import type { Project } from '@/lib/content/schemas';

function isPlaceholder(value: string | null | undefined) {
  return !value || value.startsWith('[PLACEHOLDER');
}

export function CaseStudy({ project }: { project: Project }) {
  const links = [
    { href: project.githubRepo || project.url, label: 'GitHub' },
    { href: project.demoUrl, label: 'Demo' },
    { href: project.paperUrl, label: 'Paper' },
  ].filter((item) => item.href && !isPlaceholder(item.href));

  return (
    <article className="mx-auto max-w-3xl pt-12 pb-24">
      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
        {project.kind === 'research' ? 'Research' : 'Project'} · {project.dateLabel}
      </p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">{project.title}</h1>
      {project.oneLiner ? (
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{project.oneLiner}</p>
      ) : null}

      {links.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <Button key={link.label} asChild variant="outline" size="sm">
              <a href={link.href!} rel="noreferrer">
                {link.label}
              </a>
            </Button>
          ))}
        </div>
      ) : null}

      {project.highlights.length ? (
        <ul className="text-muted-foreground mt-10 space-y-2 text-sm leading-relaxed">
          {project.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-12 space-y-10">
        {project.sections.map((section, index) => (
          <section key={section.id}>
            <SectionLabel index={String(index + 1).padStart(2, '0')} title={section.title} />
            <p
              className={
                isPlaceholder(section.body)
                  ? 'text-muted-foreground font-mono text-sm'
                  : 'text-sm leading-relaxed'
              }
            >
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-16">
        <Link
          href={project.kind === 'research' ? '/research' : '/work'}
          className="text-muted-foreground hover:text-foreground font-mono text-[11px] tracking-[0.16em] uppercase"
        >
          Back
        </Link>
      </p>
    </article>
  );
}
