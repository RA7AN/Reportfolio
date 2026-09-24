import type { Skill } from '@/lib/content/schemas';

function initials(label: string) {
  const parts = label
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Chip({ label }: { label: string }) {
  return (
    <li
      className="border-border bg-card hover:border-note/60 flex h-12 w-12 items-center justify-center rounded-xl border text-[10px] font-medium tracking-tight"
      title={label}
    >
      {initials(label)}
    </li>
  );
}

export function StackGrid({ skills }: { skills: Skill[] }) {
  const build = skills.find((item) => /program|cloud|devops|web/i.test(item.category));
  const research = skills.find((item) => /machine|ai|research/i.test(item.category));
  const left = (build?.items ?? skills[0]?.items ?? []).slice(0, 9);
  const right = (research?.items ?? skills[1]?.items ?? []).slice(0, 9);

  return (
    <section className="pt-28">
      <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
        stack
      </p>
      <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">
        what I make things with
      </h2>
      <p className="text-muted-foreground mt-2 text-[13px]">hover for names.</p>
      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.16em] uppercase">
            {build?.category ?? 'tools'}
          </p>
          <ul className="flex flex-wrap gap-2">
            {left.map((item) => (
              <Chip key={item} label={item} />
            ))}
            <li className="text-muted-foreground flex h-12 items-center px-2 text-[12px]">
              + more
            </li>
          </ul>
        </div>
        <div>
          <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.16em] uppercase">
            {research?.category ?? 'research'}
          </p>
          <ul className="flex flex-wrap gap-2">
            {right.map((item) => (
              <Chip key={item} label={item} />
            ))}
            <li className="text-muted-foreground flex h-12 items-center px-2 text-[12px]">
              + more
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
