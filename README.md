# Dribble Design Codex

> **Status**: ACTIVE
> **Last Updated**: 2026-08-27

## Overview

Dribble Design Codex — справочное руководство и пример реализации дизайн-системы уровня Dribbble на современном React-стеке. Проект демонстрирует лучшие практики типографики, анимаций, визуализации данных и UI-компонентов для создания «дорогого» и отзывчивого пользовательского интерфейса.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Дизайн-система уровня Dribbble** — типографика, пространство, цвет, иерархия (часть 1 гайда)
- **Полный технологический стек** — Tailwind CSS 4, Radix UI / Untitled UI, Framer Motion, Magic UI, React Spring
- **Визуализация данных** — @xyflow/react (графы), Tremor + Recharts (дашборды), react-syntax-highlighter
- **Продвинутые анимации** — staggered reveal, scroll-triggered, layout animations, number tickers, Lottie
- **CSS-эффекты без зависимостей** — noise-текстура, glassmorphism, mesh-градиенты, animated borders, spotlight-hover
- **Иконки** — Phosphor Icons (6 стилей, duotone) + Iconify React (резерв)
- **Формы и состояние** — React Hook Form + Zod, Zustand, TanStack Query
- **Документация** — встроенный docs-viewer с MDX, подсветкой кода, оглавлением
- **TypeScript strict mode** — полная типизация, path aliases (@/*)
- **Качество кода** — ESLint 9 (flat config), Prettier, Husky, lint-staged, commitlint, custom rules (unicode-policy, code-block-language)

## Tech Stack

- **Runtime**: Node.js 20+, npm
- **Framework**: Next.js 16 (App Router, Turbopack, standalone output)
- **Language**: TypeScript 5 (strict, ES2022)
- **Styling**: Tailwind CSS 4 + @tailwindcss/postcss, clsx + tailwind-merge + cva
- **UI Primitives**: Radix UI (40+ компонентов) / Untitled UI React
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

## Getting Started

### Prerequisites

- Node.js >= 20.12.0
- npm (входит в Node.js)

### Installation

1. Клонируйте репозиторий:
   ```bash
   git clone <repository-url>
   cd Dribble-Design-Codex
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Настройте переменные окружения:
   ```bash
   cp .env.example .env
   # Отредактируйте .env при необходимости
   ```
4. Инициализируйте базу данных:
   ```bash
   npm run db:push
   npm run db:generate
   ```
5. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
   Откройте http://localhost:3000

## Scripts

- `npm run dev` — запуск development сервера (Turbopack, порт 3000)
- `npm run build` — production сборка (standalone output в .next/standalone/)
- `npm run start` — запуск production сервера
- `npm run lint` — проверка кода через ESLint (0 errors policy)
- `npm run format` — форматирование кода через Prettier (`npx prettier --write .`)
- `npm run validate` — комплексная проверка (lint + typecheck + build)
- `npm run db:push` — Prisma db push (создание схемы в БД)
- `npm run db:generate` — Prisma generate (генерация клиента)
- `npm run db:migrate` — Prisma migrate dev
- `npm run db:reset` — Prisma migrate reset

## Architecture

Проект использует **Next.js App Router** с группировкой по доменам:

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

**Документация** — в `docs/` (design-guide.md + sources/) и `src/components/docs/` (интерактивный просмотрщик).

**Конфигурация** — корневые файлы: `eslint.config.mjs`, `tsconfig.base.json`, `tailwind.config.ts`, `next.config.ts`, `.prettierrc`, `.editorconfig`.

## Contributing

1. Создайте новую ветку: `git checkout -b feat/your-feature` (или `fix/`, `refactor/`, `docs/`, `chore/`)
2. Внесите изменения, следуя код-стайлу (Prettier + ESLint)
3. Сделайте коммит (Conventional Commits):
   ```bash
   git commit -m "feat: add your feature"
   ```
   Husky автоматически запустит `prettier --write` и `eslint --fix` на staged файлах
4. Отправьте изменения: `git push origin feat/your-feature`
5. Создайте Pull Request

**Правила**:

- Все PR должны проходить `npm run lint` (0 errors), `npx tsc --noEmit`, `npm run build`
- Коммиты — Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `perf:`)
- Ветки — `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`, `test/*`

## License

Этот проект распространяется под лицензией MIT.
