// Variant B — Editorial (권장)
// 거대 타이틀 + 매거진 스타일 비대칭
const VariantB = () => {
  const cats = [
    { id: '01', name: '부동산', items: ['양도세', '취득세', '종부세', '중개수수료', '전월세 환산', 'LTV/DTI'] },
    { id: '02', name: '세금', items: ['연봉 실수령액', '종합소득세', '부가세', '4대보험', '연말정산'] },
    { id: '03', name: '금융·대출', items: ['주담대', '신용대출', '전세자금', 'DSR', '적금이자', '복리'] },
  ];
  return (
    <div className="wf" style={{ background: '#fafafa', minHeight: '100%', padding: '32px 64px 80px' }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, borderBottom: '1px solid #d4d4d4' }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>계산기 / Korea Life Calc Hub</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888' }}>
          <span style={{ border: '1px solid #d4d4d4', padding: '4px 10px', borderRadius: 4 }}>⌘K Search</span>
          <span>Dark / Light</span>
        </div>
      </div>

      {/* HERO — 매거진 스타일 비대칭 */}
      <div style={{ paddingTop: 96, paddingBottom: 96, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 64, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', color: '#888', textTransform: 'uppercase', marginBottom: 24 }}>ISSUE 01 · 2026</div>
          <h1 style={{ fontSize: 88, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.95, margin: 0, color: '#1a1a1a' }}>
            대한민국에서<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>필요한 모든</span><br />
            계산.
          </h1>
        </div>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16 }}>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.6, marginBottom: 24 }}>
            부동산, 세금, 금융, 노동, 복지, 자동차, 일상까지 — 한국인이 필요한 40개의 계산을 한 페이지에서. 광고 없이, 30초 안에.
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#888' }}>
            <span style={{ border: '1px solid #d4d4d4', padding: '4px 8px' }}>40 calculators</span>
            <span style={{ border: '1px solid #d4d4d4', padding: '4px 8px' }}>7 categories</span>
            <span style={{ border: '1px solid #d4d4d4', padding: '4px 8px' }}>No ads</span>
          </div>
        </div>
      </div>

      {/* TOP 6 — 매거진 헤더 + 큰 숫자 인덱스 */}
      <div style={{ marginBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, paddingBottom: 16, borderBottom: '1px solid #1a1a1a', marginBottom: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}>The Index</div>
          <div style={{ fontSize: 11, color: '#888' }}>이번 주 가장 많이 쓰인 6개의 계산</div>
        </div>
        {[
          ['연봉 실수령액', '세금/4대보험 자동 차감 후 월 실수령'],
          ['양도소득세', '1주택/다주택, 보유기간별 자동 계산'],
          ['퇴직금', '평균임금 기준 법정 퇴직금'],
          ['주택담보대출 한도', 'DSR/LTV 반영 가능 한도'],
          ['종합소득세', '사업소득/근로소득 합산'],
          ['실업급여', '이직 사유·근속 기준 일액·일수'],
        ].map(([name, desc], i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 2fr 80px',
            gap: 32,
            padding: '28px 0',
            borderBottom: '1px solid #ececec',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 56, fontWeight: 300, color: '#bbb', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>0{i + 1}</div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>{name}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{desc}</div>
            <div style={{ fontSize: 18, color: '#bbb', textAlign: 'right' }}>→</div>
          </div>
        ))}
      </div>

      {/* Categories — 비대칭 그리드 */}
      {cats.map((cat) => (
        <div key={cat.id} style={{ marginBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, paddingBottom: 16, borderBottom: '1px solid #1a1a1a', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: '#888', letterSpacing: '0.08em' }}>CATEGORY {cat.id}</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>{cat.name}</div>
            </div>
            <div style={{ fontSize: 12, color: '#888', alignSelf: 'flex-end' }}>{cat.items.length} calculators →</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #ececec', borderRadius: 12, overflow: 'hidden' }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{
                padding: 24,
                borderRight: (i % 3 !== 2) ? '1px solid #ececec' : 'none',
                borderBottom: i < cat.items.length - 3 ? '1px solid #ececec' : 'none',
                background: '#fff',
                minHeight: 110,
              }}>
                <div style={{ fontSize: 10, color: '#aaa', letterSpacing: '0.08em', marginBottom: 8 }}>{cat.id}.{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{item}</div>
                <div style={{ height: 6, width: '60%', background: '#ececec', borderRadius: 2 }}></div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: 40, color: '#bbb', fontSize: 12 }}>— 04 노동, 05 복지, 06 자동차, 07 일상 동일 패턴 —</div>

      {/* footer */}
      <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid #d4d4d4', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888' }}>
        <span>© 2026 계산기</span>
        <span>데이터 출처: 국세청, 고용노동부</span>
        <span>Updated 2026.04</span>
      </div>
    </div>
  );
};
window.VariantB = VariantB;
