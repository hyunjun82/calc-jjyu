import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "르엘 시그니처 — 프리미엄 주거의 새로운 기준",
  description: "이탈리아 명품 가구 Euromobil SEI 적용, 도심 속 자연과 함께하는 프리미엄 주거 공간",
  openGraph: {
    title: "르엘 시그니처 — 프리미엄 주거의 새로운 기준",
    description: "이탈리아 명품 가구 Euromobil SEI 적용, 도심 속 자연과 함께하는 프리미엄 주거 공간",
    type: "website",
  },
};

export default function ApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
