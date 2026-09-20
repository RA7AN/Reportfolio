import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

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
    <section id={id} className={cn("scroll-mt-24 md:scroll-mt-28", className)} data-testid={`section-${id ?? title}`}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <header className="max-w-2xl">
          {eyebrow && (
            <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{eyebrow}</div>
          )}
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
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
