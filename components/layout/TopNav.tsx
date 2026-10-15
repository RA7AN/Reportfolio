'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlassesIcon, MoonIcon, ScribbleArrow, SunIcon } from '@/components/layout/SiteIcons';
import { useSiteUi } from '@/components/layout/SiteUi';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'projects', href: '/projects' },
  { label: 'writing', href: '/blog' },
  { label: 'links', href: '/links' },
  { label: 'beats', href: '/beats' },
];

function ThemeToggle({ light, onToggle }: { light: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={light ? 'switch to dark mode' : 'switch to light mode'}
      className="hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors duration-150"
      onClick={onToggle}
    >
      {light ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function NerdToggle({ nerd, onToggle }: { nerd: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={nerd}
      title="nerd mode"
      aria-label={nerd ? 'turn off nerd mode' : 'turn on nerd mode'}
      className={cn(
        'hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors duration-150',
        nerd ? 'text-note' : 'text-muted-foreground',
      )}
      onClick={onToggle}
    >
      <GlassesIcon />
    </button>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const { light, nerd, setLight, setNerd } = useSiteUi();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex min-h-9 items-center font-medium tracking-tight">
            jawwad
          </Link>
          <div className="text-muted-foreground hidden items-center gap-1 md:flex md:gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'link-draw hover:text-foreground inline-flex min-h-9 items-center px-2 text-sm transition-colors duration-150',
                  isActive(item.href) ? 'text-foreground' : '',
                )}
              >
                {item.label}
              </Link>
            ))}
            <span className="bg-border mx-1 hidden h-4 w-px md:block" aria-hidden />
            <ThemeToggle light={light} onToggle={() => setLight(!light)} />
            <NerdToggle nerd={nerd} onToggle={() => setNerd(!nerd)} />
            <span
              className="nerd-fade pointer-events-none hidden items-center self-stretch md:flex"
              aria-hidden
            >
              <span className="text-note ml-1 inline-flex scale-90 items-center gap-1">
                <ScribbleArrow toward="left" className="h-10 w-11 shrink-0" />
                <span className="font-hand text-xl leading-tight sm:text-2xl">
                  wear the glasses
                </span>
              </span>
            </span>
          </div>
        </nav>
      </header>
      {/* phone: the links move to a floating pill pinned to the bottom of the
          screen (reference shape), leaving the top bar as just the brand */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 md:hidden">
        <nav
          aria-label="primary"
          className="border-border bg-background/85 flex max-w-[calc(100vw-24px)] items-center gap-0.5 rounded-full border px-1.5 py-1.5 shadow-lg backdrop-blur-md"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-2.5 py-1.5 text-[13px] transition-colors duration-150',
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="bg-border mx-0.5 h-4 w-px" aria-hidden />
          <ThemeToggle light={light} onToggle={() => setLight(!light)} />
          <NerdToggle nerd={nerd} onToggle={() => setNerd(!nerd)} />
        </nav>
      </div>
    </>
  );
}
