import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '양도소득세 계산기 — 1주택, 다주택, 조정지역 | calc.jjyu',
  description: '부동산 양도소득세를 정확히 계산하세요. 1주택·다주택, 조정대상지역 중과세율, 장기보유특별공제를 자동 적용합니다. 2026년 세법 기준.',
  openGraph: {
    title: '양도소득세 계산기 — 1주택, 다주택, 조정지역',
    description: '부동산 양도소득세를 정확히 계산하세요. 장기보유특별공제 자동 적용.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
