'use client';

import { HERO_MUSES } from '@/components/home/hero-muses';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';

const HOLD_MS = 5000;
const SWAP_MS = 300;

// the longest word plus the trailing dots reserves the slot, so the sentence never reflows
const LONGEST = HERO_MUSES.reduce((longest, word) =>
  word.length > longest.length ? word : longest,
);

// hand-tuned pseudo-random clocks: the nine pixels flicker one at a time
const PIXEL_DURATIONS = [1.05, 0.85, 1.45, 0.95, 1.25, 0.75, 1.6, 1.15, 0.9];
const PIXEL_DELAYS = [-0.15, -0.8, -0.45, -1.25, -0.6, -1.05, -0.3, -1.4, -0.95];
const PIXEL_PEAKS = [0.95, 0.6, 0.8, 0.5, 1, 0.7, 0.9, 0.55, 0.75];

function subscribeReduce(onStoreChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function getReduce() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function PixelGrid() {
  return (
    <span className="mr-[7px] inline-grid grid-cols-3 gap-[1.5px] align-middle">
      {PIXEL_PEAKS.map((peak, i) => (
        <span
          key={i}
          className="pixel-blink bg-note size-[3px]"
          style={
            {
              animationDuration: `${PIXEL_DURATIONS[i]}s`,
              animationDelay: `${PIXEL_DELAYS[i]}s`,
              opacity: peak,
              '--blink-max': peak,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function HeroMuseLoop() {
  const indexRef = useRef(0);
  const swapTimer = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);
  const [outgoingReady, setOutgoingReady] = useState(false);
  const [ready, setReady] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduce, getReduce, () => false);

  const swapping = outgoing != null && incoming != null;

  useEffect(() => {
    const start = Math.floor(Math.random() * HERO_MUSES.length);
    indexRef.current = start;
    const frame = window.requestAnimationFrame(() => {
      setIndex(start);
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const tick = () => {
      const current = indexRef.current;
      const next = (current + 1) % HERO_MUSES.length;
      if (reduce) {
        indexRef.current = next;
        setIndex(next);
        return;
      }
      setOutgoing(current);
      setIncoming(next);
      setIncomingReady(false);
      setOutgoingReady(false);
      swapTimer.current = window.setTimeout(() => {
        swapTimer.current = null;
        indexRef.current = next;
        setIndex(next);
        setOutgoing(null);
        setIncoming(null);
        setIncomingReady(false);
      }, SWAP_MS);
    };

    const id = window.setInterval(tick, HOLD_MS);
    return () => {
      window.clearInterval(id);
      if (swapTimer.current != null) {
        window.clearTimeout(swapTimer.current);
        swapTimer.current = null;
      }
    };
  }, [ready, reduce]);

  // if motion turns off mid-swap, settle the incoming word instead of sliding on
  useEffect(() => {
    if (!reduce || incoming == null) return;
    if (swapTimer.current != null) {
      window.clearTimeout(swapTimer.current);
      swapTimer.current = null;
    }

    // deferred like the transition kick-off: effects must not set state synchronously
    let settleFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      settleFrame = window.requestAnimationFrame(() => {
        indexRef.current = incoming;
        setIndex(incoming);
        setOutgoing(null);
        setIncoming(null);
        setIncomingReady(false);
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settleFrame);
    };
  }, [reduce, incoming]);

  useEffect(() => {
    if (incoming == null && outgoing == null) return;
    let innerFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        setIncomingReady(true);
        setOutgoingReady(true);
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [incoming, outgoing]);

  // the trailing dots ride along with each word so nothing sits after the reserved slot
  const renderWord = (i: number) => <>{HERO_MUSES[i]}...</>;

  return (
    <span className="text-note" aria-hidden="true">
      <PixelGrid />
      <span className="relative inline-block align-baseline">
        <span className="invisible whitespace-nowrap">{LONGEST}...</span>
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
                {renderWord(outgoing)}
              </span>
              <span
                className={cn(
                  'absolute inset-0 transition-[transform,opacity,filter] duration-300 ease-out',
                  incomingReady
                    ? 'blur-0 translate-y-0 opacity-100'
                    : 'translate-y-[70%] opacity-0 blur-[2px]',
                )}
              >
                {renderWord(incoming)}
              </span>
            </>
          ) : (
            <span className="absolute inset-0">{renderWord(index)}</span>
          )}
        </span>
      </span>
    </span>
  );
}
