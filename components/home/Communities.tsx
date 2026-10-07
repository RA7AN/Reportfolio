'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { CompanyMark } from '@/components/home/CompanyMark';
import { ContributionGridChart } from '@/components/home/ContributionGridChart';
import type { Community } from '@/lib/content/schemas';

// matches the .rise-in keyframes in globals.css (0.5s, translateY(14px))
const RISE = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
// the row rises itself in on view; each pixel meter charges on its own in-view trigger
const ROW = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function Communities({ items }: { items: Community[] }) {
  const reduceMotion = useReducedMotion() ?? false;
  const nowYear = new Date().getFullYear();

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="communities"
      data-nerd="communities: git cms rows, per-row rise on view, one contribution grid per row that charges on view, initials fallback for logos"
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
            <ContributionGridChart
              dateLabel={item.dateLabel}
              nowYear={nowYear}
              seed={item.id}
              reduceMotion={reduceMotion}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
