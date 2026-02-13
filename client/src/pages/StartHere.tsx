import { Link } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, Code, Github, Mail, ExternalLink } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

function QuickLink({ title, description, href, icon, external = false }: QuickLinkProps) {
  const Component = external ? 'a' : Link;
  const props = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
  
  return (
    <Component
      {...props}
      className={cn(
        "block rounded-xl border border-border/70 bg-card/60 backdrop-blur",
        "p-4 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-200",
        "group hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-medium group-hover:text-primary transition-colors">
          {title}
        </h3>
        {external && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Component>
  );
}

export default function StartHere() {
  return (
    <div className="min-h-screen grain">
      <Seo
        title="Start Here — Event Horizon"
        description="New to Abdul Jawwad's digital space? Start your journey here with an overview of everything available."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <MinimalSection
              eyebrow="Welcome"
              title="Start Here"
              subtitle="New to this digital space? Here's your guide to everything available."
            >
              <div className="space-y-8">
                <div
                  className={cn(
                    "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                    "p-8 shadow-[var(--shadow-md)]",
                  )}
                >
                  <h3 className="text-xl font-semibold mb-4">About This Space</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Welcome to Event Horizon — my digital home where I document my journey in AI research, 
                    engineering, and building systems that matter. This space serves as both a portfolio 
                    and a laboratory for ideas.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you're here to explore my work, read my thoughts, or connect for meaningful 
                    collaboration, everything is organized to help you find what you're looking for quickly.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <QuickLink
                      title="About Me"
                      description="Learn about my background, philosophy, and current focus areas"
                      href="/about"
                      icon={<BookOpen className="w-4 h-4 text-primary" />}
                    />
                    <QuickLink
                      title="My Work"
                      description="Explore projects, publications, and professional experience"
                      href="/resume"
                      icon={<Code className="w-4 h-4 text-primary" />}
                    />
                    <QuickLink
                      title="Writing"
                      description="Long-form articles on AI, systems, and technology"
                      href="/writing"
                      icon={<BookOpen className="w-4 h-4 text-primary" />}
                    />
                    <QuickLink
                      title="Musings"
                      description="Random thoughts and research notes from my notebook"
                      href="/musings"
                      icon={<BookOpen className="w-4 h-4 text-primary" />}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Featured Content</h3>
                  <div className="grid gap-4">
                    <QuickLink
                      title="Latest Projects"
                      description="Recent work on multimodal AI systems and evaluation frameworks"
                      href="/projects"
                      icon={<Code className="w-4 h-4 text-primary" />}
                    />
                    <QuickLink
                      title="Recommended Reads"
                      description="Books, papers, and articles that have shaped my thinking"
                      href="/reads"
                      icon={<BookOpen className="w-4 h-4 text-primary" />}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <QuickLink
                      title="Get in Touch"
                      description="Available for consulting, collaboration, and meaningful conversations"
                      href="/contact"
                      icon={<Mail className="w-4 h-4 text-primary" />}
                    />
                    <QuickLink
                      title="GitHub"
                      description="Open source projects and ongoing development work"
                      href="https://github.com/RA7AN"
                      icon={<Github className="w-4 h-4 text-primary" />}
                      external
                    />
                  </div>
                </div>

                <div className="text-center pt-6">
                  <Button asChild className="gap-2">
                    <Link href="/writing">
                      Start with my writing
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </div>
  );
}