// 변형 E — 2열 비대칭 (좌측 큰 TOP 1 인라인 모달 + 우측 카테고리)
function VariantE() {
  const { top6, categories } = window.CALC_DATA;
  return (
    <div className="wf" style={{ width: 1280, minHeight: 1700, position: 'relative', padding: 0 }}>
      <div className="wf-stamp">E · Inline TOP 1</div>

      <Header variant="E" />

      <main style={{ padding: '40px 56px' }}>
        <h1 className="wf-h1" style={{ fontSize: 56, lineHeight: 1, margin: '0 0 8px' }}>
          대한민국 모든 계산.
        </h1>
        <div style={{ fontSize: 15, color: 'var(--ink-soft)', fontFamily: 'Patrick Hand', marginBottom: 32 }}>
          40개 생활 계산기 · 광고 없음 · 30초
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 32 }}>
          {/* 좌측 — TOP 1 인라인 작동 모달 */}
          <div>
            <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.15em', marginBottom: 8 }}>
              FEATURED · 가장 많이 쓰는
            </div>
            <div className="wf-box" style={{ padding: 28, position: 'relative' }}>
              <div style={{ fontFamily: 'Caveat', fontSize: 60, color: 'var(--accent)', lineHeight: 0.9, fontWeight: 300 }}>01</div>
              <div className="wf-h1" style={{ fontSize: 36, marginTop: 4 }}>연봉 실수령액</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 22 }}>
                내 연봉의 월 실수령액을 30초 안에
              </div>

              {/* 입력 영역 placeholder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'Patrick Hand', marginBottom: 4 }}>연봉 (만원)</div>
                  <div className="wf-box-soft" style={{ padding: '12px 14px', fontFamily: 'Caveat', fontSize: 24, color: 'var(--ink-faint)' }}>
                    예: 4,800
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'Patrick Hand', marginBottom: 4 }}>부양가족</div>
                    <div className="wf-box-soft" style={{ padding: '10px 12px', fontFamily: 'Caveat', fontSize: 20, color: 'var(--ink-faint)' }}>1</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'Patrick Hand', marginBottom: 4 }}>20세 이하 자녀</div>
                    <div className="wf-box-soft" style={{ padding: '10px 12px', fontFamily: 'Caveat', fontSize: 20, color: 'var(--ink-faint)' }}>0</div>
                  </div>
                </div>

                {/* 결과 영역 */}
                <div className="wf-hatch-soft wf-box-soft" style={{ padding: 20, marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'Patrick Hand', marginBottom: 4 }}>월 실수령액 (예상)</div>
                  <div style={{ fontFamily: 'Caveat', fontSize: 56, color: 'var(--accent)', lineHeight: 1, fontWeight: 300 }}>
                    3,420,000 원
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'Patrick Hand', marginTop: 8, display: 'flex', gap: 14 }}>
                    <span>소득세 −280k</span>
                    <span>4대보험 −410k</span>
                    <span>지방세 −28k</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <span className="wf-chip">⌐ 30초</span>
                  <span className="wf-chip">2026 기준</span>
                  <span className="wf-cta" style={{ marginLeft: 'auto' }}>전체 화면 →</span>
                </div>
              </div>
              <span className="wf-note" style={{ position: 'absolute', top: -16, right: 12 }}>
                인라인 작동 ✓
              </span>
            </div>

            {/* 다른 TOP 5 작은 리스트 */}
            <div style={{ marginTop: 24 }}>
              <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.15em', marginBottom: 8 }}>
                다음 인기
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {top6.slice(1).map((t) => (
                  <div key={t.num} style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 4px', borderBottom: '1px dashed var(--line)' }}>
                    <span style={{ fontFamily: 'Caveat', fontSize: 24, color: 'var(--accent)', width: 32, fontWeight: 300 }}>{t.num}</span>
                    <span className="wf-h2" style={{ fontSize: 16, minWidth: 140 }}>{t.name}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', flex: 1 }}>{t.desc}</span>
                    <span className="wf-cta">→</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <AdSlot label="AD · 728×90 (좌측 컬럼 하단)" h={90} />
            </div>
          </div>

          {/* 우측 — 카테고리 컴팩트 리스트 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.15em' }}>BROWSE ALL</span>
              <span className="wf-box-soft" style={{ padding: '3px 10px', fontFamily: 'Patrick Hand', fontSize: 12, marginLeft: 'auto' }}>⌘ K  검색</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {categories.map((c) => (
                <div key={c.id} className="wf-box" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                    <span className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>[{c.id}]</span>
                    <span className="wf-h1" style={{ fontSize: 22 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-faint)', marginLeft: 'auto' }}>{c.items.length}개</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4, fontFamily: 'Gaegu', fontWeight: 700, fontSize: 13 }}>
                    {c.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed var(--line-soft)' }}>
                        <span>{it.name}</span>
                        <span style={{ color: 'var(--ink-faint)', fontSize: 11, fontFamily: 'Patrick Hand' }}>{it.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

window.VariantE = VariantE;
