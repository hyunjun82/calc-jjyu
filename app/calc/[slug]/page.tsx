import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CALCULATORS, getCalcBySlug } from '@/lib/data/calculators';
import { GUIDES } from '@/lib/data/guides';
import { SITE } from '@/lib/format';
import { CalculatorWidget } from '@/components/calc/CalculatorWidget';
import { AdSlot } from '@/components/adsense/AdSlot';
import { JsonLd } from '@/components/seo/JsonLd';

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);
  if (!calc) return {};
  const guide = GUIDES[calc.slug];
  const description = guide
    ? guide.intro[0].slice(0, 155)
    : `2026년 최신 기준 ${calc.name} 계산기. ${calc.desc}.`;
  const title = `${calc.name} 계산기 - ${calc.desc}`;
  return {
    title, description,
    openGraph: { title, description, url: `${SITE.url}/calc/${calc.slug}` },
    alternates: { canonical: `${SITE.url}/calc/${calc.slug}` },
  };
}

export default async function CalcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);
  if (!calc) notFound();
  const guide = GUIDES[calc.slug];

  return (
    <>
      <header className="site-header">
        <div className="container row">
          <Link href="/" className="brand">
            <span className="mark">계</span>
            <span>계산기 <small>· Korea Life</small></span>
          </Link>
        </div>
      </header>

      <article className="seo-article">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link><span className="sep">›</span>
            <Link href={`/category/${calc.catSlug}`}>{calc.catName}</Link><span className="sep">›</span>
            <span className="current">{calc.name}</span>
          </nav>

          <header className="seo-head">
            <div className="t-eyebrow" style={{ marginBottom: 10 }}>{calc.catName} · CALCULATOR</div>
            <h1>{calc.name} 계산기</h1>
            <p className="seo-sub">{calc.desc} · 2026년 최신 기준 · 평균 {calc.time}</p>
          </header>

          <section className="seo-calc-embed">
            <CalculatorWidget slug={calc.slug} />
          </section>

          <AdSlot slot="below-calc" />

          {guide && (
            <>
              <section className="seo-guide">
                {guide.intro.map((p, i) => <p key={i}>{p}</p>)}
                {guide.sections.map((s, i) => (
                  <div key={i}>
                    <h2>{s.h2}</h2>
                    {s.body.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                ))}
                {guide.table && (
                  <div className="seo-table">
                    <table>
                      <thead>
                        <tr>{guide.table.headers.map(h => <th key={h}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {guide.table.rows.map((row, i) => (
                          <tr key={i}>{row.map((cell, j) => <td key={j}>{j === row.length - 2 ? <b>{cell}</b> : cell}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                    {guide.table.note && <div className="seo-table-note">{guide.table.note}</div>}
                  </div>
                )}
              </section>

              <AdSlot slot="in-article" />

              <section className="seo-faq">
                <h2>자주 묻는 질문</h2>
                <div className="faq-list">
                  {guide.faqs.map((f, i) => (
                    <details key={i} className="faq-item">
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <AdSlot slot="below-faq" />

              <section className="seo-related">
                <h2>관련 계산기</h2>
                <div className="seo-related-grid">
                  {guide.related.map(rel => (
                    <Link key={rel.slug} href={`/calc/${rel.slug}`} className="card" style={{ padding: 24, display: 'block' }}>
                      <div className="t-eyebrow" style={{ marginBottom: 8 }}>{calc.catName}</div>
                      <div style={{ fontSize: 17, fontWeight: 600 }}>{rel.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6 }}>{rel.desc}</div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="seo-sources">
                <h2>계산 근거 및 출처</h2>
                <ul>{guide.sources.map((s, i) => <li key={i}>{s}</li>)}</ul>
                <div className="seo-disclaimer">
                  ⚠️ 이 계산기는 참고용이며 실제 금액과 차이가 있을 수 있습니다.
                  개인 상황에 따라 추가 공제, 비과세 항목 등이 적용될 수 있습니다.
                </div>
              </section>
            </>
          )}

          {!guide && (
            <section className="seo-guide">
              <h2>{calc.name} 안내</h2>
              <p>{calc.desc}. 본문 가이드는 곧 추가됩니다.</p>
            </section>
          )}
        </div>
      </article>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: `${calc.name} 계산기`,
            url: `${SITE.url}/calc/${calc.slug}`,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
          },
          guide && {
            '@type': 'FAQPage',
            mainEntity: guide.faqs.map(f => ({
              '@type': 'Question', name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: SITE.url },
              { '@type': 'ListItem', position: 2, name: calc.catName, item: `${SITE.url}/category/${calc.catSlug}` },
              { '@type': 'ListItem', position: 3, name: calc.name },
            ],
          },
        ].filter(Boolean),
      }} />
    </>
  );
}
