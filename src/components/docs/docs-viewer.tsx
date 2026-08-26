"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download, FileText, ListTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pluralRu } from "@/lib/utils";
import { DocList } from "./doc-list";
import { MarkdownContent } from "./markdown-content";
import { SiteHeader } from "./site-header";
import { TableOfContents } from "./table-of-contents";
import type { DocPayload } from "@/lib/docs-types";

export function DocsViewer({ docs }: { docs: DocPayload[] }) {
  const [activeSlug, setActiveSlug] = React.useState(docs[0]?.slug ?? "");
  const activeDoc = docs.find((doc) => doc.slug === activeSlug) ?? docs[0];

  const selectDoc = React.useCallback((slug: string) => {
    setActiveSlug(slug);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  if (!activeDoc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <p className="text-muted-foreground">Документы не найдены.</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="noise-overlay" aria-hidden="true" />

      <a
        href="#doc-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Перейти к содержимому
      </a>

      <SiteHeader docs={docs} activeDoc={activeDoc} onSelectDoc={selectDoc} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-start">
        {/* Left rail: document switcher (desktop) */}
        <aside
          className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-border/60 pt-[88px] lg:flex"
          aria-label="Документы"
        >
          <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Документы
          </p>
          <div className="px-3">
            <DocList docs={docs} activeSlug={activeDoc.slug} onSelect={selectDoc} />
          </div>
          <div className="mt-auto px-5 pb-6">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Основной документ открывается по умолчанию. Тематические источники доступны в этом
              списке.
            </p>
          </div>
        </aside>

        {/* Center column */}
        <main id="doc-content" className="min-w-0 flex-1">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="mesh-glow" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-10">
              <motion.div
                key={activeDoc.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-brand/40 bg-brand/10 px-2.5 text-[11px] font-medium text-brand"
                  >
                    {activeDoc.primary ? "Основной документ" : "Исходный документ"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full border-border/70 bg-muted/40 px-2.5 font-mono text-[11px] font-normal text-muted-foreground"
                  >
                    {activeDoc.fileName}
                  </Badge>
                </div>

                <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
                  {activeDoc.title}
                </h1>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {activeDoc.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Button
                    asChild
                    className="h-11 gap-2 rounded-lg bg-brand px-5 text-sm text-brand-foreground shadow-lg shadow-brand/25 hover:bg-brand/90"
                  >
                    <a
                      href={`/api/docs?file=${activeDoc.slug}`}
                      download
                      aria-label={`Скачать документ ${activeDoc.title} в формате Markdown`}
                    >
                      <Download className="size-4" aria-hidden="true" />
                      Скачать .md
                    </a>
                  </Button>
                  <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FileText className="size-3.5" aria-hidden="true" />
                      {activeDoc.lines} {pluralRu(activeDoc.lines, "строка", "строки", "строк")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ListTree className="size-3.5" aria-hidden="true" />
                      {activeDoc.sections}{" "}
                      {pluralRu(activeDoc.sections, "раздел", "раздела", "разделов")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Markdown content */}
          <motion.div
            key={activeDoc.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <article className="md-body mx-auto w-full max-w-3xl px-4 pb-28 sm:px-6 lg:px-10">
              <MarkdownContent content={activeDoc.content} />
            </article>
          </motion.div>
        </main>

        {/* Right sidebar: table of contents (desktop) */}
        <aside
          className="sticky top-0 hidden h-screen w-[256px] shrink-0 flex-col border-l border-border/60 pt-[88px] lg:flex"
          aria-label="Содержание документа"
        >
          <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Содержание
          </p>
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-6">
            <TableOfContents headings={activeDoc.toc} />
          </div>
        </aside>
      </div>

      <footer className="mt-auto border-t border-border/60 bg-background">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1.5 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Документация проекта</p>
          <p>
            {docs.length} {pluralRu(docs.length, "документ", "документа", "документов")} · Markdown
            · Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
