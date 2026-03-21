import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '증여세 계산기 — 부동산, 현금, 주식 증여 | calc.jjyu',
  description: '증여세를 계산하세요. 부동산, 현금, 주식 증여 시 납부할 세금을 산출합니다. 증여 공제한도 자동 적용.',
  openGraph: {
    title: '증여세 계산기 — 부동산, 현금, 주식 증여',
    description: '증여세를 계산하세요. 증여 공제한도 자동 적용.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
