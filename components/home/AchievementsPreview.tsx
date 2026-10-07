'use client';

import { useState } from 'react';
import type { Honor } from '@/lib/content/schemas';
import { cn } from '@/lib/utils';

// the year token of the award's date label, for the corner badge
function yearOf(dateLabel: string) {
  return dateLabel.trim().split(/\s+/).pop() ?? '';
}

function AwardCard({ award, amber = false }: { award: Honor; amber?: boolean }) {
  if (award.image) {
    return (
      <li
        className={cn(
          'group relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-2xl p-4',
          amber
            ? // the freshest win borrows the timeline's amber treatment
              'shadow-[inset_0_0_0_1px_rgba(232,185,35,0.28)]'
            : 'border-border border hover:border-[#5a5a5a]',
        )}
      >
        {/* the photo fills the card and eases forward on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={award.image}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* the smoke cover lifts a little on hover to reveal more of the photo */}
        <span
          className={cn(
            'absolute inset-0 bg-gradient-to-t transition-opacity duration-300 group-hover:opacity-75',
            amber
              ? 'from-[#171208] via-[#171208]/85 to-[#171208]/40'
              : 'from-background via-background/92 to-background/60',
          )}
        />
        <span className="absolute top-3 right-3 z-10 rounded-full border border-white/10 bg-black/45 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white/80 backdrop-blur-sm">
          {yearOf(award.dateLabel)}
        </span>
        <div className="relative z-10 flex h-full flex-col">
          <p className="text-[15px] font-medium tracking-tight text-white">{award.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/70">{award.highlights[0]}</p>
          <p className="mt-auto pt-3 text-xs text-white/55">
            {award.org} · {award.dateLabel}
          </p>
        </div>
      </li>
    );
  }
  return (
    <li className="border-border hover:bg-muted/60 relative flex h-full flex-col rounded-2xl border p-4 transition-colors duration-200 hover:border-[#5a5a5a]">
      <span className="border-border text-muted-foreground absolute top-3 right-3 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-widest">
        {yearOf(award.dateLabel)}
      </span>
      {/* the dashed tile stands in until a photo is set */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/achievements/placeholder.svg" alt="" className="size-12 rounded-lg object-cover" />
      <p className="mt-3.5 text-[15px] font-medium tracking-tight">{award.title}</p>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{award.highlights[0]}</p>
      <p className="text-muted-foreground mt-auto pt-3 text-xs">
        {award.org} · {award.dateLabel}
      </p>
    </li>
  );
}

export function AchievementsPreview({ items }: { items: Honor[] }) {
  // awards with a photo line the shelf; the rest wait under load more
  const visible = items.filter((item) => item.image);
  const hidden = items.filter((item) => !item.image);
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="achievements"
      data-nerd="achievements: photoed wins fill their cards, the rest hide under load more"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        achievements
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">the shelf so far</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        awards, honors, and a couple of quarters won
      </p>
      {visible.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {visible.map((award, index) => (
            <AwardCard key={award.id} award={award} amber={index === 0} />
          ))}
        </ul>
      )}
      {hidden.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-muted-foreground hover:text-foreground rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors"
          >
            {expanded ? 'show less' : `load more (${hidden.length})`}
          </button>
          {expanded ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {hidden.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </section>
  );
}
