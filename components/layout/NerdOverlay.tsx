'use client';

import { useSiteUi } from '@/components/layout/SiteUi';

export function NerdOverlay() {
  const { nerd, setNerd } = useSiteUi();
  if (!nerd) return null;

  return (
    <div className="bg-background/95 border-border text-muted-foreground pointer-events-none fixed inset-x-0 bottom-0 z-50 border-t p-4 font-mono text-[11px] leading-relaxed backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] items-start justify-between gap-4">
        <p>
          nerd mode placeholder · tokens: bg #0a0a0a · type #edebe6 · note #e8b923 · geist + caveat
          · swap this overlay for inspector details later
        </p>
        <button
          type="button"
          className="text-foreground pointer-events-auto"
          onClick={() => setNerd(false)}
        >
          close
        </button>
      </div>
    </div>
  );
}
