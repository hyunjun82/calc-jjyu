import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: '대한민국 모든 계산기 이용약관',
};

export default function TermsPage() {
  return (
    <>
      <header className="site-header"><div className="container row"><Link href="/" className="brand"><span className="mark">계</span><span>계산기</span></Link></div></header>
      <main className="seo-article">
        <div className="container">
          <header className="seo-head">
            <h1>이용약관</h1>
            <p className="seo-sub">최종 개정일: 2026년 5월 16일</p>
          </header>
          <section className="seo-guide">
            <h2>제1조 (목적)</h2>
            <p>본 약관은 대한민국 모든 계산기(이하 "사이트")의 이용 조건과 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

            <h2>제2조 (서비스 내용)</h2>
            <p>사이트는 한국 사용자가 일상에서 필요한 40여 종의 계산기를 무료로 제공합니다. 계산 결과는 참고용이며 법적 효력이 없습니다.</p>

            <h2>제3조 (책임 제한)</h2>
            <p>본 사이트의 계산 결과를 근거로 한 의사결정에 대한 책임은 사용자에게 있습니다. 세율 변경, 법령 개정 등으로 인한 차이가 발생할 수 있으며, 본 사이트는 이에 대한 책임을 지지 않습니다.</p>

            <h2>제4조 (저작권)</h2>
            <p>사이트의 디자인, 코드, 콘텐츠는 저작권의 보호를 받습니다. 무단 복제·배포를 금합니다.</p>

            <h2>제5조 (광고)</h2>
            <p>사이트는 구글 애드센스를 통해 광고로 운영됩니다. 광고 콘텐츠에 대한 책임은 광고주에게 있습니다.</p>
          </section>
        </div>
      </main>
    </>
  );
}
