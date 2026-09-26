import { cn } from '@/lib/utils';

export function GlassesIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="7" cy="13" r="3.4" />
      <circle cx="17" cy="13" r="3.4" />
      <path d="M10.4 12.4c.9-.8 2.3-.8 3.2 0M3.6 12 2 10.5M20.4 12 22 10.5" />
    </svg>
  );
}

export function MoonIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function SunIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2 4.8 4.8M19.2 19.2l-1.4-1.4M17.8 6.2l1.4-1.4M4.8 19.2l1.4-1.4" />
    </svg>
  );
}

export function ScribbleArrow({
  toward,
  className = 'mt-2 h-10 w-11 shrink-0',
}: {
  toward: 'left' | 'down-left' | 'down-right';
  className?: string;
}) {
  const d =
    toward === 'left'
      ? 'M60 22 C 44 10, 26 12, 8 26 M8 26 l 11 -7 M8 26 l 12 3'
      : toward === 'down-left'
        ? 'M58 6 C 54 30, 30 34, 12 46 M12 46 l 10 -2 M12 46 l 1 -10'
        : 'M6 6 C 10 30, 34 34, 52 46 M52 46 l -10 -2 M52 46 l -1 -10';

  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandNote({
  children,
  arrow,
  className,
}: {
  children: string;
  arrow: 'left' | 'down-left' | 'down-right';
  className?: string;
}) {
  const label = <span className="font-hand text-xl leading-tight sm:text-2xl">{children}</span>;
  const mark = <ScribbleArrow toward={arrow} />;
  return (
    <span className={cn('text-note inline-flex items-start gap-1', className)}>
      {arrow === 'left' ? (
        <>
          {mark}
          {label}
        </>
      ) : (
        <>
          {label}
          {mark}
        </>
      )}
    </span>
  );
}
