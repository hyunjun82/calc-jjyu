import Link from 'next/link';
import { CALCULATORS, CATEGORIES, TOP6 } from '@/lib/data/calculators';
import { SITE } from '@/lib/format';

export default function HomePage() {
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

      <main>
        <section className="hero">
          <div className="container">
            <div className="t-eyebrow">ISSUE 01 · KOREA LIFE · 2026</div>
            <h1 className="t-display">대한민국에서<br />필요한<br /><em className="t-serif-it">모든 계산.</em></h1>
            <p className="hero-sub">{SITE.desc}</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>인기 TOP 6</h2>
            <div className="top6-grid">
              {TOP6.map((c, i) => (
                <Link key={c.slug} href={`/calc/${c.slug}`} className={`cell ${i === 0 ? 'feature' : 'small'}`}>
                  <div className="num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="name">{c.name}</div>
                  <div className="desc">{c.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>카테고리</h2>
            {CATEGORIES.map(cat => {
              const items = CALCULATORS.filter(c => c.catSlug === cat.slug);
              return (
                <div key={cat.slug} className="cat-block">
                  <div className="cat-head">
                    <div className="t-eyebrow">CATEGORY · {cat.id}</div>
                    <h3>{cat.name}</h3>
                    <div className="count">{items.length} calculators</div>
                  </div>
                  <div className="cat-grid">
                    {items.map(it => (
                      <Link key={it.slug} href={`/calc/${it.slug}`} className="item">
                        <div className="name">{it.name}</div>
                        <div className="desc">{it.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="container">
          © 2026 {SITE.name} · 데이터 출처: 국세청, 고용노동부, 국민연금공단
        </div>
      </footer>
    </>
  );
}
