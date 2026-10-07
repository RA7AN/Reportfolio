'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SnakePost = {
  id: number;
  title: string;
  kind: string;
  venue?: string | null;
  year?: string | null;
  url?: string | null;
  doi?: string | null;
  excerpt?: string | null;
  image?: string | null;
};

// a card links out through its url, else its doi; some print-only pieces have neither
function primaryHref(post: SnakePost) {
  if (post.url) return post.url;
  return post.doi ? `https://doi.org/${post.doi}` : undefined;
}

// the accent stroke finishes filling once the reading line reaches this viewport fraction
const REVEAL_LINE = 0.72;

export function WritingSnake({ posts, author }: { posts: SnakePost[]; author: string }) {
  const gridRef = useRef<HTMLUListElement | null>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const basePathRef = useRef<SVGPathElement | null>(null);
  const fillPathRef = useRef<SVGPathElement | null>(null);
  const frameRef = useRef(0);
  const [lit, setLit] = useState<Set<number>>(() => new Set());
  const [openId, setOpenId] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  const open = openId ? (posts.find((post) => post.id === openId) ?? null) : null;

  // the accent copy fills in with scroll, drawn along the path's own length
  const applyProgress = useCallback(() => {
    const grid = gridRef.current;
    const fill = fillPathRef.current;
    if (!grid || !fill) return;
    const length = Number(fill.dataset.length ?? 0);
    if (!length) return;
    if (reduced) {
      fill.style.strokeDashoffset = '0';
      return;
    }
    const rect = grid.getBoundingClientRect();
    const progress = Math.min(
      1,
      Math.max(0, (window.innerHeight * REVEAL_LINE - rect.top) / rect.height),
    );
    fill.style.strokeDashoffset = `${length * (1 - progress)}`;
  }, [reduced]);

  // Catmull-Rom spline through the node points, emitted as cubic bezier segments
  const drawPath = useCallback(() => {
    const grid = gridRef.current;
    const base = basePathRef.current;
    const fill = fillPathRef.current;
    if (!grid || !base || !fill) return;
    const bounds = grid.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < posts.length; i++) {
      const node = nodeRefs.current[i];
      if (!node) return;
      const rect = node.getBoundingClientRect();
      points.push({
        x: rect.left + rect.width / 2 - bounds.left,
        y: rect.top + rect.height / 2 - bounds.top,
      });
    }
    if (points.length < 2) {
      base.removeAttribute('d');
      fill.removeAttribute('d');
      return;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    base.setAttribute('d', d);
    fill.setAttribute('d', d);
    const length = fill.getTotalLength();
    fill.dataset.length = `${length}`;
    fill.style.strokeDasharray = `${length}`;
    applyProgress();
  }, [posts, applyProgress]);

  // respect prefers-reduced-motion: everything renders lit and fully drawn
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // nodes light up once scrolled into view and stay lit; reduced motion lights them all
  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setLit((current) => {
          const next = new Set(current);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const index = Number((entry.target as HTMLElement).dataset.snakeCard);
            if (!Number.isNaN(index)) next.add(index);
          }
          return next;
        });
      },
      { threshold: 0.5 },
    );
    grid
      .querySelectorAll<HTMLElement>('[data-snake-card]')
      .forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [reduced, posts]);

  // draw once laid out, then redraw whenever the grid reflows
  useLayoutEffect(() => {
    drawPath();
    const grid = gridRef.current;
    if (!grid) return;
    const watcher = new ResizeObserver(() => drawPath());
    watcher.observe(grid);
    return () => watcher.disconnect();
  }, [drawPath]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(applyProgress);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [applyProgress]);

  // modal hygiene: escape dismisses, the page behind stops scrolling
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <div className="relative mt-10">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full sm:block"
          fill="none"
        >
          {/* dim thread always visible under the cards; the amber copy fills in on scroll */}
          <path ref={basePathRef} className="stroke-border" strokeWidth={2} />
          <path ref={fillPathRef} className="stroke-note" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <ul ref={gridRef} className="relative z-10 grid grid-cols-1 gap-y-24 sm:gap-y-40">
          {posts.map((post, index) => (
            <li
              key={post.id}
              className={cn(
                'relative w-full sm:w-[58%]',
                // one card per row, alternating sides so the thread weaves like a plough
                index % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto',
              )}
              style={{ zIndex: posts.length - index }}
              data-snake-card={index}
            >
              <button
                type="button"
                onClick={() => setOpenId(post.id)}
                className="group border-border bg-background relative z-10 flex w-full flex-col rounded-2xl border p-6 text-left transition-colors duration-200 hover:border-[#5a5a5a] sm:p-7"
              >
                {/* the node the snake threads through */}
                <span
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  aria-hidden
                  className={cn(
                    'border-border bg-background absolute top-0 left-1/2 z-20 hidden size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300 sm:block',
                    lit.has(index) || reduced ? 'border-note bg-note' : undefined,
                    index === 0 && (lit.has(index) || reduced) && 'pixel-blink',
                  )}
                />
                <span className="text-muted-foreground flex items-baseline justify-between font-mono text-[11px] tracking-widest">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{post.year}</span>
                </span>
                <span className="mt-4 block text-xl font-medium tracking-tight">{post.title}</span>
                {post.venue ? (
                  <span className="text-muted-foreground mt-1 block truncate text-xs">
                    {post.venue}
                  </span>
                ) : null}
                {post.excerpt ? (
                  <span className="text-muted-foreground mt-2 line-clamp-3 block text-[15px] leading-7">
                    {post.excerpt}
                  </span>
                ) : null}
                <span className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-muted-foreground rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase">
                    {post.kind}
                  </span>
                  <ArrowUpRight
                    className="text-muted-foreground group-hover:text-note size-4 transition-colors duration-200"
                    aria-hidden
                  />
                </span>
              </button>
              {/* citation card beside its card: right of left-aligned cards, left of
                right-aligned ones, vertically centered; stacks below on phones */}
              <span
                className={cn(
                  'border-border text-muted-foreground bg-background relative mt-3 block rounded-lg border border-dashed p-3 text-[11px] leading-4 shadow-lg',
                  'sm:absolute sm:top-1/2 sm:mt-0 sm:w-60 sm:-translate-y-1/2 sm:-rotate-2',
                  index % 2 === 0 ? 'sm:left-[calc(100%+1.5rem)]' : 'sm:right-[calc(100%+1.5rem)]',
                )}
              >
                <span className="text-muted-foreground block font-mono text-[9px] tracking-widest uppercase">
                  cite as
                </span>
                <span className="text-foreground mt-1 block text-xs font-medium">{author}</span>
                <span className="mt-0.5 block">
                  {author}. &quot;{post.title}.&quot; {post.venue ?? 'print'}, {post.year}.
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      {open ? <PreviewModal post={open} onClose={() => setOpenId(null)} /> : null}
    </>
  );
}

// browser-chrome style preview: click through to the source, click away to dismiss
function PreviewModal({ post, onClose }: { post: SnakePost; onClose: () => void }) {
  const href = primaryHref(post);
  const body = (
    <>
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image} alt="" className="mb-5 aspect-[8/3] w-full rounded-lg object-cover" />
      ) : null}
      <p className="text-note font-mono text-[10px] tracking-widest uppercase">
        {post.kind}
        {post.year ? ` · ${post.year}` : ''}
      </p>
      <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">{post.title}</h2>
      {post.excerpt ? (
        <p className="text-muted-foreground mt-3 text-sm leading-6">{post.excerpt}</p>
      ) : null}
      {href ? (
        <span className="text-note mt-6 inline-flex items-center gap-1 font-mono text-xs">
          open source <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </>
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <button
        type="button"
        aria-label="dismiss preview"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out bg-black/75 backdrop-blur-sm"
      />
      <div className="border-border bg-background relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl">
        <div className="border-border bg-muted/40 flex items-center gap-3 border-b px-4 py-3">
          <span aria-hidden className="flex shrink-0 gap-1.5">
            <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
            <span className="size-2.5 rounded-full bg-[#2e2e2e]" />
            <span className="size-2.5 rounded-full bg-[#242424]" />
          </span>
          <span className="text-muted-foreground bg-muted min-w-0 flex-1 truncate rounded-md px-3 py-1.5 font-mono text-xs">
            {href ?? [post.venue, post.year].filter(Boolean).join(' · ')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-h-[70vh] overflow-y-auto p-6 sm:p-8"
          >
            {body}
          </a>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">{body}</div>
        )}
      </div>
    </div>
  );
}
