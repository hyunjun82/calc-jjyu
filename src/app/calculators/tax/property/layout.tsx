import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '재산세 계산기 — 주택, 건물, 토지 | calc.jjyu',
  description: '보유 부동산에 대한 재산세를 계산하세요. 주택, 건물, 토지 유형별 세율을 적용하여 정확한 세액을 산출합니다.',
  openGraph: {
    title: '재산세 계산기 — 주택, 건물, 토지',
    description: '보유 부동산에 대한 재산세를 계산하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
