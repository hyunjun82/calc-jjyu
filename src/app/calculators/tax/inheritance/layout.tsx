import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '상속세 계산기 — 상속재산 세액 산출 | calc.jjyu',
  description: '상속세를 계산하세요. 상속 받은 재산에 대한 세금을 정확히 산출합니다. 기초공제, 인적공제 자동 적용.',
  openGraph: {
    title: '상속세 계산기 — 상속재산 세액 산출',
    description: '상속세를 계산하세요. 기초공제, 인적공제 자동 적용.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
