'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

// the baseline always covers 2021 through the current year, cut into a fixed number of
// columns so every card's grid is comparable; 5px cells on a 3px gap give an 8px integer
// pitch both ways, so the cells stay evenly sized and evenly spaced in the 10rem slot
const TRACK_START_YEAR = 2021;
const COLUMNS = 20;
const ROWS = 5;

// github-style intensity sprinkle: a small discrete set, picked deterministically per cell
// so the server render and the hydrated client agree
const LEVELS = [1, 0.85, 1, 0.68];

// the sweep is purely horizontal: each whole column charges in together, left to right
const CHART_DELAY_MS = 250;
const COLUMN_STAGGER_MS = 30;
const CELL_MS = 260; // matches the .grid-cell animation in globals.css
const SWEEP_MS = CHART_DELAY_MS + (COLUMNS - 1) * COLUMN_STAGGER_MS + CELL_MS;

type Span = { left: number; width: number; ongoing: boolean };

// the entry's own years as fractions of the 2021-to-now baseline, or null when the label has none
function spanOf(dateLabel: string, nowYear: number): Span | null {
  const years = [...dateLabel.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  // nothing to read: leave the whole grid dim instead of inventing a duration
  if (years.length === 0) return null;

  const ongoing = /\b(now|present|current)\b/i.test(dateLabel);
  const startYear = Math.min(...years);
  const endYear = ongoing ? nowYear : Math.max(...years);

  const totalYears = Math.max(nowYear + 1 - TRACK_START_YEAR, 1);
  const left = (startYear - TRACK_START_YEAR) / totalYears;
  // the end year counts as a full year of membership, so the span is inclusive
  const width = (endYear - startYear + 1) / totalYears;

  const clampedLeft = Math.min(Math.max(left, 0), 1);
  return { left: clampedLeft, width: Math.min(Math.max(width, 0), 1 - clampedLeft), ongoing };
}

export function ContributionGridChart({
  dateLabel,
  nowYear,
  seed,
  reduceMotion,
}: {
  dateLabel: string;
  nowYear: number;
  seed: number;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;

    // the charge plays once per page load: the first time the card scrolls in (or is
    // already on screen), the observer hangs up; run drives the key so the cells
    // remount into the staggered sweep
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRun(1);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const span = spanOf(dateLabel, nowYear);
  const animating = !reduceMotion && run > 0;

  // amber columns are the active years, everything else keeps the dim empty state
  const active = Array.from({ length: COLUMNS }, (_, column) => {
    const position = (column + 0.5) / COLUMNS;
    const share = span ? (position - span.left) / span.width : -1;
    return share >= 0 && share <= 1;
  });

  // an ongoing role reads as live: its rightmost active column (the "now" edge) keeps blinking
  let liveColumn = -1;
  if (span?.ongoing) {
    for (let column = COLUMNS - 1; column >= 0 && liveColumn < 0; column -= 1) {
      if (active[column]) liveColumn = column;
    }
  }

  return (
    <div ref={ref} aria-hidden className="w-full max-w-40">
      <div key={run} className="flex w-fit gap-[3px]">
        {active.map((isActive, column) => (
          <div key={column} className="flex flex-col gap-[3px]">
            {Array.from({ length: ROWS }, (_, row) => {
              const level = isActive
                ? (LEVELS[(seed * 13 + column * 7 + row * 11) % LEVELS.length] ?? 1)
                : 1;
              const blink = animating && column === liveColumn;
              const cellStyle = {
                opacity: level,
                '--cell-opacity': level,
                ...(animating
                  ? { animationDelay: `${CHART_DELAY_MS + column * COLUMN_STAGGER_MS}ms` }
                  : {}),
              } as CSSProperties;
              return (
                <span key={row} className={cn('block', animating && 'grid-cell')} style={cellStyle}>
                  <span
                    className={cn(
                      'block size-[5px]',
                      isActive ? 'bg-note' : 'bg-[#2a2a2a]',
                      blink && 'pixel-blink',
                    )}
                    style={blink ? { animationDelay: `${SWEEP_MS}ms` } : undefined}
                  />
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
