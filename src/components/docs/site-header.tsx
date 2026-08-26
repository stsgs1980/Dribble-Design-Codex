"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { Download, Layers, ListTree, Moon, PanelLeft, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { pluralRu } from "@/lib/utils";
import { DocList } from "./doc-list";
import { TableOfContents } from "./table-of-contents";
import type { DocPayload } from "@/lib/docs-types";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 lg:size-9"
      aria-label="Переключить тему"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-[18px] hidden dark:block" aria-hidden="true" />
      <Moon className="size-[18px] dark:hidden" aria-hidden="true" />
    </Button>
  );
}

export function SiteHeader({
  docs,
  activeDoc,
  onSelectDoc,
}: {
  docs: DocPayload[];
  activeDoc: DocPayload;
  onSelectDoc: (slug: string) => void;
}) {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [docsOpen, setDocsOpen] = React.useState(false);
  const [tocOpen, setTocOpen] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const isScrolled = value > 32;
    setScrolled((previous) => (previous === isScrolled ? previous : isScrolled));
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  const handleSelect = (slug: string) => {
    onSelectDoc(slug);
    setDocsOpen(false);
  };

  return (
    <motion.header
      initial={false}
      animate={{ height: scrolled ? 56 : 64 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full shrink-0 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center gap-2 px-4 sm:px-6">
        {/* Documents sheet (mobile) */}
        <Sheet open={docsOpen} onOpenChange={setDocsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 lg:hidden"
              aria-label="Открыть список документов"
            >
              <PanelLeft className="size-[18px]" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] gap-0 border-border/60 p-0"
          >
            <SheetHeader className="border-b border-border/60 px-5 py-4">
              <SheetTitle className="text-base">Документы</SheetTitle>
              <SheetDescription className="text-xs">
                {docs.length}{" "}
                {pluralRu(docs.length, "документ", "документа", "документов")}{" "}
                дизайн-системы
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <DocList
                docs={docs}
                activeSlug={activeDoc.slug}
                onSelect={handleSelect}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand shadow-[0_0_20px_-6px_var(--brand)]">
            <Layers className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 flex-col leading-tight min-[420px]:flex">
            <span className="truncate text-[13px] font-semibold tracking-tight">
              Дизайн-документация
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {activeDoc.short}
            </span>
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Download current document (desktop) */}
          <Button
            asChild
            variant="ghost"
            className="hidden h-11 gap-2 text-[13px] text-muted-foreground hover:text-foreground sm:inline-flex lg:h-8"
          >
            <a
              href={`/api/docs?file=${activeDoc.slug}`}
              download
              aria-label={`Скачать документ ${activeDoc.title} в формате Markdown`}
            >
              <Download className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">Скачать .md</span>
            </a>
          </Button>

          {/* Table of contents sheet (mobile) */}
          <Sheet open={tocOpen} onOpenChange={setTocOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 lg:hidden"
                aria-label="Открыть содержание"
              >
                <ListTree className="size-[18px]" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] gap-0 border-border/60 p-0"
            >
              <SheetHeader className="border-b border-border/60 px-5 py-4">
                <SheetTitle className="text-base">Содержание</SheetTitle>
                <SheetDescription className="truncate text-xs">
                  {activeDoc.title}
                </SheetDescription>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col p-4">
                <TableOfContents headings={activeDoc.toc} />
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
        </div>
      </div>

      {/* Reading progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-linear-to-r from-brand via-brand to-brand/70"
        aria-hidden="true"
      />
    </motion.header>
  );
}
