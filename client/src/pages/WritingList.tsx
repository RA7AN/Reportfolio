import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Filter, Search, X } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { WritingComposerDialog } from "@/components/writing/WritingComposerDialog";
import { useWritingList } from "@/hooks/use-writing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default function WritingList() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [tag, setTag] = useState("");

  const filters = useMemo(
    () => ({
      q: q.trim() || undefined,
      kind: kind.trim() || undefined,
      tag: tag.trim() || undefined,
    }),
    [q, kind, tag],
  );

  const { data, isLoading, error } = useWritingList(filters);

  const derived = useMemo(() => {
    const kinds = unique((data ?? []).map((d) => d.kind).filter(Boolean)).sort((a, b) =>
      a.localeCompare(b),
    );
    const tags = unique((data ?? []).flatMap((d) => d.tags ?? [])).sort((a, b) =>
      a.localeCompare(b),
    );
    return { kinds, tags };
  }, [data]);

  useEffect(() => {
    // if the chosen tag/kind disappears after a filter, keep value but UI will show 0 results
  }, [derived]);

  const clearAll = () => {
    setQ("");
    setKind("");
    setTag("");
  };

  const activeCount = (q.trim() ? 1 : 0) + (kind.trim() ? 1 : 0) + (tag.trim() ? 1 : 0);

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Writing — Abdul Jawwad"
        description="Essays, notes, and links. Filter by kind and tags."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 rise-in" data-testid="writing-list-hero">
            <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur shadow-[var(--shadow-md)] overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                      Writing
                    </div>
                    <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.03]">
                      Notes, essays, and links
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      A small archive. Designed for scanning, then reading slowly.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <Tag data-testid="writing-count" tone="primary">
                        {(data?.length ?? 0).toLocaleString()} items
                      </Tag>
                      {activeCount > 0 ? (
                        <Tag data-testid="writing-active-filters" tone="accent">
                          <Filter className="w-3.5 h-3.5" />
                          {activeCount} filters
                        </Tag>
                      ) : (
                        <Tag data-testid="writing-no-filters">No filters</Tag>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <WritingComposerDialog />
                    <Button
                      data-testid="writing-clear"
                      variant="outline"
                      onClick={clearAll}
                      className={cn(
                        "rounded-xl",
                        "border-border/70 bg-card/70 hover:bg-card",
                        "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
                        "transition-all duration-200",
                      )}
                      disabled={activeCount === 0}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        data-testid="writing-search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search title / summary…"
                        className="pl-10 rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        type="search"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <Input
                      data-testid="writing-kind"
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                      placeholder={derived.kinds.length ? `Kind (e.g. ${derived.kinds[0]})` : "Kind"}
                      className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                    <Input
                      data-testid="writing-tag"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder={derived.tags.length ? `Tag (e.g. ${derived.tags[0]})` : "Tag"}
                      className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {(derived.kinds.length > 0 || derived.tags.length > 0) && (
                  <div className="mt-6 flex flex-col gap-4">
                    {derived.kinds.length > 0 && (
                      <div>
                        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Kinds</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {derived.kinds.slice(0, 10).map((k) => (
                            <button
                              key={k}
                              data-testid={`writing-kind-chip-${k}`}
                              onClick={() => setKind(kind === k ? "" : k)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur",
                                "transition-all duration-200",
                                kind === k
                                  ? "border-primary/30 bg-primary/10 text-foreground shadow-[0_10px_30px_hsl(var(--primary)/0.12)]"
                                  : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                              )}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {derived.tags.length > 0 && (
                      <div>
                        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Tags</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {derived.tags.slice(0, 16).map((t) => (
                            <button
                              key={t}
                              data-testid={`writing-tag-chip-${t}`}
                              onClick={() => setTag(tag === t ? "" : t)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur",
                                "transition-all duration-200",
                                tag === t
                                  ? "border-accent/30 bg-accent/10 text-foreground shadow-[0_10px_30px_hsl(var(--accent)/0.14)]"
                                  : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/60",
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

          <div className="mt-14 md:mt-20 fade-in">
            <MinimalSection
              eyebrow="Archive"
              title="All writing"
              subtitle="Click into an item for the full text."
            >
              {isLoading && (
                <div data-testid="writing-list-loading" className="text-sm text-muted-foreground">
                  Loading…
                </div>
              )}

              {error && (
                <div
                  data-testid="writing-list-error"
                  className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm"
                >
                  <div className="font-semibold">Couldn’t load writing</div>
                  <div className="mt-1 text-muted-foreground">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </div>
                </div>
              )}

              {!isLoading && !error && (data?.length ?? 0) === 0 && (
                <div
                  data-testid="writing-list-empty"
                  className="rounded-2xl border border-border/70 bg-card/60 p-6 text-sm text-muted-foreground shadow-[var(--shadow-xs)]"
                >
                  No items match your filters.
                  <div className="mt-3">
                    <Button
                      data-testid="writing-list-empty-clear"
                      variant="outline"
                      className="rounded-xl"
                      onClick={clearAll}
                    >
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}

              {!isLoading && !error && (data?.length ?? 0) > 0 && (
                <div className="grid gap-3">
                  {data!.map((item) => (
                    <div
                      key={item.id}
                      data-testid={`writing-item-${item.id}`}
                      className={cn(
                        "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                        "p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300",
                      )}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Tag data-testid={`writing-item-kind-${item.id}`} tone="primary">
                              {item.kind}
                            </Tag>
                            {item.source ? (
                              <Tag data-testid={`writing-item-source-${item.id}`}>{item.source}</Tag>
                            ) : null}
                            {item.publishedAt ? (
                              <Tag data-testid={`writing-item-date-${item.id}`}>{item.publishedAt}</Tag>
                            ) : null}
                          </div>

                          <div className="mt-3 font-display text-xl md:text-2xl font-bold leading-tight">
                            <Link
                              data-testid={`writing-item-open-${item.id}`}
                              href={`/writing/${item.id}`}
                              className="hover:underline"
                            >
                              {item.title}
                            </Link>
                          </div>

                          {item.summary ? (
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                              {item.summary}
                            </p>
                          ) : null}

                          {item.tags?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.slice(0, 10).map((t, idx) => (
                                <button
                                  key={`${item.id}-${t}-${idx}`}
                                  data-testid={`writing-item-tag-${item.id}-${idx}`}
                                  onClick={() => setTag(tag === t ? "" : t)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                                    "bg-background/50 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                                    "transition-all duration-200",
                                  )}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-2 md:items-end">
                          {item.url ? (
                            <button
                              data-testid={`writing-item-external-${item.id}`}
                              onClick={() => window.open(item.url ?? "", "_blank")}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
                            >
                              External <ArrowUpRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}

                          <Link
                            data-testid={`writing-item-read-${item.id}`}
                            href={`/writing/${item.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline"
                          >
                            Read <ArrowUpRight className="w-4 h-4" />
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
    </div>
  );
}
