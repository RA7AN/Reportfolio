'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { CompanyMark } from '@/components/home/CompanyMark';
import type { Community } from '@/lib/content/schemas';

// matches the .rise-in keyframes in globals.css (0.5s, translateY(14px))
const RISE = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
// the line starts a beat after its row has risen, then draws itself across the years
const LINE_DRAW = { duration: 0.9, ease: 'easeOut' as const };

const TRACK_COLOR = '#2a2a2a';

// how much of the span it takes to fade grey into amber and back again
const COLOR_FADE = 0.25;

// the row owns the in-view trigger, and the line inherits "visible" from it so both move as one
const ROW = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

// the baseline always covers 2021 through the current year, one equal slice per calendar year,
// so the crest's offset reads as "when it started" and its width as "how long it ran"
const TRACK_START_YEAR = 2021;

// points used to approximate the crest; 16 stays smooth across the whole row width
const CREST_STEPS = 16;

// sub-pixel precision is meaningless here and it keeps the path string short
function round(value: number): number {
  return Number(value.toFixed(2));
}

type BarSpan = { left: number; width: number };

// the entry's own years as percentages of the 2021-to-now baseline, or null when the label has none
function barSpan(dateLabel: string, nowYear: number): BarSpan | null {
  const years = [...dateLabel.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  // nothing to read: leave the baseline flat instead of inventing a duration
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

// the whole 2021-to-now line as a single path: flat, one swell across the entry's own years,
// then flat again. The swell uses sin^2, which leaves and rejoins the flat runs with no slope,
// so it stays one continuous line rather than a shape sitting on top of one.
function trackPath(span: BarSpan): string {
  const points = ['0 100', `${round(span.left)} 100`];

  for (let step = 1; step <= CREST_STEPS; step += 1) {
    const t = step / CREST_STEPS;
    points.push(
      `${round(span.left + span.width * t)} ${round(100 - 100 * Math.sin(Math.PI * t) ** 2)}`,
    );
  }

  points.push('100 100');
  return `M ${points[0]} L ${points.slice(1).join(' L ')}`;
}

function ActivityLine({
  id,
  dateLabel,
  nowYear,
  delay,
  reduceMotion,
}: {
  id: number;
  dateLabel: string;
  nowYear: number;
  delay: number;
  reduceMotion: boolean;
}) {
  const span = barSpan(dateLabel, nowYear);
  const gradientId = `community-line-${id}`;
  const clipId = `community-draw-${id}`;
  const transition = { ...LINE_DRAW, delay };
  const fade = span ? span.width * COLOR_FADE : 0;

  return (
    <div aria-hidden className="relative h-4 w-full translate-y-1">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {span ? (
          <defs>
            {/* same line, recoloured: grey at the join, amber through the middle of the span,
                grey again by the time it settles back onto the baseline */}
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={100}
              y2={0}
            >
              <stop offset={0} stopColor={TRACK_COLOR} />
              <stop offset={round(span.left / 100)} stopColor={TRACK_COLOR} />
              <stop
                offset={round((span.left + fade) / 100)}
                style={{ stopColor: 'var(--note, #e8b923)' }}
              />
              <stop
                offset={round((span.left + span.width - fade) / 100)}
                style={{ stopColor: 'var(--note, #e8b923)' }}
              />
              <stop offset={round((span.left + span.width) / 100)} stopColor={TRACK_COLOR} />
              <stop offset={1} stopColor={TRACK_COLOR} />
            </linearGradient>
            {/* wiped in from 2021, and padded so the clip never shaves the stroke */}
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              {reduceMotion ? (
                <rect x={-2} y={-10} width={104} height={120} />
              ) : (
                <motion.rect
                  x={-2}
                  y={-10}
                  height={120}
                  variants={{ hidden: { width: 0 }, visible: { width: 104 } }}
                  transition={transition}
                />
              )}
            </clipPath>
          </defs>
        ) : null}
        <path
          d={span ? trackPath(span) : 'M 0 100 L 100 100'}
          clipPath={span ? `url(#${clipId})` : undefined}
          fill="none"
          stroke={span ? `url(#${gradientId})` : TRACK_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function Communities({ items }: { items: Community[] }) {
  const reduceMotion = useReducedMotion() ?? false;
  const nowYear = new Date().getFullYear();

  return (
    <section
      className="pt-20 sm:pt-24"
      id="communities"
      data-nerd="communities: git cms rows, per-row rise on view, one line per row that crests over its active years and draws itself in, initials fallback for logos"
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
            variants={ROW}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
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
            <ActivityLine
              id={item.id}
              dateLabel={item.dateLabel}
              nowYear={nowYear}
              delay={(reduceMotion ? 0 : Math.min(index, 4) * 0.06) + 0.1}
              reduceMotion={reduceMotion}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
