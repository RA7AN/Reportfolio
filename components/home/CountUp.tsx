'use client';

import { useEffect, useState } from 'react';

type CountUpProps = {
  value: number;
  delay?: number;
  duration?: number;
};

// counts from 1 up to the target; ssr keeps the final value so no-js still reads right
export function CountUp({ value, delay = 0, duration = 900 }: CountUpProps) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // nonanimated paths sync too, so a changed value never leaves the old count up;
    // deferred a frame because effects must not set state synchronously
    if (value <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => setDisplay(value));
      return () => window.cancelAnimationFrame(frame);
    }

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(1 + (value - 1) * eased));
      if (p < 1) frame = window.requestAnimationFrame(step);
    };

    const timer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [value, delay, duration]);

  return <>{display}</>;
}
