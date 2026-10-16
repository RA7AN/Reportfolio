import type { Metadata } from 'next';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'Community',
  description: 'The community page is still under construction.',
};

export default function CommunityPage() {
  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/community/under-construction.svg"
              alt="A striped barricade and two traffic cones beside a warning sign"
              width={900}
              height={460}
              className="w-full max-w-xs"
            />
            <p className="text-muted-foreground mt-10 mb-2 font-mono text-xs tracking-widest uppercase">
              community
            </p>
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              still under construction
            </h1>
            <p className="text-muted-foreground mt-4 text-base leading-7">
              this page is still being built. the rooms i learned in are on the home page in the
              meantime — come back soon.
            </p>
          </div>
        </HomeInner>
      </main>
    </PageShell>
  );
}
