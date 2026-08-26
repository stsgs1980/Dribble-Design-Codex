"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DocIcon } from "./doc-icon";
import type { DocPayload } from "@/lib/docs-types";

export function DocList({
  docs,
  activeSlug,
  onSelect,
  className,
}: {
  docs: DocPayload[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  className?: string;
}) {
  return (
    <nav aria-label="Документы" className={cn("flex flex-col gap-1.5", className)}>
      {docs.map((doc) => {
        const active = doc.slug === activeSlug;
        return (
          <button
            key={doc.slug}
            type="button"
            onClick={() => onSelect(doc.slug)}
            aria-current={active ? "page" : undefined}
            title={doc.title}
            className={cn(
              "group relative w-full rounded-lg border px-2.5 py-2 text-left transition-all duration-200",
              active
                ? "border-brand/40 bg-brand/[0.08]"
                : "border-transparent hover:border-border/70 hover:bg-muted/60",
            )}
          >
            <span className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors",
                  active
                    ? "border-brand/40 bg-brand/15 text-brand"
                    : doc.primary
                      ? "border-brand/30 bg-brand/10 text-brand"
                      : "border-border/70 bg-muted/50 text-muted-foreground group-hover:text-foreground",
                )}
              >
                <DocIcon icon={doc.icon} className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "truncate text-[13.5px] font-medium leading-5",
                      active ? "text-foreground" : "text-foreground/85",
                    )}
                  >
                    {doc.short}
                  </span>
                  {doc.primary && (
                    <Badge className="h-[17px] shrink-0 rounded-full border border-brand/30 bg-brand/10 px-1.5 text-[10px] font-medium text-brand">
                      Основной
                    </Badge>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {doc.subtitle}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
