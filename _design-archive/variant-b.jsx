// 변형 B — Editorial (상단 거대 타이틀 + 매거진 스타일 비대칭) ★ PRD 우선 권장
function VariantB() {
  const { top6, categories } = window.CALC_DATA;
  return (
    <div className="wf" style={{ width: 1280, minHeight: 1700, position: 'relative', padding: 0 }}>
      <div className="wf-stamp">B · Editorial</div>

      <Header variant="B" />

      <main style={{ padding: '0 64px' }}>
        {/* HERO — 매거진 비대칭 */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, padding: '88px 0 48px',
          borderBottom: '1.5px solid var(--ink)' }}>
          <div>
            <div className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', letterSpacing: '0.15em', marginBottom: 18 }}>
              ISSUE 01 · KOREA LIFE · 2026
            </div>
            <h1 className="wf-h1" style={{ fontSize: 96, lineHeight: 0.95, margin: 0, letterSpacing: '-0.04em' }}>
              대한민국에서<br />
              필요한<br />
              <span className="wf-squiggle">모든 계산.</span>
            </h1>
            <span className="wf-note" style={{ display: 'inline-block', marginTop: 12 }}>
              ← H1 96px (PRD 72→96 확대안)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 18, paddingBottom: 12 }}>
            <div className="wf-line-thick" />
            <div style={{ fontFamily: 'Gaegu', fontWeight: 700, fontSize: 18, lineHeight: 1.45 }}>
              세금, 부동산, 노동, 복지 — 한국인이 일상에서 마주치는 모든 숫자를
              <span className="wf-hl"> 30초 </span>안에.
            </div>
            <div style={{ display: 'flex', gap: 14, fontFamily: 'Patrick Hand', fontSize: 14, color: 'var(--ink-soft)' }}>
              <span>40 calculators</span>
              <span>·</span>
              <span>0 ads in-flow</span>
              <span>·</span>
              <span>≤ 30s</span>
            </div>
            <div className="wf-line-thick" />
          </div>
        </section>

        {/* TOP 6 — 큰 숫자 매거진 풍 */}
        <section style={{ padding: '64px 0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
            <span className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', letterSpacing: '0.15em' }}>FEATURED</span>
            <span className="wf-h1" style={{ fontSize: 36 }}>인기 TOP 6</span>
            <span className="wf-note" style={{ marginLeft: 'auto' }}>↓ 호버 시 →  화살표 등장</span>
          </div>

          {/* 큰 1열 + 작은 5열 비대칭 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 0,
            border: '1.5px solid var(--ink)', borderRadius: '6px 8px 5px 7px' }}>
            {/* 큰 카드 */}
            <div style={{ padding: 36, borderRight: '1.5px solid var(--ink)', gridRow: 'span 2' }}>
              <div style={{ fontFamily: 'Caveat', fontSize: 140, lineHeight: 0.9,
                color: 'var(--accent)', fontWeight: 300 }}>01</div>
              <div className="wf-h2" style={{ fontSize: 30, marginTop: 8 }}>{top6[0].name}</div>
              <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5, maxWidth: 320 }}>
                {top6[0].desc}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <span className="wf-chip">⌐ 30초</span>
                <span className="wf-chip">월간 1.2M</span>
              </div>
              <span className="wf-cta" style={{ display: 'block', marginTop: 16, fontSize: 30 }}>→</span>
            </div>
            {/* 작은 5개 */}
            {top6.slice(1).map((t, i) => (
              <div key={t.num} style={{
                padding: 22,
                borderRight: i % 2 === 0 ? '1.5px solid var(--ink)' : 'none',
                borderBottom: i < 3 ? '1.5px solid var(--ink)' : 'none',
                position: 'relative',
              }}>
                <div style={{ fontFamily: 'Caveat', fontSize: 44, color: 'var(--accent)', lineHeight: 1, fontWeight: 300 }}>{t.num}</div>
                <div className="wf-h2" style={{ fontSize: 17, marginTop: 6 }}>{t.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ padding: '8px 0' }}>
          <AdSlot label="AD · 970×90 (leaderboard)" h={90} note="hero ↔ 카테고리 사이 1개만" />
        </div>

        {/* 카테고리 — Editorial: 좌측 라벨 + 우측 카드 6열 */}
        <section style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', gap: 56 }}>
          {categories.map((c) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32 }}>
              <div style={{ position: 'sticky', top: 20 }}>
                <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.15em' }}>
                  CATEGORY {c.id}
                </div>
                <div className="wf-h1" style={{ fontSize: 38, lineHeight: 1, marginTop: 6 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'Patrick Hand', marginTop: 4 }}>
                  {c.items.length} calculators
                </div>
                <div className="wf-line" style={{ marginTop: 10, width: 60 }} />
              </div>
              <div style={{ display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(c.items.length, 3)}, 1fr)`,
                gap: 0, border: '1.5px solid var(--line)', borderRadius: 6 }}>
                {c.items.map((it, i) => {
                  const cols = Math.min(c.items.length, 3);
                  const isLastCol = (i + 1) % cols === 0;
                  const isLastRow = i >= c.items.length - cols;
                  return (
                    <div key={i} style={{
                      padding: 18,
                      borderRight: isLastCol ? 'none' : '1.5px solid var(--line)',
                      borderBottom: isLastRow ? 'none' : '1.5px solid var(--line)',
                    }}>
                      <div className="wf-h2" style={{ fontSize: 17 }}>{it.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.4, minHeight: 32 }}>
                        {it.desc}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                        <span className="wf-chip">⌐ {it.time}</span>
                        <span className="wf-cta">→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* 관련 calculator chain */}
        <section style={{ padding: '40px 0 0', borderTop: '1.5px solid var(--ink)' }}>
          <div className="wf-mono" style={{ fontSize: 12, color: 'var(--ink-faint)', letterSpacing: '0.15em' }}>RELATED FLOWS</div>
          <div className="wf-h1" style={{ fontSize: 32, marginTop: 4, marginBottom: 20 }}>자주 함께 쓰는 계산</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontFamily: 'Gaegu', fontWeight: 700, fontSize: 15 }}>
            {['양도세 → 취득세 → 종부세','연봉 → 4대보험 → 연말정산','주담대 → DSR → LTV','퇴직금 → 실업급여 → 국민연금'].map((p, i) => (
              <span key={i} className="wf-box" style={{ padding: '6px 14px' }}>{p}</span>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

window.VariantB = VariantB;
