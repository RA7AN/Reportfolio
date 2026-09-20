import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  Building,
  Calendar,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Users,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyBlock } from '@/components/primitives/EmptyBlock';
import { MinimalSection } from '@/components/primitives/MinimalSection';
import { Tag } from '@/components/primitives/Tag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPortfolio } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Professional resume and experience of Abdul Jawwad, AI Research Engineer and Systems Builder.',
};

export default function ResumePage() {
  const data = getPortfolio();

  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="mx-auto max-w-4xl pt-10 md:pt-14">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <Button size="sm" variant="outline" className="gap-2" disabled>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <div className="border-border/70 bg-card/60 mb-12 rounded-2xl border p-8 shadow-[var(--shadow-md)] backdrop-blur">
              <div className="mb-6 text-center">
                <h1 className="mb-2 text-3xl font-bold">{data.profile.fullName}</h1>
                <p className="text-muted-foreground mb-4 text-lg">{data.profile.headline}</p>
                <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
                  {data.profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {data.profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {data.profile.email}
                  </div>
                </div>
              </div>
              {data.profile.objective && (
                <div className="border-primary/20 border-l-4 pl-4">
                  <p className="text-muted-foreground leading-relaxed">{data.profile.objective}</p>
                </div>
              )}
            </div>

            <div className="space-y-12">
              <MinimalSection
                eyebrow="Work"
                title="Experience"
                subtitle="Professional background and achievements"
              >
                {data.experiences.length ? (
                  <div className="space-y-6">
                    {data.experiences.map((e) => (
                      <div
                        key={e.id}
                        className={cn(
                          'border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur',
                        )}
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold">{e.role}</h3>
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>
                                {e.companyUrl ? (
                                  <a
                                    href={e.companyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                  >
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
                          <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4" />
                            {e.startDate} - {e.endDate}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {e.highlights.map((h) => (
                            <div
                              key={h}
                              className="text-muted-foreground flex items-start gap-2 text-sm"
                            >
                              <span className="bg-muted-foreground mt-2 h-1 w-1 shrink-0 rounded-full" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyBlock label="Experience" />
                )}
              </MinimalSection>

              <MinimalSection
                eyebrow="Education"
                title="Education"
                subtitle="Academic background and qualifications"
              >
                {data.education.length ? (
                  <div className="space-y-6">
                    {data.education.map((ed) => (
                      <div
                        key={ed.id}
                        className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur"
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold">{ed.program}</h3>
                            <div className="text-muted-foreground flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>{ed.institution}</span>
                              <span>•</span>
                              <span>{ed.location}</span>
                            </div>
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4" />
                            {ed.startDate} - {ed.endDate}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {ed.details.map((d) => (
                            <div
                              key={d}
                              className="text-muted-foreground flex items-start gap-2 text-sm"
                            >
                              <span className="bg-muted-foreground mt-2 h-1 w-1 shrink-0 rounded-full" />
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyBlock label="Education" />
                )}
              </MinimalSection>

              <MinimalSection
                eyebrow="Expertise"
                title="Skills"
                subtitle="Technical competencies and areas of focus"
              >
                {data.skills.length ? (
                  <div className="grid gap-4">
                    {data.skills.map((s) => (
                      <div
                        key={s.id}
                        className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur"
                      >
                        <h3 className="mb-3 font-semibold">{s.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {s.items.map((it) => (
                            <Tag key={it} tone="neutral">
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

              <MinimalSection
                eyebrow="Research"
                title="Publications"
                subtitle="Academic contributions and research output"
              >
                {data.publications.length ? (
                  <div className="space-y-4">
                    {data.publications.map((pub) => (
                      <div
                        key={pub.id}
                        className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur"
                      >
                        <h3 className="mb-2 font-semibold">
                          {pub.url ? (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                            >
                              {pub.title}
                            </a>
                          ) : (
                            pub.title
                          )}
                        </h3>
                        {pub.venue && (
                          <p className="text-muted-foreground mb-2 text-sm">{pub.venue}</p>
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
                    ))}
                  </div>
                ) : (
                  <EmptyBlock label="Publications" />
                )}
              </MinimalSection>

              {data.honors.length > 0 && (
                <MinimalSection
                  eyebrow="Recognition"
                  title="Honors & Awards"
                  subtitle="Recognition and achievements"
                >
                  <div className="space-y-4">
                    {data.honors.map((h) => (
                      <div
                        key={h.id}
                        className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur"
                      >
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="flex items-center gap-2 font-semibold">
                              <Award className="text-primary h-4 w-4" />
                              {h.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{h.org}</p>
                          </div>
                          <div className="text-muted-foreground text-sm">{h.dateLabel}</div>
                        </div>
                        <div className="space-y-2">
                          {h.highlights.map((x) => (
                            <div
                              key={x}
                              className="text-muted-foreground flex items-start gap-2 text-sm"
                            >
                              <span className="bg-muted-foreground mt-2 h-1 w-1 shrink-0 rounded-full" />
                              <span>{x}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </MinimalSection>
              )}

              {data.leadership.length > 0 && (
                <MinimalSection
                  eyebrow="Service"
                  title="Leadership"
                  subtitle="Community involvement and leadership roles"
                >
                  <div className="space-y-4">
                    {data.leadership.map((l) => (
                      <div
                        key={l.id}
                        className="border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-xs)] backdrop-blur"
                      >
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="flex items-center gap-2 font-semibold">
                              <Users className="text-primary h-4 w-4" />
                              {l.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{l.org}</p>
                          </div>
                          <div className="text-muted-foreground text-sm">{l.dateLabel}</div>
                        </div>
                        <div className="space-y-2">
                          {l.highlights.map((x) => (
                            <div
                              key={x}
                              className="text-muted-foreground flex items-start gap-2 text-sm"
                            >
                              <span className="bg-muted-foreground mt-2 h-1 w-1 shrink-0 rounded-full" />
                              <span>{x}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </MinimalSection>
              )}
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
