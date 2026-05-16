import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE } from '@/lib/format';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | 40개 생활 계산기`, template: `%s | ${SITE.name}` },
  description: SITE.desc,
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE.name, url: SITE.url, title: SITE.name, description: SITE.desc },
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {SITE.adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {SITE.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${SITE.gaId}');
            `}</Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
