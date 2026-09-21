'use client';

import { useEffect, useState } from 'react';

export function LocalClock({ city, timeZone }: { city: string; timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <p className="font-mono text-[11px] tracking-[0.16em] text-[#63d9c4] uppercase">
      <span className="text-muted-foreground">{city}</span>
      <span className="mx-2 text-[#20222c]">/</span>
      <span>{time ?? '—'}</span>
      <span className="text-muted-foreground ml-2">AST</span>
    </p>
  );
}
