import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '연봉 실수령액 계산기 — 2026년 4대보험, 소득세 | calc.jjyu',
  description: '연봉에서 4대 보험료와 소득세를 차감한 월 실수령액을 계산하세요. 2026년 기준 국민연금, 건강보험, 고용보험, 소득세를 자동 계산합니다.',
  openGraph: {
    title: '연봉 실수령액 계산기 — 2026년 4대보험, 소득세',
    description: '연봉에서 4대 보험료와 소득세를 차감한 월 실수령액을 계산하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
