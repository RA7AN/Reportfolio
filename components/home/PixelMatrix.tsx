'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

// each cell renders as a 5x5 square inside a 6x6 box: 1:1 with CSS pixels,
// so the matrix reads as separated pixels, not a solid block
const BLOCK = 6;
const FILL = BLOCK - 1;

// baseline css px per cell; grows on very large viewports to cap the cell count
const PITCH = 6;
const MAX_CELLS = 90_000;
const FPS_MS = 1000 / 30;
// the whole field advances in discrete frames, game-boy style
const STEP_HZ = 10;

// slice morph speed — how fast clusters dissolve and reform
const MORPH = 0.22;
const STATIC_T = 21.3;

// 4x4 ordered dither — breaks shade bands into game-boy style checker patterns
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const DITHER = 0.55;

type RGB = [number, number, number];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function buildPerm() {
  const source = new Uint8Array(256);
  for (let i = 0; i < 256; i++) source[i] = i;
  let seed = 1337;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = source[i];
    source[i] = source[j];
    source[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = source[i & 255];
  return perm;
}

const PERM = buildPerm();

// so = integer noise slice; crossfading two slices morphs the field in place
function vnoise(x: number, y: number, so: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const Y = yi & 255;
  const o = ((xi & 255) + so) & 255;
  const o1 = (o + 1) & 255;
  const aa = PERM[PERM[o] + Y];
  const ab = PERM[PERM[o] + Y + 1];
  const ba = PERM[PERM[o1] + Y];
  const bb = PERM[PERM[o1] + Y + 1];
  const x1 = aa + (ba - aa) * u;
  const x2 = ab + (bb - ab) * u;
  return (x1 + (x2 - x1) * v) / 255;
}

function parseHex(value: string, fallback: RGB): RGB {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return fallback;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = Number.parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// quantized density -> packed RGBA pixel; neutral at low density, gold only at the hot peaks
function buildLut(neutral: RGB, gold: RGB, maxAlpha: number) {
  const lut = new Uint32Array(256);
  for (let q = 0; q < 256; q++) {
    const d = q / 255;
    const tint = smoothstep(0.68, 1, d);
    const r = Math.round(neutral[0] + (gold[0] - neutral[0]) * tint);
    const g = Math.round(neutral[1] + (gold[1] - neutral[1]) * tint);
    const b = Math.round(neutral[2] + (gold[2] - neutral[2]) * tint);
    const a = Math.round(255 * maxAlpha * smoothstep(0.42, 0.92, d));
    lut[q] = ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
  }
  return lut;
}

function buildThemeLut() {
  const light = document.documentElement.classList.contains('light');
  const cs = getComputedStyle(document.documentElement);
  const neutral = parseHex(
    cs.getPropertyValue('--foreground'),
    light ? [22, 21, 19] : [237, 235, 230],
  );
  const gold = parseHex(cs.getPropertyValue('--note'), light ? [184, 134, 11] : [232, 185, 35]);
  const maxAlpha = light ? 0.48 : 0.58;
  return { lut: buildLut(neutral, gold, maxAlpha), step: (maxAlpha * 255) / 3 };
}

export function PixelMatrix({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;
    let buf: Uint32Array | null = null;
    let pulse = new Float32Array(0);
    let palette = buildThemeLut();
    let lastStep = -1;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = media.matches;

    const paint = (t: number, force = false) => {
      if (!image || !buf) return;
      const step = Math.floor(t * STEP_HZ);
      if (!force && step === lastStep) return;
      lastStep = step;
      t = step / STEP_HZ;
      const W = canvas.width;
      const breathe = 0.86 + 0.14 * Math.sin(t * 0.45);
      // swaying threshold + traveling wave: clusters light up and out in sweeps
      const sway = 0.1 * Math.sin(t * 0.75) + 0.06 * Math.sin(t * 0.31 + 1.7);
      const tz = t * MORPH;
      const s0 = Math.floor(tz);
      const fzRaw = tz - s0;
      const fz = fzRaw * fzRaw * (3 - 2 * fzRaw);
      const so0 = (s0 * 61) & 255;
      const so1 = ((s0 + 1) * 61) & 255;
      let i = 0;
      for (let r = 0; r < rows; r++) {
        const fy = rows > 1 ? r / (rows - 1) : 0;
        // fade in at the very top edge, fade out before the bottom of the hero
        const fade = (1 - smoothstep(0.55, 1, fy)) * smoothstep(0, 0.04, fy);
        const n1y = r * 0.075 + t * 0.11;
        const n2y = r * 0.162 + t * 0.075 + 57.1;
        for (let c = 0; c < cols; c++, i++) {
          const n1x = c * 0.038 + t * 0.28;
          const n2x = c * 0.085 - t * 0.18 + 31.7;
          const na = vnoise(n1x, n1y, so0) * 0.66 + vnoise(n2x, n2y, (so0 + 97) & 255) * 0.34;
          const nb = vnoise(n1x, n1y, so1) * 0.66 + vnoise(n2x, n2y, (so1 + 97) & 255) * 0.34;
          const n = na + (nb - na) * fz;
          const wave = 0.055 * Math.sin(c * 0.045 + r * 0.08 - t * 0.9);
          const bayer = (BAYER[((r & 3) << 2) + (c & 3)] / 16 - 0.46875) * DITHER;
          const d = (n + sway + wave - 0.47) * 2.7 + bayer;
          let q = d * fade * breathe;
          if (q < 0) q = 0;
          else if (q > 1) q = 1;
          // per-cell clock: pixel pops between its shades with hard game-boy steps
          const j = i << 2;
          const period = pulse[j + 1];
          let ph = t / period + pulse[j];
          ph -= Math.floor(ph);
          const mul = ph < pulse[j + 2] ? 1 : 1 - pulse[j + 3];
          const u0 = palette.lut[(q * 255) | 0];
          let a2 = ((u0 >>> 24) * mul) | 0;
          a2 = (Math.round(a2 / palette.step) * palette.step) | 0;
          if (a2 > 255) a2 = 255;
          const u = (u0 & 0xffffff) | (a2 << 24);
          const o = r * BLOCK * W + c * BLOCK;
          for (let yy = 0; yy < FILL; yy++) {
            const oo = o + yy * W;
            for (let xx = 0; xx < FILL; xx++) buf[oo + xx] = u;
          }
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const resize = () => {
      const cssW = wrap.clientWidth;
      const cssH = wrap.clientHeight;
      if (!cssW || !cssH) return;
      let pitch = PITCH;
      cols = Math.max(1, Math.floor(cssW / pitch));
      rows = Math.max(1, Math.floor(cssH / pitch));
      while (cols * rows > MAX_CELLS && pitch < 64) {
        pitch *= 2;
        cols = Math.max(1, Math.floor(cssW / pitch));
        rows = Math.max(1, Math.floor(cssH / pitch));
      }
      canvas.width = cols * BLOCK;
      canvas.height = rows * BLOCK;
      image = ctx.createImageData(canvas.width, canvas.height);
      buf = new Uint32Array(image.data.buffer);
      // per-cell pulse clock: phase, period (s), on-hold end, dip depth (negative = brighten)
      pulse = new Float32Array(cols * rows * 4);
      let p = 7;
      const rand = () => {
        p = (p * 1103515245 + 12345) & 0x7fffffff;
        return p / 0x7fffffff;
      };
      for (let i = 0; i < cols * rows; i++) {
        const j = i << 2;
        pulse[j] = rand();
        pulse[j + 1] = 0.7 + rand() * 1.7;
        pulse[j + 2] = 0.78 + rand() * 0.16;
        pulse[j + 3] = rand() < 0.15 ? -(0.2 + rand() * 0.3) : 0.55 + rand() * 0.45;
      }
    };

    let start = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      raf = window.requestAnimationFrame(tick);
      if (now - last < FPS_MS) return;
      last = now;
      paint((now - start) / 1000);
    };

    const play = () => {
      if (running || reduce) return;
      running = true;
      start = performance.now();
      last = 0;
      raf = window.requestAnimationFrame(tick);
    };

    const pause = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const refresh = () => {
      lastStep = -1;
      if (reduce || !running) paint(STATIC_T, true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) {
          if (reduce) paint(STATIC_T);
          else play();
        } else {
          pause();
        }
      },
      { rootMargin: '120px' },
    );
    observer.observe(wrap);

    const onReduceChange = () => {
      reduce = media.matches;
      if (reduce) {
        pause();
        paint(STATIC_T);
      } else if (visible) {
        play();
      }
    };
    media.addEventListener('change', onReduceChange);

    const themeObserver = new MutationObserver(() => {
      palette = buildThemeLut();
      refresh();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const ro = new ResizeObserver(() => {
      resize();
      refresh();
    });
    ro.observe(wrap);

    resize();
    if (reduce) paint(STATIC_T, true);
    else play();

    return () => {
      pause();
      observer.disconnect();
      media.removeEventListener('change', onReduceChange);
      themeObserver.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn('pointer-events-none absolute overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        data-nerd="hero bg: pixel matrix, stepped frames + bayer dither"
        className="h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
