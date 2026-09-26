'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteUi } from '@/components/layout/SiteUi';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'projects', href: '/projects' },
  { label: 'blog', href: '/blog' },
  { label: 'links', href: '/links' },
  { label: 'beats', href: '/beats' },
];

export function TopNav() {
  const pathname = usePathname();
  const { light, nerd, setLight, setNerd } = useSiteUi();

  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="text-[15px] font-medium tracking-tight">
          jawwad
        </Link>
        <div className="flex items-center gap-5 text-[13px] text-[#9c9a93]">
          <nav className="flex items-center gap-3 sm:gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'link-draw hover:text-foreground py-1 transition-colors duration-150',
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'text-foreground'
                    : '',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="bg-border hidden h-3 w-px sm:block" />
          <button
            type="button"
            aria-label={light ? 'switch to dark mode' : 'switch to light mode'}
            className="hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors duration-150"
            onClick={() => setLight(!light)}
          >
            {light ? '☀' : '☾'}
          </button>
          <button
            type="button"
            aria-pressed={nerd}
            aria-label={nerd ? 'turn off nerd mode' : 'turn on nerd mode'}
            className={cn(
              'hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors duration-150',
              nerd && 'text-note',
            )}
            onClick={() => setNerd(!nerd)}
          >
            ∞
          </button>
          <span className="font-hand text-note hidden -rotate-6 text-base md:inline">
            wear the glasses
          </span>
        </div>
      </div>
    </header>
  );
}
