'use client';

import { useSiteUi } from '@/components/layout/SiteUi';
import { useEffect, useLayoutEffect, useState } from 'react';

type Box = {
  top: number;
  left: number;
  width: number;
  height: number;
  display: string;
  fontSize: string;
  lineHeight: string;
  tracking: string;
  token: string;
};

function tokenForColor(color: string) {
  if (color.includes('237, 235, 230') || color.includes('237,235,230')) return 'text-foreground';
  if (color.includes('22, 21, 19')) return 'text-foreground';
  return color;
}

function displayLabel(tag: string, display: string) {
  if (tag === 'H1') return 'Display Block';
  if (tag === 'H2' || tag === 'H3') return 'Heading Block';
  return `${tag} ${display}`;
}

function NerdInspect() {
  const { nerd } = useSiteUi();
  const [boxes, setBoxes] = useState<Box[]>([]);

  useLayoutEffect(() => {
    if (!nerd) {
      setBoxes([]);
      return;
    }

    const measure = () => {
      const nodes = document.querySelectorAll('main h1, main h2');
      const next: Box[] = [];
      nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()].filter(
          (item) => item.width > 2 && item.height > 2,
        );
        const source = rects[0] ?? node.getBoundingClientRect();
        let left = source.left;
        let top = source.top;
        let right = source.right;
        let bottom = source.bottom;
        for (const item of rects) {
          left = Math.min(left, item.left);
          top = Math.min(top, item.top);
          right = Math.max(right, item.right);
          bottom = Math.max(bottom, item.bottom);
        }
        const rect = { left, top, width: right - left, height: bottom - top, bottom };
        if (rect.width < 8 || rect.height < 8) return;
        if (rect.bottom < 56) return;
        const cs = getComputedStyle(node);
        const fontPx = parseFloat(cs.fontSize);
        const lhPx = parseFloat(cs.lineHeight);
        const trackingPx = parseFloat(cs.letterSpacing);
        next.push({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          display: displayLabel(node.tagName, cs.display),
          fontSize: `${Number((fontPx / 16).toFixed(2))}rem`,
          lineHeight: Number.isFinite(lhPx / fontPx) ? (lhPx / fontPx).toFixed(2) : cs.lineHeight,
          tracking: Number.isFinite(trackingPx)
            ? `${Number((trackingPx / fontPx).toFixed(2))}em`
            : cs.letterSpacing,
          token: tokenForColor(cs.color),
        });
      });
      setBoxes(next);
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    const id = window.setInterval(measure, 400);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      window.clearInterval(id);
    };
  }, [nerd]);

  if (!nerd) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden>
      {boxes.map((box, index) => (
        <div
          key={`${box.left}-${box.top}-${index}`}
          className="absolute"
          style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
        >
          <div className="border-note absolute inset-0 border" />
          <span className="bg-note absolute -top-0.5 -left-0.5 size-1.5" />
          <span className="bg-note absolute -top-0.5 -right-0.5 size-1.5" />
          <span className="bg-note absolute -bottom-0.5 -left-0.5 size-1.5" />
          <span className="bg-note absolute -right-0.5 -bottom-0.5 size-1.5" />
          <div className="absolute -top-8 left-0 flex w-max max-w-[min(90vw,42rem)] gap-1.5 overflow-hidden">
            <Chip>{box.display}</Chip>
            <span className="flex flex-wrap gap-1.5">
              <Chip>Aa {box.fontSize}</Chip>
              <Chip>↕ {box.lineHeight}</Chip>
              <Chip>↔ {box.tracking}</Chip>
              <Chip>A {box.token}</Chip>
              <Chip>W {Math.round(box.width)}px</Chip>
              <Chip>H {Math.round(box.height)}px</Chip>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="text-note flex items-center gap-1 rounded-[4px] bg-[color-mix(in_srgb,var(--note)_12%,transparent)] px-1.5 py-0.5 font-mono text-[10px] leading-4 whitespace-nowrap">
      {children}
    </span>
  );
}

function NerdHud() {
  const { nerd, light } = useSiteUi();
  const [fps, setFps] = useState('--');
  const [vp, setVp] = useState('--');
  const [scroll, setScroll] = useState('0%');
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    if (!nerd) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      frames += 1;
      if (now - last >= 500) {
        setFps(String(Math.round((frames * 1000) / (now - last))));
        frames = 0;
        last = now;
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    const started = performance.now();
    const tick = window.setInterval(() => {
      const sec = Math.floor((performance.now() - started) / 1000);
      const m = Math.floor(sec / 60);
      const s = String(sec % 60).padStart(2, '0');
      setElapsed(`${m}:${s}`);
    }, 1000);

    const onSize = () => setVp(`${window.innerWidth}x${window.innerHeight}`);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : Math.round((window.scrollY / max) * 100);
      setScroll(`${pct}%`);
    };
    onSize();
    onScroll();
    window.addEventListener('resize', onSize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(tick);
      window.removeEventListener('resize', onSize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [nerd]);

  if (!nerd) return null;

  return (
    <div className="border-border bg-background/90 text-muted-foreground pointer-events-none fixed right-4 bottom-4 left-16 z-[70] flex flex-wrap gap-x-3 gap-y-1 rounded-lg border px-3 py-2 font-mono text-[10px] shadow-lg backdrop-blur sm:left-6 sm:max-w-xl">
      <span>
        fps <span className="text-foreground">{fps}</span>
      </span>
      <span>
        vp <span className="text-foreground">{vp}</span>
      </span>
      <span>
        scroll <span className="text-foreground">{scroll}</span>
      </span>
      <span>
        time <span className="text-foreground">{elapsed}</span>
      </span>
      <span>
        theme <span className="text-foreground">{light ? 'light' : 'dark'}</span>
      </span>
      <span>
        build <span className="text-foreground">v3-dev</span>
      </span>
    </div>
  );
}

export function NerdOverlay() {
  return (
    <>
      <NerdInspect />
      <NerdHud />
    </>
  );
}
