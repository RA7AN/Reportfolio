import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/content/schemas';

export function WorkCard({ project, href = '/projects' }: { project: Project; href?: string }) {
  const tags = project.cardTags?.length ? project.cardTags : project.tools.slice(0, 4);

  return (
    <Link
      href={href}
      className={cn(
        'group border-border bg-card/40 relative block overflow-hidden rounded-sm border p-5 transition-colors',
        'hover:border-primary/50',
      )}
    >
      <span
        className="pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgb(139_124_255/0.22),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        aria-hidden
      />
      <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
        {project.kind === 'research' ? 'Research' : 'Project'}
      </p>
      <h3 className="mt-3 text-lg font-medium tracking-tight">{project.title}</h3>
      {project.oneLiner ? (
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{project.oneLiner}</p>
      ) : null}
      <p className="text-muted-foreground mt-4 font-mono text-[10px] tracking-[0.12em] uppercase">
        {tags.join(' · ')}
      </p>
    </Link>
  );
}
