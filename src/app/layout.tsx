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
  title: "Mystic AI - AI Tarot, Saju & Horoscope | 무료 타로 및 사주 운세",
  description: "타로카드, 평생 사주, 오늘의 운세를 AI가 분석해 드립니다. Get your free personalized AI Tarot reading, Saju (Four Pillars of Destiny), and Daily Horoscope.",
  keywords: [
    "운세", "무료운세", "타로", "사주", "오늘의운세", "AI운세", "사주팔자", "점성술", "별자리운세", "명리학", "오하아사",
    "타로점", "무료 타로", "타로카드 보기", "사주 풀이", "평생 사주 무료", "연애운", "금전운", "오늘의 띠별 운세",
    "free tarot reading", "AI tarot", "saju", "four pillars of destiny", "daily horoscope", "astrology", "fortune telling", "mystic ai", "zodiac signs"
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "Mystic AI - AI Tarot, Saju & Horoscope",
    description: "타로카드, 사주, 오늘의 운세를 AI가 실시간으로 분석해 드립니다. Free AI Tarot & Saju Horoscope.",
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
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystic AI - AI Tarot, Saju & Horoscope",
    description: "타로카드, 사주, 오늘의 운세를 AI가 실시간으로 분석해 드립니다. Free AI Tarot & Saju Horoscope.",
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
        {/* Google Analytics 4 */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-F45L019Z1D`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F45L019Z1D');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Mystic AI - AI 타로, 사주, 오늘의 운세",
              "url": "https://mystic.weknews.com",
              "description": "타로카드, 평생 사주, 오늘의 운세를 AI가 실시간으로 정확하게 분석해 드립니다.",
              "applicationCategory": "EntertainmentApplication",
              "operatingSystem": "All"
            })
          }}
        />
        
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
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-6635245275061755'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
