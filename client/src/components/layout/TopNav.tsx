import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  kind: "anchor" | "route";
  testid: string;
};

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "intro");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.4, 0.6],
        rootMargin: "-20% 0px -65% 0px",
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids.join(",")]);

  return active;
}

export function TopNav() {
  const [loc] = useLocation();
  const onHome = loc === "/";

  const nav: NavItem[] = useMemo(
    () => [
      { label: "Work", href: onHome ? "#work" : "/#work", kind: onHome ? "anchor" : "route", testid: "nav-work" },
      { label: "Writing", href: "/writing", kind: "route", testid: "nav-writing" },
      { label: "Contact", href: onHome ? "#contact" : "/#contact", kind: onHome ? "anchor" : "route", testid: "nav-contact" },
    ],
    [onHome],
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useScrollSpy(["intro", "work", "projects", "writing", "contact"]);

  useEffect(() => {
    setMobileOpen(false);
  }, [loc]);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div
      className={cn(
        "sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55",
        "shadow-[0_1px_0_hsl(var(--border)/1)]",
      )}
    >
      <Container>{children}</Container>
    </div>
  );

  return (
    <Shell>
      <div className="flex items-center justify-between py-3 md:py-4">
        <div className="flex items-baseline gap-3 min-w-0">
          <Link
            href="/"
            data-testid="nav-home"
            className="group inline-flex items-baseline gap-2 min-w-0"
          >
            <span
              className={cn(
                "font-display text-lg md:text-xl leading-none",
                "tracking-tight text-foreground",
              )}
            >
              Abdul Jawwad
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground truncate">
              ultra-minimal portfolio
            </span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1" aria-label="Primary">
            {nav.map((item) => {
              const isActive =
                onHome && item.kind === "anchor"
                  ? active === item.href.replace("#", "")
                  : loc === item.href;

              const cls = cn(
                "px-3 py-2 rounded-xl text-sm font-medium",
                "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                "transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-ring/10 focus:bg-muted/70",
                isActive && "text-foreground bg-muted/70",
              );

              return item.kind === "anchor" ? (
                <a
                  key={item.testid}
                  data-testid={item.testid}
                  href={item.href}
                  className={cls}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.testid} data-testid={item.testid} href={item.href} className={cls}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            data-testid="nav-email"
            variant="outline"
            className={cn(
              "rounded-xl",
              "border-border/70 bg-card/70 hover:bg-card",
              "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
              "transition-all duration-200",
            )}
            onClick={() => {
              window.location.href = "mailto:abdul@example.com";
            }}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>

        <div className="md:hidden">
          <Button
            data-testid="nav-mobile-toggle"
            variant="outline"
            className="rounded-xl border-border/70 bg-card/70 shadow-[var(--shadow-xs)]"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden pb-4">
          <div className="rounded-2xl border bg-card/70 backdrop-blur shadow-[var(--shadow-sm)] p-2">
            <div className="grid gap-1">
              {nav.map((item) => {
                const cls =
                  "px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-200";
                return item.kind === "anchor" ? (
                  <a
                    key={item.testid}
                    data-testid={`${item.testid}-mobile`}
                    href={item.href}
                    className={cls}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.testid}
                    data-testid={`${item.testid}-mobile`}
                    href={item.href}
                    className={cls}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <button
                data-testid="nav-email-mobile"
                onClick={() => (window.location.href = "mailto:abdul@example.com")}
                className="px-3 py-3 rounded-xl text-sm font-medium text-foreground bg-muted/70 hover:bg-muted transition-all duration-200 text-left"
              >
                Email
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
