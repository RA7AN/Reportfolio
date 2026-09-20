import { TopNav } from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function PageShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('grain min-h-screen', className)}>
      <TopNav />
      {children}
    </div>
  );
}
