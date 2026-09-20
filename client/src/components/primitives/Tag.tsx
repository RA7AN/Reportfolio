import { cn } from "@/lib/utils";

export function Tag({
  children,
  tone = "neutral",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "accent";
  className?: string;
  "data-testid"?: string;
}) {
  const tones =
    tone === "primary"
      ? "border-primary/25 bg-primary/10 text-foreground"
      : tone === "accent"
        ? "border-accent/25 bg-accent/10 text-foreground"
        : "border-border/70 bg-card/60 text-muted-foreground";

  return (
    <span
      data-testid={dataTestId}
      className={cn(
        "inline-flex items-center gap-1",
        "px-2.5 py-1 rounded-full text-xs font-medium",
        "border",
        "backdrop-blur",
        tones,
        className,
      )}
    >
      {children}
    </span>
  );
}
