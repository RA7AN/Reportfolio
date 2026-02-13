import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, ChevronDown, FileText, Notebook } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { TopNav } from "@/components/layout/TopNav";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock notebook data - replace with actual data source
const notebooks = [
  {
    id: "ai-research",
    title: "AI Research Notes",
    description: "Thoughts on machine learning and artificial intelligence",
    entries: [
      { id: "1", title: "Large Language Models", date: "2026-02-10", preview: "Exploring the capabilities and limitations..." },
      { id: "2", title: "Neural Architecture Search", date: "2026-02-08", preview: "Automated design of neural networks..." },
      { id: "3", title: "Transformer Attention Mechanisms", date: "2026-02-05", preview: "Deep dive into attention patterns..." },
    ]
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture patterns and distributed systems",
    entries: [
      { id: "4", title: "Event-Driven Architecture", date: "2026-02-12", preview: "Building resilient distributed systems..." },
      { id: "5", title: "Database Scaling Strategies", date: "2026-02-09", preview: "Horizontal vs vertical scaling approaches..." },
    ]
  },
  {
    id: "philosophy",
    title: "Philosophy & Ethics",
    description: "Reflections on technology, society, and meaning",
    entries: [
      { id: "6", title: "The Ethics of AI Development", date: "2026-02-11", preview: "Responsibility in building artificial minds..." },
      { id: "7", title: "Technology and Human Connection", date: "2026-02-07", preview: "How digital tools shape relationships..." },
    ]
  },
  {
    id: "random",
    title: "Random Thoughts", 
    description: "Miscellaneous observations and ideas",
    entries: [
      { id: "8", title: "The Art of Learning", date: "2026-02-06", preview: "Strategies for continuous growth..." },
      { id: "9", title: "Building in Public", date: "2026-02-04", preview: "Thoughts on transparency in creation..." },
    ]
  }
];

interface NotebookSidebarProps {
  notebooks: typeof notebooks;
  selectedNotebook: string | null;
  selectedEntry: string | null;
  onNotebookSelect: (notebookId: string) => void;
  onEntrySelect: (entryId: string) => void;
  expandedNotebooks: Set<string>;
  onToggleNotebook: (notebookId: string) => void;
}

function NotebookSidebar({
  notebooks,
  selectedNotebook,
  selectedEntry,
  onNotebookSelect,
  onEntrySelect,
  expandedNotebooks,
  onToggleNotebook
}: NotebookSidebarProps) {
  return (
    <div className="w-80 border-r border-border/70 bg-card/30 backdrop-blur">
      <div className="p-6 border-b border-border/70">
        <h2 className="text-lg font-semibold mb-2">Notebooks</h2>
        <p className="text-sm text-muted-foreground">
          Organized thoughts and explorations
        </p>
      </div>
      
      <div className="p-4 space-y-2">
        {notebooks.map((notebook) => (
          <div key={notebook.id} className="space-y-1">
            <button
              onClick={() => {
                onToggleNotebook(notebook.id);
                onNotebookSelect(notebook.id);
              }}
              className={cn(
                "w-full flex items-center gap-2 p-3 rounded-lg text-left transition-colors",
                "hover:bg-card/60",
                selectedNotebook === notebook.id ? "bg-card/70 shadow-sm" : ""
              )}
            >
              {expandedNotebooks.has(notebook.id) ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
              <Notebook className="w-4 h-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{notebook.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {notebook.entries.length} entries
                </div>
              </div>
            </button>
            
            {expandedNotebooks.has(notebook.id) && (
              <div className="ml-6 space-y-1">
                {notebook.entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => onEntrySelect(entry.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors text-sm",
                      "hover:bg-card/40",
                      selectedEntry === entry.id ? "bg-card/60 shadow-sm" : ""
                    )}
                  >
                    <FileText className="w-3 h-3 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{entry.title}</div>
                      <div className="text-xs text-muted-foreground">{entry.date}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface NotebookContentProps {
  selectedNotebook: string | null;
  selectedEntry: string | null;
  notebooks: typeof notebooks;
  onEntrySelect: (entryId: string) => void;
}

function NotebookContent({ selectedNotebook, selectedEntry, notebooks, onEntrySelect }: NotebookContentProps) {
  const currentNotebook = notebooks.find(n => n.id === selectedNotebook);
  const currentEntry = currentNotebook?.entries.find(e => e.id === selectedEntry);

  if (!selectedNotebook && !selectedEntry) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Notebook className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">Welcome to Musings</h3>
          <p className="text-muted-foreground">
            Select a notebook from the sidebar to start exploring thoughts and ideas.
          </p>
        </div>
      </div>
    );
  }

  if (selectedNotebook && !selectedEntry) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">{currentNotebook?.title}</h1>
            <p className="text-lg text-muted-foreground">{currentNotebook?.description}</p>
          </div>
          
          <div className="grid gap-4">
            {currentNotebook?.entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onEntrySelect(entry.id)}
                className={cn(
                  "text-left p-6 rounded-xl border border-border/70 bg-card/60 backdrop-blur",
                  "hover:bg-card/70 hover:shadow-md transition-all duration-200",
                  "hover:-translate-y-0.5"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                    <p className="text-muted-foreground mb-3">{entry.preview}</p>
                    <div className="text-sm text-muted-foreground">{entry.date}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 mt-1 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedEntry) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{currentNotebook?.title}</span>
              <ChevronRight className="w-4 h-4" />
              <span>{currentEntry?.title}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{currentEntry?.title}</h1>
            <div className="text-muted-foreground">{currentEntry?.date}</div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {/* Mock content - replace with actual content rendering */}
            <p className="text-lg leading-relaxed mb-6">{currentEntry?.preview}</p>
            
            <h2>Overview</h2>
            <p>
              This is where the full content of the musing would be displayed. 
              In a real implementation, this would be rendered from markdown or 
              another content format.
            </p>
            
            <h2>Key Insights</h2>
            <ul>
              <li>Important observation number one</li>
              <li>Critical insight about the topic</li>
              <li>Implications for future work</li>
            </ul>
            
            <h2>Further Exploration</h2>
            <p>
              Links to related musings, external resources, or areas for 
              continued investigation would appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function Musings() {
  const [selectedNotebook, setSelectedNotebook] = React.useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = React.useState<string | null>(null);
  const [expandedNotebooks, setExpandedNotebooks] = React.useState<Set<string>>(new Set());

  const handleNotebookSelect = (notebookId: string) => {
    setSelectedNotebook(notebookId);
    setSelectedEntry(null);
  };

  const handleEntrySelect = (entryId: string) => {
    setSelectedEntry(entryId);
    // Also find and set the notebook that contains this entry
    const notebook = notebooks.find(n => n.entries.some(e => e.id === entryId));
    if (notebook) {
      setSelectedNotebook(notebook.id);
    }
  };

  const handleToggleNotebook = (notebookId: string) => {
    const newExpanded = new Set(expandedNotebooks);
    if (expandedNotebooks.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
    }
    setExpandedNotebooks(newExpanded);
  };

  return (
    <div className="min-h-screen grain">
      <Seo 
        title="Musings — Event Horizon"
        description="Organized thoughts and explorations across AI research, system design, philosophy, and more."
      />
      <TopNav />
      
      <main className="flex">
        <NotebookSidebar
          notebooks={notebooks}
          selectedNotebook={selectedNotebook}
          selectedEntry={selectedEntry}
          onNotebookSelect={handleNotebookSelect}
          onEntrySelect={handleEntrySelect}
          expandedNotebooks={expandedNotebooks}
          onToggleNotebook={handleToggleNotebook}
        />
        
        <NotebookContent 
          selectedNotebook={selectedNotebook}
          selectedEntry={selectedEntry}
          notebooks={notebooks}
          onEntrySelect={handleEntrySelect}
        />
      </main>
      
      {/* Back to Home */}
      <div className="fixed bottom-6 left-6">
        <Link href="/">
          <Button
            variant="outline"
            className={cn(
              "rounded-xl border-border/70 bg-card/70 backdrop-blur hover:bg-card",
              "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
              "transition-all duration-200"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}