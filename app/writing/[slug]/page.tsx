import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Calendar, Link as LinkIcon, Tag as TagIcon } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { Tag } from '@/components/primitives/Tag';
import { Button } from '@/components/ui/button';
import { getWriting, getWritingById, getWritingBySlug } from '@/lib/content';
import { compileWritingMdx } from '@/lib/content/mdx';
import { cn } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWriting().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = /^\d+$/.test(slug) ? getWritingById(Number(slug)) : getWritingBySlug(slug);
  if (!item) return { title: 'Writing' };
  return {
    title: item.title,
    description: item.summary ?? 'A writing entry.',
  };
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;
  if (/^\d+$/.test(slug)) {
    const byId = getWritingById(Number(slug));
    if (byId) permanentRedirect(`/writing/${byId.slug}`);
    notFound();
  }

  const data = getWritingBySlug(slug);
  if (!data) notFound();

  const body = data.content ? await compileWritingMdx(data.content) : null;

  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="rise-in pt-10 md:pt-14">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/writing"
                className="text-foreground/80 hover:text-foreground inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to list
              </Link>
              {data.url ? (
                <Button
                  variant="outline"
                  asChild
                  className="border-border/70 bg-card/70 rounded-xl"
                >
                  <a href={data.url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    External
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <span className="text-muted-foreground text-xs">—</span>
              )}
            </div>
            <div className="border-border/70 bg-card/60 mt-6 overflow-hidden rounded-sm border">
              <div className="p-6 sm:p-8 md:p-10">
                <article>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="primary">{data.kind}</Tag>
                    {data.source ? <Tag>{data.source}</Tag> : null}
                    {data.publishedAt ? (
                      <Tag>
                        <Calendar className="h-3.5 w-3.5" />
                        {data.publishedAt}
                      </Tag>
                    ) : null}
                  </div>
                  <h1 className="mt-4 text-3xl leading-[1.05] font-bold sm:text-4xl md:text-5xl">
                    {data.title}
                  </h1>
                  {data.summary ? (
                    <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
                      {data.summary}
                    </p>
                  ) : null}
                  {data.tags.length ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Tag>
                        <TagIcon className="h-3.5 w-3.5" />
                        Tags
                      </Tag>
                      {data.tags.map((t) => (
                        <Link
                          key={t}
                          href={`/writing?tag=${encodeURIComponent(t)}`}
                          className={cn(
                            'border-border/70 bg-background/50 text-muted-foreground rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur',
                            'hover:bg-muted/60 hover:text-foreground',
                          )}
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-10">
                    {body ? (
                      <div className="prose prose-sm sm:prose-base dark:prose-invert prose-headings:font-display max-w-none">
                        {body}
                      </div>
                    ) : (
                      <div className="border-border/70 bg-background/50 text-muted-foreground rounded-2xl border p-6 text-sm">
                        No content yet.
                      </div>
                    )}
                  </div>
                </article>
              </div>
            </div>
            <div className="text-muted-foreground mt-10 text-xs">
              Tip: keep the writing sparse; let the content carry.
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
