'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, ExternalLink, Filter, Star } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { MinimalSection } from '@/components/primitives/MinimalSection';
import { Tag } from '@/components/primitives/Tag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ReadItem } from '@/lib/content/schemas';

type FilterType = 'all' | 'book' | 'paper' | 'article';

export function ReadsClient({ reads }: { reads: ReadItem[] }) {
  const [filter, setFilter] = useState<FilterType>('all');
  const filtered = filter === 'all' ? reads : reads.filter((read) => read.type === filter);

  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="mx-auto max-w-4xl pt-10 md:pt-14">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <MinimalSection
              eyebrow="Library"
              title="Recommended Reads"
              subtitle="Books, papers, and articles that have shaped my thinking."
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Filter className="text-muted-foreground h-4 w-4" />
                  <div className="flex gap-2">
                    {(['all', 'book', 'paper', 'article'] as FilterType[]).map((type) => (
                      <Button
                        key={type}
                        size="sm"
                        variant={filter === type ? 'default' : 'outline'}
                        onClick={() => setFilter(type)}
                        className="capitalize"
                      >
                        {type === 'all' ? 'All' : `${type}s`}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6">
                  {filtered.map((read) => (
                    <div
                      key={read.id}
                      className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <BookOpen className="text-primary h-5 w-5 shrink-0" />
                            <h3 className="text-lg font-semibold">
                              <a
                                href={read.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary inline-flex items-center gap-2"
                              >
                                {read.title}
                                <ExternalLink className="h-4 w-4 shrink-0" />
                              </a>
                            </h3>
                          </div>
                          <div className="text-muted-foreground mb-2 text-sm">
                            by {read.authors.join(', ')} • {read.year}
                          </div>
                          <div className="mb-3 flex items-center gap-4">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-3 w-3',
                                    i < read.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300',
                                  )}
                                />
                              ))}
                            </div>
                            <Tag tone="neutral" className="text-xs capitalize">
                              {read.type}
                            </Tag>
                            <Tag tone="primary" className="text-xs">
                              {read.category}
                            </Tag>
                          </div>
                          <div className="mb-4 flex flex-wrap gap-1">
                            {read.tags.map((tag) => (
                              <Tag key={tag} tone="neutral" className="text-xs">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" />
                          {read.dateRead}
                        </div>
                      </div>
                      <div className="border-primary/20 border-l-4 pl-4">
                        <p className="text-muted-foreground text-sm leading-relaxed italic">
                          &ldquo;{read.myReview}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
