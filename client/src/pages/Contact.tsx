import { Link } from "wouter";
import { ArrowLeft, Mail, Phone, Github, Linkedin, MapPin } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/hooks/use-portfolio";

function InlineIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-border/70 bg-card/70 shadow-[var(--shadow-2xs)]">
      {children}
    </span>
  );
}

export default function Contact() {
  const { data } = usePortfolio();

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Contact — Event Horizon"
        description="Get in touch with Abdul Jawwad for meaningful collaborations and conversations."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <MinimalSection
              id="contact"
              eyebrow="Contact"
              title="Let's talk"
              subtitle="If it's meaningful work, I'll respond quickly."
            >
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    className={cn(
                      "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                      "p-6 shadow-[var(--shadow-xs)]",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <InlineIcon>
                        <Mail className="w-4 h-4" />
                      </InlineIcon>
                      <span className="font-semibold text-sm">Email</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {data?.profile?.email || "hey.jawwad@gmail.com"}
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        window.location.href = `mailto:${data?.profile?.email || "hey.jawwad@gmail.com"}`;
                      }}
                    >
                      Send Email
                    </Button>
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                      "p-6 shadow-[var(--shadow-xs)]",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <InlineIcon>
                        <Phone className="w-4 h-4" />
                      </InlineIcon>
                      <span className="font-semibold text-sm">Phone</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {data?.profile?.phonePrimary || "+966 57 928 7411"}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        window.location.href = `tel:${data?.profile?.phonePrimary || "+966579287411"}`;
                      }}
                    >
                      Call Now
                    </Button>
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                    "p-6 shadow-[var(--shadow-xs)]",
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <InlineIcon>
                      <MapPin className="w-4 h-4" />
                    </InlineIcon>
                    <span className="font-semibold text-sm">Location</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {data?.profile?.location || "Jeddah, Saudi Arabia"}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Tag tone="neutral">
                      <Github className="w-3.5 h-3.5" />
                      GitHub
                    </Tag>
                    <Tag tone="primary">
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </Tag>
                  </div>
                </div>

                <div className="text-center pt-6">
                  <p className="text-sm text-muted-foreground">
                    Available for consulting, collaboration, and meaningful conversations.
                  </p>
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </div>
  );
}