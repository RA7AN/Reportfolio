import type { Metadata } from 'next';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'Beats',
  description: 'Placeholder page. Not in use yet.',
};

export default function BeatsPage() {
  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
            beats
          </p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">not used yet</h1>
          <p className="text-muted-foreground mt-4 max-w-md text-base leading-7">
            this route exists so the nav matches the reference. discard it later, or drop in audio
            if you ever want it.
          </p>
        </HomeInner>
      </main>
    </PageShell>
  );
}
