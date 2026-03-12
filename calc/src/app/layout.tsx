import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "계산기 | calc.jjyu.co.kr",
  description: "부동산, 세금, 금융, 근로 등 다양한 분야의 정확한 계산기 서비스",
  openGraph: {
    title: "계산기 | calc.jjyu.co.kr",
    description: "부동산, 세금, 금융, 근로 등 다양한 분야의 정확한 계산기 서비스",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 text-slate-900">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
