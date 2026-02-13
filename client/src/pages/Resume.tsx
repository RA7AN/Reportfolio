import { Link } from "wouter";
import { ArrowLeft, Download, Mail, Phone, Github, Linkedin, MapPin, Calendar, Building, GraduationCap, Award, Users } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/ui/button";
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

export default function Resume() {
  const { data, isLoading, error } = usePortfolio();

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Resume — Event Horizon"
        description="Professional resume and experience of Abdul Jawwad, AI Research Engineer and Systems Builder."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
            
            {/* Header Section */}
            <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur shadow-[var(--shadow-md)] p-8 mb-12">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  {data?.profile?.fullName || "Abdul Jawwad"}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {data?.profile?.headline || "AI Research Engineer"}
                </p>
                <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {data?.profile?.location || "Location"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {data?.profile?.email || "email"}
                  </div>
                  {data?.profile?.phonePrimary && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {data.profile.phonePrimary}
                    </div>
                  )}
                </div>
              </div>
              
              {data?.profile?.objective && (
                <div className="border-l-4 border-primary/20 pl-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {data.profile.objective}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-12">
              {/* Experience Section */}
              <MinimalSection
                eyebrow="Work"
                title="Experience"
                subtitle="Professional background and achievements"
              >
                {!isLoading && data?.experiences?.length ? (
                  <div className="space-y-6">
                    {data.experiences
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                      .map((e) => (
                        <div
                          key={e.id}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                            "p-6 shadow-[var(--shadow-xs)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{e.role}</h3>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Building className="w-4 h-4" />
                                <span>
                                  {e.companyUrl ? (
                                    <a href={e.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                      {e.company}
                                    </a>
                                  ) : (
                                    e.company
                                  )}
                                </span>
                                <span>•</span>
                                <span>{e.location}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {e.startDate} - {e.endDate}
                            </div>
                          </div>

                          {e.highlights && e.highlights.length > 0 && (
                            <div className="space-y-2">
                              {e.highlights.map((h, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyBlock label="Experience" />
                )}
              </MinimalSection>

              {/* Education Section */}
              <MinimalSection
                eyebrow="Education"
                title="Education"
                subtitle="Academic background and qualifications"
              >
                {!isLoading && data?.education?.length ? (
                  <div className="space-y-6">
                    {data.education
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                      .map((ed) => (
                        <div
                          key={ed.id}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                            "p-6 shadow-[var(--shadow-xs)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{ed.program}</h3>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <GraduationCap className="w-4 h-4" />
                                <span>{ed.institution}</span>
                                <span>•</span>
                                <span>{ed.location}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {ed.startDate} - {ed.endDate}
                            </div>
                          </div>

                          {ed.details && ed.details.length > 0 && (
                            <div className="space-y-2">
                              {ed.details.map((d, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  <span>{d}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyBlock label="Education" />
                )}
              </MinimalSection>

              {/* Skills Section */}
              <MinimalSection
                eyebrow="Expertise"
                title="Skills"
                subtitle="Technical competencies and areas of focus"
              >
                {!isLoading && data?.skills?.length ? (
                  <div className="grid gap-4">
                    {data.skills
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                      .map((s) => (
                        <div
                          key={s.id}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                            "p-6 shadow-[var(--shadow-xs)]",
                          )}
                        >
                          <h3 className="font-semibold mb-3">{s.category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {s.items.map((it, idx) => (
                              <Tag key={idx} tone="neutral">
                                {it}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyBlock label="Skills" />
                )}
              </MinimalSection>

              {/* Publications Section */}
              <MinimalSection
                eyebrow="Research"
                title="Publications"
                subtitle="Academic contributions and research output"
              >
                {!isLoading && data?.publications?.length ? (
                  <div className="space-y-4">
                    {data.publications
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                      .map((pub) => (
                        <div
                          key={pub.id}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                            "p-6 shadow-[var(--shadow-xs)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold mb-2">
                                {pub.url ? (
                                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    {pub.title}
                                  </a>
                                ) : (
                                  pub.title
                                )}
                              </h3>
                              {pub.venue && (
                                <p className="text-sm text-muted-foreground mb-2">{pub.venue}</p>
                              )}
                              <div className="flex items-center gap-2">
                                <Tag tone="neutral" className="text-xs">
                                  {pub.kind}
                                </Tag>
                                <Tag tone="primary" className="text-xs">
                                  {pub.year}
                                </Tag>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyBlock label="Publications" />
                )}
              </MinimalSection>

              {/* Honors Section */}
              {!isLoading && data?.honors?.length ? (
                <MinimalSection
                  eyebrow="Recognition"
                  title="Honors & Awards"
                  subtitle="Recognition and achievements"
                >
                  <div className="space-y-4">
                    {data.honors
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                      .map((h) => (
                        <div
                          key={h.id}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                            "p-6 shadow-[var(--shadow-xs)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                <Award className="w-4 h-4 text-primary" />
                                {h.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{h.org}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">{h.dateLabel}</div>
                          </div>

                          {h.highlights && h.highlights.length > 0 && (
                            <div className="space-y-2">
                              {h.highlights.map((x, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  <span>{x}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </MinimalSection>
              ) : null}

              {/* Leadership Section */}
              {!isLoading && data?.leadership?.length ? (
                <MinimalSection
                  eyebrow="Service"
                  title="Leadership"
                  subtitle="Community involvement and leadership roles"
                >
                  <div className="space-y-4">
                    {data.leadership
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                      .map((l) => (
                        <div
                          key={l.id}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                            "p-6 shadow-[var(--shadow-xs)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                {l.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{l.org}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">{l.dateLabel}</div>
                          </div>

                          {l.highlights && l.highlights.length > 0 && (
                            <div className="space-y-2">
                              {l.highlights.map((x, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  <span>{x}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </MinimalSection>
              ) : null}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}