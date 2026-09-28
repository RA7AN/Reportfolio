'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { CompanyMark } from '@/components/home/CompanyMark';
import type { Community } from '@/lib/content/schemas';

// matches the .rise-in keyframes in globals.css (0.5s, translateY(14px))
const RISE = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

// the baseline always covers 2021 through the current year, one equal slice per calendar year,
// so the crest's offset reads as "when it started" and its width as "how long it ran"
const TRACK_START_YEAR = 2021;

// points used to approximate the sine crest; 16 stays smooth across the whole row width
const CREST_STEPS = 16;

// sub-pixel precision is meaningless here and it keeps the path string short
function round(value: number): number {
  return Number(value.toFixed(2));
}

type BarSpan = { left: number; width: number };

// the entry's own years as percentages of the 2021-to-now baseline, or null when the label has none
function barSpan(dateLabel: string, nowYear: number): BarSpan | null {
  const years = [...dateLabel.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  // nothing to read: leave the baseline unlit instead of inventing a duration
  if (years.length === 0) return null;

  const openEnded = /\b(now|present|current)\b/i.test(dateLabel);
  const startYear = Math.min(...years);
  const endYear = openEnded ? nowYear : Math.max(...years);

  const totalYears = Math.max(nowYear + 1 - TRACK_START_YEAR, 1);
  const left = ((startYear - TRACK_START_YEAR) / totalYears) * 100;
  // the end year counts as a full year of membership, so the span is inclusive
  const width = ((endYear - startYear + 1) / totalYears) * 100;

  const clampedLeft = Math.min(Math.max(left, 0), 100);
  return { left: clampedLeft, width: Math.min(Math.max(width, 0), 100 - clampedLeft) };
}

// one positive half-cycle of a sine inside a 0-100 viewBox: baseline at y=100, crest at y=0
function crestPath(dateLabel: string, nowYear: number): string {
  const span = barSpan(dateLabel, nowYear);
  if (!span) return '';

  const points = Array.from({ length: CREST_STEPS + 1 }, (_, index) => {
    const t = index / CREST_STEPS;
    return `${round(span.left + span.width * t)} ${round(100 - 100 * Math.sin(Math.PI * t))}`;
  });

  const [first, ...rest] = points;
  return `M ${first} L ${rest.join(' L ')} Z`;
}

export function Communities({ items }: { items: Community[] }) {
  const reduceMotion = useReducedMotion();
  const nowYear = new Date().getFullYear();

  return (
    <section
      className="pt-20 sm:pt-24"
      id="communities"
      data-nerd="communities: git cms rows, per-row rise on view, one line per row that crests over the active years on a 2021-now baseline, initials fallback for logos"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        leadership
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">the rooms i learned in</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        the bars run 2021 to now. amber represents active duration
      </p>
      <ul className="mt-8 space-y-3">
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            // each row animates itself on entry: rows mounted after the section has already
            // been viewed (cms edits, fast refresh) still get their rise instead of
            // being stranded at opacity 0 by a one-shot parent stagger
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...RISE, delay: reduceMotion ? 0 : Math.min(index, 4) * 0.06 }}
            className="border-border group hover:bg-muted/60 grid items-center gap-4 rounded-2xl border px-4 py-3.5 transition-colors duration-200 hover:border-[#5a5a5a] sm:grid-cols-[18rem_minmax(0,1fr)_10rem]"
          >
            <div className="flex items-center gap-3.5">
              <CompanyMark
                company={item.org}
                src={item.logo}
                size={44}
                className="size-11"
                imgClassName={item.logoFill === 'yes' ? 'object-cover p-0' : 'p-1'}
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-base font-medium tracking-tight lowercase">
                  <span className="truncate" title={item.org}>
                    {item.org}
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${item.org} (opens in a new tab)`}
                      className="text-muted-foreground group-hover:text-note hover:text-note shrink-0 transition-colors duration-200"
                    >
                      <ArrowUpRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-125"
                        aria-hidden
                      />
                    </a>
                  ) : null}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{item.dateLabel}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.highlights[0]}</p>
            <div aria-hidden className="relative h-4 w-full">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="text-note absolute inset-0 h-full w-full overflow-visible"
              >
                {/* one 2021-to-now line: flat grey, then it curves up and back down across the years */}
                <line
                  x1={0}
                  y1={100}
                  x2={100}
                  y2={100}
                  stroke="#2a2a2a"
                  strokeWidth={2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={crestPath(item.dateLabel, nowYear)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
