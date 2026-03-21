import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '예금 이자 계산기 — 정기예금 만기 수령액 | calc.jjyu',
  description: '정기예금 만기 시 받을 이자와 총 수령액을 계산하세요. 일반과세, 세금우대, 비과세 옵션을 지원합니다.',
  openGraph: {
    title: '예금 이자 계산기 — 정기예금 만기 수령액',
    description: '정기예금 만기 시 받을 이자와 총 수령액을 계산하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
