import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "calc.jjyu — 부동산, 세금, 금융, 근로 계산기",
  description: "양도소득세, 취득세, 중개수수료, 대출이자, 연봉 실수령액 등 15가지 계산기를 무료로 이용하세요. 2026년 최신 세법 기준 정확한 계산.",
  metadataBase: new URL("https://calc.jjyu.co.kr"),
  openGraph: {
    title: "calc.jjyu — 부동산, 세금, 금융, 근로 계산기",
    description: "양도소득세, 취득세, 중개수수료, 대출이자, 연봉 실수령액 등 15가지 계산기를 무료로 이용하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "calc.jjyu",
  },
  alternates: {
    canonical: "https://calc.jjyu.co.kr",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "naver-site-verification": "",
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
