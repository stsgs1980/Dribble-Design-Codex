# Единый гайд по дизайну интерфейсов уровня Dribbble

**Версия:** 1.0
**Область применения:** веб-приложения и сайты на Next.js / React / TypeScript
**Статус:** рабочий стандарт дизайна
**Основа:** консолидация четырёх источников (фундамент дизайна, модель слоёв Dribbble-уровня, стек на Untitled UI + React Flow, полный гайд по стеку). Документ универсален и не привязан к конкретному продукту или задаче.

---

## Содержание

1. [Введение](#1-введение)
2. [Фундамент дизайна: четыре кита](#2-фундамент-дизайна-четыре-кита)
3. [Архитектура визуальных слоёв](#3-архитектура-визуальных-слоёв)
4. [Технологический стек: обзор и выбор UI-пути](#4-технологический-стек-обзор-и-выбор-ui-пути)
5. [Типографика и шрифты](#5-типографика-и-шрифты)
6. [Цвет, контраст и пространство](#6-цвет-контраст-и-пространство)
7. [CSS-эффекты без зависимостей](#7-css-эффекты-без-зависимостей)
8. [Анимации](#8-анимации)
9. [Иконки](#9-иконки)
10. [Node-based графы: React Flow](#10-node-based-графы-react-flow)
11. [Визуализация данных](#11-визуализация-данных)
12. [Иллюстрации и 3D](#12-иллюстрации-и-3d)
13. [Состояние, данные и формы](#13-состояние-данные-и-формы)
14. [Доступность (a11y)](#14-доступность-a11y)
15. [Адаптивность](#15-адаптивность)
16. [Производительность](#16-производительность)
17. [Каталог анимаций интерфейса](#17-каталог-анимаций-интерфейса)
18. [Приоритеты внедрения](#18-приоритеты-внедрения)
19. [Чек-лист качества](#19-чек-лист-качества)
20. [Насмотренность (Visual Library)](#20-насмотренность-visual-library)
21. [Практика: метод осознанного клонирования](#21-практика-метод-осознанного-клонирования)
22. [AI как помощник](#22-ai-как-помощник)
23. [Приложение A. Полная карта стека](#приложение-a-полная-карта-стека)
24. [Приложение B. Требования к Markdown-документации](#приложение-b-требования-к-markdown-документации)
25. [Приложение C. Связанные документы](#приложение-c-связанные-документы)

---

## 1. Введение

### 1.1. Цель

Документ консолидирует все правила, инструменты и практики, необходимые для создания интерфейсов визуального уровня Dribbble: уровня Linear, Vercel, Raycast, Resend. Гайд объединяет фундаментальные принципы дизайна и полный технологический стек их реализации.

### 1.2. Философия: правила важнее инструментов

Крутой дизайн строится на правилах, а не на интуиции. Ни одна библиотека не спасёт интерфейс, в котором нарушена типографика, иерархия или сетка отступов. Поэтому порядок чтения строгий: сначала фундамент (раздел 2), потом слои и стек (разделы 3-13), и только затем полировка — эффекты, анимации, 3D.

### 1.3. Как пользоваться гайдом

- Проектируете новый продукт — читайте разделы по порядку.
- Улучшаете существующий интерфейс — начните с приоритетов внедрения (раздел 18) и чек-листа (раздел 19).
- Выбираете библиотеку — смотрите полную карту стека (приложение A) и раздел соответствующей категории.

---

## 2. Фундамент дизайна: четыре кита

### 2.1. Типографика — 80% дизайна

Типографика влияет на восприятие интерфейса сильнее, чем любой другой фактор.

**Обязательные правила:**

- `line-height`: **1.5-1.7** для body-текста, **1.1-1.3** для крупных заголовков.
- `letter-spacing`: слегка отрицательный (-0.01em ... -0.02em) для крупных заголовков, нейтральный для body.
- Иерархия заголовков строится по шкале (см. раздел 5.3), а не "на глаз".
- Максимальная длина строки body-текста: **65-75 символов**.

**Шрифтовая система:**

| Роль | Шрифт | Обоснование |
|---|---|---|
| Заголовки | **Geist** (Vercel) / **Satoshi** (Fontshare) / Cabinet Grotesk | Выразительные, геометричные; Inter "переиспользован до смерти" |
| Body | **Inter** | Нейтральный, отлично читается |
| Код | **JetBrains Mono** | Стандарт для моноширинного кода |

Ключевой принцип: **замена заголовочного шрифта — минимальное изменение с максимальным эффектом**. Одно CSS-правило полностью меняет восприятие продукта.

### 2.2. Пространство (Whitespace) и 8px-сетка

- Все отступы и размеры кратны **8px** (допустим шаг 4px для мелких элементов).
- Не лепите элементы друг к другу — воздух делает дизайн дорогим.
- Если сомневаетесь — увеличивайте отступ, а не уменьшайте.

Шкала отступов и утилиты Tailwind — в разделе 6.4.

### 2.3. Цвет и контраст: правило 60-30-10

- **60%** — основной цвет (фон, нейтральные поверхности).
- **30%** — вторичный цвет (карточки, панели, приглушённые блоки).
- **10%** — акцентный цвет (кнопки, ссылки, активные состояния).

Всегда проверяйте контрастность текста: коэффициент не ниже **4.5:1** для основного текста и **3:1** для крупного (WCAG AA). Инструменты: Contrast Checker, встроенные аудиты браузеров.

### 2.4. Визуальная иерархия: правило 3 секунд

Пользователь за **3 секунды** должен понять:

1. Куда смотреть (доминирующий элемент).
2. Что читать (порядок чтения по убыванию веса).
3. Куда нажать (одна главная цель на экран).

### 2.5. Базовая литература

**"Refactoring UI"** (Adam Wathan, Steve Schoger) — библия для разработчиков, которые хотят научиться дизайну. Все принципы из этого раздела раскрыты там с примерами.

---

## 3. Архитектура визуальных слоёв

Dribbble-уровень — это не одна библиотека, а **слои**. Каждый следующий слой усиливает предыдущий. Пропуск нижних слоёв делает верхние бессмысленными.

| Слой | Состав | Вклад в результат |
|---|---|---|
| 1. База | shadcn/ui + Radix (или Untitled UI + React Aria), Tailwind CSS 4, Motion, Tremor | Около 40% визуального уровня |
| 2. Анимированные компоненты | Magic UI: shimmer-border, animated beam, marquee, number ticker, dock, meteors, particles, border-beam | Переход с "хорошо" на "замечательно" |
| 3. Типографика | Geist / Satoshi для заголовков, Inter для body, JetBrains Mono для кода | Выразительность, отстройка от шаблонных SaaS |
| 4. Иконки | Phosphor Icons (duotone) как основной набор, Iconify как резерв | Глубина и премиальность |
| 5. Текстуры и эффекты | Noise, glassmorphism, mesh-градиенты, grain, animated borders, spotlight, Lenis | "Тактильность" и кинематографичность |
| 6. Иллюстрации и графика | Spline (3D hero), lottie-react (состояния), SVG-иллюстрации | "Тот самый" момент продукта |

**Формула итогового рецепта:**

```text
Базовый стек (UI-кит + Tailwind 4 + Motion + Tremor)
  + Magic UI          (анимированные компоненты)
  + Phosphor Icons    (или Iconify)
  + Geist / Satoshi   (заголовочный шрифт)
  + Lenis             (smooth scroll)
  + lottie-react      (анимации пустых состояний)
  + SVG noise-текстура (CSS-фильтр, без зависимостей)
  + Spline            (опционально, для hero)
```

---

## 4. Технологический стек: обзор и выбор UI-пути

### 4.1. Фундамент

| Технология | Роль |
|---|---|
| Next.js (App Router) | Фреймворк, маршрутизация, SSR/SSG, оптимизация |
| React 19 | UI-рантайм |
| TypeScript 5.9 | Строгая типизация |
| Tailwind CSS 4 + @tailwindcss/postcss | Утилитарный CSS: системность отступов, цветов, радиусов |

### 4.2. UI-слой: два равноценных пути

**Путь A: shadcn/ui + Radix**

| Библиотека | Роль |
|---|---|
| shadcn/ui | Компоненты через CLI (`npx shadcn add`), код принадлежит вам |
| Radix UI | Headless-примитивы доступности под капотом shadcn |

**Путь B: Untitled UI React + React Aria**

| Библиотека | Версия | Роль |
|---|---|---|
| Untitled UI React | latest | Основа: кнопки, инпуты, карточки, таблицы, модалки, дропдауны, аватары, breadcrumbs |
| React Aria | ^1.20 | Accessibility-примитивы (заменяет Radix) |

**Критерии выбора:**

| Критерий | shadcn/ui + Radix | Untitled UI + React Aria |
|---|---|---|
| Начальный вид | Требует настройки | Премиальный из коробки: скругления, тени, спейсинг настроены |
| Контроль кода | Полный (компоненты в репозитории) | Ограничен API библиотеки |
| Установка компонентов | CLI одной командой | Импорт из пакета |
| Magic UI | Подключается через CLI | Ручная интеграция (перезапись примитивов) |
| Кому подходит | Команды, которым нужен контроль | Быстрый запуск с "дизайнерским" видом |

Оба пути строятся поверх Tailwind CSS 4 и совместимы со всем остальным стеком этого гайда.

**Почему в паре с Untitled UI указан React Aria, а не React Flow.** Путь B зеркально повторяет архитектуру пути A: Untitled UI заменяет shadcn/ui как библиотека компонентов, React Aria заменяет Radix как headless-примитивы доступности. React Flow (@xyflow/react) к выбору UI-кита отношения не имеет: библиотека ортогональна UI-слою, одинаково работает с обоими путями и поэтому вынесена в отдельный раздел 10. Связка "Untitled UI + React Flow" в названии одного из исходных документов описывала конкретный вариант стека целиком, а не зависимость между этими библиотеками.

### 4.3. Утилиты слияния классов (нужны на обоих путях)

| Библиотека | Версия | Роль |
|---|---|---|
| clsx | ^2.1 | Условное построение строк классов |
| tailwind-merge | ^3.6 | Корректное слияние конфликтующих Tailwind-классов |
| class-variance-authority (cva) | ^0.7 | Декларативные вариации компонентов |

Утилита `cn()` — стандарт для всех компонентов проекта:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Вариации компонентов через cva:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-transparent hover:bg-muted",
        ghost: "hover:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;
```

---

## 5. Типографика и шрифты

### 5.1. Шрифтовая система

| Роль | Основной вариант | Альтернативы |
|---|---|---|
| Заголовки (display, h1-h3) | **Geist** | Satoshi, Cabinet Grotesk |
| Body-текст | **Inter** | — |
| Код, моноширинный | **JetBrains Mono** | — |

Правило отстройки: Inter для заголовков "переиспользован до смерти" — каждый второй SaaS собран на нём. Выразительный гротеск для заголовков + нейтральный Inter для body — рабочая пара уровня Linear/Vercel.

### 5.2. Подключение через next/font

```tsx
import { Geist, Inter, JetBrains_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

```css
/* globals.css: назначение ролей */
h1, h2, h3, h4 {
  font-family: var(--font-heading), ui-sans-serif, system-ui, sans-serif;
}

body {
  font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
}

code, pre, kbd {
  font-family: var(--font-mono), ui-monospace, monospace;
}
```

### 5.3. Типографическая шкала

| Уровень | Размер / line-height | letter-spacing | Tailwind |
|---|---|---|---|
| Display | 48-60px / 1.1 | -0.02em | `text-5xl md:text-6xl leading-[1.1] tracking-tight` |
| H1 | 36-40px / 1.2 | -0.01em | `text-4xl leading-tight tracking-tight` |
| H2 | 24-28px / 1.3 | -0.01em | `text-2xl md:text-3xl leading-snug tracking-tight` |
| H3 | 20px / 1.4 | 0 | `text-xl leading-normal` |
| Body | 16px / 1.6 | 0 | `text-base leading-relaxed` |
| Small | 14px / 1.5 | 0 | `text-sm leading-normal` |
| Caption | 12-13px / 1.5 | +0.01em | `text-xs text-muted-foreground` |

### 5.4. Правила применения

1. **Одно правило — один эффект:** замена заголовочного шрифта на Geist/Satoshi меняет восприятие продукта целиком.
2. Заголовки не набираются Inter — только display-гротеск из системы.
3. Не более двух семейств на странице + моноширинный для кода.
4. Длина строки body — 65-75 символов (`max-w-prose` или `max-w-[65ch]`).

---

## 6. Цвет, контраст и пространство

### 6.1. Распределение 60-30-10 на практике

| Доля | Роль | Пример в тёмной теме |
|---|---|---|
| 60% | Фон и базовые поверхности | background, зонах без содержимого |
| 30% | Вторичные поверхности | карточки, панели, сайдбар, таблицы |
| 10% | Акцент | primary-кнопки, ссылки, активные состояния, бейджи |

Акцентный цвет не используется для декоративных элементов — только для действий и состояний.

### 6.2. Контраст

- Body-текст: **4.5:1** и выше (WCAG AA).
- Крупный текст (18px+ / 14px bold+): **3:1** и выше.
- Проверка: Contrast Checker, Lighthouse-аудит.
- Приглушённый текст (`muted-foreground`) — тоже текст: проверяйте его контраст, а не только основной.

### 6.3. Семантические токены через CSS-переменные

Цвета применяются только через семантические токены, никогда — напрямую HEX-значениями в компонентах.

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --border: oklch(1 0 0 / 10%);
  --ring: oklch(0.556 0 0);
}
```

### 6.4. Шкала отступов (8px grid)

| Токен | Значение | Tailwind | Применение |
|---|---|---|---|
| xs | 4px | `p-1 gap-1` | Плотные элементы: теги, иконки в кнопках |
| sm | 8px | `p-2 gap-2` | Внутренние отступы мелких компонентов |
| md | 12px | `p-3 gap-3` | Отступы внутри кнопок, инпутов |
| lg | 16px | `p-4 gap-4` | Внутренние отступы карточек |
| xl | 24px | `p-6 gap-6` | Отступы карточек, между блоками |
| 2xl | 32px | `p-8 gap-8` | Между секциями внутри блока |
| 3xl | 48px | `p-12 gap-12` | Между крупными секциями |
| 4xl | 64px | `p-16 gap-16` | Секции лендинга |
| 5xl | 96px | `p-24 gap-24` | Hero-блоки |

### 6.5. Скругления и тени

- Система радиусов: `--radius: 0.625rem` (10px); производные `sm/md/lg/xl` через `calc()`.
- Тени — мягкие, многослойные, а не жёсткие чёрные: низкая непрозрачность + большой blur.
- Единство важнее "красоты": один радиус для всех карточек, один для кнопок.

---

## 7. CSS-эффекты без зависимостей

Все эффекты раздела — чистый CSS (или CSS + пара строк JS). Суммарно около 30 строк кода добавляют интерфейсу "тактильность" уровня Linear/Vercel/Raycast.

### 7.1. Noise-текстура

Тонкая "аналоговая" текстура на фон всей страницы. Реализация — SVG-фильтр `feTurbulence`, применяется как fixed-оверлей.

```css
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### 7.2. Grain overlay

Отличие от noise: крупное зерно. Применяется точечно — на hero и CTA-блоки, для кинематографичности. Тот же `feTurbulence`, но `baseFrequency` меньше (крупнее зерно) и opacity выше (0.04-0.06).

### 7.3. Glassmorphism

Полупрозрачное "стекло" с размытием фона. Применение: навбар, модалки, floating-панели, тултипы.

```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

Тёмная тема: фон `rgba(20, 20, 20, 0.6)`, граница `rgba(255, 255, 255, 0.08)`.

### 7.4. Mesh-градиенты

Слои `radial-gradient` создают "дорогой" фон для hero, дашбордов и пустых состояний.

```css
.mesh-gradient {
  background:
    radial-gradient(at 20% 20%, rgba(99, 102, 241, 0.15) 0, transparent 50%),
    radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.10) 0, transparent 50%),
    radial-gradient(at 50% 50%, rgba(16, 185, 129, 0.05) 0, transparent 50%);
}
```

### 7.5. Анимированные градиентные границы

Обводка карточек и активных элементов "бегает" градиентом. Современная реализация — `@property` + `conic-gradient`:

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.animated-border {
  position: relative;
  background:
    linear-gradient(var(--card), var(--card)) padding-box,
    conic-gradient(from var(--angle), transparent 20%, oklch(0.7 0.15 160) 50%, transparent 80%)
      border-box;
  border: 1px solid transparent;
  animation: spin-angle 4s linear infinite;
}

@keyframes spin-angle {
  to {
    --angle: 360deg;
  }
}
```

Альтернатива без ручного кода — компонент `shimmer-border` из Magic UI.

### 7.6. Spotlight-hover

Мягкое свечение следует за курсором на фоне карточки — как у Stripe и Linear.

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.08), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
```

### 7.7. Современный CSS в арсенале

| Фича | Применение |
|---|---|
| `@property` | Типизированные CSS-переменные — анимация градиентов и углов |
| `backdrop-filter` | Glassmorphism, размытие навбара при скролле |
| `mix-blend-mode` | Смешивание слоёв текста и графики |
| CSS Grid `subgrid` | Точное выравнивание вложенных сеток карточек |

---

## 8. Анимации

### 8.1. Принципы

**Длительности:**

| Тип | Длительность | Примеры |
|---|---|---|
| Микро-взаимодействия | 100-200ms | Hover кнопки, чекбокс |
| Переходы состояний | 200-400ms | Появление дропдауна, смена таба |
| Появление/исчезновение | 300-500ms | Модалки, страницы, тосты |
| Декоративные фоны | 3-10s и бесконечно | Mesh, marquee, beam |

**Жёсткие правила:**

1. Анимируются только `transform` и `opacity` (compositor-friendly). `width`/`height`/`top`/`left` — запрещены.
2. Easing: вход — `ease-out`, выход — `ease-in`, перемещение — `ease-in-out` или физика пружин.
3. Обязательна поддержка `prefers-reduced-motion`: декоративные анимации отключаются.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.2. Motion / Framer Motion — база

Версия: **^13** (пакет `motion` или `framer-motion`). Абсолютный маст-хэв для React.

Освоение по порядку: `initial` / `animate` / `whileHover`, затем `AnimatePresence` (mount/unmount), затем `layout` (перестроения сеток) и `useInView` (reveal при скролле).

Scroll-reveal секций:

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
```

Staggered reveal карточек (каскад):

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {children}
    </motion.div>
  );
}
```

Смена шагов мастера (wizard) через `AnimatePresence`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -320 : 320, opacity: 0 }),
};

export function WizardSteps({ steps }: { steps: React.ReactNode[] }) {
  const [[index, direction], setStep] = useState<[number, number]>([0, 0]);

  function go(delta: number) {
    setStep(([prev]) => [
      Math.min(Math.max(prev + delta, 0), steps.length - 1),
      delta,
    ]);
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {steps[index]}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex gap-2">
        <button onClick={() => go(-1)}>Назад</button>
        <button onClick={() => go(1)}>Далее</button>
      </div>
    </div>
  );
}
```

### 8.3. Magic UI — анимированные компоненты

Именно Magic UI даёт "Dribbble-эффекты". Состав:

| Компонент | Применение |
|---|---|
| `shimmer-button`, `shimmer-border` | CTA-кнопки и карточки с бегущим свечением |
| `animated-beam` | Визуализация потока между узлами (графы, пайплайны) |
| `marquee` | Бесконечные ленты логотипов, тегов |
| `number-ticker` | Счётчики метрик при появлении в вьюпорте |
| `dock` | Панель иконок с эффектом увеличения (macOS Dock) |
| `meteors`, `particles`, `grid-pattern` | Декоративные фоны hero-секций |
| `border-beam` | Луч света, бегущий по границе карточки |
| `animated-grid-pattern`, `dot-pattern` | Фоновые сетки и точки |

**Интеграция:**

- Путь A (shadcn/ui): установка одной командой CLI `npx shadcn add`.
- Путь B (Untitled UI): ручная интеграция — компоненты Magic UI это просто React + Tailwind + Motion, нужно переписать shadcn-примитивы на Untitled UI.

### 8.4. react-spring — физика

Версия: **^9**. Физические пружины для drag-интеракций и elastic-эффектов: перетаскивание нод в графах, "резиновые" элементы, инерция. Используется точечно там, где линейные easing-кривые ощущаются "мёртвыми".

### 8.5. auto-animate — списки

Версия: **^0.8**. Одна обёртка — и DOM-перестройки списка (добавление, удаление, сортировка) анимируются автоматически, без ручных keyframe. Идеально для списков задач, таблиц, фильтров.

```tsx
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";

export function AnimatedList({ items }: { items: string[] }) {
  const parent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);

  return (
    <ul ref={parent}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### 8.6. Lenis — плавный скролл

Версия: **^1**. Инерционный smooth scroll — базовый компонент "дорогого" ощущения всей страницы.

```tsx
"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

### 8.7. sonner — тосты

Версия: **^2**. Совместим с любым UI-китом. Тосты — обязательный канал обратной связи для асинхронных действий.

### 8.8. GSAP — сценарные анимации

Если нужно: сложный скролл-теллинг (ScrollTrigger), параллакс, анимация SVG-путей — GSAP мощнее Framer Motion для сценарных анимаций. Используется точечно на лендингах, не в продуктовом UI.

### 8.9. lottie-react — анимации состояний

Версия: **^2**. Lottie-анимации для пустых состояний, загрузки длительных операций, успешного завершения процессов.

Типовые сценарии:

| Сценарий | Что показывает |
|---|---|
| Обработка данных | Анимация "сканирования" |
| Трансформация | Разложение на слои или токены |
| Сборка результата | Компоновка блоков |
| Пустое состояние | Лампа с шестерёнками |

### 8.10. Выбор инструмента по задаче

| Задача | Инструмент первого выбора |
|---|---|
| Hover, появление, mount/unmount | Motion / Framer Motion |
| Перестроения сеток и списков | Motion `layout` + auto-animate |
| Поток между узлами графа | Magic UI `animated-beam` |
| Счётчики метрик | Magic UI `number-ticker` |
| Drag с физикой | react-spring |
| Скролл-теллинг, SVG-пути | GSAP |
| Плавность скролла страницы | Lenis |
| Пустые состояния, загрузки | lottie-react |
| Уведомления | sonner |

---

## 9. Иконки

### 9.1. Phosphor Icons — основной набор

Версия: **@phosphor-icons/react ^2**. Шесть стилей в одной библиотеке: `thin`, `light`, `regular`, `bold`, `fill`, **`duotone`**.

Стратегия duotone — главный приём: двухцветные иконки воспринимаются "дороже" и дают визуальную глубину, которой нет у Lucide:

- **duotone** — активные состояния, ключевые разделы, hero.
- **regular** — неактивные состояния, второстепенные действия.

```tsx
import { GearSix, House, MagnifyingGlass } from "@phosphor-icons/react";

export function NavIcons({ active }: { active: string }) {
  return (
    <nav className="flex items-center gap-4">
      <House
        size={24}
        weight={active === "home" ? "duotone" : "regular"}
        aria-hidden
      />
      <MagnifyingGlass size={24} weight="regular" aria-hidden />
      <GearSix size={24} weight={active === "settings" ? "duotone" : "regular"} aria-hidden />
    </nav>
  );
}
```

### 9.2. Iconify React — резерв

Версия: **^4**. Доступ к 150 000+ иконок из 100+ наборов (Phosphor, Tabler, Solar и другие) через единый `<Icon>` компонент. Используется, когда нужной иконки нет в основном наборе.

### 9.3. Lucide — базовый вариант

Функциональный, но скучный. Допустим как стартовый набор; для премиум-визуала заменяется на Phosphor. Смена набора — это типографически согласованная операция: одинаковые размеры, одинаковый stroke.

### 9.4. Правила применения

- Базовые размеры: 16 / 20 / 24px, кратны 4.
- Один визуальный вес в пределах группы; смешивание fill и outline в одной группе запрещено.
- Декоративные иконки получают `aria-hidden`, смысловые — `aria-label`.

---

## 10. Node-based графы: React Flow

### 10.1. Назначение

| Библиотека | Версия | Роль |
|---|---|---|
| @xyflow/react | ^12.x | Node-based графы: многоэтапные процессы, пайплайны, схемы данных, mind maps |
| @xyflow/react-controls | ^12.x | Мини-карта, зум, пан |
| dagre | ^0.8 | Автоматическая раскладка нод (top-to-bottom / left-to-right) |

React Flow превращает линейные индикаторы прогресса (степперы) в полноценный интерактивный граф: узлы — этапы процесса, рёбра — потоки данных между ними. Поддерживает drag & drop, кастомные ноды с превью, анимацию потока по рёбрам.

React Flow не зависит от выбора UI-пути (раздел 4.2): библиотека одинаково совместима и с shadcn/ui + Radix, и с Untitled UI + React Aria — она не является частью ни одного из UI-китов.

### 10.2. Автолэйаут через dagre

```ts
import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "LR",
): Node[] {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 48, ranksep: 64 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const position = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });
}
```

### 10.3. Кастомная нода

```tsx
"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function StageNode({ data }: NodeProps) {
  const stage = data as { title: string; status: "idle" | "running" | "done" };

  return (
    <div className="glass rounded-xl border p-4 shadow-lg">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <span
          className={
            stage.status === "done"
              ? "h-2 w-2 rounded-full bg-emerald-500"
              : stage.status === "running"
                ? "h-2 w-2 animate-pulse rounded-full bg-amber-500"
                : "h-2 w-2 rounded-full bg-muted"
          }
          aria-hidden
        />
        <span className="text-sm font-medium">{stage.title}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
```

### 10.4. Практики

- Панели и тултипы над графом — glassmorphism (раздел 7.3).
- Поток данных по рёбрам — Magic UI `animated-beam` или анимированный `stroke-dashoffset` в SVG-рёбрах.
- Drag нод с инерцией — react-spring.
- Обязательно подключайте `@xyflow/react-controls`: мини-карта, зум, пан для больших схем.

---

## 11. Визуализация данных

### 11.1. Tremor + recharts

| Библиотека | Версия | Роль |
|---|---|---|
| Tremor | ^3.18 | Дашборд-карточки, мини-графики, метрики |
| recharts | (в составе Tremor) | Полноценные графики |

Tremor закрывает 90% продуктовых задач визуализации: карточки метрик, спарклайны, area/bar/line-графики — всё в едином стиле с Tailwind.

### 11.2. react-syntax-highlighter

Версия: **^15**. Подсветка кода в превью и сниппетах.

```tsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodePreview({ code }: { code: string }) {
  return (
    <SyntaxHighlighter
      language="tsx"
      style={oneDark}
      showLineNumbers
      customStyle={{
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
```

---

## 12. Иллюстрации и 3D

### 12.1. Spline

Пакет: **@splinetool/react-spline**. Интерактивная 3D-сцена на hero-секции: реагирует на курсор, создаёт "тот самый" момент первого впечатления. Сцены собираются в редакторе Spline и встраиваются одним компонентом.

### 12.2. three.js + @react-three/fiber

Резерв для сложных 3D-сцен, возможностей Spline для которых недостаточно: кастомные шейдеры, процедурная геометрия, физика.

### 12.3. Lottie

Пакет: **lottie-react ^2**. Сценарии применения и типовые анимации — раздел 8.9. Анимации берутся с LottieFiles или заказываются у моушн-дизайнера.

### 12.4. React SVG Pan Zoom

Версия: **^3**. Зум и пан для больших SVG-превью (схемы, диаграммы, макеты).

### 12.5. SVG-иллюстрации

Онбординг, шаги мастеров, пустые состояния — рисованные SVG-иллюстрации + Lottie для анимированных вариантов.

---

## 13. Состояние, данные и формы

### 13.1. Разделение ответственности

| Библиотека | Версия | Зона ответственности |
|---|---|---|
| Zustand | ^5 | Клиентское состояние: UI-стор, настройки, локальный кэш |
| TanStack React Query | ^5 | Серверное состояние: запросы, кэш, фоновые обновления, инвалидация |

Правило: всё, что приходит с сервера, живёт в React Query. Всё, что порождается интерфейсом, — в Zustand. Дублирование запрещено.

### 13.2. Формы: React Hook Form + Zod

Версии: **react-hook-form ^7** + **zod ^4** (+ `@hookform/resolvers`). Совместимы и с shadcn/ui, и с Untitled UI.

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ onSubmit }: { onSubmit: (values: FormValues) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email ? <span role="alert">{errors.email.message}</span> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Пароль</label>
        <input id="password" type="password" {...register("password")} />
        {errors.password ? (
          <span role="alert">{errors.password.message}</span>
        ) : null}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}
```

---

## 14. Доступность (a11y)

Доступность — признак профессионала и обязательное требование к качеству.

- **Семантика:** `main`, `header`, `nav`, `section`, `article`; заголовки h1-h6 по иерархии без пропусков.
- **Клавиатура:** все интерактивные элементы доступны с клавиатуры; видимый `focus-visible` на каждом.
- **ARIA:** `aria-label` для иконочных кнопок, `aria-hidden` для декоративных иконок, `role="alert"` для ошибок.
- **Контраст:** раздел 6.2.
- **Reduced motion:** раздел 8.1.
- **Touch targets:** минимальная площадь касания 44x44px.
- **Экранные читалки:** `sr-only` классы для поясняющего текста.
- Оба UI-пути стека закрывают примитивы доступности: Radix (в shadcn) или React Aria (в Untitled UI).

---

## 15. Адаптивность

- **Mobile-first:** базовые стили — для мобильных, усложнение через `sm:` / `md:` / `lg:` / `xl:`.
- Брейкпоинты Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.
- Сетки: 1 колонка (mobile) -> 2 (`sm`) -> 3 (`lg`).
- Проверка на реальных устройствах, а не только в эмуляторе DevTools.
- Таблицы и графы на мобильных: горизонтальный скролл-контейнер или перестройка в карточки.

---

## 16. Производительность

- **Мгновенная загрузка:** App Router, оптимизация изображений (`next/image`), кэширование данных.
- **Анимации:** только `transform` / `opacity` (раздел 8.1).
- **Тяжёлые библиотеки** (Spline, three.js, GSAP, Lottie) — динамический импорт и ленивая загрузка, только там, где реально используются:

```tsx
import dynamic from "next/dynamic";

const SplineScene = dynamic(
  () => import("@splinetool/react-spline").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-[420px] animate-pulse rounded-xl bg-muted" />,
  },
);
```

- **Шрифты:** `next/font` — предзагрузка и нулевой layout shift.
- **Изображения:** WebP/AVIF через `next/image`, явные `width`/`height`.

---

## 17. Каталог анимаций интерфейса

Единая карта: какой элемент — какой анимацией — каким инструментом.

| Элемент | Анимация | Инструмент |
|---|---|---|
| Навбар при скролле | Backdrop-blur + shrink | Framer Motion |
| Карточки | Staggered reveal при скролле | Framer Motion `useInView` |
| Графы и схемы | Animated beam по рёбрам | Magic UI + @xyflow |
| Метрики и счётчики | Number ticker | Magic UI |
| Шаги мастеров (wizard) | Slide left/right | Framer Motion `AnimatePresence` |
| Пустые состояния | Lottie-анимация | lottie-react |
| Загрузка | Skeleton + shimmer | UI-кит + CSS |
| Кнопки / CTA | Shimmer-border или border-beam | Magic UI |
| Списки и таблицы | Авто-анимация перестроений | auto-animate |
| Drag-элементы | Физика пружин | react-spring |
| Скролл страницы | Инерционный smooth scroll | Lenis |
| Переходы между страницами | Fade/slide через AnimatePresence | Framer Motion |
| Тосты | Появление/исчезновение | sonner |
| Декоративные фоны | Meteors, particles, grid-pattern | Magic UI |
| Скролл-теллинг на лендингах | ScrollTrigger, параллакс | GSAP |

---

## 18. Приоритеты внедрения

Максимальный эффект при минимальных усилиях — порядок обязателен:

| Приоритет | Действие | Эффект | Усилие |
|---|---|---|---|
| P1 | Фундамент: типографика, 8px grid, 60-30-10, иерархия | Без этого анимации не спасут | Среднее |
| P2 | Magic UI | Максимум визуальной отдачи | Малое |
| P3 | Замена шрифта заголовков (Geist/Satoshi) | Одно CSS-правило — другое восприятие | Минимальное |
| P4 | Noise + glassmorphism | Чистый CSS, около 30 строк, добавляет тактильности | Минимальное |
| P5 | Phosphor Icons | Duotone даёт глубину | Малое |
| P6 | Lenis + scroll-reveal | Общая "дороговизна" ощущения | Малое |
| P7 | Spline, Lottie, three.js | Финальное полирование | Среднее |

---

## 19. Чек-лист качества

Финальная приёмка интерфейса:

- [ ] Мгновенная загрузка: оптимизация изображений, App Router, кэширование.
- [ ] Микро-взаимодействия: кнопки реагируют скейлом/свечением, а не только сменой цвета.
- [ ] Идеальная адаптивность: mobile-first, проверка на реальных устройствах.
- [ ] Доступность: семантические теги, фокус с клавиатуры, aria-атрибуты.
- [ ] Плавные переходы между страницами (AnimatePresence).
- [ ] Noise-текстура на фоне страницы.
- [ ] Scroll-reveal во всех секциях.
- [ ] Контраст текста проверен (4.5:1 для body).
- [ ] Заголовки набраны display-гротеском (Geist/Satoshi), body — Inter.
- [ ] Все отступы кратны 8px.
- [ ] Длительности анимаций в пределах норм раздела 8.1.
- [ ] `prefers-reduced-motion` поддержан.
- [ ] Тяжёлые 3D/анимационные библиотеки загружаются динамически.
- [ ] Пустые состояния и загрузки оформлены (Lottie/skeleton).

---

## 20. Насмотренность (Visual Library)

Нельзя сделать круто, если не видел крутого. Разбирайте сайты по косточкам, сохраняйте в Pinterest или Are.na.

### 20.1. Галереи и эталоны

| Ресурс | Что изучать |
|---|---|
| godly.website | Лучшая подборка современных анимированных сайтов |
| awwwards.com | Классика; сайты "Site of the Day", переходы между страницами |
| land-book.com | Структура и композиция лендингов |
| mobbin.com | Реальные UI-паттерны топовых SaaS |
| linear.app, vercel.com, raycast.com | Эталоны тёмного B2B-дизайна; изучайте исходный код и клоны |

### 20.2. YouTube

| Канал | Тематика |
|---|---|
| Kevin Powell | Лучший канал по CSS |
| DesignCourse (Gary Simon) | Связка Figma + вёрстка |
| Jhey Tompkins | CSS-трюки, креативный фронтенд |
| Web Dev Simplified, Cosden Solutions | Framer Motion, Next.js |

### 20.3. Интерактив

- **CSSBattle.dev** — геймифицированная тренировка знания CSS.
- **Документация Framer Motion** — сама по себе лучший туториал с примерами.

---

## 21. Практика: метод осознанного клонирования

Не пытайтесь сразу придумать уникальный дизайн. Метод:

1. Найдите на Awwwards или Godly сайт, который очень нравится.
2. Сверстайте его пиксель-в-пиксель на Next.js + Tailwind.
3. Воспроизведите анимации на Framer Motion.
4. Решение реальных проблем ("как они сделали этот градиент?", "почему у них так плавно открывается меню?") — и есть обучение.

**Упражнение:** редизайн старого проекта или скучного корпоративного сайта в стиле Linear или Apple.

---

## 22. AI как помощник

AI — ускоритель, а не замена.

- **v0.dev** (Vercel): генерация кода React + Tailwind + shadcn/ui по текстовому описанию. Использовать как стартовую точку, не как финальный результат.
- **Midjourney:** генерация идей, фоновых градиентов, абстрактных 3D-форм, референсов ассетов.

Промпт-приём: показывайте модели скетч и просите конкретику — "Сгенерируй современный UI для дашборда в стиле glassmorphism, тёмная тема".

---

## Приложение A. Полная карта стека

Полный реестр библиотек гайда: категория, пакет, версия, роль.

| Категория | Пакет | Версия | Роль |
|---|---|---|---|
| Фундамент | next | ^16 | Фреймворк, App Router |
| Фундамент | react / react-dom | ^19 | UI-рантайм |
| Фундамент | typescript | ^5.9 | Типизация |
| UI | tailwindcss + @tailwindcss/postcss | ^4.3 | Утилитарный CSS |
| UI (путь A) | shadcn/ui + Radix | latest | Компоненты через CLI, headless-примитивы |
| UI (путь B) | Untitled UI React | latest | Премиальные компоненты из коробки |
| UI (путь B) | react-aria | ^1.20 | A11y-примитивы (замена Radix) |
| UI-утилиты | clsx | ^2.1 | Условные классы |
| UI-утилиты | tailwind-merge | ^3.6 | Слияние Tailwind-классов |
| UI-утилиты | class-variance-authority | ^0.7 | Вариации компонентов |
| Графы | @xyflow/react | ^12 | Node-based графы |
| Графы | @xyflow/react-controls | ^12 | Мини-карта, зум, пан |
| Графы | dagre | ^0.8 | Автолэйаут |
| Данные | tremor | ^3.18 | Дашборд-карточки, мини-графики |
| Данные | recharts | (в составе Tremor) | Графики |
| Данные | react-syntax-highlighter | ^15 | Подсветка кода |
| Анимации | motion / framer-motion | ^13 | База анимаций |
| Анимации | magic-ui | (компоненты) | Shimmer, beam, marquee, ticker, dock, particles |
| Анимации | react-spring | ^9 | Физика пружин |
| Анимации | @formkit/auto-animate | ^0.8 | Авто-анимации списков |
| Анимации | lenis | ^1 | Smooth scroll |
| Анимации | sonner | ^2 | Тосты |
| Анимации | gsap | latest | Скролл-теллинг, SVG-пути |
| Анимации | lottie-react | ^2 | Lottie-состояния |
| Иконки | @phosphor-icons/react | ^2 | Основной набор (duotone) |
| Иконки | iconify-react | ^4 | Резерв, 150 000+ иконок |
| Иллюстрации | @splinetool/react-spline | latest | 3D hero-сцены |
| Иллюстрации | three + @react-three/fiber | latest | Сложные 3D-сцены |
| Иллюстрации | react-svg-pan-zoom | ^3 | Зум/пан SVG |
| Состояние | zustand | ^5 | Клиентское состояние |
| Состояние | @tanstack/react-query | ^5 | Серверное состояние |
| Формы | react-hook-form | ^7 | Формы |
| Формы | zod + @hookform/resolvers | ^4 | Валидация |
| Шрифты | Geist / Satoshi | — | Заголовки |
| Шрифты | Inter | — | Body |
| Шрифты | JetBrains Mono | — | Код |

CSS-эффекты (noise, glass, mesh, animated borders, spotlight, grain) зависимостей не требуют — см. раздел 7.

---

## Приложение B. Требования к Markdown-документации

Все Markdown-документы проекта проходят ESLint-проверку. Правила автоматизированы и обязательны.

### B.1. Запрещены эмодзи

Правило: `unicode-policy/emoji-in-md` (error).

- Эмодзи запрещены во всём документе, включая заголовки, таблицы и списки.
- Вместо эмодзи используйте текстовые теги: `[OK]`, `[FAIL]`, `[NEW]`, `[WARN]`.

### B.2. Запрещены Unicode-символы графики

Правило: `unicode-policy/unicode-graphics-in-md` (error).

- Запрещены символы псевдографики: рамки, линии, блоки, геометрические фигуры, шрифты Брайля из диапазонов Unicode: Box Drawing (U+2500-U+257F), Block Elements (U+2580-U+259F), Geometric Shapes (U+25A0-U+25FF), Braille Patterns (U+2800-U+28FF).
- Для схем и карт используйте ASCII-графику, списки или таблицы Markdown.

### B.3. Блоки кода обязаны иметь язык

Правило: `code-block-language/require-language` (error).

- Каждый fenced-блок ``` обязан указывать язык: `css`, `ts`, `tsx`, `json`, `bash`.
- Если язык неизвестен или это просто текст — указывайте `text`.

### B.4. Прочее

- Запрещены нерегулярные пробелы (неразрывные, zero-width) в коде и тексте.
- Для кода внутри документации действуют те же правила, что и для обычного кода: без эмодзи и псевдографики.

---

## Приложение C. Связанные документы

Исходные материалы, консолидированные в этом гайде (отвязанные от задач универсальные версии):

| Документ | Путь |
|---|---|
| Фундамент дизайна | `docs/sources/01-design-fundamentals.md` |
| Dribbble-уровень: слои визуального качества | `docs/sources/02-dribbble-level-layers.md` |
| Полная картина на Untitled UI + React Flow | `docs/sources/03-untitled-ui-react-flow.md` |
| Гайд по дизайну уровня Dribbble (полный стек) | `docs/sources/04-design-guide-dribbble-level.md` |
