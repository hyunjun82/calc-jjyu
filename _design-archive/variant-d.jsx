// 변형 D — 검색 우선 (거의 빈 화면 + 거대 검색바 + TOP 6 하단)
function VariantD() {
  const { top6, categories } = window.CALC_DATA;
  return (
    <div className="wf" style={{ width: 1280, minHeight: 1500, position: 'relative', padding: 0 }}>
      <div className="wf-stamp">D · Search-first</div>

      <Header variant="D" />

      <main style={{ padding: '0 80px' }}>
        {/* 거대 검색 영역 */}
        <section style={{ minHeight: 540, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 0', borderBottom: '1.5px dashed var(--line)' }}>
          <div className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', letterSpacing: '0.2em', marginBottom: 24 }}>
            CALCULATOR · KOREA · 2026
          </div>
          <h1 className="wf-h1" style={{ fontSize: 60, lineHeight: 1, margin: '0 0 32px', textAlign: 'center' }}>
            무엇을 계산하시겠어요?
          </h1>

          {/* 거대 검색바 */}
          <div className="wf-box" style={{ width: 720, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <span style={{ fontFamily: 'Caveat', fontSize: 32, color: 'var(--ink-faint)' }}>?</span>
            <span style={{ fontFamily: 'Patrick Hand', fontSize: 22, color: 'var(--ink-faint)', flex: 1 }}>
              연봉, 양도세, 퇴직금, 주담대 …
            </span>
            <span className="wf-box-soft" style={{ padding: '4px 12px', fontFamily: 'Patrick Hand', fontSize: 13 }}>⌘ K</span>
          </div>
          <span className="wf-note" style={{ marginTop: 16 }}>↑ 입력 즉시 실시간 필터링</span>

          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', alignSelf: 'center' }}>자주 찾는 것 →</span>
            {['연봉 실수령액','양도세','퇴직금','주담대','실업급여','자동차세'].map((p, i) => (
              <span key={i} className="wf-chip" style={{ padding: '4px 12px', fontSize: 13 }}>{p}</span>
            ))}
          </div>
        </section>

        {/* TOP 6 하단 */}
        <section style={{ padding: '56px 0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24 }}>
            <span className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', letterSpacing: '0.15em' }}>POPULAR</span>
            <span className="wf-h1" style={{ fontSize: 30 }}>인기 TOP 6</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, border: '1.5px solid var(--ink)', borderRadius: 6 }}>
            {top6.map((t, i) => (
              <div key={t.num} style={{ padding: 18, borderRight: i < 5 ? '1.5px solid var(--ink)' : 'none' }}>
                <div style={{ fontFamily: 'Caveat', fontSize: 48, color: 'var(--accent)', lineHeight: 0.9, fontWeight: 300 }}>{t.num}</div>
                <div className="wf-h2" style={{ fontSize: 15, marginTop: 8 }}>{t.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.35 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <AdSlot label="AD · 970×90" h={90} note="TOP 6 ↔ 카테고리 사이" />

        {/* 접힌 카테고리 — 한 줄 요약 */}
        <section style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', letterSpacing: '0.15em', marginBottom: 6 }}>
            전체 카테고리 — 클릭으로 펼침
          </div>
          {categories.map((c) => (
            <div key={c.id} className="wf-box" style={{ padding: '14px 22px', display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', width: 30 }}>[{c.id}]</span>
              <span className="wf-h1" style={{ fontSize: 24, minWidth: 110 }}>{c.name}</span>
              <span style={{ flex: 1, fontFamily: 'Gaegu', fontWeight: 700, fontSize: 13.5, color: 'var(--ink-soft)' }}>
                {c.items.map(i => i.name).join(' · ')}
              </span>
              <span className="wf-cta" style={{ fontSize: 24 }}>↓</span>
            </div>
          ))}
        </section>

        <Footer />
      </main>
    </div>
  );
}

window.VariantD = VariantD;
