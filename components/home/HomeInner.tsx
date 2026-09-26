import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export const shellWidth = 'mx-auto w-full max-w-5xl px-5 sm:px-8';

export function HomeInner({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn(shellWidth, className)}>{children}</div>;
}

export function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
      {children}
    </p>
  );
}

export function SectionTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <h2 className={cn('text-2xl font-medium tracking-tight sm:text-3xl', className)}>{children}</h2>
  );
}

export function SectionLead({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <p className={cn('text-muted-foreground mt-2 text-sm leading-6 sm:text-base', className)}>
      {children}
    </p>
  );
}
