// 변형 C — Dense Index (사이드바 + 모든 계산기 한 화면 노출, 컴팩트)
function VariantC() {
  const { top6, categories } = window.CALC_DATA;
  return (
    <div className="wf" style={{ width: 1280, minHeight: 1500, position: 'relative', padding: 0 }}>
      <div className="wf-stamp">C · Dense Index</div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 220px', minHeight: 1500 }}>
        {/* 좌측 카테고리 인덱스 */}
        <aside style={{ borderRight: '1.5px solid var(--ink)', padding: '20px 16px', position: 'sticky', top: 0, alignSelf: 'start' }}>
          <div className="wf-h1" style={{ fontSize: 24, marginBottom: 18 }}>계산기</div>
          <div className="wf-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.15em', marginBottom: 8 }}>JUMP TO</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'Gaegu', fontWeight: 700 }}>
            {categories.map((c) => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', fontSize: 14, borderBottom: '1px dashed var(--line-soft)' }}>
                <span><span style={{ color: 'var(--ink-faint)', marginRight: 4 }}>{c.id}</span>{c.name}</span>
                <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>{c.items.length}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 24, fontFamily: 'Patrick Hand', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            전체 <b>40</b>개<br />업데이트 4.30
          </div>
        </aside>

        {/* 메인 — 모든 계산기 dense */}
        <main style={{ padding: '20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <h1 className="wf-h1" style={{ fontSize: 38, margin: 0 }}>
              모든 계산, 한 화면에. <span className="wf-note">↘ 스크롤 없이</span>
            </h1>
            <span className="wf-box-soft" style={{ padding: '3px 10px', fontFamily: 'Patrick Hand', fontSize: 13 }}>⌘ K  검색</span>
          </div>

          {/* TOP 6 — 한 줄 띠 */}
          <div className="wf-box" style={{ padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 0 }}>
            <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', borderRight: '1.5px solid var(--ink)', paddingRight: 6, marginRight: 14, letterSpacing: '0.2em' }}>
              TOP 6
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, flex: 1 }}>
              {top6.map((t) => (
                <div key={t.num}>
                  <div style={{ fontFamily: 'Caveat', fontSize: 38, color: 'var(--accent)', lineHeight: 0.9, fontWeight: 300 }}>{t.num}</div>
                  <div className="wf-h2" style={{ fontSize: 14, marginTop: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.35 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리 — 좁은 행, 4-6열 dense */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {categories.map((c) => (
              <section key={c.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, borderBottom: '1.2px solid var(--ink)', paddingBottom: 4, marginBottom: 8 }}>
                  <span className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>[{c.id}]</span>
                  <span className="wf-h2" style={{ fontSize: 17 }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{c.items.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {c.items.map((it, i) => (
                    <div key={i} className="wf-box-soft" style={{ padding: '10px 12px', minHeight: 78 }}>
                      <div className="wf-h2" style={{ fontSize: 13.5, lineHeight: 1.2 }}>{it.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.3 }}>{it.desc}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 6, fontFamily: 'Patrick Hand' }}>⌐ {it.time}  →</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Footer />
        </main>

        {/* 우측 광고/관련 패널 */}
        <aside style={{ borderLeft: '1.5px solid var(--ink)', padding: '20px 16px' }}>
          <AdSlot label="AD · 300×250" h={250} note="우측 컬럼 상단" />
          <div style={{ marginTop: 24 }}>
            <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.15em', marginBottom: 8 }}>RELATED</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'Gaegu', fontWeight: 700, fontSize: 13 }}>
              {['양도세 → 취득세','주담대 → DSR','연봉 → 연말정산','퇴직금 → 실업급여'].map((p, i) => (
                <div key={i} className="wf-box-soft" style={{ padding: '6px 10px' }}>{p}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <AdSlot label="AD · 300×600" h={500} note="sticky 가능" />
          </div>
        </aside>
      </div>
    </div>
  );
}

window.VariantC = VariantC;
