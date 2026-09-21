export function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <p className="text-muted-foreground mb-6 font-mono text-[11px] tracking-[0.22em] uppercase">
      {index} <span className="text-border mx-2">/</span> {title}
    </p>
  );
}
