'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/** The landing "more written things" link should always open this page at
 * the top: lenis keeps its own scroll offset across client navigations, and
 * a plain window.scrollTo fights its raf loop — go through the instance when
 * it exists (immediate = no smooth-scroll animation on entry), with the raw
 * call as the fallback when reduced motion leaves lenis unmounted. */
export function ScrollReset() {
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return null;
}
