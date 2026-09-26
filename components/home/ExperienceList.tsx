'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ChevronUp } from 'lucide-react';
import { CompanyMark } from '@/components/home/CompanyMark';
import { HandNote } from '@/components/layout/SiteIcons';
import { cn } from '@/lib/utils';
import type { Experience } from '@/lib/content/schemas';

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function parseStamp(label: string, fallback: Date) {
  if (/present/i.test(label.trim())) return fallback;
  const parts = label.trim().split(/\s+/);
  const month = MONTHS[parts[0]?.toLowerCase() ?? ''] ?? 0;
  const year = Number(parts[1]) || fallback.getFullYear();
  return new Date(year, month, 1);
}

function range(item: Experience) {
  return `${item.startDate} to ${item.endDate}`.toLowerCase();
}

function NoteAsterisk() {
  return (
    <svg viewBox="0 0 16 16" className="text-note mt-[3px] size-[13px] shrink-0" aria-hidden>
      <path
        fill="currentColor"
        d="M7.2 0.85h1.6v5.05l3.57-3.57 1.13 1.13-3.57 3.57H15.15v1.6h-5.22l3.57 3.57-1.13 1.13-3.57-3.57V15.15H7.2v-5.22l-3.57 3.57-1.13-1.13 3.57-3.57H0.85V6.03h5.22L2.5 2.46l1.13-1.13 3.57 3.57z"
      />
    </svg>
  );
}

function isCurrent(item: Experience) {
  return /present/i.test(item.endDate);
}

function monthsBetween(start: Date, end: Date) {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function assignLanes(spans: { start: number; end: number }[]) {
  const lanes: number[] = [];
  const ends: number[] = [];
  for (const span of spans) {
    let lane = ends.findIndex((end) => end <= span.start);
    if (lane === -1) {
      lane = ends.length;
      ends.push(span.end);
    } else {
      ends[lane] = span.end;
    }
    lanes.push(lane);
  }
  return { lanes, count: Math.max(ends.length, 1) };
}

function ExperienceTimeline({ items }: { items: Experience[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const now = useMemo(() => new Date(), []);

  const model = useMemo(() => {
    const GAP = 8;
    const dated = items.map((item) => ({
      item,
      start: parseStamp(item.startDate, now),
      end: parseStamp(item.endDate, now),
      current: isCurrent(item),
    }));
    const earliest = dated.reduce(
      (min, row) => (row.start < min ? row.start : min),
      dated[0]?.start ?? now,
    );
    const latest = dated.reduce((max, row) => (row.end > max ? row.end : max), now);
    const startYear = earliest.getFullYear();
    const endYear = Math.max(latest.getFullYear() + 1, startYear + 1);
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    const origin = Date.UTC(startYear, 0, 1);
    const horizon = Date.UTC(endYear + 1, 0, 1);
    const spanMs = horizon - origin;
    const axisWidth = years.length * 176;
    const xOf = (date: Date) => ((date.getTime() - origin) / spanMs) * axisWidth;

    const spanYears = (latest.getTime() - earliest.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const recordedYears = Math.max(1, Math.round(spanYears));

    const placed = dated
      .map((row) => {
        const left = xOf(row.start);
        const rawRight = xOf(row.end);
        const duration = Math.max(monthsBetween(row.start, row.end), 1);
        const compact = duration <= 4 && !row.current;
        const width = compact ? 48 : Math.max(rawRight - left, 108);
        return {
          ...row,
          left,
          width,
          overlapStart: left,
          overlapEnd: rawRight,
          compact,
        };
      })
      .sort((a, b) => a.left - b.left || a.overlapEnd - b.overlapEnd);

    const { lanes, count } = assignLanes(
      placed.map((row) => ({ start: row.overlapStart, end: row.overlapEnd })),
    );

    const byLane = new Map<number, typeof placed>();
    placed.forEach((row, index) => {
      const lane = lanes[index] ?? 0;
      const list = byLane.get(lane) ?? [];
      list.push(row);
      byLane.set(lane, list);
    });
    for (const list of byLane.values()) {
      list.sort((a, b) => a.left - b.left);
      for (let i = 1; i < list.length; i += 1) {
        const minLeft = list[i - 1].left + list[i - 1].width + GAP;
        if (list[i].left < minLeft) list[i].left = minLeft;
      }
    }

    const active = placed.find((row) => row.current) ?? placed[placed.length - 1];
    const packedRight = Math.max(...placed.map((row) => row.left + row.width), 0);
    const nowX = active ? active.left + active.width + 24 : xOf(now);
    const width = Math.max(axisWidth, packedRight + 64, nowX + 48);

    return { years, width, nowX, placed, lanes, laneCount: count, recordedYears };
  }, [items, now]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = Math.max(model.nowX - el.clientWidth * 0.62, 0);
  }, [model.nowX]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { x: event.clientX, left: el.scrollLeft };
    el.setPointerCapture(event.pointerId);
    el.style.cursor = 'grabbing';
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    drag.current = null;
    if (el) el.style.cursor = 'grab';
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
  };

  const trackHeight = 128 + Math.max(model.laneCount - 1, 0) * 58;

  return (
    <div className="mt-10">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="cursor-grab touch-pan-y [scrollbar-width:none] overflow-x-auto pb-2 select-none [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative" style={{ width: model.width, height: trackHeight }}>
          {model.years.map((year, index) => {
            const left = (index / Math.max(model.years.length, 1)) * (model.years.length * 176);
            return (
              <div key={year} className="absolute inset-y-0" style={{ left }}>
                <div className="h-full w-px bg-white/8" />
                <span className="absolute bottom-0 left-2 text-[11px] tracking-wide text-white/35">
                  {year}
                </span>
              </div>
            );
          })}

          <div
            className="pointer-events-none absolute top-4 bottom-7 z-20 border-l border-dashed border-[#c4a35a]"
            style={{ left: model.nowX }}
          >
            <span className="font-hand text-note absolute -top-1 left-2 text-sm">now</span>
          </div>

          {model.placed.map((row, index) => {
            const lane = model.lanes[index] ?? 0;
            if (row.compact) {
              return (
                <article
                  key={row.item.id}
                  title={`${row.item.company} · ${row.item.role}`}
                  className="absolute z-10 flex size-12 items-center justify-center rounded-2xl bg-[#161616]"
                  style={{
                    left: row.left,
                    top: 52 + lane * 58,
                  }}
                >
                  <CompanyMark company={row.item.company} className="size-8" />
                </article>
              );
            }

            return (
              <article
                key={row.item.id}
                className={cn(
                  'absolute z-10 flex items-center gap-2.5 rounded-2xl px-2.5 py-2',
                  row.current
                    ? 'bg-[#3a3118] shadow-[inset_0_0_0_1px_rgba(232,185,35,0.28)]'
                    : 'bg-[#161616]',
                )}
                style={{
                  left: row.left,
                  width: row.width,
                  top: 52 + lane * 58,
                }}
              >
                <CompanyMark company={row.item.company} className="size-8" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium tracking-tight lowercase">
                    {row.item.company}
                  </p>
                  <p className="truncate text-[11px] text-white/45 lowercase">{row.item.role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <p className="font-hand mt-4 text-center text-[15px] text-white/40">
        {`drag sideways, the last ${model.recordedYears} year${model.recordedYears === 1 ? '' : 's'} are in here`}
      </p>
    </div>
  );
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
    const id = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <section
      className="pt-20 sm:pt-24"
      id="experience"
      data-nerd="experience: sliding pill + css grid-rows accordion + year-axis timeline"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
            experience
          </p>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">where I have worked</h2>
        </div>
        <div className="mb-2 flex items-center gap-3 sm:mb-0">
          <span className="hidden -translate-y-3 sm:inline-flex">
            <HandNote arrow="down-right">try this</HandNote>
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
        <ul className="relative mt-8">
          <span aria-hidden className="absolute top-5 bottom-8 left-[22px] w-px bg-white/12" />
          {items.map((item) => {
            const open = openId === item.id;
            const current = isCurrent(item);
            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  className="flex w-full items-start gap-3.5 py-3 text-left"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                >
                  <CompanyMark company={item.company} current={current} className="mt-0.5 size-9" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium tracking-tight lowercase">
                      {item.company}
                    </span>
                    <span className="block text-sm text-white/45 lowercase">{item.role}</span>
                  </span>
                  <span className="mt-1 hidden shrink-0 items-center gap-1 sm:flex">
                    <span className="text-[12px] text-white/35">{range(item)}</span>
                    {open ? <ChevronUp className="size-3.5 text-white/35" aria-hidden /> : null}
                  </span>
                </button>
                <div className="accordion-grid" data-open={open}>
                  <div>
                    <div className="pb-5 pl-[3.15rem]">
                      {item.highlights.map((line) => (
                        <p
                          key={line}
                          className="mb-1.5 flex gap-2.5 text-sm leading-relaxed text-white/55"
                        >
                          <NoteAsterisk />
                          <span>{line}</span>
                        </p>
                      ))}
                      <p className="mt-2 flex items-center gap-1 text-[12px] text-white/35 sm:hidden">
                        {range(item)}
                        {open ? <ChevronUp className="size-3.5" aria-hidden /> : null}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ExperienceTimeline items={items} />
      )}
    </section>
  );
}
