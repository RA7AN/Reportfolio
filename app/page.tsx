import Link from 'next/link';
import { Award, BookOpen, Clock, Code, FileText, PenTool, Target } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { cn } from '@/lib/utils';
import { getFeatured, getPublications, getWriting } from '@/lib/content';

const exploreLinks = [
  {
    title: 'Start Here',
    description: 'Get an overview of everything available',
    href: '/start-here',
    icon: <Target className="h-4 w-4" />,
  },
  {
    title: 'My Projects',
    description: 'Explore all projects and technical work',
    href: '/projects',
    icon: <Code className="h-4 w-4" />,
  },
  {
    title: 'Favorite Reads',
    description: 'Books, papers, and articles that shaped my thinking',
    href: '/reads',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: 'Current Resume',
    description: 'Professional experience and qualifications',
    href: '/resume',
    icon: <FileText className="h-4 w-4" />,
  },
];

export default function HomePage() {
  const featured = getFeatured();
  const writing = getWriting();
  const publications = getPublications();

  const featuredEssays = writing.filter((essay) =>
    featured.featuredEssays.includes(String(essay.id)),
  );
  const featuredPublications = publications.filter((pub) =>
    featured.featuredPublications.includes(String(pub.id)),
  );

  const featuredItems = [
    ...featuredEssays.map((essay) => ({
      title: essay.title,
      href: essay.url || `/writing/${essay.slug}`,
      type: 'essay' as const,
      icon: <PenTool className="h-4 w-4" />,
    })),
    ...featuredPublications.map((pub) => ({
      title: pub.title,
      href: pub.url || '/resume',
      type: 'publication' as const,
      icon: <Award className="h-4 w-4" />,
    })),
  ];

  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="rise-in pt-10 md:pt-14" id="intro">
            <div className="max-w-2xl">
              <h1 className="mb-6 text-2xl leading-relaxed font-bold sm:text-3xl md:text-4xl">
                Welcome, traveller
              </h1>
              <p className="text-muted-foreground mb-2 text-lg leading-relaxed sm:text-xl">
                I&apos;m <span className="text-foreground font-semibold">Abdul Jawwad</span> and
                this is my digital home.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                These days, I&apos;m building the foundations of my universe.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-2">
            <div
              className={cn(
                'border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-md)] backdrop-blur',
              )}
            >
              <h2 className="mb-6 text-xl font-semibold">Explore</h2>
              <div className="space-y-3">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'group border-border/50 bg-card/40 block rounded-xl border p-4 backdrop-blur',
                      'hover:bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]',
                    )}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                        {link.icon}
                      </div>
                      <h3 className="group-hover:text-primary font-medium transition-colors">
                        {link.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={cn(
                'border-border/70 bg-card/60 rounded-2xl border p-6 shadow-[var(--shadow-md)] backdrop-blur',
              )}
            >
              <h2 className="mb-6 text-xl font-semibold">Featured Essays</h2>
              <div className="space-y-3">
                {featuredItems.slice(0, 5).map((item) => (
                  <a
                    key={`${item.type}-${item.title}`}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'group border-border/50 bg-card/40 block rounded-xl border p-4 backdrop-blur',
                      'hover:bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]',
                    )}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="group-hover:text-primary truncate font-medium transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-xs capitalize">{item.type}</p>
                      </div>
                    </div>
                  </a>
                ))}
                {featuredItems.length === 0 && (
                  <div className="text-muted-foreground py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">Featured work will appear here soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
