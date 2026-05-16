import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '소개',
  description: '대한민국에서 필요한 모든 계산을 한 곳에서.',
};

export default function AboutPage() {
  return (
    <>
      <header className="site-header"><div className="container row"><Link href="/" className="brand"><span className="mark">계</span><span>계산기</span></Link></div></header>
      <main className="seo-article">
        <div className="container">
          <header className="seo-head">
            <h1>소개</h1>
            <p className="seo-sub">한국인이 일상에서 필요한 모든 계산을 한 페이지에서.</p>
          </header>
          <section className="seo-guide">
            <h2>왜 만들었나요?</h2>
            <p>연봉 실수령액, 양도세, 퇴직금, 주담대 한도. 계산이 필요할 때마다 흩어진 사이트를 찾아다니는 게 번거롭습니다. 모든 계산을 한 페이지에서, 광고 방해 없이, 30초 안에 끝낼 수 있도록 만들었습니다.</p>

            <h2>원칙</h2>
            <p>· 광고는 본문 흐름 밖에만 — 계산기 사용을 방해하지 않습니다.<br/>· 결과는 즉시 — 회원가입, 이메일 입력 같은 장벽 없습니다.<br/>· 출처 명시 — 모든 산식은 공식 법령과 정부 자료를 근거로 합니다.</p>

            <h2>데이터 출처</h2>
            <p>국세청, 고용노동부, 국민연금공단, 국민건강보험공단, 금융위원회.</p>

            <h2>운영</h2>
            <p>jjyu.co.kr 운영팀이 만들고 관리합니다. 문의는 <Link href="/contact">문의 페이지</Link>에서.</p>
          </section>
        </div>
      </main>
    </>
  );
}
