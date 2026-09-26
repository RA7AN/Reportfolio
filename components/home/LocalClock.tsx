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
          hour12: true,
        })
          .format(new Date())
          .toLowerCase(),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <p className="text-muted-foreground text-[13px]">
      {city.toLowerCase()}
      <span className="mx-1.5">·</span>
      <span>{time ?? '—'}</span>
      <span className="ml-1">ast</span>
    </p>
  );
}
