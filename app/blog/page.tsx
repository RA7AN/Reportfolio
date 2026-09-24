import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';
import { getWritingList } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on design, research, and making.',
};

export default function BlogPage() {
  const posts = getWritingList();

  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            blog
          </p>
          <h1 className="text-3xl tracking-tight">notes on design and making</h1>
          <ul className="divide-border border-border mt-10 divide-y border-y">
            {posts.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.url || `/writing/${item.slug}`}
                  className="hover:text-note flex items-baseline justify-between gap-6 py-4 text-[15px]"
                >
                  <span>{item.title}</span>
                  <span className="text-muted-foreground text-[12px]">{item.publishedAt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </HomeInner>
      </main>
    </PageShell>
  );
}
