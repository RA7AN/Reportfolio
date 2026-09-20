import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyBlock } from '@/components/primitives/EmptyBlock';
import { MinimalSection } from '@/components/primitives/MinimalSection';
import { Tag } from '@/components/primitives/Tag';
import { cn } from '@/lib/utils';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    "Explore Abdul Jawwad's projects spanning AI research, system architecture, and open source contributions.",
};

export default function ProjectsPage() {
  const projects = getProjects();

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
              eyebrow="Work"
              title="Projects"
              subtitle="A small set of things I'd happily defend."
            >
              {projects.length ? (
                <div className="grid gap-6">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className={cn(
                        'group border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur',
                        'transition-all duration-200 hover:shadow-[var(--shadow-sm)]',
                      )}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="truncate text-lg font-semibold">
                              {p.url ? (
                                <a
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary inline-flex items-center gap-2 transition-colors"
                                >
                                  {p.title}
                                  <ExternalLink className="h-4 w-4 shrink-0" />
                                </a>
                              ) : (
                                p.title
                              )}
                            </h3>
                            {p.githubRepo && (
                              <a
                                href={p.githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <div className="mb-3 flex flex-wrap gap-1">
                            {p.tools.slice(0, 8).map((t) => (
                              <Tag key={t} tone="neutral" className="text-xs">
                                {t}
                              </Tag>
                            ))}
                            {p.tools.length > 8 && (
                              <Tag tone="neutral" className="text-xs">
                                +{p.tools.length - 8}
                              </Tag>
                            )}
                          </div>
                        </div>
                        <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" />
                          {p.dateLabel}
                        </div>
                      </div>
                      {p.highlights.length > 0 && (
                        <div className="space-y-2">
                          {p.highlights.map((h) => (
                            <div
                              key={h}
                              className="text-muted-foreground flex items-start gap-2 text-sm"
                            >
                              <span className="bg-muted-foreground mt-2 h-1 w-1 shrink-0 rounded-full" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {p.isResearch === 'yes' && (
                        <div className="border-border/70 mt-4 border-t pt-4">
                          <Tag tone="primary" className="text-xs">
                            Research Project
                          </Tag>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyBlock label="Projects" />
              )}
            </MinimalSection>
            <div className="border-border/70 mt-16 border-t pt-8">
              <div className="text-center">
                <h3 className="text-muted-foreground mb-4 text-lg font-medium">Explore More</h3>
                <Link
                  href="/certificates"
                  className={cn(
                    'border-border/70 bg-card/60 inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium backdrop-blur',
                    'hover:bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                  )}
                >
                  View Certificates & Credentials
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
