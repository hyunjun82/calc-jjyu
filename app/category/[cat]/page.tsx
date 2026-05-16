import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCalcsByCategory } from '@/lib/data/calculators';
import { SITE } from '@/lib/format';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ cat: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const c = CATEGORIES.find(x => x.slug === decodeURIComponent(cat));
  if (!c) return {};
  return {
    title: `${c.name} 계산기 모음`,
    description: `${c.name} 관련 계산기 한 곳에서. 2026년 최신 세율·요율 반영.`,
    alternates: { canonical: `${SITE.url}/category/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const c = CATEGORIES.find(x => x.slug === decodeURIComponent(cat));
  if (!c) notFound();
  const items = getCalcsByCategory(c.slug);

  return (
    <>
      <header className="site-header">
        <div className="container row">
          <Link href="/" className="brand">
            <span className="mark">계</span><span>계산기 <small>· Korea Life</small></span>
          </Link>
        </div>
      </header>

      <main className="seo-article">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">홈</Link><span className="sep">›</span>
            <span className="current">{c.name}</span>
          </nav>
          <header className="seo-head">
            <div className="t-eyebrow" style={{ marginBottom: 10 }}>CATEGORY · {c.id}</div>
            <h1>{c.name} 계산기</h1>
            <p className="seo-sub">{items.length}개의 {c.name} 관련 계산기를 한 곳에서.</p>
          </header>

          <div className="cat-grid" style={{ marginTop: 32 }}>
            {items.map(it => (
              <Link key={it.slug} href={`/calc/${it.slug}`} className="item">
                <div className="name">{it.name}</div>
                <div className="desc">{it.desc}</div>
                <div className="foot">
                  <span className="time">⌐ {it.time}</span>
                  <span className="arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
