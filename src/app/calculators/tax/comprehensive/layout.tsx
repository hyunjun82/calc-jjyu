import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '종합부동산세 계산기 — 종부세 과세대상 판정 | calc.jjyu',
  description: '종합부동산세(종부세)를 계산하세요. 공시가격 기준 과세대상 판정 및 세액을 산출합니다. 1세대 1주택 공제 포함.',
  openGraph: {
    title: '종합부동산세 계산기 — 종부세 과세대상 판정',
    description: '종합부동산세(종부세)를 계산하세요. 공시가격 기준.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
