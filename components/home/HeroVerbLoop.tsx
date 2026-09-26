'use client';

import { HERO_VERBS } from '@/components/home/hero-verbs';
import { cn } from '@/lib/utils';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const HOLD_MS = 5000;
const SWAP_MS = 300;

export function HeroVerbLoop() {
  const indexRef = useRef(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);
  const [outgoingReady, setOutgoingReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const [width, setWidth] = useState<number>();

  const swapping = outgoing != null && incoming != null;
  const measureIndex = swapping ? incoming : index;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = Math.floor(Math.random() * HERO_VERBS.length);
    indexRef.current = start;
    setIndex(start);
    setReduce(media.matches);
    setReady(true);
    const onChange = () => setReduce(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    setWidth(Math.ceil(node.getBoundingClientRect().width));
  }, [measureIndex, ready]);

  useEffect(() => {
    if (!ready) return;

    const tick = () => {
      const current = indexRef.current;
      const next = (current + 1) % HERO_VERBS.length;
      if (reduce) {
        indexRef.current = next;
        setIndex(next);
        return;
      }
      setOutgoing(current);
      setIncoming(next);
      setIncomingReady(false);
      setOutgoingReady(false);
      window.setTimeout(() => {
        indexRef.current = next;
        setIndex(next);
        setOutgoing(null);
        setIncoming(null);
        setIncomingReady(false);
      }, SWAP_MS);
    };

    const id = window.setInterval(tick, HOLD_MS);
    return () => window.clearInterval(id);
  }, [ready, reduce]);

  useEffect(() => {
    if (incoming == null && outgoing == null) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIncomingReady(true);
        setOutgoingReady(true);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [incoming, outgoing]);

  return (
    <span
      className="relative inline-block align-baseline"
      aria-hidden="true"
      style={{
        width,
        transition: reduce ? undefined : `width ${SWAP_MS}ms ease-out`,
      }}
    >
      <span ref={measureRef} className="invisible whitespace-nowrap">
        {HERO_VERBS[measureIndex]}
      </span>
      <span className="absolute inset-0 overflow-hidden whitespace-nowrap">
        {swapping ? (
          <>
            <span
              className={cn(
                'absolute inset-0 transition-[transform,opacity,filter] duration-300 ease-out',
                outgoingReady
                  ? '-translate-y-[70%] opacity-0 blur-[2px]'
                  : 'blur-0 translate-y-0 opacity-100',
              )}
            >
              {HERO_VERBS[outgoing]}
            </span>
            <span
              className={cn(
                'absolute inset-0 transition-[transform,opacity,filter] duration-300 ease-out',
                incomingReady
                  ? 'blur-0 translate-y-0 opacity-100'
                  : 'translate-y-[70%] opacity-0 blur-[2px]',
              )}
            >
              {HERO_VERBS[incoming]}
            </span>
          </>
        ) : (
          <span className="absolute inset-0">{HERO_VERBS[index]}</span>
        )}
      </span>
    </span>
  );
}
