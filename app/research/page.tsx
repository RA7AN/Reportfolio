import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { WorkCard } from '@/components/work/WorkCard';
import { getPublications, getResearchProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'How intelligent systems reason, interact with software, and understand multimodal information.',
};

export default function ResearchPage() {
  const research = getResearchProjects();
  const publications = getPublications().filter((item) => item.kind !== 'Magazine');

  return (
    <PageShell>
      <main>
        <Container className="max-w-5xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">Research</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed">
            I’m interested in how intelligent systems reason, interact with software, and understand
            multimodal information.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {research.map((item) => (
              <WorkCard key={item.id} project={item} />
            ))}
          </div>

          <h2 className="mt-16 font-mono text-[11px] tracking-[0.22em] uppercase">Publications</h2>
          <ul className="mt-6 space-y-4">
            {publications.map((pub) => (
              <li key={pub.id} className="border-border rounded-sm border p-5">
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
                  {pub.kind} · {pub.year}
                </p>
                <a
                  href={pub.url || undefined}
                  className="hover:text-primary mt-2 block text-base font-medium"
                  rel={pub.url ? 'noreferrer' : undefined}
                >
                  {pub.title}
                </a>
                {pub.venue ? (
                  <p className="text-muted-foreground mt-2 text-sm">{pub.venue}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </PageShell>
  );
}
