'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// placeholder rows — swap for getPublications() once the section design settles
const rows = [
  {
    kind: 'Journal',
    title: 'Cross-Attention Video Temporal Grounding for Real-Time Urban Analytics',
    venue: 'IEEE Access',
    year: '2026',
    image: '/publications/1.svg',
    featured: true,
  },
  {
    kind: 'Conference',
    title: 'A Review on Cross-Temporal Video Grounding and Moment Localization',
    venue:
      'Proceedings of the 2nd International Conference on Data Analytics and Intelligence Computing',
    year: '2025',
    image: '/publications/2.svg',
    featured: false,
  },
  {
    kind: 'Journal',
    title: 'Cross-Attention Video Temporal Grounding for Smart-City CCTV',
    venue: 'Springer',
    year: '2025',
    image: '/publications/3.svg',
    featured: false,
  },
  {
    kind: 'Preprint',
    title: 'Evaluating Coding Agents Beyond Benchmarks',
    venue: 'arXiv',
    year: '2025',
    image: '/publications/5.svg',
    featured: false,
  },
  {
    kind: 'Poem',
    title: 'Do Not Gentle Into That Moonlight',
    venue: 'Muse India',
    year: '2024',
    image: '/publications/4.svg',
    featured: false,
  },
  {
    kind: 'Poem',
    title: 'Small Hours, Long Commutes',
    venue: 'Notebook',
    year: '2023',
    image: '/publications/6.svg',
    featured: false,
  },
];

// how many grid cards show before the button reveals the rest
const VISIBLE_COUNT = 3;

// a pinned entry wins the top slot; with nothing pinned the most recent year does
const featured =
  rows.find((row) => row.featured) ??
  rows.reduce((a, b) => (Number(b.year) > Number(a.year) ? b : a));
const rest = rows.filter((row) => row !== featured);

function Thumb({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn('relative block overflow-hidden rounded-xl', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* the tint keeps bright art calm on the dark card, and lightens on hover */}
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.28) 55%, rgba(0, 0, 0, 0.06))',
        }}
      />
      {/* pixel cluster signature in the corner, like the contribution grid */}
      <span aria-hidden className="absolute right-2 bottom-2 grid grid-cols-2 gap-[2px]">
        <span className="bg-note size-[4px]" />
        <span className="bg-note size-[4px]" />
        <span className="bg-note size-[4px]" />
        <span className="bg-note size-[4px]" />
      </span>
    </span>
  );
}

export function PublicationsPreview() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? rest : rest.slice(0, VISIBLE_COUNT);

  return (
    <section
      className="pt-20 sm:pt-24"
      id="publications"
      data-nerd="publications: featured card + grid, tinted thumbs with pixel clusters"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        publications
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">things I have published</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        conference papers, review notes, and one poem that snuck in
      </p>

      <article className="border-border group relative mt-8 rounded-2xl border p-5 transition-colors duration-200 hover:border-[#5a5a5a]">
        <ArrowUpRight
          className="text-muted-foreground group-hover:text-note absolute top-5 right-5 size-4 transition-colors duration-200"
          aria-hidden
        />
        <Thumb src={featured.image} className="aspect-[3/2] w-56 max-w-full" />
        <p className="text-note mt-4 font-mono text-[10px] tracking-widest uppercase">
          latest · {featured.kind}
        </p>
        <h3 className="mt-1.5 text-xl font-medium tracking-tight sm:text-2xl">{featured.title}</h3>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {featured.venue} · {featured.year}
        </p>
      </article>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((row, index) => (
          <li
            key={row.title}
            className={index >= VISIBLE_COUNT ? 'rise-in' : undefined}
            style={
              index >= VISIBLE_COUNT
                ? { animationDelay: `${(index - VISIBLE_COUNT) * 0.06}s` }
                : undefined
            }
          >
            <article className="border-border group flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-200 hover:border-[#5a5a5a]">
              <Thumb src={row.image} className="aspect-[8/5] w-full rounded-none" />
              <div className="flex grow flex-col p-4">
                <h3 className="text-[15px] leading-snug font-medium tracking-tight">{row.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-xs">
                  {row.venue} · {row.year}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-muted-foreground rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase">
                    {row.kind}
                  </span>
                  <ArrowUpRight
                    className="text-muted-foreground group-hover:text-note size-4 transition-colors duration-200"
                    aria-hidden
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {rest.length > VISIBLE_COUNT ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="border-border bg-background text-muted-foreground hover:text-foreground rounded-full border px-5 py-2 text-[13px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'show less' : 'more written things'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
