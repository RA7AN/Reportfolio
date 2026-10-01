'use client';

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CountUp } from '@/components/home/CountUp';
import type { DevActivityData, DevActivityWeek } from '@/lib/dev-activity';
import { cn } from '@/lib/utils';

// the calendar is the section's hero visual: 7px cells on a 3px gap — a 10px
// integer pitch, one step up from the 5px mini-charts in the leadership rows
const GRID_DELAY_MS = 120;
const COLUMN_STAGGER_MS = 16;
// four amber steps; the cuts come from the dataset's own quartiles, not hardcoded values
const SWATCH_OPACITIES = [0.32, 0.52, 0.74, 1];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MS = 24 * 60 * 60 * 1000;
// the selector stops at 2021 by request; earlier years stay in the dataset so the
// oldest selectable pill keeps its vs-previous-year delta
const FIRST_SELECTABLE_YEAR = 2021;

// the radar draws once: eased strokes staggered per axis, counting labels synced to each spoke
const SPOKE_STAGGER_MS = 150;
const SPOKE_DRAW_MS = 800;
const LABEL_COUNT_MS = 700;
const LABEL_LAG_MS = 120;

// discrete steps from the dataset's own distribution: quartile cuts across the days
// that have activity, so the scale adapts to whatever range the accounts produced
function buildStep(counts: number[]) {
  const active = counts.filter((count) => count > 0).sort((a, b) => a - b);
  if (active.length === 0) return () => 0;
  const at = (p: number) => active[Math.floor(p * (active.length - 1))] ?? 0;
  const cuts = [at(0.25), at(0.5), at(0.75)];
  return (count: number) => {
    if (count <= 0) return 0;
    let step = 1;
    for (const cut of cuts) if (count > cut) step += 1;
    return step;
  };
}

function ContributionGrid({
  weeks,
  reduceMotion,
}: {
  weeks: DevActivityWeek[];
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;

    // the sweep plays once, the first time the card scrolls in; the observer hangs up
    // after charging and run remounts the cells into their staggered pop-in
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRun(1);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const animating = !reduceMotion && run > 0;
  const stepOf = buildStep(weeks.flatMap((week) => week.days));

  // month labels land on the first week that contains a new month's 1st, github-style,
  // so the trailing partial month gets a label too
  const months = weeks.map((week, index) => {
    const start = Date.parse(week.start);
    if (index === 0) return MONTHS[new Date(start).getUTCMonth()] ?? '';
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start + day * DAY_MS);
      if (date.getUTCDate() === 1) return MONTHS[date.getUTCMonth()] ?? '';
    }
    return '';
  });

  // weekday marks are read off the first week's real dates; only Mon/Wed/Fri get one
  const firstStart = weeks[0]?.start;
  const firstDay = firstStart ? new Date(Date.parse(firstStart)).getUTCDay() : 0;
  const weekdays = Array.from({ length: 7 }, (_, row) => {
    const name = WEEKDAY_NAMES[(firstDay + row) % 7] ?? '';
    return name === 'Mon' || name === 'Wed' || name === 'Fri' ? name : '';
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('grid-chart mx-auto w-max', animating && 'grid-charged')}
    >
      {/* with JS off the observer never charges, so noscript un-hides the settled grid */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.grid-chart{opacity:1}</style>' }} />
      <div key={run}>
        {/* month labels share the columns' 7px + 3px pitch so they sit over their weeks */}
        <div className="mb-1.5 flex h-3.5 gap-[3px]">
          <span className="mr-1.5 w-6" />
          {months.map((label, index) => (
            <span key={index} className="relative block w-[7px]">
              {label ? (
                <span className="text-muted-foreground absolute top-0 left-0 font-mono text-[10px] leading-none">
                  {label}
                </span>
              ) : null}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          <div className="mr-1.5 flex w-6 flex-col gap-[3px]">
            {weekdays.map((label, row) => (
              <span
                key={row}
                className="text-muted-foreground flex h-[7px] items-center font-mono text-[10px] leading-none"
              >
                {label}
              </span>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.days.map((count, dayIndex) => {
                const step = stepOf(count);
                const level = step === 0 ? 1 : (SWATCH_OPACITIES[step - 1] ?? 1);
                const cellStyle = {
                  opacity: level,
                  '--cell-opacity': level,
                  ...(animating
                    ? { animationDelay: `${GRID_DELAY_MS + weekIndex * COLUMN_STAGGER_MS}ms` }
                    : {}),
                } as CSSProperties;
                return (
                  <span
                    key={dayIndex}
                    className={cn('block', animating && 'grid-cell')}
                    style={cellStyle}
                  >
                    <span
                      className={cn('block size-[7px]', step === 0 ? 'bg-[#2a2a2a]' : 'bg-note')}
                    />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CX = 140;
const CY = 116;
const R = 62;

function RadarChart({
  types,
  reduceMotion,
}: {
  types: DevActivityData['types'];
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [charged, setCharged] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setCharged(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!charged || reduceMotion) return;

    // one painted frame between charge and draw, so the dashoffset has a start to leave
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setDrawn(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [charged, reduceMotion]);

  const total = types.commits + types.issues + types.prs + types.reviews;
  const pctOf = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);
  const max = Math.max(
    pctOf(types.commits),
    pctOf(types.issues),
    pctOf(types.prs),
    pctOf(types.reviews),
    1,
  );

  // four independent spokes: up = code review, right = issues, down = pull requests, left = commits
  const axes = [
    {
      label: 'Code review',
      value: pctOf(types.reviews),
      dx: 0,
      dy: -1,
      anchor: 'middle',
      pctX: CX,
      pctY: 42,
      nameX: CX,
      nameY: 24,
    },
    {
      label: 'Issues',
      value: pctOf(types.issues),
      dx: 1,
      dy: 0,
      anchor: 'start',
      pctX: 216,
      pctY: 120,
      nameX: 216,
      nameY: 138,
    },
    {
      label: 'Pull requests',
      value: pctOf(types.prs),
      dx: 0,
      dy: 1,
      anchor: 'middle',
      pctX: CX,
      pctY: 196,
      nameX: CX,
      nameY: 216,
    },
    {
      label: 'Commits',
      value: pctOf(types.commits),
      dx: -1,
      dy: 0,
      anchor: 'end',
      pctX: 64,
      pctY: 120,
      nameX: 64,
      nameY: 138,
    },
  ] as const;

  // spoke lengths are proportional to each percentage, normalized to the largest axis
  const lengths = axes.map((axis) => (axis.value > 0 ? Math.max(4, (axis.value / max) * R) : 0));
  // the filled area joins the four spoke tips, like github's profile radar
  const areaPoints = axes
    .map((axis, index) => {
      const length = lengths[index] ?? 0;
      return `${CX + axis.dx * length},${CY + axis.dy * length}`;
    })
    .join(' ');

  const labelActive = charged && !reduceMotion;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('grid-chart mx-auto w-full max-w-xs', charged && 'grid-charged')}
    >
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            '<style>.grid-chart{opacity:1}.radar-spoke{stroke-dashoffset:0 !important}.radar-area,.radar-dot{opacity:1 !important}</style>',
        }}
      />
      <svg viewBox="0 0 280 240" className="w-full">
        {/* the filled area waits under the spokes, filling the wedge like github's profile radar */}
        {total > 0 ? (
          <polygon
            points={areaPoints}
            className="radar-area fill-note"
            fillOpacity={0.16}
            style={{
              opacity: drawn || reduceMotion ? 1 : 0,
              ...(drawn && !reduceMotion ? { transition: 'opacity 700ms ease 250ms' } : {}),
            }}
          />
        ) : null}
        {axes.map((axis, index) => {
          const length = lengths[index] ?? 0;
          const offset = drawn || reduceMotion ? 0 : length;
          const spokeStyle: CSSProperties = {
            strokeDasharray: length,
            strokeDashoffset: offset,
            ...(drawn && !reduceMotion
              ? {
                  transition: `stroke-dashoffset ${SPOKE_DRAW_MS}ms cubic-bezier(0.16, 1, 0.3, 1) ${
                    index * SPOKE_STAGGER_MS
                  }ms`,
                }
              : {}),
          };
          return (
            <Fragment key={axis.label}>
              {/* a faint full-length guide stays visible under each value line */}
              <line
                x1={CX}
                y1={CY}
                x2={CX + axis.dx * R}
                y2={CY + axis.dy * R}
                className="stroke-border"
                strokeWidth={1}
              />
              {length > 0 ? (
                <>
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX + axis.dx * length}
                    y2={CY + axis.dy * length}
                    className="radar-spoke stroke-note"
                    strokeWidth={2}
                    strokeLinecap="round"
                    style={spokeStyle}
                  />
                  <circle
                    cx={CX + axis.dx * length}
                    cy={CY + axis.dy * length}
                    r={3}
                    className="radar-dot fill-note"
                    style={{
                      opacity: drawn || reduceMotion ? 1 : 0,
                      ...(drawn && !reduceMotion
                        ? {
                            transition: `opacity 220ms ease-out ${
                              index * SPOKE_STAGGER_MS + SPOKE_DRAW_MS - 200
                            }ms`,
                          }
                        : {}),
                    }}
                  />
                </>
              ) : null}
              <text
                x={axis.pctX}
                y={axis.pctY}
                textAnchor={axis.anchor}
                className={cn(
                  'fill-muted-foreground font-mono text-[10px]',
                  labelActive && 'rise-in',
                )}
                style={
                  labelActive
                    ? { animationDelay: `${index * SPOKE_STAGGER_MS + LABEL_LAG_MS}ms` }
                    : undefined
                }
              >
                {charged ? (
                  <CountUp
                    value={axis.value}
                    delay={index * SPOKE_STAGGER_MS + LABEL_LAG_MS}
                    duration={LABEL_COUNT_MS}
                  />
                ) : (
                  axis.value
                )}
                %
              </text>
              <text
                x={axis.nameX}
                y={axis.nameY}
                textAnchor={axis.anchor}
                className="fill-foreground text-[12px] font-medium"
              >
                {axis.label}
              </text>
            </Fragment>
          );
        })}
        {/* the shared center pixel, smallest unit of the site's pixel language */}
        <rect x={CX - 2.5} y={CY - 2.5} width={5} height={5} className="fill-note" />
      </svg>
    </div>
  );
}

export function DevelopmentActivity({ data }: { data: DevActivityData }) {
  const reduceMotion = useReducedMotion() ?? false;
  // newest year first in the dataset; the switcher grounds the stat in a calendar year
  const [activeYear, setActiveYear] = useState(data.years[0]?.year ?? new Date().getFullYear());
  const selectedIndex = Math.max(
    0,
    data.years.findIndex((entry) => entry.year === activeYear),
  );
  const selected = data.years[selectedIndex];
  const previous = selectedIndex < data.years.length - 1 ? data.years[selectedIndex + 1] : null;
  const delta =
    previous && previous.total > 0
      ? Math.round(((selected.total - previous.total) / previous.total) * 100)
      : null;
  const selectableYears = data.years.filter((entry) => entry.year >= FIRST_SELECTABLE_YEAR);

  if (!selected) {
    // the pipeline always emits at least the current year; this guards a hand-edited file
    return null;
  }

  return (
    <section
      className="pt-20 sm:pt-24"
      id="dev-activity"
      data-nerd="development activity: merged accounts, year-switchable grid charges on view, radar draws once"
    >
      <p className="text-muted-foreground mb-2 flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
        <span className="pixel-blink bg-note inline-block size-[5px]" aria-hidden />
        development activity
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">code, committed</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        merged from {data.accounts.length} github account{data.accounts.length === 1 ? '' : 's'} —
        no single contribution graph tells the whole story
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {data.accounts.map((account) => (
          <li
            key={account}
            className="border-border text-muted-foreground rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-widest"
          >
            [{account}]
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="border-border flex flex-col justify-center rounded-2xl border p-4 sm:p-5">
          {/* the headline stat reads fully amber; only the delta stays grey */}
          <p className="text-note mb-3 font-mono text-xs">
            <span className="tabular-nums">{selected.total.toLocaleString('en-US')}</span>{' '}
            contributions in {selected.year}
            {delta !== null && previous ? (
              <span className="text-muted-foreground ml-2 tabular-nums">
                {delta > 0 ? '↑' : delta < 0 ? '↓' : ''}
                {Math.abs(delta)}% vs {previous.year}
              </span>
            ) : null}
          </p>
          <div className="overflow-x-auto">
            <ContributionGrid
              key={selected.year}
              weeks={selected.weeks}
              reduceMotion={reduceMotion}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {/* the year switcher lines up with the legend, github-profile style */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectableYears.map((entry) => (
                <button
                  key={entry.year}
                  type="button"
                  onClick={() => setActiveYear(entry.year)}
                  aria-pressed={entry.year === selected.year}
                  className={cn(
                    'rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-widest tabular-nums transition-colors',
                    entry.year === selected.year
                      ? 'border-note text-note'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {entry.year}
                </button>
              ))}
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase">
              <span>less</span>
              <span aria-hidden className="flex gap-[3px]">
                <span className="block size-[7px] bg-[#2a2a2a]" />
                {SWATCH_OPACITIES.map((opacity) => (
                  <span key={opacity} className="bg-note block size-[7px]" style={{ opacity }} />
                ))}
              </span>
              <span>more</span>
            </div>
          </div>
        </div>
        <div className="border-border flex items-center justify-center rounded-2xl border p-5">
          <RadarChart types={data.types} reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}
