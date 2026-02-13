import { Link } from "wouter";
import { ArrowLeft, User, Target, BookOpen, Code } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function AboutMe() {
  const { data } = usePortfolio();

  return (
    <div className="min-h-screen grain">
      <Seo
        title="About Me — Event Horizon"
        description="Learn about Abdul Jawwad's journey in AI research, engineering, and building meaningful systems."
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
              eyebrow="About"
              title="Who I Am"
              subtitle="A builder at the intersection of AI research and systems engineering."
            >
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  className={cn(
                    "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                    "p-8 shadow-[var(--shadow-md)] mb-8",
                  )}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <User className="w-5 h-5" />
                    Background
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {data?.profile?.bio || 
                      "I'm Abdul Jawwad, an AI Research Engineer with a passion for building systems that matter. My journey spans from foundational AI research to practical engineering solutions that bridge the gap between cutting-edge research and real-world applications."}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Currently focused on multimodal learning, agentic systems, and developing robust evaluation frameworks for AI systems. I believe in building technology that amplifies human capability while maintaining clarity and purpose.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className={cn(
                      "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                      "p-6 shadow-[var(--shadow-xs)]",
                    )}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                      <Target className="w-5 h-5" />
                      Current Focus
                    </h3>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Multimodal AI systems and evaluation</li>
                      <li>• Agentic architectures and frameworks</li>
                      <li>• Research-to-production pipelines</li>
                      <li>• Open source AI tooling</li>
                    </ul>
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                      "p-6 shadow-[var(--shadow-xs)]",
                    )}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                      <BookOpen className="w-5 h-5" />
                      Interests
                    </h3>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Philosophy of technology</li>
                      <li>• System design and architecture</li>
                      <li>• Technical writing and knowledge sharing</li>
                      <li>• Building communities around AI research</li>
                    </ul>
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                    "p-6 shadow-[var(--shadow-xs)] mt-6",
                  )}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                    <Code className="w-5 h-5" />
                    Philosophy
                  </h3>
                  <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                    "Technology should amplify human potential, not replace human judgment. 
                    I build systems that are transparent, reliable, and serve meaningful purposes."
                  </blockquote>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Tag tone="primary">AI Research</Tag>
                  <Tag tone="neutral">System Architecture</Tag>
                  <Tag tone="primary">Technical Writing</Tag>
                  <Tag tone="neutral">Open Source</Tag>
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </div>
  );
}