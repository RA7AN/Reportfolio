import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Code, ExternalLink, Github, Mail } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { MinimalSection } from '@/components/primitives/MinimalSection';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Start Here',
  description:
    "New to Abdul Jawwad's digital space? Start your journey here with an overview of everything available.",
};

function QuickLink({
  title,
  description,
  href,
  icon,
  external = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  const className = cn(
    'group block rounded-xl border border-border/70 bg-card/60 p-4 shadow-[var(--shadow-xs)] backdrop-blur',
    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]',
  );

  const inner = (
    <>
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          {icon}
        </div>
        <h3 className="group-hover:text-primary font-medium transition-colors">{title}</h3>
        {external && <ExternalLink className="text-muted-foreground h-3 w-3" />}
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export default function StartHerePage() {
  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="mx-auto max-w-3xl pt-10 md:pt-14">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <MinimalSection
              eyebrow="Welcome"
              title="Start Here"
              subtitle="New to this digital space? Here's your guide to everything available."
            >
              <div className="space-y-8">
                <div
                  className={cn(
                    'border-border/70 bg-card/60 rounded-2xl border p-8 shadow-[var(--shadow-md)] backdrop-blur',
                  )}
                >
                  <h3 className="mb-4 text-xl font-semibold">About This Space</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Welcome to Event Horizon — my digital home where I document my journey in AI
                    research, engineering, and building systems that matter. This space serves as
                    both a portfolio and a laboratory for ideas.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you&apos;re here to explore my work, read my thoughts, or connect for
                    meaningful collaboration, everything is organized to help you find what
                    you&apos;re looking for quickly.
                  </p>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Quick Navigation</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <QuickLink
                      title="About Me"
                      description="Learn about my background, philosophy, and current focus areas"
                      href="/about"
                      icon={<BookOpen className="text-primary h-4 w-4" />}
                    />
                    <QuickLink
                      title="My Work"
                      description="Explore projects, publications, and professional experience"
                      href="/resume"
                      icon={<Code className="text-primary h-4 w-4" />}
                    />
                    <QuickLink
                      title="Writing"
                      description="Long-form articles on AI, systems, and technology"
                      href="/writing"
                      icon={<BookOpen className="text-primary h-4 w-4" />}
                    />
                    <QuickLink
                      title="Musings"
                      description="Random thoughts and research notes from my notebook"
                      href="/musings"
                      icon={<BookOpen className="text-primary h-4 w-4" />}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Featured Content</h3>
                  <div className="grid gap-4">
                    <QuickLink
                      title="Latest Projects"
                      description="Recent work on multimodal AI systems and evaluation frameworks"
                      href="/projects"
                      icon={<Code className="text-primary h-4 w-4" />}
                    />
                    <QuickLink
                      title="Recommended Reads"
                      description="Books, papers, and articles that have shaped my thinking"
                      href="/reads"
                      icon={<BookOpen className="text-primary h-4 w-4" />}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Connect</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <QuickLink
                      title="Get in Touch"
                      description="Available for consulting, collaboration, and meaningful conversations"
                      href="/about"
                      icon={<Mail className="text-primary h-4 w-4" />}
                    />
                    <QuickLink
                      title="GitHub"
                      description="Open source projects and ongoing development work"
                      href="https://github.com/RA7AN"
                      icon={<Github className="text-primary h-4 w-4" />}
                      external
                    />
                  </div>
                </div>
                <div className="pt-6 text-center">
                  <Button asChild className="gap-2">
                    <Link href="/writing">
                      Start with my writing
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
