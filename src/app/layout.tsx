import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
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
