import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight, FileX } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen grain">
      <Seo title="404 — Not Found" description="The page you’re looking for doesn’t exist." />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-14 md:pt-20 rise-in" data-testid="not-found">
            <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur shadow-[var(--shadow-md)] overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-border/70 bg-background/50 grid place-items-center shadow-[var(--shadow-xs)]">
                    <FileX className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">404</div>
                    <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                      Page not found
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                      A clean site still needs a clean escape hatch. Try heading back home or open the writing archive.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      <Link href="/" data-testid="not-found-home" className="inline-block">
                        <Button
                          className={cn(
                            "rounded-xl font-semibold",
                            "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground",
                            "shadow-[0_14px_40px_hsl(var(--primary)/0.22)]",
                            "hover:shadow-[0_18px_55px_hsl(var(--primary)/0.28)] hover:-translate-y-0.5",
                            "active:translate-y-0",
                            "transition-all duration-200 ease-out",
                          )}
                          onClick={() => {}}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Home
                        </Button>
                      </Link>

                      <Link href="/writing" data-testid="not-found-writing" className="inline-block">
                        <Button
                          variant="outline"
                          className={cn(
                            "rounded-xl border-border/70 bg-card/70 hover:bg-card",
                            "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
                            "transition-all duration-200",
                          )}
                          onClick={() => {}}
                        >
                          Writing
                          <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-xs text-muted-foreground" data-testid="not-found-footnote">
              Minimal doesn’t mean missing.
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
