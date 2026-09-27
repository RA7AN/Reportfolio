'use client';

import { useEffect, useRef } from 'react';

type CSSVars = React.CSSProperties & {
  '--orbit-x'?: string;
  '--orbit-y'?: string;
  '--orbit-z'?: string;
  '--orbit-scale'?: string;
  '--orbit-opacity'?: string;
};

const nodes = [
  [300, 64],
  [410, 94],
  [486, 176],
  [520, 300],
  [470, 438],
  [362, 522],
  [238, 522],
  [130, 438],
  [80, 300],
  [112, 174],
  [190, 94],
  [300, 132],
  [402, 164],
  [456, 252],
  [448, 354],
  [374, 432],
  [266, 450],
  [176, 396],
  [144, 296],
  [168, 206],
  [222, 160],
  [300, 228],
  [370, 250],
  [392, 320],
  [352, 382],
  [268, 384],
  [208, 324],
  [228, 258],
] as const;

const outerPaths = [
  'M300 64 C170 92 80 190 80 300 C80 430 188 522 300 536 C428 522 520 424 520 300 C520 180 420 82 300 64Z',
  'M190 94 C290 190 402 196 470 438',
  'M410 94 C314 186 202 210 130 438',
  'M112 174 C236 262 390 280 486 176',
  'M80 300 C212 252 370 344 520 300',
  'M130 438 C250 362 374 354 470 438',
  'M238 522 C240 390 336 236 362 78',
  'M362 522 C360 392 268 238 238 78',
];
const innerPaths = [
  'M300 132 C210 160 144 232 144 296 C144 386 218 450 300 450 C388 444 456 374 456 296 C456 218 384 150 300 132Z',
  'M222 160 C278 242 360 348 374 432',
  'M402 164 C328 250 250 346 176 396',
  'M144 296 C232 264 366 294 448 354',
  'M168 206 C250 312 350 316 456 252',
  'M208 324 C280 252 344 240 392 320',
];

export function HeroOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let progress = 0;

    const render = () => {
      const { x, y } = pointerRef.current;
      stage.style.setProperty('--orbit-x', `${reduce ? 0 : x}deg`);
      stage.style.setProperty('--orbit-y', `${reduce ? 0 : y}deg`);
      stage.style.setProperty('--orbit-z', `${progress * 230}px`);
      stage.style.setProperty('--orbit-scale', `${1 - progress * 0.2}`);
      stage.style.setProperty('--orbit-opacity', `${Math.max(0.12, 1 - progress * 1.15)}`);
      frameRef.current = null;
    };
    const requestRender = () => {
      if (frameRef.current == null) frameRef.current = window.requestAnimationFrame(render);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 10,
        y: (event.clientY / window.innerHeight - 0.5) * -10,
      };
      requestRender();
    };
    const onScroll = () => {
      progress = Math.min(Math.max(window.scrollY / Math.max(window.innerHeight * 0.82, 1), 0), 1);
      requestRender();
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="hero-orbit" aria-hidden="true">
      <div className="hero-orbit__caption">
        <span className="hero-orbit__live" />
        <span>signal / 01—05</span>
      </div>
      <div
        ref={stageRef}
        className="hero-orbit__stage"
        style={{ '--orbit-scale': '1', '--orbit-opacity': '1' } as CSSVars}
      >
        <svg
          className="hero-orbit__svg"
          viewBox="0 0 600 600"
          role="img"
          aria-label="A slow moving wireframe network monolith"
        >
          <defs>
            <radialGradient id="monolith-glow">
              <stop offset="0" stopColor="#e8b923" stopOpacity=".14" />
              <stop offset=".65" stopColor="#e8b923" stopOpacity=".035" />
              <stop offset="1" stopColor="#e8b923" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="244" fill="url(#monolith-glow)" />
          <g className="hero-orbit__outer" fill="none" stroke="currentColor">
            <ellipse cx="300" cy="300" rx="238" ry="238" />
            <ellipse cx="300" cy="300" rx="238" ry="150" transform="rotate(32 300 300)" />
            <ellipse cx="300" cy="300" rx="238" ry="92" transform="rotate(-42 300 300)" />
            {outerPaths.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>
          <g className="hero-orbit__inner" fill="none" stroke="currentColor">
            <ellipse cx="300" cy="300" rx="158" ry="158" />
            <ellipse cx="300" cy="300" rx="158" ry="86" transform="rotate(48 300 300)" />
            {innerPaths.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>
          <g className="hero-orbit__nodes" fill="currentColor">
            {nodes.map(([cx, cy], index) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 5 === 0 ? 3 : 1.8} />
            ))}
          </g>
          <circle className="hero-orbit__core" cx="300" cy="300" r="28" />
          <circle className="hero-orbit__core-dot" cx="300" cy="300" r="4" />
        </svg>
      </div>
      <div className="hero-orbit__note">
        ideas in motion <span>↗</span>
      </div>
    </div>
  );
}
