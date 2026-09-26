'use client';

import { useState } from 'react';
import { MARKS, type StackMark } from '@/components/home/stack-marks-data';
import { cn } from '@/lib/utils';

function CodexIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'size-5'} fill="none" aria-hidden>
      <path
        d="M5 6.5 11 12 5 17.5M13 18h6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function neighborShift(index: number, hovered: number | null) {
  if (hovered === null) return { x: 0, scale: 1 };
  if (index === hovered) return { x: 0, scale: 1.62 };
  const distance = index - hovered;
  const away = distance < 0 ? -1 : 1;
  const mag = Math.abs(distance) === 1 ? 16 : Math.abs(distance) === 2 ? 8 : 4;
  return { x: away * mag, scale: 1 };
}

export function StackIcon({
  item,
  hot = false,
  shift = 0,
  scale = 1,
  onEnter,
  onLeave,
  size = 'md',
}: {
  item: StackMark;
  hot?: boolean;
  shift?: number;
  scale?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'size-11' : 'size-10';
  const glyph = size === 'sm' ? 'size-[22px]' : 'size-5';

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        'stack-mark border-border bg-background text-muted-foreground relative z-0 flex shrink-0 items-center justify-center rounded-full border',
        dim,
        hot && 'is-hot',
      )}
      style={{
        ['--brand' as string]: item.brand,
        transform: `translateX(${shift}px) scale(${scale})`,
        zIndex: hot ? 8 : 0,
      }}
    >
      {'kind' in item && item.kind === 'codex' ? (
        <CodexIcon className={glyph} />
      ) : (
        <svg viewBox="0 0 24 24" className={glyph} aria-hidden>
          <path fill="currentColor" d={'path' in item ? item.path : ''} />
        </svg>
      )}
    </span>
  );
}

export function StackIconRow({
  items,
  className,
  size = 'md',
  showMore = true,
}: {
  items: readonly StackMark[];
  className?: string;
  size?: 'sm' | 'md';
  showMore?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn('relative overflow-visible', className)}>
      <div className="relative mb-3 flex h-8 items-center">
        <p className="font-hand text-muted-foreground text-lg">my stack</p>
        <span
          aria-hidden={hovered === null}
          className={cn(
            'stack-tooltip bg-foreground text-background pointer-events-none absolute left-16 z-20 rounded-2xl px-3.5 py-1.5 text-[13px] leading-none font-medium tracking-wide lowercase shadow-[0_10px_28px_rgba(0,0,0,0.4)]',
            hovered !== null ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
          )}
        >
          {hovered !== null ? items[hovered]?.label : ''}
        </span>
      </div>
      <div
        role="img"
        aria-label={`tools I use: ${items.map((item) => item.label).join(', ')}`}
        className="flex max-w-full flex-wrap items-center gap-2.5 overflow-visible py-3"
      >
        {items.map((item, index) => {
          const motion = neighborShift(index, hovered);
          return (
            <StackIcon
              key={item.label}
              item={item}
              size={size}
              hot={hovered === index}
              shift={motion.x}
              scale={motion.scale}
              onEnter={() => setHovered(index)}
              onLeave={() => setHovered(null)}
            />
          );
        })}
        {showMore ? (
          <span className="font-hand text-muted-foreground ml-1.5 text-lg">+ more</span>
        ) : null}
      </div>
    </div>
  );
}

export function StackMarks({ className }: { className?: string }) {
  return <StackIconRow items={MARKS} className={className} />;
}

export function StackMarksPlain({
  items,
  className,
}: {
  items: readonly StackMark[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn('relative overflow-visible', className)}>
      <div className="relative mb-3 min-h-8">
        <span
          className={cn(
            'stack-tooltip bg-foreground text-background inline-flex rounded-2xl px-3 py-1 text-[13px] leading-none font-medium tracking-wide lowercase shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
            hovered !== null ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
          )}
        >
          {hovered !== null ? (items[hovered]?.label ?? '\u00a0') : '\u00a0'}
        </span>
      </div>
      <ul
        className="flex flex-wrap items-center gap-2.5 overflow-visible py-3"
        aria-label={items.map((item) => item.label).join(', ')}
      >
        {items.map((item, index) => {
          const motion = neighborShift(index, hovered);
          return (
            <li key={item.label} className="overflow-visible">
              <StackIcon
                item={item}
                size="sm"
                hot={hovered === index}
                shift={motion.x}
                scale={motion.scale}
                onEnter={() => setHovered(index)}
                onLeave={() => setHovered(null)}
              />
            </li>
          );
        })}
        <li className="font-hand text-muted-foreground ml-1.5 flex h-11 items-center text-lg">
          + more
        </li>
      </ul>
    </div>
  );
}
