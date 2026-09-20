'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'About Me', href: '/about' },
  { label: 'Writings', href: '/writing' },
  { label: 'Musings', href: '/musings' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <div className="bg-background/70 supports-[backdrop-filter]:bg-background/55 sticky top-0 z-40 border-b shadow-[0_1px_0_hsl(var(--border)/1)] backdrop-blur">
      <Container>
        <div className="border-border/70 border-b py-6 text-center">
          <Link href="/" className="group inline-block">
            <h1 className="text-foreground group-hover:text-primary text-2xl font-bold tracking-tight transition-colors md:text-3xl">
              Event Horizon
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              On a trajectory shaped by curiosity
            </p>
          </Link>
        </div>
        <nav className="flex items-center justify-center py-4">
          <div className="flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'hover:text-primary text-sm font-medium transition-colors',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </Container>
    </div>
  );
}
