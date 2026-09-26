export function Ventures() {
  const items = [
    {
      name: 'Revent',
      when: '2026',
      blurb: 'placeholder · what I am building in production right now.',
      live: true,
      width: '78%',
    },
    {
      name: 'Anthar Study',
      when: '2025 to now',
      blurb: 'evaluating AI coding agents on real GitHub PRs, beyond benchmarks.',
      live: true,
      width: '62%',
    },
    {
      name: 'SafeSight',
      when: '2026',
      blurb: 'computer-vision and RAG assistant for workplace safety officers.',
      live: true,
      width: '40%',
    },
    {
      name: 'KYC automation',
      when: '2026',
      blurb: 'OCR + NER pipeline for document extraction and risk scoring.',
      live: true,
      width: '36%',
    },
    {
      name: 'This slot',
      when: 'tbd',
      blurb: 'placeholder venture row. discard or replace later.',
      live: false,
      width: '18%',
    },
  ];

  return (
    <section className="pt-28">
      <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
        ventures
      </p>
      <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">things I started</h2>
      <p className="text-muted-foreground mt-2 text-[13px]">
        the bars are placeholders. amber means still alive.
      </p>
      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="border-border grid items-center gap-3 rounded-2xl border px-4 py-3 sm:grid-cols-[10rem_1fr_8rem]"
          >
            <div>
              <p className="text-[14px] font-medium">{item.name}</p>
              <p className="text-muted-foreground text-[11px]">{item.when}</p>
            </div>
            <p className="text-[13px] text-[#c4c2ba]">{item.blurb}</p>
            <div className="h-[3px] overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className={item.live ? 'bg-note h-full' : 'h-full bg-[#5a5a5a]'}
                style={{ width: item.width }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
