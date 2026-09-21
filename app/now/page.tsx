import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { getNow } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Now',
  description: 'What I am building, exploring, and reading.',
};

export default function NowPage() {
  const now = getNow();
  const rows = [
    { label: 'Building', value: now.building },
    { label: 'Exploring', value: now.exploring.join(' · ') },
    { label: 'Experimenting', value: now.experimenting.join(' · ') },
    { label: 'Reading', value: now.reading },
    { label: 'Thinking about', value: now.thinkingAbout },
  ];

  return (
    <PageShell>
      <main>
        <Container className="max-w-3xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">Now</h1>
          <p className="text-muted-foreground mt-3 font-mono text-[11px] tracking-[0.16em] uppercase">
            {now.period}
          </p>
          <dl className="divide-border border-border mt-10 divide-y border-y">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr]">
                <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.16em] uppercase">
                  {row.label}
                </dt>
                <dd className="text-sm leading-relaxed">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </main>
    </PageShell>
  );
}
