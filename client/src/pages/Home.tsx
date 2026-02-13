import { Link } from "wouter";
import * as React from "react";
import { ArrowUpRight, BookOpen, Code, User, Target, FileText, Clock, Award } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/use-portfolio";

function ExploreCard() {
  const exploreLinks = [
    {
      title: "Start Here",
      description: "Get an overview of everything available",
      href: "/start-here",
      icon: <Target className="w-4 h-4" />,
    },
    {
      title: "My Projects",
      description: "Explore all projects and technical work",
      href: "/projects",
      icon: <Code className="w-4 h-4" />,
    },
    {
      title: "Favorite Reads",
      description: "Books, papers, and articles that shaped my thinking",
      href: "/reads",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      title: "Current Resume",
      description: "Professional experience and qualifications",
      href: "/resume",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
        "p-6 shadow-[var(--shadow-md)]",
      )}
    >
      <h2 className="text-xl font-semibold mb-6">Explore</h2>
      <div className="space-y-3">
        {exploreLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-xl border border-border/50 bg-card/40 backdrop-blur",
              "p-4 hover:bg-card/70 hover:shadow-[var(--shadow-sm)]",
              "transition-all duration-200 group hover:-translate-y-0.5",
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {link.icon}
              </div>
              <h3 className="font-medium group-hover:text-primary transition-colors">
                {link.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeaturedWorkCard() {
  const { data } = usePortfolio();
  const [featuredConfig, setFeaturedConfig] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/featured')
      .then(res => res.json())
      .then(config => setFeaturedConfig(config))
      .catch(err => console.error('Failed to load featured config:', err));
  }, []);
  
  // Get manually selected featured items
  const featuredProjects = React.useMemo(() => {
    if (!data?.projects || !featuredConfig?.featuredProjects) return [];
    return data.projects.filter(p => featuredConfig.featuredProjects.includes(String(p.id)));
  }, [data?.projects, featuredConfig]);

  const featuredPublications = React.useMemo(() => {
    if (!data?.publications || !featuredConfig?.featuredPublications) return [];
    return data.publications.filter(pub => featuredConfig.featuredPublications.includes(String(pub.id)));
  }, [data?.publications, featuredConfig]);
  
  const featuredItems = [
    ...featuredProjects.map(p => ({
      title: p.title,
      description: p.highlights?.[0] || "Project description",
      href: p.url || "/projects",
      type: "project" as const,
      icon: <Code className="w-4 h-4" />,
    })),
    ...featuredPublications.map(pub => ({
      title: pub.title,
      description: pub.venue || "Academic publication",
      href: pub.url || "/resume",
      type: "publication" as const,
      icon: <Award className="w-4 h-4" />,
    })),
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
        "p-6 shadow-[var(--shadow-md)]",
      )}
    >
      <h2 className="text-xl font-semibold mb-6">Featured Work</h2>
      <div className="space-y-3">
        {featuredItems.slice(0, 5).map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={cn(
              "block rounded-xl border border-border/50 bg-card/40 backdrop-blur",
              "p-4 hover:bg-card/70 hover:shadow-[var(--shadow-sm)]",
              "transition-all duration-200 group hover:-translate-y-0.5",
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </a>
        ))}
        
        {featuredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Featured work will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { data } = usePortfolio();

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Event Horizon — On a trajectory shaped by curiosity"
        description="Welcome to Abdul Jawwad's digital home. Exploring the intersection of AI research, systems engineering, and meaningful technology."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          {/* Hero Section */}
          <div className="pt-10 md:pt-14 rise-in" id="intro">
            <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur shadow-[var(--shadow-md)] overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10 text-center">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed mb-6">
                    Welcome, traveller
                  </h1>

                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-2">
                    I'm <span className="font-semibold text-foreground">Abdul Jawwad</span> and this is my digital home.
                  </p>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                    These days, I'm building the foundations of my universe.
                  </p>

                  <div className="flex justify-center">
                    <Button
                      onClick={() => (window.location.href = "/writing")}
                      className={cn(
                        "rounded-xl font-semibold px-8 py-3",
                        "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground",
                        "shadow-[0_14px_40px_hsl(var(--primary)/0.22)]",
                        "hover:shadow-[0_18px_55px_hsl(var(--primary)/0.28)] hover:-translate-y-0.5",
                        "active:translate-y-0 active:shadow-[0_10px_30px_hsl(var(--primary)/0.20)]",
                        "transition-all duration-200 ease-out",
                      )}
                    >
                      Explore Writing
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Cards */}
          <div className="mt-14 md:mt-20 grid lg:grid-cols-2 gap-8">
            <ExploreCard />
            <FeaturedWorkCard />
          </div>
        </Container>
      </main>
    </div>
  );
}
