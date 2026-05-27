import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TopNavigation } from "@/components/TopNavigation";
import InstallPrompt from "@/components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystic AI - 별빛이 들려주는 당신의 운명",
  description: "타로카드, 평생 사주, 그리고 오늘의 운세를 AI가 실시간으로 분석해 드립니다. 나만의 운명 카드를 뽑아보세요.",
  keywords: ["운세", "무료운세", "타로", "사주", "오늘의운세", "AI운세", "사주팔자", "점성술", "별자리운세", "명리학", "신년운세"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Mystic AI - 별빛이 들려주는 당신의 운명",
    description: "타로카드, 평생 사주, 그리고 오늘의 운세를 AI가 실시간으로 분석해 드립니다.",
    url: "https://mystic-ai.vercel.app",
    siteName: "Mystic AI",
    images: [
      {
        url: "https://mystic-ai.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mystic AI Preview Image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystic AI - 별빛이 들려주는 당신의 운명",
    description: "타로카드, 평생 사주, 그리고 오늘의 운세를 AI가 실시간으로 분석해 드립니다.",
    images: ["https://mystic-ai.vercel.app/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <LanguageProvider>
          <TopNavigation />
          {children}
          <InstallPrompt />
        </LanguageProvider>

        <Analytics />
        <SpeedInsights />

        {/* Google AdSense Global Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
