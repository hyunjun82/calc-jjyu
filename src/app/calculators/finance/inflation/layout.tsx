import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '인플레이션 계산기 — 실질 가치 환산 | calc.jjyu',
  description: '인플레이션을 고려한 실질 가치를 계산하세요. 현재 금액의 미래 가치 또는 과거 금액의 현재 가치를 환산합니다.',
  openGraph: {
    title: '인플레이션 계산기 — 실질 가치 환산',
    description: '인플레이션을 고려한 실질 가치를 계산하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
