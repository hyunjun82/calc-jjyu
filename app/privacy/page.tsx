import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '대한민국 모든 계산기 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <>
      <header className="site-header"><div className="container row"><Link href="/" className="brand"><span className="mark">계</span><span>계산기</span></Link></div></header>
      <main className="seo-article">
        <div className="container">
          <header className="seo-head">
            <h1>개인정보처리방침</h1>
            <p className="seo-sub">최종 개정일: 2026년 5월 16일</p>
          </header>
          <section className="seo-guide">
            <h2>1. 수집하는 개인정보</h2>
            <p>본 사이트는 회원가입 없이 이용 가능하며, 개인을 식별할 수 있는 정보를 수집하지 않습니다. 다만 다음 정보가 자동으로 수집될 수 있습니다:</p>
            <p>· 접속 IP, 브라우저 종류, OS, 접속 시간 (서버 로그)<br/>· 쿠키 (구글 애드센스, 구글 애널리틱스)</p>

            <h2>2. 광고 및 분석 도구</h2>
            <p>본 사이트는 구글 애드센스(Google AdSense)를 통해 광고를 게재하며, 광고 개인화를 위해 쿠키를 사용할 수 있습니다. 사용자는 <a href="https://www.google.com/settings/ads">광고 설정</a>에서 개인화를 거부할 수 있습니다.</p>
            <p>구글 애널리틱스를 통해 익명화된 방문 통계를 수집합니다.</p>

            <h2>3. 입력값 처리</h2>
            <p>계산기 입력값(연봉, 주택가 등)은 모두 사용자 브라우저에서만 처리되며, 서버로 전송·저장되지 않습니다.</p>

            <h2>4. 문의</h2>
            <p>개인정보 관련 문의: <a href="/contact">문의 페이지</a></p>
          </section>
        </div>
      </main>
    </>
  );
}
