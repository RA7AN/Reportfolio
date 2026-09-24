'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Experience } from '@/lib/content/schemas';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function range(item: Experience) {
  return `${item.startDate} to ${item.endDate}`.toLowerCase();
}

export function ExperienceList({ items }: { items: Experience[] }) {
  const [mode, setMode] = useState<'list' | 'timeline'>('list');
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);
  const listRef = useRef<HTMLButtonElement>(null);
  const timeRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState({ left: 4, width: 48 });

  const measure = () => {
    const active = mode === 'list' ? listRef.current : timeRef.current;
    const parent = active?.parentElement;
    if (!active || !parent) return;
    const a = active.getBoundingClientRect();
    const p = parent.getBoundingClientRect();
    setPill({ left: a.left - p.left, width: a.width });
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <section className="pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            experience
          </p>
          <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">
            where I have worked
          </h2>
        </div>
        <div className="relative flex items-center gap-3">
          <span className="font-hand text-note absolute -top-7 right-0 hidden -rotate-6 text-lg sm:block">
            try this
          </span>
          <div
            role="tablist"
            className="border-border relative flex rounded-full border bg-[#111] p-1 text-[13px]"
          >
            <span
              aria-hidden
              className="bg-foreground absolute top-1 bottom-1 rounded-full"
              style={{
                left: pill.left,
                width: pill.width,
                transition:
                  'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <button
              ref={listRef}
              type="button"
              role="tab"
              aria-selected={mode === 'list'}
              onClick={() => setMode('list')}
              className={cn(
                'relative z-10 rounded-full px-4 py-1.5 transition-colors duration-150',
                mode === 'list' ? 'text-background' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              list
            </button>
            <button
              ref={timeRef}
              type="button"
              role="tab"
              aria-selected={mode === 'timeline'}
              onClick={() => setMode('timeline')}
              className={cn(
                'relative z-10 rounded-full px-4 py-1.5 transition-colors duration-150',
                mode === 'timeline'
                  ? 'text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              timeline
            </button>
          </div>
        </div>
      </div>

      {mode === 'list' ? (
        <ul className="mt-8">
          {items.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id} className="border-border/80 border-b">
                <button
                  type="button"
                  className="hover:bg-muted/40 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                >
                  <span className="bg-muted mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-medium">
                    {initials(item.company)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium tracking-tight">
                      {item.company}
                    </span>
                    <span className="text-muted-foreground block text-[13px]">{item.role}</span>
                  </span>
                  <span className="text-muted-foreground hidden shrink-0 text-[12px] sm:block">
                    {range(item)}
                  </span>
                </button>
                <div className="accordion-grid" data-open={open}>
                  <div>
                    <div className="pb-5 pl-12">
                      {item.highlights.map((line) => (
                        <p key={line} className="mb-1.5 text-[13px] leading-relaxed text-[#c4c2ba]">
                          {line}
                        </p>
                      ))}
                      <p className="text-muted-foreground mt-2 text-[12px] sm:hidden">
                        {range(item)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8">
          <p className="text-muted-foreground mb-4 text-[13px]">
            drag sideways, the last few years are in here
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="rise-in border-border w-56 shrink-0 rounded-2xl border p-4"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <p className="text-muted-foreground text-[11px]">{range(item)}</p>
                <p className="mt-3 text-[15px] font-medium">{item.company}</p>
                <p className="text-muted-foreground mt-1 text-[13px]">{item.role}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
