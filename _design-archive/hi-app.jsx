/* global React, ReactDOM */

function App() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [calcOpen, setCalcOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(null);
  const [dark, setDark] = React.useState(false);

  // ⌘K shortcut
  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setSearchOpen(o => !o);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // dark mode
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const openCalc = (item) => {
    setActiveItem(item);
    setCalcOpen(true);
    setSearchOpen(false);
  };

  const { Header, Hero, Top6, Category, Footer, AdSlot, CommandK, CalcModal } = window;
  const { categories } = window.CALC_DATA;

  return (
    <>
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        dark={dark} onToggleDark={() => setDark(d => !d)}
      />
      <main>
        <Hero onOpenSearch={() => setSearchOpen(true)} />
        <Top6 onPick={openCalc} />

        {/* Ad slot 1 — between hero and categories */}
        <section style={{ padding: '8px 0 0' }}>
          <div className="container">
            <AdSlot size="leaderboard" sizeLabel="970 × 90 leaderboard · responsive" />
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="t-eyebrow" style={{ marginBottom: 6 }}>CATALOG · 전체 40개</div>
                <h2>카테고리별 둘러보기</h2>
              </div>
              <div className="right">7개 카테고리 · 40개 계산기</div>
            </div>
            {categories.slice(0, 3).map(cat => (
              <Category key={cat.id} cat={cat} onPick={openCalc} />
            ))}
          </div>
        </section>

        {/* Ad slot 2 — middle */}
        <section style={{ padding: '24px 0' }}>
          <div className="container">
            <AdSlot size="leaderboard" sizeLabel="in-article 970 × 90 · responsive" />
          </div>
        </section>

        {/* More categories */}
        <section style={{ padding: '0 0 40px' }}>
          <div className="container">
            {categories.slice(3).map(cat => (
              <Category key={cat.id} cat={cat} onPick={openCalc} />
            ))}
          </div>
        </section>

        {/* Related flows */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="t-eyebrow" style={{ marginBottom: 6 }}>RELATED FLOWS</div>
                <h2>자주 함께 쓰는 계산</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { from: '양도소득세', to: '취득세 → 종부세', desc: '주택 매도 시 세금 전체 흐름' },
                { from: '연봉 실수령액', to: '4대보험 → 연말정산', desc: '월급에서 환급까지' },
                { from: '주택담보대출', to: 'DSR → LTV', desc: '한도 시뮬레이션' },
                { from: '퇴직금', to: '실업급여 → 국민연금', desc: '퇴직 후 일정' },
              ].map((f, i) => (
                <div key={i} className="card" style={{ padding: 22, cursor: 'pointer' }}>
                  <div className="t-eyebrow" style={{ marginBottom: 8 }}>FLOW {String(i + 1).padStart(2, '0')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em' }}>{f.from}</span>
                    <span style={{ color: 'var(--ink-4)' }}>{window.Ic.arrow(14)}</span>
                    <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em' }}>{f.to}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <CommandK open={searchOpen} onClose={() => setSearchOpen(false)} onPick={openCalc} />
      <CalcModal open={calcOpen} item={activeItem} onClose={() => setCalcOpen(false)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
