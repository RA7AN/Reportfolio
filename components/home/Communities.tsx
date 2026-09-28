'use client';

import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { CompanyMark } from '@/components/home/CompanyMark';
import type { Community } from '@/lib/content/schemas';

// matches the .rise-in keyframes in globals.css (0.5s, translateY(14px))
const RISE = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

// the track always covers 2021 through the current year, one equal slice per calendar year,
// so the amber segment's offset reads as "when it started" and its length as "how long it ran"
const TRACK_START_YEAR = 2021;

// keep the inline styles short: sub-pixel precision is meaningless on a 3px track
function round(value: number): number {
  return Number(value.toFixed(3));
}

function barStyle(dateLabel: string, nowYear: number): CSSProperties {
  const totalYears = Math.max(nowYear + 1 - TRACK_START_YEAR, 1);

  const years = [...dateLabel.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  // nothing to read: leave the track empty instead of inventing a duration
  if (years.length === 0) return { marginLeft: '0%', width: '0%' };

  const openEnded = /\b(now|present|current)\b/i.test(dateLabel);
  const startYear = Math.min(...years);
  const endYear = openEnded ? nowYear : Math.max(...years);

  const left = ((startYear - TRACK_START_YEAR) / totalYears) * 100;
  // the end year counts as a full year of membership, so the span is inclusive
  const width = ((endYear - startYear + 1) / totalYears) * 100;

  const clampedLeft = Math.min(Math.max(left, 0), 100);
  return {
    marginLeft: `${round(clampedLeft)}%`,
    width: `${round(Math.min(Math.max(width, 0), 100 - clampedLeft))}%`,
  };
}

export function Communities({ items }: { items: Community[] }) {
  const reduceMotion = useReducedMotion();
  const nowYear = new Date().getFullYear();

  return (
    <section
      className="pt-20 sm:pt-24"
      id="communities"
      data-nerd="communities: git cms rows, per-row rise on view, bars span 2021 to now from the date labels, initials fallback for logos"
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
            className="border-border group grid items-center gap-4 rounded-2xl border px-4 py-3.5 transition-colors duration-200 hover:border-[#5a5a5a] sm:grid-cols-[18rem_minmax(0,1fr)_10rem]"
          >
            <div className="flex items-center gap-3.5">
              <CompanyMark
                company={item.org}
                src={item.logo}
                size={56}
                className="size-14"
                imgClassName={item.logoFill === 'yes' ? 'object-cover p-0' : 'p-1.5'}
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
            <div aria-hidden className="h-[3px] w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div className="bg-note h-full" style={barStyle(item.dateLabel, nowYear)} />
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
