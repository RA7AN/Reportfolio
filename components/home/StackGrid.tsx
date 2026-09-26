import { MARKS, type StackMark } from '@/components/home/stack-marks-data';
import { ML_MARKS } from '@/components/home/stack-ml-marks';
import { StackMarksPlain } from '@/components/home/StackMarks';
import type { Skill } from '@/lib/content/schemas';

function aliases(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchMark(name: string): StackMark | null {
  const key = aliases(name);
  return (
    MARKS.find((item) => {
      const label = aliases(item.label);
      if (key === label) return true;
      const keyWords = key.split(' ');
      const labelWords = label.split(' ');
      return labelWords.length > 1 && labelWords.every((word) => keyWords.includes(word));
    }) ?? null
  );
}

function uniqueMarks(names: string[], extra: readonly StackMark[] = []) {
  const seen = new Set<string>();
  const out: StackMark[] = [];
  for (const name of names) {
    const mark = matchMark(name);
    if (mark && !seen.has(mark.label)) {
      seen.add(mark.label);
      out.push(mark);
    }
  }
  for (const mark of extra) {
    if (!seen.has(mark.label)) {
      seen.add(mark.label);
      out.push(mark);
    }
  }
  return out;
}

export function StackGrid({ skills }: { skills: Skill[] }) {
  const research = skills.find((item) => /machine|ai|research/i.test(item.category));
  const leftNames = skills
    .filter((item) => /program|cloud|devops|database|web/i.test(item.category))
    .flatMap((item) => item.items);
  const rightNames = skills
    .filter((item) => /machine|ai|research|other/i.test(item.category))
    .flatMap((item) => item.items);

  const left = uniqueMarks(
    leftNames,
    MARKS.filter((item) => /cursor|codex|git|google|postgres|type|next/i.test(item.label)),
  );
  const right = uniqueMarks(rightNames, [
    ...MARKS.filter((item) => /python|lang/i.test(item.label)),
    ...ML_MARKS,
  ]);

  return (
    <section
      className="pt-20 sm:pt-24"
      id="stack"
      data-nerd="stack: circular simple-icons, shared hover tooltip"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        stack
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">what I make things with</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-6 sm:text-base">hover for names.</p>
      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.16em] uppercase">
            Programming
          </p>
          <StackMarksPlain items={left} />
        </div>
        <div>
          <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.16em] uppercase">
            {research?.category ?? 'research'}
          </p>
          <StackMarksPlain items={right} />
        </div>
      </div>
    </section>
  );
}
