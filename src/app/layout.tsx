import type { Metadata } from "next";
// Self-hosted variable fonts (no build-time fetch from Google Fonts).
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Единый гайд по дизайну интерфейсов уровня Dribbble",
  description:
    "Документация дизайн-системы проекта: единый гайд по дизайну интерфейсов уровня Dribbble, фундамент дизайна, модель визуальных слоёв и технологический стек (Tailwind CSS, shadcn/ui, Framer Motion, React Flow).",
  keywords: [
    "дизайн",
    "design system",
    "Dribbble",
    "Tailwind CSS",
    "shadcn/ui",
    "Next.js",
    "документация",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Единый гайд по дизайну интерфейсов уровня Dribbble",
    description:
      "Рабочий стандарт дизайна: фундамент, слои визуального качества и полный технологический стек.",
    siteName: "Дизайн-документация",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
