"use client";

import { BookOpen, Compass, Layers, Palette, Workflow, type LucideIcon } from "lucide-react";
import type { DocIconKey } from "@/lib/docs-types";

const iconMap: Record<DocIconKey, LucideIcon> = {
  book: BookOpen,
  palette: Palette,
  layers: Layers,
  workflow: Workflow,
  compass: Compass,
};

export function DocIcon({ icon, className }: { icon: DocIconKey; className?: string }) {
  const Icon = iconMap[icon] ?? BookOpen;
  return <Icon className={className} aria-hidden="true" />;
}
