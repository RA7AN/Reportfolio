import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, FileX } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <PageShell>
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="rise-in pt-14 md:pt-20">
            <div className="border-border/70 bg-card/60 overflow-hidden rounded-3xl border shadow-[var(--shadow-md)] backdrop-blur">
              <div className="p-8 md:p-12">
                <div className="flex items-start gap-4">
                  <div className="border-border/70 bg-background/50 grid h-12 w-12 place-items-center rounded-2xl border shadow-[var(--shadow-xs)]">
                    <FileX className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                      404
                    </div>
                    <h1 className="mt-2 text-3xl font-bold md:text-4xl">Page not found</h1>
                    <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed md:text-base">
                      A clean site still needs a clean escape hatch. Try heading back home or open
                      the writing archive.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      <Button asChild className="rounded-xl font-semibold">
                        <Link href="/">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Home
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/writing">
                          Writing
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
