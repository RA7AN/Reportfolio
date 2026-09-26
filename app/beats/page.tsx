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
          <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            beats
          </p>
          <h1 className="text-3xl tracking-tight">not used yet</h1>
          <p className="text-muted-foreground mt-4 max-w-md text-[14px] leading-relaxed">
            this route exists so the nav matches the reference. discard it later, or drop in audio
            if you ever want it.
          </p>
        </HomeInner>
      </main>
    </PageShell>
  );
}
