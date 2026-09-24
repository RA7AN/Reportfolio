import { cn } from '@/lib/utils';
import type { CSSProperties, HTMLAttributes } from 'react';

export function RiseIn({
  delay = 0,
  className,
  as: Tag = 'div',
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  delay?: number;
  as?: 'div' | 'p' | 'span' | 'h1' | 'ul';
}) {
  return (
    <Tag
      className={cn('rise-in', className)}
      style={{ animationDelay: `${delay}s` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function LetterTitle({ text, className }: { text: string; className?: string }) {
  const chars = [...text];
  return (
    <h1
      className={cn('text-[2.6rem] leading-none tracking-tight sm:text-6xl md:text-7xl', className)}
    >
      {chars.map((char, index) =>
        char === ' ' ? (
          <span key={`sp-${index}`} className="inline-block w-[0.28em]" />
        ) : (
          <span
            key={`${char}-${index}`}
            aria-hidden
            className="rise-in inline-block"
            style={{ animationDelay: `${0.1 + index * 0.04}s` }}
          >
            {char}
          </span>
        ),
      )}
      <span className="sr-only">{text}</span>
    </h1>
  );
}
