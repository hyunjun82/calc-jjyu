import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '평수 환산 계산기 — 평, m², ft² 변환 | calc.jjyu',
  description: '평수를 제곱미터(m²), 평방피트(ft²)로 간편하게 변환하세요. 아파트, 오피스텔, 상가 면적을 정확히 환산할 수 있습니다.',
  openGraph: {
    title: '평수 환산 계산기 — 평, m², ft² 변환',
    description: '평수를 제곱미터(m²), 평방피트(ft²)로 간편하게 변환하세요.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
