import { cn } from '@/lib/utils';

export function EmptyBlock({ label }: { label: string }) {
  return (
    <div
      className={cn(
        'border-border/70 bg-card/60 text-muted-foreground rounded-2xl border p-6 text-sm shadow-[var(--shadow-xs)] backdrop-blur',
      )}
    >
      {label} — no entries yet.
    </div>
  );
}
