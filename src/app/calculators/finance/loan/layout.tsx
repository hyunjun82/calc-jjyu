import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대출이자 계산기 — 원리금균등, 원금균등, 만기일시상환 | calc.jjyu',
  description: '대출 상환 방식별 월 납부액, 총 이자, 상환 스케줄을 계산하세요. 원리금균등, 원금균등, 만기일시상환 방식을 비교할 수 있습니다.',
  openGraph: {
    title: '대출이자 계산기 — 원리금균등, 원금균등, 만기일시상환',
    description: '대출 상환 방식별 월 납부액과 총 이자를 계산하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
