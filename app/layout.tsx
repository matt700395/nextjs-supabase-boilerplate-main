import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

/**
 * Root Layout with Clerk Korean Localization
 * 
 * Clerk 컴포넌트를 한국어로 표시하기 위해 @clerk/localizations의 koKR을 사용합니다.
 * 
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 * 
 * 주요 설정:
 * - localization={koKR}: 모든 Clerk 컴포넌트를 한국어로 표시
 * - appearance.cssLayerName: Tailwind CSS 4 호환성을 위한 설정
 * - html lang="ko": HTML 문서의 언어를 한국어로 설정
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        cssLayerName: "clerk", // Tailwind CSS 4 호환성 필수
      }}
    >
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
