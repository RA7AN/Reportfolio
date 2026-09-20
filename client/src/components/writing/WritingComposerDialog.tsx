import { useMemo, useState } from "react";
import { z } from "zod";
import { Plus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateWriting } from "@/hooks/use-writing";
import { insertWritingSchema } from "@shared/schema";
import type { WritingCreateInput } from "@shared/routes";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = insertWritingSchema.extend({
  tags: z
    .union([z.array(z.string()), z.string().optional()])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : (v ? v.split(",") : [])))
    .refine((arr) => Array.isArray(arr), "Invalid tags"),
});

function parseTagsInput(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function WritingComposerDialog({
  defaultKind,
  triggerVariant = "outline",
}: {
  defaultKind?: string;
  triggerVariant?: "default" | "outline" | "secondary";
}) {
  const { toast } = useToast();
  const create = useCreateWriting();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState(defaultKind ?? "Essay");
  const [source, setSource] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [tags, setTags] = useState("");

  const payload: WritingCreateInput = useMemo(
    () => ({
      title,
      kind,
      source: source || null,
      publishedAt: publishedAt || null,
      url: url || null,
      summary: summary || null,
      contentMd: contentMd || null,
      tags: parseTagsInput(tags),
    }),
    [title, kind, source, publishedAt, url, summary, contentMd, tags],
  );

  const canSubmit = title.trim().length >= 2 && kind.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="writing-create-open"
          variant={triggerVariant}
          onClick={() => setOpen(true)}
          className={cn(
            "rounded-xl",
            "border-border/70 bg-card/70 hover:bg-card",
            "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
            "transition-all duration-200",
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </Button>
      </DialogTrigger>

      <DialogContent
        data-testid="writing-create-dialog"
        className={cn(
          "max-w-2xl",
          "rounded-2xl border border-border/70 bg-card/80 backdrop-blur",
          "shadow-[var(--shadow-lg)]",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">New Writing</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            A small, clean editor. Save now; refine later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Title</label>
            <Input
              data-testid="writing-create-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A precise title…"
              className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Kind</label>
              <Input
                data-testid="writing-create-kind"
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                placeholder="Essay, Note, Link…"
                className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Source</label>
              <Input
                data-testid="writing-create-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Personal, Medium…"
                className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Published</label>
              <Input
                data-testid="writing-create-publishedAt"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                placeholder="2025-01 or Jan 2025"
                className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">URL</label>
              <Input
                data-testid="writing-create-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Summary</label>
            <Textarea
              data-testid="writing-create-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One or two lines that explain the piece."
              className="min-h-[88px] rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Content (Markdown)</label>
            <Textarea
              data-testid="writing-create-contentMd"
              value={contentMd}
              onChange={(e) => setContentMd(e.target.value)}
              placeholder={"# Heading\n\nWrite in a calm tone.\n\n- crisp\n- minimal\n"}
              className="min-h-[180px] rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-[12.5px] leading-relaxed"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Tags</label>
            <Input
              data-testid="writing-create-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma, separated, tags"
              className="rounded-xl bg-background/60 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Tip: keep tags short. They become filters.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            data-testid="writing-create-cancel"
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            data-testid="writing-create-submit"
            type="button"
            disabled={!canSubmit || create.isPending}
            onClick={async () => {
              try {
                const validated = formSchema.parse(payload);
                await create.mutateAsync(validated);
                toast({
                  title: "Saved",
                  description: "Your draft is now in the list.",
                });
                setOpen(false);
                setTitle("");
                setKind(defaultKind ?? "Essay");
                setSource("");
                setPublishedAt("");
                setUrl("");
                setSummary("");
                setContentMd("");
                setTags("");
              } catch (e) {
                if (e instanceof z.ZodError) {
                  toast({
                    title: "Check the form",
                    description: e.errors?.[0]?.message ?? "Invalid input",
                    variant: "destructive",
                  });
                  return;
                }
                toast({
                  title: "Couldn’t save",
                  description: e instanceof Error ? e.message : "Unknown error",
                  variant: "destructive",
                });
              }
            }}
            className={cn(
              "rounded-xl font-semibold",
              "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground",
              "shadow-[0_14px_40px_hsl(var(--primary)/0.22)]",
              "hover:shadow-[0_18px_55px_hsl(var(--primary)/0.28)] hover:-translate-y-0.5",
              "active:translate-y-0 active:shadow-[0_10px_30px_hsl(var(--primary)/0.20)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
              "transition-all duration-200 ease-out",
            )}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {create.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
