import { NerdOverlay } from '@/components/layout/NerdOverlay';
import { TopNav } from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function PageShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      <TopNav />
      <div className="flex-1">{children}</div>
      {/* the mobile nav is a fixed bottom pill, so give every page enough
          breathing room that it never sits on top of the footer */}
      <div className="h-20 shrink-0 md:hidden" aria-hidden />
      <NerdOverlay />
    </div>
  );
}
