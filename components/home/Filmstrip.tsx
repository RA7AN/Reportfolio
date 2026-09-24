const shots = [
  { label: 'jeddah, always', palette: ['#f2d39a', '#7aa8c4', '#1f3b4d'] },
  { label: 'hyderabad, 2023', palette: ['#8fbf7a', '#f0c14a', '#3d5a3a'] },
  { label: 'campus nights', palette: ['#2b2b40', '#f2e6c9', '#d9a441'] },
  { label: 'lab hours', palette: ['#1c1c1c', '#9ad1c4', '#edebe6'] },
  { label: 'placeholder one', palette: ['#c9e4ff', '#f7d9a4', '#5b7c99'] },
  { label: 'placeholder two', palette: ['#ffd6c9', '#8aa3d1', '#f7f1e6'] },
  { label: 'the desk', palette: ['#111', '#e8b923', '#444'] },
  { label: 'home', palette: ['#d9c4a0', '#6b8f71', '#f4f1ea'] },
];

export function Filmstrip() {
  return (
    <section className="pt-28">
      <div className="mx-auto max-w-[920px] px-5 sm:px-8">
        <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
          off screen
        </p>
        <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">
          I travel with a camera and too many opinions
        </h2>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="marquee-track flex w-max gap-4 px-5 pb-4 sm:px-8">
          {[...shots, ...shots].map((shot, index) => (
            <figure
              key={`${shot.label}-${index}`}
              className="w-36 shrink-0 rotate-[-2deg] bg-[#f4f1ea] p-2 shadow-lg even:rotate-[2deg]"
            >
              <div
                className="h-28 w-full"
                style={{
                  background: `linear-gradient(160deg, ${shot.palette[0]}, ${shot.palette[1]} 55%, ${shot.palette[2]})`,
                }}
              />
              <figcaption className="font-hand mt-2 text-center text-[13px] text-[#3a3a3a]">
                {shot.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mx-auto mt-2 max-w-[920px] px-5 text-[11px] sm:px-8">
        polaroid placeholders · swap in real photos later
      </p>
    </section>
  );
}
