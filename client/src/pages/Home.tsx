import { Link } from "wouter";
import { ArrowUpRight, FileText, MapPin, Phone, Mail, Github, Linkedin } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/use-portfolio";

function InlineIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-border/70 bg-card/70 shadow-[var(--shadow-2xs)]">
      {children}
    </span>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div
      data-testid={`empty-${label}`}
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

export default function Home() {
  const { data, isLoading, error } = usePortfolio();

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Abdul Jawwad — Portfolio"
        description="An ultra-minimal portfolio: work, projects, publications, talks, and writing."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 rise-in" id="intro" data-testid="home-intro">
            <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur shadow-[var(--shadow-md)] overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                      Portfolio
                    </div>

                    <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.03]">
                      {data?.profile?.fullName ?? "Abdul Jawwad"}
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {data?.profile?.headline ??
                        "Building calm, high-clarity systems — research, engineering, and writing."}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <Tag data-testid="tag-location" tone="neutral">
                        <MapPin className="w-3.5 h-3.5" />
                        {data?.profile?.location ?? "—"}
                      </Tag>
                      <Tag data-testid="tag-objective" tone="primary">
                        <FileText className="w-3.5 h-3.5" />
                        {data?.profile?.objective ? "Open to impact" : "Objective"}
                      </Tag>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:items-end">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        data-testid="intro-cta-writing"
                        onClick={() => (window.location.href = "/writing")}
                        className={cn(
                          "rounded-xl font-semibold",
                          "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground",
                          "shadow-[0_14px_40px_hsl(var(--primary)/0.22)]",
                          "hover:shadow-[0_18px_55px_hsl(var(--primary)/0.28)] hover:-translate-y-0.5",
                          "active:translate-y-0 active:shadow-[0_10px_30px_hsl(var(--primary)/0.20)]",
                          "transition-all duration-200 ease-out",
                        )}
                      >
                        Explore Writing
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        data-testid="intro-cta-contact"
                        variant="outline"
                        onClick={() => {
                          const el = document.getElementById("contact");
                          el?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={cn(
                          "rounded-xl border-border/70 bg-card/70 hover:bg-card",
                          "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
                          "transition-all duration-200",
                        )}
                      >
                        Contact
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Minimal UI. Maximum signal.
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-border/70 bg-background/40 p-4 shadow-[var(--shadow-xs)]">
                    <div className="flex items-center gap-3">
                      <InlineIcon>
                        <Mail className="w-4 h-4" />
                      </InlineIcon>
                      <div className="min-w-0">
                        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                          Email
                        </div>
                        <div className="text-sm font-medium truncate">
                          {data?.profile?.email ?? "abdul@example.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/40 p-4 shadow-[var(--shadow-xs)]">
                    <div className="flex items-center gap-3">
                      <InlineIcon>
                        <Phone className="w-4 h-4" />
                      </InlineIcon>
                      <div className="min-w-0">
                        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                          Phone
                        </div>
                        <div className="text-sm font-medium truncate">
                          {data?.profile?.phonePrimary ?? "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/40 p-4 shadow-[var(--shadow-xs)]">
                    <div className="flex items-center gap-3">
                      <InlineIcon>
                        <ArrowUpRight className="w-4 h-4" />
                      </InlineIcon>
                      <div className="min-w-0">
                        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                          Links
                        </div>
                        <div className="mt-1 flex items-center gap-3">
                          <button
                            data-testid="link-github"
                            onClick={() => data?.profile?.githubUrl && window.open(data.profile.githubUrl, "_blank")}
                            className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors disabled:opacity-40"
                            disabled={!data?.profile?.githubUrl}
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </button>
                          <button
                            data-testid="link-linkedin"
                            onClick={() => data?.profile?.linkedinUrl && window.open(data.profile.linkedinUrl, "_blank")}
                            className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors disabled:opacity-40"
                            disabled={!data?.profile?.linkedinUrl}
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoading && (
                  <div data-testid="home-loading" className="mt-8 text-sm text-muted-foreground">
                    Loading portfolio…
                  </div>
                )}
                {error && (
                  <div
                    data-testid="home-error"
                    className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-foreground"
                  >
                    <div className="font-semibold">Couldn’t load portfolio</div>
                    <div className="mt-1 text-muted-foreground">
                      {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-14 md:mt-20 space-y-16 md:space-y-20 fade-in">
            <MinimalSection
              id="work"
              eyebrow="Work"
              title="Experience"
              subtitle="Focused on outcomes. Written for scanning."
            >
              {data?.experiences?.length ? (
                <div className="grid gap-4">
                  {data.experiences
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((e) => (
                      <div
                        key={e.id}
                        data-testid={`experience-${e.id}`}
                        className={cn(
                          "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                          "p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300",
                        )}
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <div className="font-display text-xl md:text-2xl font-bold leading-tight">
                              {e.role}
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {e.companyUrl ? (
                                <button
                                  data-testid={`experience-company-${e.id}`}
                                  onClick={() => window.open(e.companyUrl ?? "", "_blank")}
                                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                  {e.company}
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span>{e.company}</span>
                              )}
                              <span className="mx-2 text-border">/</span>
                              <span>{e.location}</span>
                            </div>
                          </div>
                          <Tag data-testid={`experience-dates-${e.id}`} tone="neutral" className="self-start">
                            {e.startDate} — {e.endDate}
                          </Tag>
                        </div>

                        {e.highlights?.length ? (
                          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground leading-relaxed">
                            {e.highlights.map((h, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Experience" />
              )}
            </MinimalSection>

            <MinimalSection
              id="projects"
              eyebrow="Selected"
              title="Projects"
              subtitle="A small set of things I’d happily defend."
              actions={
                <Link
                  data-testid="projects-to-writing"
                  href="/writing"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
                >
                  Read more in Writing <ArrowUpRight className="w-4 h-4" />
                </Link>
              }
            >
              {data?.projects?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((p) => (
                      <div
                        key={p.id}
                        data-testid={`project-${p.id}`}
                        className={cn(
                          "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                          "p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-display text-xl font-bold leading-tight">
                              {p.url ? (
                                <button
                                  data-testid={`project-open-${p.id}`}
                                  onClick={() => window.open(p.url ?? "", "_blank")}
                                  className="inline-flex items-center gap-2 hover:underline"
                                >
                                  {p.title}
                                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                              ) : (
                                p.title
                              )}
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">{p.dateLabel}</div>
                          </div>
                          <Tag data-testid={`project-tools-count-${p.id}`} tone="primary">
                            {p.tools?.length ?? 0} tools
                          </Tag>
                        </div>

                        {p.tools?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.tools.slice(0, 8).map((t, idx) => (
                              <Tag key={idx} data-testid={`project-tool-${p.id}-${idx}`}>
                                {t}
                              </Tag>
                            ))}
                          </div>
                        ) : null}

                        {p.highlights?.length ? (
                          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground leading-relaxed">
                            {p.highlights.map((h, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Projects" />
              )}
            </MinimalSection>

            <MinimalSection
              eyebrow="Public"
              title="Publications"
              subtitle="Citations and venues, cleanly listed."
            >
              {data?.publications?.length ? (
                <div className="grid gap-3">
                  {data.publications
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((pub) => (
                      <div
                        key={pub.id}
                        data-testid={`publication-${pub.id}`}
                        className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">{pub.kind}</span>{" "}
                              <span className="text-muted-foreground/70">{pub.code}</span> • {pub.year}
                            </div>
                            <div className="mt-1 font-display text-lg font-bold leading-snug">
                              {pub.url ? (
                                <button
                                  data-testid={`publication-open-${pub.id}`}
                                  onClick={() => window.open(pub.url ?? "", "_blank")}
                                  className="inline-flex items-center gap-2 hover:underline"
                                >
                                  {pub.title}
                                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                              ) : (
                                pub.title
                              )}
                            </div>
                            {pub.venue ? (
                              <div className="mt-1 text-sm text-muted-foreground">{pub.venue}</div>
                            ) : null}
                          </div>
                          <Tag data-testid={`publication-year-${pub.id}`} tone="neutral">
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

            <MinimalSection eyebrow="Talks" title="Talks" subtitle="Short list, high intent.">
              {data?.talks?.length ? (
                <div className="grid gap-3">
                  {data.talks
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((t) => (
                      <div
                        key={t.id}
                        data-testid={`talk-${t.id}`}
                        className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                          <div>
                            <div className="font-display text-lg font-bold">{t.title}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{t.venue}</div>
                          </div>
                          <Tag data-testid={`talk-date-${t.id}`} tone="neutral">
                            {t.dateLabel}
                          </Tag>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Talks" />
              )}
            </MinimalSection>

            <MinimalSection eyebrow="Education" title="Education" subtitle="Programs and highlights.">
              {data?.education?.length ? (
                <div className="grid gap-4">
                  {data.education
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((ed) => (
                      <div
                        key={ed.id}
                        data-testid={`education-${ed.id}`}
                        className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <div className="font-display text-xl font-bold leading-tight">{ed.program}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {ed.institution} <span className="mx-2 text-border">/</span> {ed.location}
                            </div>
                          </div>
                          <Tag data-testid={`education-dates-${ed.id}`} tone="neutral" className="self-start">
                            {ed.startDate} — {ed.endDate}
                          </Tag>
                        </div>

                        {ed.details?.length ? (
                          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground leading-relaxed">
                            {ed.details.map((d, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Education" />
              )}
            </MinimalSection>

            <MinimalSection eyebrow="Strengths" title="Skills" subtitle="Grouped and honest.">
              {data?.skills?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.skills
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((s) => (
                      <div
                        key={s.id}
                        data-testid={`skill-${s.id}`}
                        className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                      >
                        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                          {s.category}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {s.items?.length ? (
                            s.items.map((it, idx) => (
                              <Tag key={idx} data-testid={`skill-item-${s.id}-${idx}`} tone="neutral">
                                {it}
                              </Tag>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Skills" />
              )}
            </MinimalSection>

            <MinimalSection eyebrow="Recognition" title="Honors" subtitle="Awards and acknowledgements.">
              {data?.honors?.length ? (
                <div className="grid gap-3">
                  {data.honors
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((h) => (
                      <div
                        key={h.id}
                        data-testid={`honor-${h.id}`}
                        className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <div className="font-display text-lg font-bold">{h.title}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{h.org}</div>
                          </div>
                          <Tag data-testid={`honor-date-${h.id}`} tone="neutral" className="self-start">
                            {h.dateLabel}
                          </Tag>
                        </div>
                        {h.highlights?.length ? (
                          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground leading-relaxed">
                            {h.highlights.map((x, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Honors" />
              )}
            </MinimalSection>

            <MinimalSection eyebrow="Service" title="Leadership" subtitle="Teams, communities, initiatives.">
              {data?.leadership?.length ? (
                <div className="grid gap-3">
                  {data.leadership
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
                    .map((l) => (
                      <div
                        key={l.id}
                        data-testid={`leadership-${l.id}`}
                        className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <div className="font-display text-lg font-bold">{l.title}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{l.org}</div>
                          </div>
                          <Tag data-testid={`leadership-date-${l.id}`} tone="neutral" className="self-start">
                            {l.dateLabel}
                          </Tag>
                        </div>
                        {l.highlights?.length ? (
                          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground leading-relaxed">
                            {l.highlights.map((x, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyBlock label="Leadership" />
              )}
            </MinimalSection>

            <MinimalSection
              id="contact"
              eyebrow="Contact"
              title="Let’s talk"
              subtitle="If it’s meaningful work, I’ll respond quickly."
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    data-testid="contact-email"
                    onClick={() => (window.location.href = `mailto:${data?.profile?.email ?? "abdul@example.com"}`)}
                    className={cn(
                      "rounded-xl font-semibold",
                      "bg-gradient-to-r from-foreground to-foreground/85 text-background",
                      "shadow-[0_14px_40px_hsl(var(--foreground)/0.14)]",
                      "hover:shadow-[0_18px_55px_hsl(var(--foreground)/0.18)] hover:-translate-y-0.5",
                      "active:translate-y-0",
                      "transition-all duration-200 ease-out",
                    )}
                  >
                    Email
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-[var(--shadow-xs)]">
                  <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Details</div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Email</span>
                      <span data-testid="contact-email-value" className="font-medium">
                        {data?.profile?.email ?? "abdul@example.com"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Phone</span>
                      <span data-testid="contact-phone-value" className="font-medium">
                        {data?.profile?.phonePrimary ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Location</span>
                      <span data-testid="contact-location-value" className="font-medium">
                        {data?.profile?.location ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-[var(--shadow-xs)]">
                  <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Links</div>
                  <div className="mt-4 grid gap-2">
                    <button
                      data-testid="contact-github"
                      onClick={() => data?.profile?.githubUrl && window.open(data.profile.githubUrl, "_blank")}
                      className="w-full text-left rounded-xl border border-border/70 bg-background/50 px-4 py-3 hover:bg-background transition-all duration-200 hover:shadow-[var(--shadow-xs)] disabled:opacity-40"
                      disabled={!data?.profile?.githubUrl}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <Github className="w-4 h-4" />
                          GitHub
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>

                    <button
                      data-testid="contact-linkedin"
                      onClick={() => data?.profile?.linkedinUrl && window.open(data.profile.linkedinUrl, "_blank")}
                      className="w-full text-left rounded-xl border border-border/70 bg-background/50 px-4 py-3 hover:bg-background transition-all duration-200 hover:shadow-[var(--shadow-xs)] disabled:opacity-40"
                      disabled={!data?.profile?.linkedinUrl}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-muted-foreground">
                    Prefer asynchronous. Send context and constraints.
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="hairline" />
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs text-muted-foreground" data-testid="footer-note">
                    © {new Date().getFullYear()} Abdul Jawwad. Built for readability.
                  </div>
                  <div className="flex gap-4">
                    <Link
                      data-testid="footer-writing-link"
                      href="/writing"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Writing archive <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link
                      data-testid="footer-certificates-link"
                      href="/certificates"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Certificates <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </div>
  );
}
