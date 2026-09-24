import { NerdOverlay } from '@/components/layout/NerdOverlay';
import { TopNav } from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function PageShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      <TopNav />
      <div className="flex-1">{children}</div>
      <NerdOverlay />
    </div>
  );
}
