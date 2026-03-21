import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '청약가점 계산기 — 무주택기간, 부양가족, 청약통장 | calc.jjyu',
  description: '주택청약 가점을 계산하세요. 무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 총 가점을 산출합니다.',
  openGraph: {
    title: '청약가점 계산기 — 무주택기간, 부양가족, 청약통장',
    description: '주택청약 가점을 계산하세요. 총 84점 만점 기준.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
