import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '취득세 계산기 — 주택, 토지, 상가 | calc.jjyu',
  description: '부동산 취득세를 계산하세요. 주택, 토지, 상가 취득 시 부과되는 세금을 정확히 산출합니다. 다주택자 중과세율 포함.',
  openGraph: {
    title: '취득세 계산기 — 주택, 토지, 상가',
    description: '부동산 취득세를 계산하세요. 다주택자 중과세율 포함.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
