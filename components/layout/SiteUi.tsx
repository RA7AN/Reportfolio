'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type SiteUi = {
  light: boolean;
  nerd: boolean;
  setLight: (value: boolean) => void;
  setNerd: (value: boolean) => void;
};

const SiteUiContext = createContext<SiteUi | null>(null);

export function SiteUiProvider({ children }: { children: ReactNode }) {
  const [light, setLight] = useState(false);
  const [nerd, setNerd] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', light);
    if (!ready.current) {
      ready.current = true;
      return;
    }
    root.classList.remove('crt-flash');
    void root.offsetWidth;
    root.classList.add('crt-flash');
    const id = window.setTimeout(() => root.classList.remove('crt-flash'), 500);
    return () => window.clearTimeout(id);
  }, [light]);

  useEffect(() => {
    document.documentElement.classList.toggle('nerd', nerd);
  }, [nerd]);

  const value = useMemo(() => ({ light, nerd, setLight, setNerd }), [light, nerd]);

  return <SiteUiContext.Provider value={value}>{children}</SiteUiContext.Provider>;
}

export function useSiteUi() {
  const ctx = useContext(SiteUiContext);
  if (!ctx) throw new Error('useSiteUi must be used within SiteUiProvider');
  return ctx;
}
