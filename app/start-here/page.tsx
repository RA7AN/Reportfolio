import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'Start here',
  description: 'A short map of Event Horizon.',
};

const links = [
  { href: '/work', title: 'Work', body: 'Experience and projects.' },
  { href: '/research', title: 'Research', body: 'Agents, multimodal systems, publications.' },
  { href: '/explore', title: 'Explore', body: 'Writing, musings, reads, now.' },
  { href: '/resume', title: 'CV', body: 'The resume-shaped version.' },
];

export default function StartHerePage() {
  return (
    <PageShell>
      <main>
        <Container className="max-w-3xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">Start here</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed">
            Event Horizon is a personal observatory: production AI engineering on one side, research
            and notes on the other.
          </p>
          <ul className="mt-10 space-y-3">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="border-border hover:border-primary/50 block rounded-sm border p-5"
                >
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase">{item.title}</p>
                  <p className="text-muted-foreground mt-2 text-sm">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </PageShell>
  );
}
