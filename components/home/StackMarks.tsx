'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
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
        'stack-mark border-border bg-card text-muted-foreground relative z-0 flex shrink-0 items-center justify-center rounded-full border',
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

/* the reference hero's "sticky" stack: one shared pointerX motion value for
   the whole row; each coin measures its own center and works out how close
   the pointer is, then springs toward it — shift + grow inside a 90px
   field, label a plain group-hover tooltip pinned above its own coin so it
   travels with the magnetism. touch pointers and reduced motion get the
   static lift fallback, matching the reference's (hover: hover) gate. */
const FIELD_RADIUS = 90;
const MAX_PULL = 14;
const MAGNET_SPRING = { stiffness: 320, damping: 22, mass: 0.5 };

function MagneticStackIcon({
  item,
  pointerX,
  size = 'md',
}: {
  item: StackMark;
  pointerX: MotionValue<number>;
  size?: 'sm' | 'md';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const centerX = useMotionValue(1e6);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      centerX.set(r.left + r.width / 2);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener('resize', measure);
    // row leave resets pointerX to the sentinel — re-measure then, in case
    // the row reflowed (wrap, resize) while the pointer was away
    const unsub = pointerX.on('change', (v) => {
      if (v === 1e6) measure();
    });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      unsub();
    };
  }, [centerX, pointerX]);

  const pull = useTransform([pointerX, centerX], ([px, cx]: number[]) => {
    const d = cx - px;
    return Math.sign(d) * Math.max(0, 1 - Math.abs(d) / FIELD_RADIUS) * MAX_PULL;
  });
  const grow = useTransform(
    [pointerX, centerX],
    ([px, cx]: number[]) => 1 + 0.5 * Math.max(0, 1 - Math.abs(cx - px) / FIELD_RADIUS),
  );
  const x = useSpring(pull, MAGNET_SPRING);
  const scale = useSpring(grow, MAGNET_SPRING);

  const dim = size === 'sm' ? 'size-11' : 'size-10';
  const glyph = size === 'sm' ? 'size-[22px]' : 'size-5';

  return (
    <motion.span
      ref={ref}
      className={cn(
        'border-border bg-card text-muted-foreground group relative z-[1] flex shrink-0 items-center justify-center rounded-full border transition-colors hover:z-10 hover:text-(--brand)',
        dim,
      )}
      style={{
        ['--brand' as string]: item.brand,
        x,
        scale,
      }}
    >
      {'kind' in item && item.kind === 'codex' ? (
        <CodexIcon className={glyph} />
      ) : (
        <svg viewBox="0 0 24 24" className={glyph} aria-hidden>
          <path fill="currentColor" d={'path' in item ? item.path : ''} />
        </svg>
      )}
      <span
        role="tooltip"
        className="bg-foreground text-background pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 rounded-md px-2 py-0.5 text-[10px] whitespace-nowrap lowercase opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {item.label}
      </span>
    </motion.span>
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
  const pointerX = useMotionValue(1e6);
  const reduceMotion = useReducedMotion() ?? false;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const t = setTimeout(
      () => setEnabled(!reduceMotion && window.matchMedia('(hover: hover)').matches),
      0,
    );
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div className={cn('relative overflow-visible', className)}>
      <div className="relative mb-1 flex h-8 items-center">
        <p className="font-hand text-muted-foreground/70 text-lg">my stack</p>
      </div>
      <div
        role="img"
        aria-label={`tools I use: ${items.map((item) => item.label).join(', ')}`}
        className="flex max-w-full flex-wrap items-center gap-2.5 overflow-visible pt-1.5 pb-3"
        onPointerMove={enabled ? (e) => pointerX.set(e.clientX) : undefined}
        onPointerLeave={enabled ? () => pointerX.set(1e6) : undefined}
      >
        {items.map((item) =>
          enabled ? (
            <MagneticStackIcon key={item.label} item={item} pointerX={pointerX} size={size} />
          ) : (
            <span
              key={item.label}
              aria-hidden="true"
              className={cn(
                'border-border bg-card text-muted-foreground flex shrink-0 items-center justify-center rounded-full border transition-transform duration-200 hover:-translate-y-1',
                size === 'sm' ? 'size-11' : 'size-10',
              )}
            >
              {'kind' in item && item.kind === 'codex' ? (
                <CodexIcon className={size === 'sm' ? 'size-[22px]' : 'size-5'} />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className={size === 'sm' ? 'size-[22px]' : 'size-5'}
                  aria-hidden
                >
                  <path fill="currentColor" d={'path' in item ? item.path : ''} />
                </svg>
              )}
            </span>
          ),
        )}
        {showMore ? (
          <span className="font-hand text-muted-foreground/70 ml-1.5 text-lg">+ more</span>
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
        <li className="font-hand text-muted-foreground/70 ml-1.5 flex h-11 items-center text-lg">
          + more
        </li>
      </ul>
    </div>
  );
}
