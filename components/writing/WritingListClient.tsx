'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Filter, Search, X } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { MinimalSection } from '@/components/primitives/MinimalSection';
import { Tag } from '@/components/primitives/Tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { WritingListItem } from '@/lib/content/schemas';

type WritingCard = Omit<WritingListItem, 'content'>;

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function WritingListClient({ items }: { items: WritingCard[] }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('');
  const [tag, setTag] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((item) => {
      if (query) {
        const hay = `${item.title} ${item.summary ?? ''}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (kind.trim() && item.kind !== kind.trim()) return false;
      if (tag.trim() && !item.tags.includes(tag.trim())) return false;
      return true;
    });
  }, [items, q, kind, tag]);

  const kinds = unique(items.map((d) => d.kind).filter(Boolean)).sort((a, b) => a.localeCompare(b));
  const tags = unique(items.flatMap((d) => d.tags ?? [])).sort((a, b) => a.localeCompare(b));
  const activeCount = (q.trim() ? 1 : 0) + (kind.trim() ? 1 : 0) + (tag.trim() ? 1 : 0);
  const clearAll = () => {
    setQ('');
    setKind('');
    setTag('');
  };

  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="rise-in pt-10 md:pt-14">
            <div className="border-border/70 bg-card/60 overflow-hidden rounded-3xl border shadow-[var(--shadow-md)] backdrop-blur">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                      Writing
                    </div>
                    <h1 className="mt-3 text-3xl leading-[1.03] font-bold sm:text-4xl md:text-5xl">
                      Notes, essays, and links
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
                      A small archive. Designed for scanning, then reading slowly.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <Tag tone="primary">{filtered.length.toLocaleString()} items</Tag>
                      {activeCount > 0 ? (
                        <Tag tone="accent">
                          <Filter className="h-3.5 w-3.5" />
                          {activeCount} filters
                        </Tag>
                      ) : (
                        <Tag>No filters</Tag>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={activeCount === 0}
                    className="border-border/70 bg-card/70 rounded-xl shadow-[var(--shadow-xs)]"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search title / summary…"
                        className="border-border/70 bg-background/60 rounded-xl pl-10"
                        type="search"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                      placeholder={kinds[0] ? `Kind (e.g. ${kinds[0]})` : 'Kind'}
                      className="border-border/70 bg-background/60 rounded-xl"
                    />
                    <Input
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder={tags[0] ? `Tag (e.g. ${tags[0]})` : 'Tag'}
                      className="border-border/70 bg-background/60 rounded-xl"
                    />
                  </div>
                </div>
                {(kinds.length > 0 || tags.length > 0) && (
                  <div className="mt-6 flex flex-col gap-4">
                    {kinds.length > 0 && (
                      <div>
                        <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                          Kinds
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {kinds.slice(0, 10).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setKind(kind === k ? '' : k)}
                              className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition-all',
                                kind === k
                                  ? 'border-primary/30 bg-primary/10 text-foreground'
                                  : 'border-border/70 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                              )}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div>
                        <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                          Tags
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.slice(0, 16).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTag(tag === t ? '' : t)}
                              className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition-all',
                                tag === t
                                  ? 'border-accent/30 bg-accent/10 text-foreground'
                                  : 'border-border/70 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="fade-in mt-14 md:mt-20">
            <MinimalSection
              eyebrow="Archive"
              title="All writing"
              subtitle="Click into an item for the full text."
            >
              {filtered.length === 0 ? (
                <div className="border-border/70 bg-card/60 text-muted-foreground rounded-2xl border p-6 text-sm shadow-[var(--shadow-xs)]">
                  No items match your filters.
                  <div className="mt-3">
                    <Button variant="outline" className="rounded-xl" onClick={clearAll}>
                      Clear filters
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filtered.map((item) => (
                    <div
                      key={item.slug}
                      className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur transition-all hover:shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Tag tone="primary">{item.kind}</Tag>
                            {item.source ? <Tag>{item.source}</Tag> : null}
                            {item.publishedAt ? <Tag>{item.publishedAt}</Tag> : null}
                          </div>
                          <div className="font-display mt-3 text-xl font-bold md:text-2xl">
                            <Link href={`/writing/${item.slug}`} className="hover:underline">
                              {item.title}
                            </Link>
                          </div>
                          {item.summary ? (
                            <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
                              {item.summary}
                            </p>
                          ) : null}
                          {item.tags?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.slice(0, 10).map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setTag(tag === t ? '' : t)}
                                  className="border-border/70 bg-background/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-full border px-2.5 py-1 text-xs font-medium"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/80 hover:text-foreground inline-flex items-center gap-2 text-sm font-semibold"
                            >
                              External <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                          <Link
                            href={`/writing/${item.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                          >
                            Read <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </MinimalSection>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
