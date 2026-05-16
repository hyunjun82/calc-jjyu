// 포맷터 — 클라이언트/서버 양쪽에서 쓰임
export const fmtKRW = (n: number) => new Intl.NumberFormat('ko-KR').format(Math.round(n));

export function manToKorean(manValue: number): string {
  const man = Math.round(Math.max(0, manValue));
  if (man === 0) return '';
  const eok = Math.floor(man / 10000);
  const rest = man % 10000;
  const cheon = Math.floor(rest / 1000);
  const baek = Math.floor((rest % 1000) / 100);
  const sip = Math.floor((rest % 100) / 10);
  const il = rest % 10;
  const parts: string[] = [];
  if (eok) parts.push(`${eok}억`);
  if (cheon) parts.push(`${cheon}천`);
  if (baek) parts.push(`${baek}백`);
  if (sip) parts.push(`${sip}십`);
  if (il) parts.push(`${il}`);
  return parts.join(' ') + '만원';
}

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://calc.jjyu.co.kr',
  name: '대한민국 모든 계산기',
  short: '계산기',
  desc: '연봉, 양도세, 퇴직금, 주담대 한도까지. 40개 생활 계산기를 한 페이지에서 30초 안에.',
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
};
