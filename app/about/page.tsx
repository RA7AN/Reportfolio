import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Mail } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about Abdul Jawwad, AI researcher and engineer.',
};

export default function AboutPage() {
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

            <div className="space-y-8">
              <div
                className={cn(
                  'border-border/70 bg-card/60 rounded-2xl border p-8 shadow-[var(--shadow-md)] backdrop-blur',
                )}
              >
                <h1 className="mb-8 text-3xl font-bold">About Me</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-lg">Hello,</p>
                  <p className="mb-6">
                    I&apos;m Abdul Jawwad. I work on researching AI problems that matter.
                  </p>
                  <p className="mb-6">
                    These days I&apos;m working as a researcher at{' '}
                    <a
                      href="https://www.deccan.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      Deccan AI
                    </a>
                    , an AI solutions company.
                  </p>
                  <p className="mb-6">
                    Previously, I completed my graduation from Osmania University with a B.E in
                    Computer science and Engineering.
                  </p>
                  <p className="mb-6">
                    You can reach me by{' '}
                    <a
                      href="mailto:hey.jawwad@gmail.com"
                      className="text-primary font-medium hover:underline"
                    >
                      Email
                    </a>{' '}
                    or DM me on{' '}
                    <a
                      href="https://twitter.com/messages/compose?recipient_id=abdljwwd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      Twitter(X)
                    </a>
                  </p>
                  <p className="mb-4">
                    Want to get to know me more?{' '}
                    <Link href="/start-here" className="text-primary font-medium hover:underline">
                      Start here
                    </Link>
                    , or follow me on social media.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <a
                  href="mailto:hey.jawwad@gmail.com"
                  className={cn(
                    'group border-border/70 bg-card/60 block rounded-2xl border p-6 shadow-[var(--shadow-sm)] backdrop-blur',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                          Email
                        </h3>
                        <p className="text-muted-foreground text-sm">hey.jawwad@gmail.com</p>
                      </div>
                    </div>
                    <ExternalLink className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                  </div>
                </a>
                <a
                  href="https://linkedin.com/in/abdul-jawwad-2ba58b23b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'group border-border/70 bg-card/60 block rounded-2xl border p-6 shadow-[var(--shadow-sm)] backdrop-blur',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                          LinkedIn
                        </h3>
                        <p className="text-muted-foreground text-sm">Professional network</p>
                      </div>
                    </div>
                    <ExternalLink className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                  </div>
                </a>
                <a
                  href="https://twitter.com/abdljwwd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'group border-border/70 bg-card/60 block rounded-2xl border p-6 shadow-[var(--shadow-sm)] backdrop-blur',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-500/10">
                        <svg
                          className="h-6 w-6 text-neutral-700"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                          Twitter / X
                        </h3>
                        <p className="text-muted-foreground text-sm">@abdljwwd</p>
                      </div>
                    </div>
                    <ExternalLink className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                  </div>
                </a>
                <a
                  href="https://github.com/abdljwwd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'group border-border/70 bg-card/60 block rounded-2xl border p-6 shadow-[var(--shadow-sm)] backdrop-blur',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-500/10">
                        <Github className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                          GitHub
                        </h3>
                        <p className="text-muted-foreground text-sm">/abdljwwd</p>
                      </div>
                    </div>
                    <ExternalLink className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
