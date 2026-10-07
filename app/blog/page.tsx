import type { Metadata } from 'next';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';
import { WritingSnake } from '@/components/blog/WritingSnake';
import { getProfile, getWritingList } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on design, research, and making.',
};

export default function BlogPage() {
  const posts = getWritingList();
  const { fullName } = getProfile();

  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
            blog
          </p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
            notes on design and making
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
            essays and notes, threaded newest first. the amber line is your reading order.
          </p>
          <WritingSnake posts={posts} author={fullName} />
        </HomeInner>
      </main>
    </PageShell>
  );
}
