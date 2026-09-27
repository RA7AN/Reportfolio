'use client';

import { useEffect, useRef } from 'react';

type CSSVars = React.CSSProperties & {
  '--orbit-x'?: string;
  '--orbit-y'?: string;
  '--orbit-z'?: string;
  '--orbit-scale'?: string;
  '--orbit-opacity'?: string;
};

export function HeroOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollProgress = 0;

    const render = () => {
      const { x, y } = pointerRef.current;
      const eased = reduce ? 0 : 1;
      stage.style.setProperty('--orbit-x', `${x * eased}deg`);
      stage.style.setProperty('--orbit-y', `${y * eased}deg`);
      stage.style.setProperty('--orbit-z', `${scrollProgress * 230}px`);
      stage.style.setProperty('--orbit-scale', `${1 - scrollProgress * 0.2}`);
      stage.style.setProperty('--orbit-opacity', `${Math.max(0.12, 1 - scrollProgress * 1.15)}`);
      frameRef.current = null;
    };

    const requestRender = () => {
      if (frameRef.current == null) frameRef.current = window.requestAnimationFrame(render);
    };

    const onScroll = () => {
      const distance = Math.max(window.innerHeight * 0.82, 1);
      scrollProgress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      requestRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      pointerRef.current = { x: x * 7, y: y * -7 };
      requestRender();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
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
        <div className="hero-orbit__glow" />
        <div className="hero-orbit__ring hero-orbit__ring--one" />
        <div className="hero-orbit__ring hero-orbit__ring--two" />
        <div className="hero-orbit__ring hero-orbit__ring--three" />
        <div className="hero-orbit__wire hero-orbit__wire--one" />
        <div className="hero-orbit__wire hero-orbit__wire--two" />
        <div className="hero-orbit__core">
          <div className="hero-orbit__core-face hero-orbit__core-face--top" />
          <div className="hero-orbit__core-face hero-orbit__core-face--front" />
          <div className="hero-orbit__core-face hero-orbit__core-face--side" />
          <span>∞</span>
        </div>
        <div className="hero-orbit__dot hero-orbit__dot--one" />
        <div className="hero-orbit__dot hero-orbit__dot--two" />
        <div className="hero-orbit__dot hero-orbit__dot--three" />
      </div>
      <div className="hero-orbit__note">
        ideas in motion <span>↗</span>
      </div>
    </div>
  );
}
