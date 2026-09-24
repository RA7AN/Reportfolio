import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function HomeInner({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('mx-auto w-full max-w-[920px] px-5 sm:px-8', className)}>{children}</div>
  );
}

export function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}
