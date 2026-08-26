Полная картина для Dribbble-уровня на **Untitled UI + React Flow** (без shadcn):

---

## 1. UI-фундамент (замена shadcn → Untitled UI)

| Библиотека | Версия | Роль |
|---|---|---|
| **Untitled UI React** | latest | Основа — кнопки, инпуты, карточки, таблицы, модалки, дропдауны, аватары, breadcrumbs и т.д. |
| **Tailwind CSS** | ^4.3 | Утилитарный CSS (Untitled UI на нём построен) |
| **@tailwindcss/postcss** | ^4.3 | PostCSS-плагин |
| **clsx + tailwind-merge** | ^2.1 / ^3.6 | Утилита `cn()` для слияния классов (вместо shadcn-версии, та же функция) |
| **class-variance-authority** | ^0.7 | Вариации компонентов (cva) — работает независимо от shadcn |
| **React Aria** | ^1.20 | Accessibility-примитивы (заменяет Radix, который шёл с shadcn) |

> Untitled UI даёт более «дизайнерский» начальный вид из коробки — скругления, тени, спейсинг уже настроены на премиальный уровень. 
Но ты теряешь `npx shadcn add` CLI и полную владимость кодом компонентов.

---

## 2. React Flow (визуализация пайплайна)

| Библиотека | Версия | Роль |
|---|---|---|
| **@xyflow/react** | ^12.x | Node-based графы — идеален для визуализации extract → analyze → spec → generate |
| **@xyflow/react-controls** | ^12.x | Мини-карта, зум, пан |
| **dagre** | ^0.8 | Автоматическая раскладка нод (top-to-bottom / left-to-right) |

В unweave это заменит текущий `StepProgress` в wizard на полноценный интерактивный граф:
- Узлы — этапы пайплайна
- Рёбра — данные между этапами
- Анимация потока данных по рёбрам
- Drag & drop для кастомных пайплайнов
- Кастомные ноды с превью результатов

---

## 3. Анимированные компоненты

Без shadcn Magic UI не подключается через CLI, но его компоненты — это просто React + Tailwind + Motion. Нужно **переписать под Untitled UI систему стилей** (заменить shadcn-примитивы на Untitled UI).

| Библиотека | Что даёт |
|---|---|
| **Magic UI** (ручная интеграция) | Shimmer-border, animated beam, marquee, number ticker, meteors, dock, particles, shimmer-button, border-beam |
| **Framer Motion** / **Motion** ^13 | Базовые анимации: mount/unmount, layout, gesture, useInView, AnimatePresence |
| **react-spring** ^9 | Физические анимации (пружины) — для drag-интеракций в React Flow, elastic-эффекты |
| **auto-animate** ^0.8 | Авто-анимации списков и DOM-перестроек (без ручных keyframe) |
| **sonner** ^2 | Тосты (уже есть, совместимо с любым UI) |

**Ключевые анимации для unweave:**

| Элемент | Анимация | Библиотека |
|---|---|---|
| Навбар при скролле | Backdrop-blur + shrink | Framer Motion |
| Карточки проектов | Staggered reveal при скролле | Framer Motion `useInView` |
| Пайплайн (React Flow) | Animated beam по рёбрам | Magic UI + @xyflow |
| StatsCard | Number ticker | Magic UI |
| Extract wizard | Шаги slide left/right | Framer Motion `AnimatePresence` |
| Пустые состояния | Lottie-анимация | lottie-react |
| Загрузка | Skeleton + shimmer | Untitled UI + CSS |
| Кнопки / CTA | Shimmer-border или border-beam | Magic UI |

---

## 4. Иконки

| Библиотека | Почему не Lucide |
|---|---|
| **@phosphor-icons/react** ^2 | 6 стилей в одной библиотеке: thin, light, regular, bold, fill, **duotone**. Duotone даёт глубину — двухцветные иконки воспринимаются "дороже" |
| **Iconify React** ^4 | Резерв: доступ к 150 000+ иконкам из 100+ наборов (Phosphor, Tabler, Solar, etc.) через единый `<Icon>` компонент |

**Рекомендация**: Phosphor как основной (duotone для активных состояний, regular для неактивных), Iconify как резерв для специфических иконок.

---

## 5. Текстуры и эффекты (CSS, без зависимостей)

### 5.1 Noise-текстура
```css
/* SVG-фильтр — добавляется в layout.tsx как inline SVG */
.noise::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background: url("data:image/svg+xml,...");
}
```
Применяется на фон всей страницы — даёт "аналоговую" текстуру, как у Linear, Vercel, Raycast.

### 5.2 Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```
Навбар, модалки, floating-панели, тултипы в React Flow.

### 5.3 Mesh-градиенты
```css
.mesh-gradient {
  background:
    radial-gradient(at 20% 20%, rgba(99, 102, 241, 0.15) 0, transparent 50%),
    radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.1) 0, transparent 50%),
    radial-gradient(at 50% 50%, rgba(16, 185, 129, 0.05) 0, transparent 50%);
}
```
Hero-секция, фон дашборда, пустые состояния.

### 5.4 Animated gradient borders
Через `@property` + `conic-gradient` — обводка карточек и активных элементов "бегает" градиентом. Либо Magic UI `shimmer-border`.

### 5.5 Smooth scroll
| Библиотека | Роль |
|---|---|
| **Lenis** ^1 | Плавный инерционный скролл — "дорогой" feel всей страницы |

### 5.6 Spotlight-эффект
CSS + JS: курсор создаёт мягкое свечение на фоне карточки при hover — как у Stripe, Linear.

### 5.7 Grain overlay
Отличие от noise: крупное зерно, применяется точечно на hero/CTA-блоки для кинематографичности.

---

## 6. Иллюстрации и графика

| Библиотека / Сервис | Применение в unweave |
|---|---|
| **Spline** (@splinetool/react-spline) | 3D-сцена на hero: анимированная "распаковка" UI-компонентов из веб-страницы. Интерактивная — реагирует на курсор |
| **lottie-react** ^2 | Lottie-анимации для: пустого состояния проектов, загрузки при extract, успешного завершения пайплайна |
| **React SVG Pan Zoom** ^3 | Зум и пан для SVG-превью извлечённых компонентов |
| **three.js + @react-three/fiber** | Альтернатива Spline для более сложных 3D-сцен (если Spline не хватит) |

**Что показывает Lottie в unweave:**
- `extract`: анимация "сканирования" страницы
- `analyze`: разложение на слои/токены
- `generate`: сборка кода из блоков
- `empty state`: лампа с шестерёнками

---

## 7. Данные и визуализация

| Библиотека | Роль |
|---|---|
| **Tremor** ^3.18 | Дашборд-карточки, мини-графики в StatsCard |
| **@xyflow/react** | React Flow для пайплайна (см. раздел 2) |
| **recharts** (в составе Tremor) | Графики |
| **react-syntax-highlighter** ^15 | Превью сгенерированного кода в `CodePreview.tsx` |

---

## 8. Состояние и данные

| Библиотека | Роль |
|---|---|
| **Zustand** ^5 | Клиентское состояние |
| **TanStack React Query** ^5 | Серверное состояние, кэш, фоновые обновления |
| **React Hook Form** + **Zod** | Формы + валидация (совместимо с Untitled UI) |

---

## 9. Шрифты

| Использование | Шрифт | Почему |
|---|---|---|
| **Заголовки** | **Geist** (Vercel) или **Satoshi** (Fontshare) | Выразительный, геометричный, не переиспользован как Inter |
| **Body** | Inter | Отлично читается, нейтральный |
| **Моноширинный** | JetBrains Mono | Уже есть, хороший выбор |

---

## Полная карта стека

```
Фундамент:
  Next.js 16 + React 19 + TypeScript 5.9
  pnpm workspaces (monorepo)

UI (вместо shadcn):
  Untitled UI React
  React Aria (a11y-примитивы)
  Tailwind CSS 4 + @tailwindcss/postcss
  clsx + tailwind-merge + cva

Визуализация:
  @xyflow/react + dagre (пайплайн-граф)
  Tremor (дашборды)

Анимации:
  Motion / Framer Motion (база)
  Magic UI (ручная интеграция, не через CLI)
  react-spring (физика)
  auto-animate (списки)
  Lenis (smooth scroll)

Иконки:
  Phosphor Icons (duotone)

Эффекты (CSS):
  Noise-текстура
  Glassmorphism
  Mesh-градиенты
  Animated gradient borders
  Spotlight-hover

Иллюстрации:
  Spline (3D hero)
  lottie-react (состояния)

Состояние:
  Zustand + TanStack Query

Формы:
  React Hook Form + Zod

Шрифты:
  Geist / Satoshi (заголовки)
  Inter (body)
  JetBrains Mono (code)
```

Это стек, который при грамотном применении даёт визуал уровня Linear, Vercel, Raycast, Resend.