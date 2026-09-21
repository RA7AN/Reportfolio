import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Writing, musings, reads, and other signals.',
};

const lanes = [
  {
    href: '/writing',
    label: 'Writing',
    body: 'Essays, technical notes, and explanations.',
  },
  {
    href: '/musings',
    label: 'Musings',
    body: 'Notebooks of things I am thinking through.',
  },
  {
    href: '/reads',
    label: 'Reads',
    body: 'A small reference library — books, papers, articles.',
  },
  {
    href: '/research',
    label: 'Research',
    body: 'Investigations and publications, kept as their own lane.',
  },
  {
    href: '/now',
    label: 'Now',
    body: 'What I am building, exploring, and reading this month.',
  },
];

export default function ExplorePage() {
  return (
    <PageShell>
      <main>
        <Container className="max-w-3xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">Explore</h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
            Personality and notes live here. Work and research stay on their own routes.
          </p>
          <ul className="mt-12 space-y-3">
            {lanes.map((lane) => (
              <li key={lane.href}>
                <Link
                  href={lane.href}
                  className="border-border bg-card/40 hover:border-primary/50 block rounded-sm border p-5 transition-colors"
                >
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase">{lane.label}</p>
                  <p className="text-muted-foreground mt-2 text-sm">{lane.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </PageShell>
  );
}
