# Dribble Design Codex

> **Status**: ACTIVE
> **Last Updated**: 2026-08-27

[![CI](https://github.com/stsgs1980/Dribble-Design-Codex/actions/workflows/ci.yml/badge.svg)](https://github.com/stsgs1980/Dribble-Design-Codex/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg)](https://tailwindcss.com/)

Dribble Design Codex is a reference guide and reference implementation of a Dribbble-level design system built with a modern React stack. It demonstrates best practices for typography, animations, data visualization, and UI components to create premium, responsive user interfaces.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dribbble-level Design System** — typography, spacing, color, hierarchy (Part 1 of the guide)
- **Styling** — Tailwind CSS 4 (CSS-first `@theme`), clsx + tailwind-merge + cva
- **UI Primitives** — Radix UI (shadcn/ui), 45+ components in `src/components/ui/`
- **Animations** — Framer Motion 12 (scroll reveal, hero transitions, reading progress)
- **Documentation** — built-in docs viewer with markdown, syntax highlighting, table of contents
- **Theming** — next-themes with class strategy and no-flash init
- **TypeScript Strict Mode** — full typing, path aliases (@/*)
- **Code Quality** — ESLint 9 (flat config), Prettier, Husky, lint-staged, commitlint, custom rules (unicode-policy, code-block-language)

## Tech Stack

- **Runtime**: Node.js 20+, npm
- **Framework**: Next.js 16 (App Router, Turbopack, standalone output)
- **Language**: TypeScript 5 (strict, ES2022)
- **Styling**: Tailwind CSS 4 + @tailwindcss/postcss, clsx + tailwind-merge + cva
- **UI Primitives**: Radix UI / shadcn/ui (45+ components in `src/components/ui/`)
- **Animations**: Framer Motion 12
- **Content**: react-markdown + remark-gfm + rehype-slug, react-syntax-highlighter (Prism)
- **Icons**: lucide-react
- **Theming**: next-themes
- **Linting**: ESLint 9 (flat), @eslint/markdown, eslint-plugin-jsdoc
- **Custom Rules**: unicode-policy (no emoji/unicode graphics), code-block-language (require language in fenced blocks)
- **Formatting**: Prettier 3 (double quotes, trailing commas, 100 width, LF)
- **Git Hooks**: Husky 9 + lint-staged + @commitlint/config-conventional

## Getting Started

### Prerequisites

- Node.js >= 20.12.0
- npm (included with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/stsgs1980/Dribble-Design-Codex.git
   cd Dribble-Design-Codex
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

The app reads its documents from `docs/` on every request, so there is no
build step and no database to initialize — `.env` is only required if you
intend to use the unused Prisma scaffold in `prisma/` and `src/lib/db.ts`.

## Scripts

- `npm run dev` — start development server (Turbopack, port 3000)
- `npm run build` — production build (standalone output in .next/standalone/)
- `npm run start` — start production server
- `npm run lint` — run ESLint (0 errors policy)
- `npm run typecheck` — type check (`tsc --noEmit`)
- `npm run format` — format code with Prettier
- `npm run format:check` — verify formatting without writing
- `npm run validate` — full validation (lint + typecheck + build)
- `npm run db:push` — Prisma db push (unused scaffold, requires `DATABASE_URL`)
- `npm run db:generate` — Prisma generate (unused scaffold)
- `npm run db:migrate` — Prisma migrate dev
- `npm run db:reset` — Prisma migrate reset

## Architecture

The project uses **Next.js App Router** with domain-based grouping:

```
src/
├── app/                    # App Router entry points
│   ├── api/
│   │   └── docs/route.ts   # Markdown download (whitelisted slugs only)
│   ├── globals.css        # Global styles + CSS variables
│   ├── layout.tsx         # Root layout + providers
│   └── page.tsx           # Home page
├── components/
│   ├── docs/              # Documentation viewer components
│   │   ├── code-block.tsx
│   │   ├── doc-icon.tsx
│   │   ├── doc-list.tsx
│   │   ├── docs-viewer.tsx
│   │   ├── markdown-content.tsx
│   │   ├── site-header.tsx
│   │   └── table-of-contents.tsx
│   ├── ui/                # 45+ UI primitives (Radix-based)
│   │   ├── accordion.tsx ... tooltip.tsx
│   │   └── sonner.tsx     # Toast notifications
│   └── theme-provider.tsx # next-themes provider
├── hooks/
│   ├── use-mobile.ts      # Mobile breakpoint detection
│   └── use-toast.ts       # Toast hook wrapper
└── lib/
    ├── db.ts              # Prisma client singleton (unused scaffold)
    ├── docs.ts            # Docs registry, file IO, TOC extraction
    ├── docs-types.ts      # TypeScript types for docs
    └── utils.ts           # cn(), pluralRu()
```

**Documentation** — in `docs/` (design-guide.md + sources/) and `src/components/docs/` (interactive viewer). The registry in `src/lib/docs.ts` is the whitelist: `/api/docs?file=<slug>` only serves slugs listed there, so path traversal is impossible by construction.

**Configuration** — root files: `eslint.config.mjs`, `tsconfig.base.json`, `tailwind.config.ts`, `next.config.ts`, `.prettierrc`, `.editorconfig`, `.gitattributes`.

## Contributing

1. Create a new branch: `git checkout -b feat/your-feature` (or `fix/`, `refactor/`, `docs/`, `chore/`)
2. Make changes following code style (Prettier + ESLint)
3. Commit (Conventional Commits):
   ```bash
   git commit -m "feat: add your feature"
   ```
   Husky automatically runs `prettier --write` and `eslint --fix` on staged files
4. Push changes: `git push origin feat/your-feature`
5. Create a Pull Request

**Rules**:

- All PRs must pass `npm run validate` (lint + typecheck + build) and `npm run format:check`
- Commits — Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `perf:`)
- Branches — `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`, `test/*`

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
