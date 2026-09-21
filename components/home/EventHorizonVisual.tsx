'use client';

import { useEffect, useRef } from 'react';

export function EventHorizonVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
      node.style.setProperty('--hx', `${x}px`);
      node.style.setProperty('--hy', `${y}px`);
    };

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-14 h-44 w-full max-w-md sm:h-56"
      aria-hidden
      style={{ ['--hx' as string]: '0px', ['--hy' as string]: '0px' }}
    >
      <svg viewBox="0 0 400 220" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b7aeff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#8b7cff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#050507" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="200"
          cy="110"
          rx="150"
          ry="42"
          fill="none"
          stroke="#20222c"
          strokeWidth="1"
          className="origin-center motion-safe:animate-[spin_48s_linear_infinite]"
        />
        <ellipse
          cx="200"
          cy="110"
          rx="110"
          ry="28"
          fill="none"
          stroke="#8b7cff"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="110"
          r="8"
          fill="url(#core)"
          style={{ transform: 'translate(var(--hx), var(--hy))' }}
        />
        <circle cx="80" cy="70" r="1.2" fill="#f2f2f4" opacity="0.5" />
        <circle cx="310" cy="150" r="1.2" fill="#f2f2f4" opacity="0.4" />
        <circle cx="330" cy="60" r="1" fill="#b7aeff" opacity="0.7" />
        <path
          d="M120 110 Q200 40 280 110"
          fill="none"
          stroke="#8b7cff"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <path
          d="M120 110 Q200 180 280 110"
          fill="none"
          stroke="#8b7cff"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
