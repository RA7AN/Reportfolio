const reels = [
  { title: 'placeholder reel one', caption: 'swap for a real clip' },
  { title: 'placeholder reel two', caption: 'or drop this section' },
  { title: 'placeholder reel three', caption: 'watch later' },
];

export function ReelsPlaceholder() {
  return (
    <section className="pt-28">
      <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
        travel log
      </p>
      <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">moving pictures</h2>
      <p className="text-muted-foreground mt-2 text-[13px]">
        reel placeholders. no instagram embeds yet.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {reels.map((reel, index) => (
          <article
            key={reel.title}
            className="border-border relative overflow-hidden rounded-2xl border"
          >
            <div
              className="h-48"
              style={{
                background: `linear-gradient(180deg, hsl(${200 + index * 40} 30% 18%), #0a0a0a)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-hand text-[15px] text-[#f4f1ea]">{reel.title}</p>
              <p className="text-muted-foreground text-[11px]">{reel.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
