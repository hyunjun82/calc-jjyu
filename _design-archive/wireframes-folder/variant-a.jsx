// Variant A — Classic Sidebar
// 좌측 240px 고정 사이드바 + 우측 메인 콘텐츠
const VariantA = () => {
  const cats = [
    { id: '01', name: '부동산', count: 6 },
    { id: '02', name: '세금', count: 5 },
    { id: '03', name: '금융·대출', count: 6 },
    { id: '04', name: '노동', count: 6 },
    { id: '05', name: '복지', count: 4 },
    { id: '06', name: '자동차', count: 5 },
    { id: '07', name: '일상', count: 6 },
  ];
  const top6 = [
    '연봉 실수령액', '양도소득세', '퇴직금',
    '주택담보대출 한도', '종합소득세', '실업급여'
  ];
  const cards = [
    '양도세', '취득세', '종부세', '중개수수료', '전월세 환산', 'LTV/DTI',
  ];
  return (
    <div className="wf" style={{ display: 'flex', minHeight: '100%', background: '#fafafa' }}>
      {/* sidebar */}
      <aside style={{ width: 240, borderRight: '1px solid #d4d4d4', padding: '32px 24px', background: '#fff' }}>
        <div className="wf-logo" style={{ fontSize: 18, fontWeight: 600, marginBottom: 40, letterSpacing: '-0.02em' }}>계산기</div>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>카테고리</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cats.map((c, i) => (
            <li key={c.id} style={{
              padding: '10px 12px',
              fontSize: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 6,
              background: i === 0 ? '#f0f0f0' : 'transparent',
              color: '#333'
            }}>
              <span><span style={{ color: '#aaa', marginRight: 8, fontVariantNumeric: 'tabular-nums' }}>{c.id}</span>{c.name}</span>
              <span style={{ fontSize: 11, color: '#aaa', fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', paddingTop: 40, fontSize: 11, color: '#aaa' }}>※ 광고 없음</div>
      </aside>

      {/* main */}
      <main style={{ flex: 1, padding: '48px 56px', overflow: 'hidden' }}>
        {/* top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 56, fontSize: 12, color: '#888' }}>
          <span style={{ border: '1px solid #d4d4d4', padding: '4px 10px', borderRadius: 4 }}>⌘K 검색</span>
          <span>Dark / Light</span>
        </div>

        {/* hero */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#222' }}>
            대한민국에서 필요한<br />모든 계산
          </div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 16 }}>40개 생활 계산기 · 광고 없음 · 30초</div>
        </div>

        {/* TOP 6 */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #d4d4d4' }}>
            <div style={{ fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>인기 TOP 6</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>이번 주 기준</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid #ececec' }}>
            {top6.map((t, i) => (
              <div key={i} style={{
                padding: '20px 18px',
                borderRight: (i % 3 !== 2) ? '1px solid #ececec' : 'none',
                borderBottom: '1px solid #ececec',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 36, fontWeight: 300, color: '#bbb', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 4 }}>{t}</div>
                  <div style={{ height: 8, background: '#ececec', width: '80%', borderRadius: 2 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* category section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #d4d4d4' }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>01 부동산</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>6 calculators</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {cards.map((c, i) => (
              <div key={i} style={{ border: '1px solid #d4d4d4', padding: 24, borderRadius: 12, background: '#fff', minHeight: 120 }}>
                <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>부동산</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{c}</div>
                <div style={{ height: 6, width: '70%', background: '#ececec', borderRadius: 2, marginBottom: 16 }}></div>
                <div style={{ fontSize: 11, color: '#888', border: '1px solid #d4d4d4', display: 'inline-block', padding: '2px 8px', borderRadius: 4 }}>30초</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 40, color: '#bbb', fontSize: 12 }}>— 02 세금, 03 금융, 04 노동 ... 계속 —</div>
        </div>
      </main>
    </div>
  );
};
window.VariantA = VariantA;
