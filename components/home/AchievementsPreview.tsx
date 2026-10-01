import { cn } from '@/lib/utils';

// placeholder rows — swap for getHonors() once the section design settles
const awards = [
  {
    title: 'Deccan Dynamite — Q3 2025',
    org: 'Deccan AI',
    dateLabel: 'May 2025',
    note: 'org-wide recognition for research contributions and client feedback',
    // the freshest win borrows the timeline's amber treatment
    featured: true,
  },
  {
    title: 'Toastmaster of the Quarter',
    org: 'Toastmasters · CBIT',
    dateLabel: 'Q1 2024',
    note: 'best speaker run of the quarter',
    featured: false,
  },
  {
    title: 'First Prize — Best Creative Article',
    org: 'International Indian School',
    dateLabel: '2023',
    note: 'creative writing contest',
    featured: false,
  },
];

export function AchievementsPreview() {
  return (
    <section
      className="pt-20 sm:pt-24"
      id="achievements"
      data-nerd="achievements: mock rows, amber tile marks the freshest win"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        achievements
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">the shelf so far</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        awards, honors, and a couple of quarters won
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {awards.map((award) => (
          <li
            key={award.title}
            className={cn(
              'flex h-full flex-col rounded-2xl p-4 transition-colors duration-200',
              award.featured
                ? 'bg-[#3a3118] shadow-[inset_0_0_0_1px_rgba(232,185,35,0.28)]'
                : 'border-border hover:bg-muted/60 border hover:border-[#5a5a5a]',
            )}
          >
            {/* dashed stand-in; becomes the award photo when wired to content */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/achievements/placeholder.svg" alt="" className="size-12 rounded-lg" />
            <p className="mt-3.5 text-[15px] font-medium tracking-tight">{award.title}</p>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{award.note}</p>
            <p className="text-muted-foreground mt-auto pt-3 text-xs">
              {award.org} · {award.dateLabel}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
