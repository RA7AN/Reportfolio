import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/use-portfolio";

function EmptyBlock({ label }: { label: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
        "p-6 text-sm text-muted-foreground",
        "shadow-[var(--shadow-xs)]",
      )}
    >
      {label} — no entries yet.
    </div>
  );
}

export default function Projects() {
  const { data, isLoading, error } = usePortfolio();

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Projects — Event Horizon"
        description="Explore Abdul Jawwad's projects spanning AI research, system architecture, and open source contributions."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <MinimalSection
              eyebrow="Work"
              title="Projects"
              subtitle="A small set of things I'd happily defend."
            >
              {!isLoading && data?.projects?.length ? (
                <div className="grid gap-6">
                  {data.projects
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((p) => (
                      <div
                        key={p.id}
                        className={cn(
                          "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                          "p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-200",
                          "group"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg truncate">
                                {p.url ? (
                                  <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors inline-flex items-center gap-2"
                                  >
                                    {p.title}
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
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
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {p.tools.slice(0, 8).map((t, idx) => (
                                <Tag key={idx} tone="neutral" className="text-xs">
                                  {t}
                                </Tag>
                              ))}
                              {p.tools.length > 8 && (
                                <Tag tone="neutral" className="text-xs">+{p.tools.length - 8}</Tag>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                            <Calendar className="w-3 h-3" />
                            {p.dateLabel}
                          </div>
                        </div>

                        {p.highlights && p.highlights.length > 0 && (
                          <div className="space-y-2">
                            {p.highlights.map((h, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {p.isResearch === "yes" && (
                          <div className="mt-4 pt-4 border-t border-border/70">
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
              
              {error && (
                <div className="text-center text-muted-foreground">
                  <p>Unable to load projects at the moment.</p>
                </div>
              )}
            </MinimalSection>

            {/* Additional Resources */}
            <div className="mt-16 pt-8 border-t border-border/70">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-4">
                  Explore More
                </h3>
                <Link
                  href="/certificates"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                    "border border-border/70 bg-card/60 backdrop-blur",
                    "hover:bg-card/70 hover:shadow-md transition-all duration-200",
                    "hover:-translate-y-0.5",
                    "text-sm font-medium"
                  )}
                >
                  View Certificates & Credentials
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
                  Professional certifications and achievements
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}