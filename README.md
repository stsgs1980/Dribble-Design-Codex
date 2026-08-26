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
- **Complete Tech Stack** — Tailwind CSS 4, Radix UI / Untitled UI, Framer Motion, Magic UI, React Spring
- **Data Visualization** — @xyflow/react (graphs), Tremor + Recharts (dashboards), react-syntax-highlighter
- **Advanced Animations** — staggered reveal, scroll-triggered, layout animations, number tickers, Lottie
- **Zero-dependency CSS Effects** — noise texture, glassmorphism, mesh gradients, animated borders, spotlight-hover
- **Icons** — Phosphor Icons (6 weights, duotone) + Iconify React (fallback)
- **Forms & State** — React Hook Form + Zod, Zustand, TanStack Query
- **Documentation** — built-in docs viewer with MDX, syntax highlighting, table of contents
- **TypeScript Strict Mode** — full typing, path aliases (@/*)
- **Code Quality** — ESLint 9 (flat config), Prettier, Husky, lint-staged, commitlint, custom rules (unicode-policy, code-block-language)

## Tech Stack

- **Runtime**: Node.js 20+, npm
- **Framework**: Next.js 16 (App Router, Turbopack, standalone output)
- **Language**: TypeScript 5 (strict, ES2022)
- **Styling**: Tailwind CSS 4 + @tailwindcss/postcss, clsx + tailwind-merge + cva
- **UI Primitives**: Radix UI (40+ components) / Untitled UI React
- **Animations**: Framer Motion 12, Magic UI, react-spring, auto-animate, Lenis
- **Data Viz**: @xyflow/react ^12 + dagre, Tremor, Recharts
- **Forms/Validation**: React Hook Form 7 + Zod 4
- **State**: Zustand 5 (client), TanStack Query 5 (server)
- **Icons**: Phosphor Icons (duotone) + Iconify React
- **Database**: Prisma 6 + SQLite
- **Linting**: ESLint 9 (flat), @eslint/markdown, eslint-plugin-jsdoc
- **Custom Rules**: unicode-policy (no emoji/unicode graphics), code-block-language (require language in fenced blocks)
- **Formatting**: Prettier 3 (double quotes, trailing commas, 100 width)
- **Git Hooks**: Husky 9 + lint-staged + @commitlint/config-conventional

## Screenshots

| Home Page                          | Docs Viewer                               | Components                                     |
| ---------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| ![Home](docs/screenshots/home.png) | ![Docs](docs/screenshots/docs-viewer.png) | ![Components](docs/screenshots/components.png) |

_Add screenshots to `docs/screenshots/` directory_

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
4. Initialize database:
   ```bash
   npm run db:push
   npm run db:generate
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Scripts

- `npm run dev` — start development server (Turbopack, port 3000)
- `npm run build` — production build (standalone output in .next/standalone/)
- `npm run start` — start production server
- `npm run lint` — run ESLint (0 errors policy)
- `npm run format` — format code with Prettier (`npx prettier --write .`)
- `npm run validate` — full validation (lint + typecheck + build)
- `npm run db:push` — Prisma db push (create schema in DB)
- `npm run db:generate` — Prisma generate (generate client)
- `npm run db:migrate` — Prisma migrate dev
- `npm run db:reset` — Prisma migrate reset

## Architecture

The project uses **Next.js App Router** with domain-based grouping:

```
src/
├── app/                    # App Router entry points
│   ├── api/               # API routes (docs, health)
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
    ├── db.ts              # Prisma client singleton
    ├── docs.ts            # Docs utilities (parsing, slugs)
    ├── docs-types.ts      # TypeScript types for docs
    └── utils.ts           # cn(), formatters, helpers
```

**Documentation** — in `docs/` (design-guide.md + sources/) and `src/components/docs/` (interactive viewer).

**Configuration** — root files: `eslint.config.mjs`, `tsconfig.base.json`, `tailwind.config.ts`, `next.config.ts`, `.prettierrc`, `.editorconfig`.

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

- All PRs must pass `npm run lint` (0 errors), `npx tsc --noEmit`, `npm run build`
- Commits — Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `perf:`)
- Branches — `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`, `test/*`

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
