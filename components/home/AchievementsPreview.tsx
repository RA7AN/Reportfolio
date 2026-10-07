'use client';

import { useState } from 'react';
import type { Honor } from '@/lib/content/schemas';
import { cn } from '@/lib/utils';

function AwardCard({ award, amber = false }: { award: Honor; amber?: boolean }) {
  return (
    <li
      className={cn(
        'flex h-full flex-col rounded-2xl p-4 transition-colors duration-200',
        amber
          ? // the freshest win borrows the timeline's amber treatment
            'bg-[#3a3118] shadow-[inset_0_0_0_1px_rgba(232,185,35,0.28)]'
          : 'border-border hover:bg-muted/60 border hover:border-[#5a5a5a]',
      )}
    >
      {/* the award photo from the cms; the dashed tile stands in until one is set */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={award.image ?? '/achievements/placeholder.svg'}
        alt=""
        className="size-12 rounded-lg object-cover"
      />
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
      data-nerd="achievements: photoed wins line the shelf, the rest hide under load more"
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
        <div className="mt-4">
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
