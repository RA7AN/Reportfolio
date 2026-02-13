import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  testid: string;
};

export function TopNav() {
  const [loc] = useLocation();

  const nav: NavItem[] = useMemo(
    () => [
      { label: "Contact", href: "/contact", testid: "nav-contact" },
      { label: "About Me", href: "/about", testid: "nav-about" },
      { label: "Writings", href: "/writing", testid: "nav-writing" },
      { label: "Musings", href: "/musings", testid: "nav-musings" },
    ],
    [],
  );

  return (
    <div className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55 border-b shadow-[0_1px_0_hsl(var(--border)/1)]">
      <Container>
        {/* Site Header */}
        <div className="text-center py-6 border-b border-border/70">
          <Link href="/" className="group inline-block">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Event Horizon
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              On a trajectory shaped by curiosity
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center py-4">
          <div className="flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testid}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  loc === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
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
