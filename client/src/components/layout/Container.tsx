import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function Container({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", className)}>{children}</div>
  );
}
