import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '문의',
  description: '버그, 계산 오류, 기능 요청은 여기로.',
};

export default function ContactPage() {
  return (
    <>
      <header className="site-header"><div className="container row"><Link href="/" className="brand"><span className="mark">계</span><span>계산기</span></Link></div></header>
      <main className="seo-article">
        <div className="container">
          <header className="seo-head">
            <h1>문의</h1>
            <p className="seo-sub">버그, 계산 오류, 추가 계산기 요청을 받습니다.</p>
          </header>
          <section className="seo-guide">
            <h2>이메일</h2>
            <p>contact@jjyu.co.kr (실제 이메일로 교체하세요)</p>
            <h2>운영 사이트</h2>
            <p><a href="https://jjyu.co.kr">jjyu.co.kr</a></p>
            <h2>답변</h2>
            <p>영업일 기준 1~3일 내 답변드립니다.</p>
          </section>
        </div>
      </main>
    </>
  );
}
