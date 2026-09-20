type ProjectVideoProps = {
  src?: string;
  caption?: string;
  poster?: string;
};

export function ProjectVideo({ src, caption, poster }: ProjectVideoProps) {
  if (!src) return null;

  return (
    <figure className="border-border/70 bg-background/50 my-8 overflow-hidden rounded-2xl border shadow-[var(--shadow-xs)]">
      <video className="w-full" controls poster={poster || undefined} src={src} />
      {caption ? (
        <figcaption className="text-muted-foreground px-4 py-3 text-sm">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
