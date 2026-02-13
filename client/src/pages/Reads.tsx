import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, ExternalLink, Star, Calendar, Filter } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { MinimalSection } from "@/components/primitives/MinimalSection";
import { Tag } from "@/components/primitives/Tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dummy data - will be replaced with CMS data later
const dummyReads = [
  {
    id: 1,
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    type: "paper",
    year: 2017,
    rating: 5,
    url: "https://arxiv.org/abs/1706.03762",
    myReview: "Foundational paper that introduced the Transformer architecture. Elegant solution to sequence modeling that became the backbone of modern LLMs. The self-attention mechanism is beautifully simple yet powerful.",
    tags: ["transformers", "attention", "nlp", "foundational"],
    dateRead: "2023-01",
    category: "research"
  },
  {
    id: 2,
    title: "The Design of Everyday Things",
    authors: ["Don Norman"],
    type: "book",
    year: 2013,
    rating: 4,
    url: "https://www.goodreads.com/book/show/840.The_Design_of_Everyday_Things",
    myReview: "Essential reading for anyone building user-facing systems. Norman's principles of good design apply far beyond physical objects - they're crucial for software interfaces and API design too.",
    tags: ["design", "ux", "systems", "usability"],
    dateRead: "2023-08",
    category: "design"
  },
  {
    id: 3,
    title: "Scaling Laws for Neural Language Models",
    authors: ["Kaplan et al."],
    type: "paper",
    year: 2020,
    rating: 4,
    url: "https://arxiv.org/abs/2001.08361",
    myReview: "Crucial insights into how model performance scales with compute, data, and parameters. Helped predict the success of large language models before GPT-3 was released.",
    tags: ["scaling", "llm", "empirical", "compute"],
    dateRead: "2023-03",
    category: "research"
  },
  {
    id: 4,
    title: "Thinking, Fast and Slow",
    authors: ["Daniel Kahneman"],
    type: "book",
    year: 2011,
    rating: 5,
    url: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
    myReview: "Profound insights into human decision-making and cognitive biases. Essential for anyone building AI systems that interact with humans or trying to understand evaluation challenges.",
    tags: ["psychology", "decision-making", "bias", "cognition"],
    dateRead: "2022-12",
    category: "psychology"
  }
];

type FilterType = "all" | "book" | "paper" | "article";

export default function Reads() {
  const [filter, setFilter] = useState<FilterType>("all");
  
  const filteredReads = filter === "all" 
    ? dummyReads 
    : dummyReads.filter(read => read.type === filter);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-3 h-3",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen grain">
      <Seo
        title="Recommended Reads — Event Horizon"
        description="Books, papers, and articles that have shaped Abdul Jawwad's thinking on AI, systems, and technology."
      />
      <TopNav />

      <main className="pb-16 md:pb-24">
        <Container>
          <div className="pt-10 md:pt-14 max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <MinimalSection
              eyebrow="Library"
              title="Recommended Reads"
              subtitle="Books, papers, and articles that have shaped my thinking."
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-2">
                    {(["all", "book", "paper", "article"] as FilterType[]).map((type) => (
                      <Button
                        key={type}
                        size="sm"
                        variant={filter === type ? "default" : "outline"}
                        onClick={() => setFilter(type)}
                        className="capitalize"
                      >
                        {type === "all" ? "All" : type + "s"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6">
                  {filteredReads.map((read) => (
                    <div
                      key={read.id}
                      className={cn(
                        "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                        "p-6 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                            <h3 className="font-semibold text-lg">
                              <a
                                href={read.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors inline-flex items-center gap-2"
                              >
                                {read.title}
                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                              </a>
                            </h3>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            by {read.authors.join(", ")} • {read.year}
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            {renderStars(read.rating)}
                            <Tag tone="neutral" className="text-xs capitalize">
                              {read.type}
                            </Tag>
                            <Tag tone="primary" className="text-xs">
                              {read.category}
                            </Tag>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {read.tags.map((tag) => (
                              <Tag key={tag} tone="neutral" className="text-xs">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                          {read.dateRead}
                        </div>
                      </div>

                      <div className="border-l-4 border-primary/20 pl-4">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "{read.myReview}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-6">
                  <div
                    className={cn(
                      "rounded-2xl border border-border/70 bg-card/60 backdrop-blur",
                      "p-6 shadow-[var(--shadow-xs)]",
                    )}
                  >
                    <BookOpen className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      More recommendations coming soon. This is a curated list that gets updated regularly
                      as I discover new insights and revisit classics.
                    </p>
                  </div>
                </div>
              </div>
            </MinimalSection>
          </div>
        </Container>
      </main>
    </div>
  );
}