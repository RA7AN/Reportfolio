'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// the wip curtain: a short fake boot log so every fresh visit knows the site is
// still under construction. a pre-paint script in app/layout.tsx pauses the
// landing's hero animations behind the curtain on every full page load; the gate
// itself covers client-side navigations to the landing page.
// the hold is generous on purpose: three lines need a couple of readable seconds
const BOOT_MS = 3600;
const FADE_MS = 350;
const BLOCKS = 24;
const TICK_MS = 80;

// a feedforward net drawn like the classic textbook diagram: full connectome,
// ring nodes brightening layer by layer (muted -> foreground -> amber), and one
// amber forward pass pulsing input -> output. the same geometry renders the og
// share card via scripts/generate-og.mjs — keep the two in sync.
const GLYPH_LAYERS = [
  { x: 12, ys: [19, 37, 55, 73], ring: 'var(--muted-foreground)' },
  { x: 54, ys: [10, 28, 46, 64, 82], ring: 'var(--foreground)' },
  { x: 96, ys: [28, 46, 64], ring: 'var(--foreground)' },
  { x: 138, ys: [37, 55], ring: 'var(--note)' },
];
const GLYPH_R = 8;
const PULSE: [number, number, number, number][] = [
  [12, 37, 54, 28],
  [54, 28, 96, 28],
  [96, 28, 138, 37],
];

function NeuralGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 92" className={className} aria-hidden>
      {/* the full connectome, dim so the rings read on top */}
      {GLYPH_LAYERS.slice(0, -1).map((layer, li) =>
        layer.ys.map((y1) =>
          GLYPH_LAYERS[li + 1].ys.map((y2) => (
            <line
              key={`${li}-${y1}-${y2}`}
              x1={layer.x}
              y1={y1}
              x2={GLYPH_LAYERS[li + 1].x}
              y2={y2}
              stroke="#2e2e2e"
              strokeWidth={1.5}
            />
          )),
        ),
      )}
      {/* one amber forward pass travelling left to right */}
      {PULSE.map(([x1, y1, x2, y2], index) => (
        <line
          key={`pulse-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--note)"
          strokeWidth={2.5}
          className="pixel-blink"
          style={{ animationDelay: `${index * 0.4}s` }}
        />
      ))}
      {/* rings filled with the curtain color, so synapses stop at the rim */}
      {GLYPH_LAYERS.map((layer) =>
        layer.ys.map((y) => (
          <circle
            key={`${layer.x}-${y}`}
            cx={layer.x}
            cy={y}
            r={GLYPH_R}
            fill="var(--background)"
            stroke={layer.ring}
            strokeWidth={2.5}
          />
        )),
      )}
    </svg>
  );
}

const BOOT_LINES = [
  '> booting portfolio v2.0-beta',
  '> notice: work in progress — rooms unfurnished',
  '> pixels may still be wet',
];

export function IntroGate() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);
  const leavingRef = useRef(false);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    // unpause the landing's rise-ins as the curtain starts lifting, so the hero
    // animates into view while the gate fades out on top of it
    document.documentElement.classList.remove('intro-pending');
    window.setTimeout(() => setGone(true), FADE_MS);
  }, []);

  useLayoutEffect(() => {
    // the pre-paint script in layout.tsx already set intro-pending on full loads;
    // adding it here (before paint) covers client-side navigations to the landing
    // page too, so the hero never animates behind the curtain. the cleanup lifts
    // the pause if the visitor navigates away mid-boot.
    const root = document.documentElement;
    root.classList.add('intro-pending');
    const auto = window.setTimeout(dismiss, BOOT_MS);
    return () => {
      window.clearTimeout(auto);
      root.classList.remove('intro-pending');
    };
  }, [dismiss]);

  useEffect(() => {
    if (leaving) return;
    const id = window.setInterval(() => {
      setPct((value) => Math.min(value + Math.ceil(100 / (BOOT_MS / TICK_MS)), 100));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [leaving]);

  if (gone) return null;

  return (
    <>
      {/* without JS nothing ever dismisses the curtain, so noscript pulls it down */}
      <noscript>
        <style>{'.intro-gate{display:none}'}</style>
      </noscript>
      <button
        type="button"
        onClick={dismiss}
        className={cn(
          'intro-gate bg-background fixed inset-0 z-[70] flex cursor-pointer flex-col items-center justify-center gap-7 px-6',
          leaving && 'pointer-events-none opacity-0',
        )}
      >
        <NeuralGlyph className="w-56" />

        <div className="font-mono text-xs leading-6">
          {BOOT_LINES.map((line, index) => (
            <p
              key={line}
              className="intro-line text-muted-foreground"
              style={{ animationDelay: `${0.1 + index * 0.5}s` }}
            >
              {line}
            </p>
          ))}
        </div>

        <span aria-hidden className="flex gap-[3px]">
          {Array.from({ length: BLOCKS }, (_, index) => (
            <span
              key={index}
              className={cn(
                'size-[7px]',
                (index / BLOCKS) * 100 < pct ? 'bg-note' : 'bg-[#2a2a2a]',
              )}
            />
          ))}
        </span>

        <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
          {pct}% · tap anywhere to skip <span className="blink">▌</span>
        </p>
      </button>
    </>
  );
}
