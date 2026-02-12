import { useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, Calendar, Link as LinkIcon, Tag as TagIcon } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/primitives/Tag";
import { useWriting } from "@/hooks/use-writing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function safeInt(s: string | undefined) {
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function renderMarkdownLite(md?: string | null) {
  const text = md ?? "";
  // ultra-minimal: no external deps; present as readable pre-wrap prose
  // Keep a touch of monospace for code blocks via ``` fences.
  const parts = text.split("```");
  return parts.map((chunk, idx) => {
    if (idx % 2 === 1) {
      return (
        <pre
          key={idx}
          className="mt-6 rounded-2xl border border-border/70 bg-background/50 p-4 overflow-auto text-[12.5px] leading-relaxed font-mono shadow-[var(--shadow-xs)]"
        >
          <code>{chunk.trim()}</code>
        </pre>
      );
    }
    return (
      <div key={idx} className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-display">
        {chunk
          .split("\n\n")
          .filter((p) => p.trim().length > 0)
          .map((p, i) => (
            <p key={i} className="leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
      </div>
    );
  });
}

export default function WritingDetail() {
  const params = useParams<{ id: string }>();
  const id = safeInt(params?.id);

  const { data, isLoading, error } = useWriting(id ?? -1);

  const title = data?.title ? `${data.title} — Writing` : "Writing — Abdul Jawwad";
  const description = data?.summary ?? "A writing entry.";

  const meta = useMemo(() => {
    return {
      kind: data?.kind ?? "Writing",
      source: data?.source ?? undefined,
      publishedAt: data?.publishedAt ?? undefined,
      url: data?.url ?? undefined,
      tags: data?.tags ?? [],
    };
  }, [data]);

  useEffect(() => {
    // Scroll to top on load for reading
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  return (
    <div className="min-h-screen grain">
      <Seo title={title} description={description} />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 rise-in" data-testid="writing-detail">
            <div className="flex items-center justify-between gap-4">
              <Link
                data-testid="writing-detail-back"
                href="/writing"
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-semibold",
                  "text-foreground/80 hover:text-foreground transition-colors",
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </Link>

              {meta.url ? (
                <Button
                  data-testid="writing-detail-external"
                  variant="outline"
                  onClick={() => window.open(meta.url!, "_blank")}
                  className={cn(
                    "rounded-xl",
                    "border-border/70 bg-card/70 hover:bg-card",
                    "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
                    "transition-all duration-200",
                  )}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  External
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground" data-testid="writing-detail-no-external">
                  —
                </span>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-border/70 bg-card/60 backdrop-blur shadow-[var(--shadow-md)] overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10">
                {!id && (
                  <div
                    data-testid="writing-detail-bad-id"
                    className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm"
                  >
                    Invalid ID.
                  </div>
                )}

                {isLoading && (
                  <div data-testid="writing-detail-loading" className="text-sm text-muted-foreground">
                    Loading…
                  </div>
                )}

                {error && (
                  <div
                    data-testid="writing-detail-error"
                    className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm"
                  >
                    <div className="font-semibold">Couldn’t load writing</div>
                    <div className="mt-1 text-muted-foreground">
                      {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                  </div>
                )}

                {!isLoading && !error && data === null && (
                  <div
                    data-testid="writing-detail-notfound"
                    className="rounded-2xl border border-border/70 bg-background/50 p-6 text-sm text-muted-foreground shadow-[var(--shadow-xs)]"
                  >
                    Not found.
                  </div>
                )}

                {!isLoading && !error && data && (
                  <article data-testid="writing-detail-article">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag data-testid="writing-detail-kind" tone="primary">
                        {meta.kind}
                      </Tag>
                      {meta.source ? <Tag data-testid="writing-detail-source">{meta.source}</Tag> : null}
                      {meta.publishedAt ? (
                        <Tag data-testid="writing-detail-date">
                          <Calendar className="w-3.5 h-3.5" />
                          {meta.publishedAt}
                        </Tag>
                      ) : null}
                    </div>

                    <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05]">
                      {data.title}
                    </h1>

                    {data.summary ? (
                      <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        {data.summary}
                      </p>
                    ) : null}

                    {meta.tags?.length ? (
                      <div className="mt-6 flex flex-wrap gap-2" data-testid="writing-detail-tags">
                        <Tag data-testid="writing-detail-tags-label">
                          <TagIcon className="w-3.5 h-3.5" />
                          Tags
                        </Tag>
                        {meta.tags.slice(0, 20).map((t, idx) => (
                          <Link
                            key={`${t}-${idx}`}
                            data-testid={`writing-detail-tag-${idx}`}
                            href={`/writing?tag=${encodeURIComponent(t)}`}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur",
                              "border-border/70 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                              "transition-all duration-200",
                            )}
                          >
                            {t}
                          </Link>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-10">
                      {data.contentMd ? (
                        <div data-testid="writing-detail-content">{renderMarkdownLite(data.contentMd)}</div>
                      ) : (
                        <div
                          data-testid="writing-detail-empty-content"
                          className="rounded-2xl border border-border/70 bg-background/50 p-6 text-sm text-muted-foreground shadow-[var(--shadow-xs)]"
                        >
                          No content yet.
                        </div>
                      )}
                    </div>
                  </article>
                )}
              </div>
            </div>

            <div className="mt-10 text-xs text-muted-foreground" data-testid="writing-detail-footer">
              Tip: keep the writing sparse; let the content carry.
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
