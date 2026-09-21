import { Container } from '@/components/layout/Container';
import { TopNav } from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function PageShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('grain flex min-h-screen flex-col', className)}>
      <TopNav />
      <div className="flex-1">{children}</div>
      <footer className="border-border/80 border-t py-4">
        <Container className="flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#63d9c4] uppercase">
            Event Horizon <span className="text-muted-foreground">/</span> online
          </p>
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase">
            Localhost redesign
          </p>
        </Container>
      </footer>
    </div>
  );
}
