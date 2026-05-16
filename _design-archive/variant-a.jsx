// 변형 A — 클래식 사이드바 (240px 좌측 고정 + 우측 메인)
function VariantA() {
  const { top6, categories } = window.CALC_DATA;
  return (
    <div className="wf" style={{ width: 1280, minHeight: 1600, position: 'relative', padding: 0 }}>
      <div className="wf-stamp">A · Sidebar</div>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 1600 }}>
        {/* 사이드바 */}
        <aside style={{ borderRight: '1.5px solid var(--ink)', padding: '24px 18px' }}>
          <div className="wf-h1" style={{ fontSize: 28, marginBottom: 24 }}>계산기</div>
          <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 8 }}>BROWSE</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categories.map((c, i) => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between',
                padding: '8px 10px', fontFamily: 'Gaegu', fontWeight: 700, fontSize: 16,
                background: i === 0 ? 'var(--hl)' : 'transparent', borderRadius: 4 }}>
                <span><span style={{ color: 'var(--ink-faint)', marginRight: 6 }}>{c.id}</span>{c.name}</span>
                <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{c.items.length}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28 }}>
            <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 8 }}>SHORTCUTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'Patrick Hand', fontSize: 13, color: 'var(--ink-soft)' }}>
              <div>⌘ K · 검색</div>
              <div>D · 다크모드</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 24, width: 200 }}>
            <AdSlot label="AD · 160×600 (sky)" h={300} note="좌측 사이드 고정" />
          </div>
        </aside>

        {/* 메인 */}
        <main style={{ padding: '32px 48px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, fontSize: 12,
            color: 'var(--ink-soft)', fontFamily: 'Patrick Hand', marginBottom: 24 }}>
            <span className="wf-box-soft" style={{ padding: '3px 10px' }}>⌘ K  검색</span>
            <span>Dark / Light</span>
          </div>

          {/* HERO */}
          <h1 className="wf-h1" style={{ fontSize: 64, lineHeight: 1.05, margin: '12px 0 14px', maxWidth: 760 }}>
            대한민국에서 필요한<br />모든 <span className="wf-hl">계산</span>
          </h1>
          <div style={{ fontSize: 16, color: 'var(--ink-soft)', fontFamily: 'Patrick Hand', marginBottom: 8 }}>
            40개 생활 계산기 · 광고 없음 · 30초
          </div>
          <span className="wf-note" style={{ display: 'inline-block', marginBottom: 36 }}>
            ↑ H1 72px / -3% 자간
          </span>

          {/* TOP 6 */}
          <SectionHeader id="03" name="인기 TOP 6" count="6" note="↑ 큰 숫자 + 골드" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 56 }}>
            {top6.map((t) => (
              <CalcCard key={t.num} num={t.num} name={t.name} desc={t.desc} top />
            ))}
          </div>

          <AdSlot label="AD · 728×90 (in-content)" h={90} note="자연스러운 본문 사이 1개" />

          {/* 카테고리 섹션들 */}
          <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 56 }}>
            {categories.map((c) => (
              <section key={c.id}>
                <SectionHeader id={c.id} name={c.name} count={c.items.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {c.items.map((it, i) => (
                    <CalcCard key={i} name={it.name} desc={it.desc} time={it.time} dense />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* 함께 쓰는 계산 */}
          <section style={{ marginTop: 64 }}>
            <SectionHeader id="08" name="자주 함께 쓰는 계산" count="—" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontFamily: 'Patrick Hand', fontSize: 14 }}>
              {['양도세 → 취득세','주담대 → DSR','연봉 → 4대보험','퇴직금 → 실업급여','종부세 → 양도세','연말정산 → 종소세'].map((p, i) => (
                <span key={i} className="wf-chip" style={{ padding: '4px 12px', fontSize: 13 }}>{p}</span>
              ))}
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}

window.VariantA = VariantA;
