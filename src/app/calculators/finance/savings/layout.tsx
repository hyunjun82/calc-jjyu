import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '적금 이자 계산기 — 정기적금 만기 수령액 | calc.jjyu',
  description: '정기적금 만기 시 받을 이자와 총 수령액을 계산하세요. 월 납입액과 금리를 입력하면 세후 수령액을 산출합니다.',
  openGraph: {
    title: '적금 이자 계산기 — 정기적금 만기 수령액',
    description: '정기적금 만기 시 받을 이자와 총 수령액을 계산하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
