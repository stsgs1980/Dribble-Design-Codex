"use client";

import * as React from "react";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/docs-types";

/**
 * Vertical offset for the scroll-spy: slightly more than the headings
 * scroll-mt-24 (96px) so a section reached via anchor click is highlighted
 * immediately even with sub-pixel rounding.
 */
const SPY_OFFSET = 104;

export function TableOfContents({
  headings,
  className,
}: {
  headings: TocHeading[];
  className?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [activeId, setActiveId] = React.useState<string>(
    headings[0]?.id ?? "",
  );

  // Reset the highlight when the document changes.
  React.useEffect(() => {
    setActiveId(headings[0]?.id ?? "");
    setQuery("");
  }, [headings]);

  // Scroll-spy: highlights the section currently in view.
  React.useEffect(() => {
    if (headings.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      let currentId = headings[0].id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= SPY_OFFSET) {
          currentId = heading.id;
        } else {
          break;
        }
      }
      const documentElement = document.documentElement;
      if (
        window.scrollY + window.innerHeight >=
        documentElement.scrollHeight - 80
      ) {
        currentId = headings[headings.length - 1].id;
      }
      setActiveId(currentId);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return headings;
    return headings.filter((heading) =>
      heading.text.toLowerCase().includes(normalized),
    );
  }, [headings, query]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Фильтр по заголовкам..."
          aria-label="Фильтр по заголовкам"
          className="h-9 border-border/70 bg-muted/40 pl-8 text-[13px] placeholder:text-muted-foreground/70"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 px-2 text-[13px] text-muted-foreground">
          <SearchX className="size-3.5 shrink-0" aria-hidden="true" />
          Ничего не найдено
        </p>
      ) : (
        <ScrollArea className="toc-scroll -mr-3 mt-3 min-h-0 flex-1">
          <nav
            aria-label="Содержание документа"
            className="flex flex-col gap-0.5 pr-2 pb-4"
          >
            {filtered.map((heading) => {
              const isActive = heading.id === activeId;
              return (
                <button
                  key={heading.id}
                  type="button"
                  onClick={() => scrollTo(heading.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative min-h-11 w-full rounded-md py-2 pr-2 text-left text-[13px] leading-snug transition-colors lg:min-h-0 lg:py-1.5",
                    heading.depth === 2
                      ? "pl-4 font-medium"
                      : "pl-9 font-normal",
                    isActive
                      ? "text-brand"
                      : "text-foreground/65 hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {heading.depth === 2 && (
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-brand transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  )}
                  {heading.text}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      )}

      {query.trim() !== "" && filtered.length > 0 && (
        <p className="mt-2 shrink-0 px-2 text-xs text-muted-foreground">
          {filtered.length} из {headings.length}
        </p>
      )}
    </div>
  );
}
