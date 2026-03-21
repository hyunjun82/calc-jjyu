import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '퇴직금 계산기 — 근무기간, 평균임금 기준 | calc.jjyu',
  description: '퇴직금을 계산하세요. 근무기간과 평균임금을 바탕으로 법정 퇴직금을 정확히 산출합니다.',
  openGraph: {
    title: '퇴직금 계산기 — 근무기간, 평균임금 기준',
    description: '퇴직금을 계산하세요. 근무기간과 평균임금 기준.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
