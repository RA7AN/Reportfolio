'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Research', href: '/research' },
  { label: 'Explore', href: '/explore' },
  { label: 'About', href: '/about' },
];

function isActive(href: string, pathname: string) {
  if (href === '/work') return pathname === '/work' || pathname.startsWith('/projects/');
  if (href === '/research') return pathname === '/research' || pathname.startsWith('/research/');
  if (href === '/explore') {
    return (
      pathname === '/explore' ||
      pathname === '/now' ||
      pathname.startsWith('/writing') ||
      pathname.startsWith('/musings') ||
      pathname.startsWith('/reads')
    );
  }
  return pathname === href;
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/80 bg-background/75 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="group min-w-0">
            <span className="font-mono text-[11px] tracking-[0.22em] text-[#a5a7b0] uppercase">
              Event Horizon
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-mono text-[11px] tracking-[0.16em] uppercase transition-colors',
                  isActive(item.href, pathname)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/resume"
              className={cn(
                'rounded-sm border px-3 py-1 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors',
                pathname === '/resume'
                  ? 'border-primary text-primary'
                  : 'border-border hover:border-primary hover:text-primary',
              )}
            >
              CV
            </Link>
          </nav>

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground font-mono text-[11px] tracking-[0.16em] uppercase md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" className="flex flex-col gap-3 border-t py-4 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.16em] uppercase"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/resume"
              className="text-primary font-mono text-xs tracking-[0.16em] uppercase"
              onClick={() => setOpen(false)}
            >
              CV
            </Link>
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
