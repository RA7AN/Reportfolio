'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronRight, FileText, Notebook } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MusingNotebook } from '@/lib/content/schemas';

export function MusingsClient({ notebooks }: { notebooks: MusingNotebook[] }) {
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(new Set());

  const currentNotebook = notebooks.find((n) => n.id === selectedNotebook);
  const currentEntry = currentNotebook?.entries.find((e) => e.id === selectedEntry);

  return (
    <PageShell>
      <main className="flex min-h-[calc(100vh-10rem)]">
        <div className="border-border/70 bg-card/30 w-80 border-r backdrop-blur">
          <div className="border-border/70 border-b p-6">
            <h2 className="mb-2 text-lg font-semibold">Notebooks</h2>
            <p className="text-muted-foreground text-sm">Organized thoughts and explorations</p>
          </div>
          <div className="space-y-2 p-4">
            {notebooks.map((notebook) => (
              <div key={notebook.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = new Set(expandedNotebooks);
                    if (next.has(notebook.id)) next.delete(notebook.id);
                    else next.add(notebook.id);
                    setExpandedNotebooks(next);
                    setSelectedNotebook(notebook.id);
                    setSelectedEntry(null);
                  }}
                  className={cn(
                    'hover:bg-card/60 flex w-full items-center gap-2 rounded-lg p-3 text-left transition-colors',
                    selectedNotebook === notebook.id ? 'bg-card/70 shadow-sm' : '',
                  )}
                >
                  {expandedNotebooks.has(notebook.id) ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                  <Notebook className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{notebook.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {notebook.entries.length} entries
                    </div>
                  </div>
                </button>
                {expandedNotebooks.has(notebook.id) && (
                  <div className="ml-6 space-y-1">
                    {notebook.entries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          setSelectedNotebook(notebook.id);
                          setSelectedEntry(entry.id);
                        }}
                        className={cn(
                          'hover:bg-card/40 flex w-full items-center gap-2 rounded-md p-2 text-left text-sm',
                          selectedEntry === entry.id ? 'bg-card/60 shadow-sm' : '',
                        )}
                      >
                        <FileText className="h-3 w-3 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{entry.title}</div>
                          <div className="text-muted-foreground text-xs">{entry.date}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          {!selectedNotebook && (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <Notebook className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-xl font-semibold">Welcome to Musings</h3>
                <p className="text-muted-foreground">
                  Select a notebook from the sidebar to start exploring thoughts and ideas.
                </p>
              </div>
            </div>
          )}
          {selectedNotebook && !selectedEntry && (
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-3 text-3xl font-bold">{currentNotebook?.title}</h1>
              <p className="text-muted-foreground mb-8 text-lg">{currentNotebook?.description}</p>
              <div className="grid gap-4">
                {currentNotebook?.entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSelectedEntry(entry.id)}
                    className="border-border/70 bg-card/60 rounded-xl border p-6 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <h3 className="mb-2 text-xl font-semibold">{entry.title}</h3>
                    <p className="text-muted-foreground mb-3">{entry.preview}</p>
                    <div className="text-muted-foreground text-sm">{entry.date}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedEntry && currentEntry && (
            <div className="mx-auto max-w-4xl">
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
                <span>{currentNotebook?.title}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{currentEntry.title}</span>
              </div>
              <h1 className="mb-3 text-3xl font-bold">{currentEntry.title}</h1>
              <div className="text-muted-foreground mb-8">{currentEntry.date}</div>
              <div className="prose prose-lg max-w-none">
                <p className="mb-6 text-lg leading-relaxed">{currentEntry.preview}</p>
                {currentEntry.body ? <p>{currentEntry.body}</p> : null}
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="fixed bottom-6 left-6">
        <Button
          variant="outline"
          asChild
          className="border-border/70 bg-card/70 rounded-xl backdrop-blur"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
