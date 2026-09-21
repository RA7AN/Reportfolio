import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <PageShell>
      <main>
        <Container className="max-w-xl pt-20 pb-24">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.22em] uppercase">
            404
          </p>
          <h1 className="mt-4 text-3xl font-medium">Page not found</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            That route is not on this observatory map.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/explore">Explore</Link>
            </Button>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
