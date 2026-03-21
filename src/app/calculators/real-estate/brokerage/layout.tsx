import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '부동산 중개수수료 계산기 — 매매, 전세, 월세 | calc.jjyu',
  description: '부동산 매매, 전세, 월세 거래 시 중개수수료(복비)를 정확히 계산하세요. 2026년 최신 요율표 기준으로 VAT 포함 금액을 산출합니다.',
  openGraph: {
    title: '부동산 중개수수료 계산기 — 매매, 전세, 월세',
    description: '부동산 거래 시 중개수수료(복비)를 정확히 계산하세요. 최신 요율표 기준.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
