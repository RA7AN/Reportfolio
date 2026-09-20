import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function MinimalSection({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  actions,
}: PropsWithChildren<{
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}>) {
  return (
    <section id={id} className={cn('scroll-mt-24 md:scroll-mt-28', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <header className="max-w-2xl">
          {eyebrow && (
            <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-2 text-2xl leading-[1.1] font-bold sm:text-3xl md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
              {subtitle}
            </p>
          )}
        </header>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
