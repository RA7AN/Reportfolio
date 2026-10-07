import { getHonors } from '@/lib/content';
import { cn } from '@/lib/utils';

export function AchievementsPreview() {
  const items = getHonors();
  if (items.length === 0) return null;

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="achievements"
      data-nerd="achievements: real cms data, amber tile marks the freshest win"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        achievements
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">the shelf so far</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        awards, honors, and a couple of quarters won
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {items.map((award, index) => (
          <li
            key={award.id}
            className={cn(
              'flex h-full flex-col rounded-2xl p-4 transition-colors duration-200',
              index === 0
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
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {award.highlights[0]}
            </p>
            <p className="text-muted-foreground mt-auto pt-3 text-xs">
              {award.org} · {award.dateLabel}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
