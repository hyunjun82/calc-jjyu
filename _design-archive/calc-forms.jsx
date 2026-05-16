/* global React */
// ============================================================
// 추가 계산기 4종의 폼 컴포넌트
// 연봉 계산기와 동일한 v2 패턴: 프리셋 → 입력 + 한국식 단위 → 결과 카드(도넛/비교) → 분해
// ============================================================

// ----- 공통 빌딩 블록 -----
function NumberField({ label, hint, value, setValue, max = 100000, suffix = '만원', withReadout = true }) {
  return (
    <div className="field">
      <label>{label} {hint && <span className="hint">{hint}</span>}</label>
      <div className="input-wrap">
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString()}
          onChange={(e) => {
            const n = +e.target.value.replace(/[^0-9]/g, '') || 0;
            setValue(Math.min(max, Math.max(0, n)));
          }}
        />
        <span className="suffix">{suffix}</span>
      </div>
      {withReadout && (
        <div className="unit-readout">
          <span className="korean">{window.manToKorean(value) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{window.fmtKRW(value * 10000)}원</span>
        </div>
      )}
    </div>
  );
}

function SegSel({ label, hint, value, setValue, options }) {
  return (
    <div className="field">
      <label>{label} {hint && <span className="hint">{hint}</span>}</label>
      <div className="seg" role="group">
        {options.map(o => (
          <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => setValue(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segs, total, centerLabel, centerValue }) {
  const C = 2 * Math.PI * 60;
  let off = 0;
  const arcs = segs.map(s => {
    const len = (s.value / total) * C;
    const arc = { ...s, dasharray: `${Math.max(0, len)} ${C}`, dashoffset: -off };
    off += len;
    return arc;
  });
  return (
    <div className="donut">
      <svg viewBox="0 0 160 160" width="140" height="140">
        <circle cx="80" cy="80" r="60" fill="none" stroke="var(--hair)" strokeWidth="22" />
        {arcs.map(a => (
          <circle key={a.key} cx="80" cy="80" r="60" fill="none"
            stroke={a.color} strokeWidth="22"
            strokeDasharray={a.dasharray} strokeDashoffset={a.dashoffset}
            transform="rotate(-90 80 80)" strokeLinecap="butt"
          />
        ))}
        <text x="80" y="76" textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)" letterSpacing="0.1em">{centerLabel}</text>
        <text x="80" y="94" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ink)" fontFamily="var(--font-sans)">{centerValue}</text>
      </svg>
      <div className="legend">
        {arcs.map(a => (
          <div key={a.key} className="legend-row">
            <span className="legend-dot" style={{ background: a.color }}></span>
            <span className="legend-label">{a.label}</span>
            <span className="legend-val t-num">{Math.round((a.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedCalcs({ items }) {
  return (
    <div className="related-calcs">
      <div className="related-head">
        <span className="t-eyebrow">다음에 해볼만한 계산</span>
        <span className="related-hint">함께 보면 좋은 계산기</span>
      </div>
      <div className="related-grid">
        {items.map((it, i) => (
          <a key={i} className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">{String(i + 2).padStart(2, '0')}</div>
            <div className="related-name">{it.name}</div>
            <div className="related-desc">{it.desc}</div>
            <span className="related-arrow">{window.Ic.arrow(14)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 1) 퇴직금
// ============================================================
function SeveranceForm() {
  const [avgMonthly, setAvg] = React.useState(350);
  const [years, setYears] = React.useState(5);
  const [months, setMonths] = React.useState(0);
  const r = React.useMemo(() => window.computeSeverance({ avgMonthlyMan: avgMonthly, yearsServed: years, monthsServed: months }), [avgMonthly, years, months]);
  const presets = [
    { label: '3년', y: 3, m: 0 },
    { label: '5년', y: 5, m: 0 },
    { label: '10년', y: 10, m: 0 },
    { label: '15년', y: 15, m: 0 },
    { label: '20년+', y: 20, m: 0 },
  ];

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>월급</div>
        <div className="step done"><span className="dot">2</span>근속</div>
        <div className="step active"><span className="dot">3</span>퇴직금</div>
      </div>

      <div className="preset-row">
        <span className="preset-label">빠른 선택</span>
        {presets.map(p => (
          <button key={p.label} className={`preset-chip ${years === p.y && months === p.m ? 'on' : ''}`}
            onClick={() => { setYears(p.y); setMonths(p.m); }}>{p.label}</button>
        ))}
      </div>

      <NumberField label="최근 3개월 평균 월급" hint="세전, 만원" value={avgMonthly} setValue={setAvg} max={50000} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>근속 연수</label>
          <div className="input-wrap">
            <input type="number" value={years} min="0" max="40" onChange={(e) => setYears(+e.target.value || 0)} />
            <span className="suffix">년</span>
          </div>
        </div>
        <div className="field">
          <label>+ 추가 개월 수</label>
          <div className="input-wrap">
            <input type="number" value={months} min="0" max="11" onChange={(e) => setMonths(+e.target.value || 0)} />
            <span className="suffix">개월</span>
          </div>
        </div>
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">예상 퇴직금 (세전)</div>
          <div className="big t-num">{window.fmtKRW(r.severance)}<small>원</small></div>
          <div className="sub">
            <div>재직일수 <b className="t-num">{r.days.toLocaleString()}일</b></div>
            <div>1일 평균임금 <b className="t-num">{window.fmtKRW(r.avgDaily)}원</b></div>
            <div>세후 예상 <b className="t-num">{window.fmtKRW(r.net)}원</b></div>
          </div>
          <div className="compare-line">
            <span className="compare-tag">근로기준법 제34조 기준</span>
            <span className="compare-note">실제는 퇴직 시점 평균임금 기준</span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'net', label: '세후 수령', value: r.net, color: 'var(--accent)' },
            { key: 'tax', label: '퇴직소득세', value: r.tax, color: '#C2553C' },
          ]}
          total={r.severance}
          centerLabel="NET"
          centerValue={`${Math.round((r.net / r.severance) * 100)}%`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>계산 과정 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>최근 3개월 임금총액</span><span className="v t-num">{window.fmtKRW(avgMonthly * 10000 * 3)}원</span></div>
          <div className="row"><span>÷ 90일 = 1일 평균임금</span><span className="v t-num">{window.fmtKRW(r.avgDaily)}원</span></div>
          <div className="row"><span>× 30일 × (재직일수 / 365)</span><span className="v t-num">{window.fmtKRW(r.severance)}원</span></div>
          <div className="row"><span>− 퇴직소득세 (간이)</span><span className="v neg t-num">− {window.fmtKRW(r.tax)}원</span></div>
          <div className="row tot"><span>최종 수령 예상</span><span className="v t-num">{window.fmtKRW(r.net)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '실업급여', desc: '퇴직 후 받을 수 있는 급여' },
        { name: '국민연금 예상', desc: '노후 연금 수령액' },
        { name: '연봉 실수령액', desc: '재취업 시 월급 계산' },
      ]} />
    </>
  );
}

// ============================================================
// 2) 주담대 한도
// ============================================================
function MortgageForm() {
  const [house, setHouse] = React.useState(80000);   // 8억
  const [income, setIncome] = React.useState(6000);  // 6천
  const [ltv, setLtv] = React.useState(70);
  const [dsr, setDsr] = React.useState(40);
  const [rate, setRate] = React.useState(4.5);
  const [years, setYears] = React.useState(30);
  const r = React.useMemo(() => window.computeMortgage({
    housePriceMan: house, annualIncomeMan: income, ltv, dsr, rate, years,
  }), [house, income, ltv, dsr, rate, years]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>주택가</div>
        <div className="step done"><span className="dot">2</span>소득·조건</div>
        <div className="step active"><span className="dot">3</span>한도</div>
      </div>

      <NumberField label="주택 가격" hint="매매가, 만원" value={house} setValue={setHouse} max={500000} />
      <NumberField label="연 소득" hint="세전, 만원" value={income} setValue={setIncome} max={100000} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>LTV (담보 인정 비율) <span className="hint">{ltv}%</span></label>
          <input type="range" className="slider" min="40" max="80" step="5" value={ltv} onChange={(e) => setLtv(+e.target.value)} />
          <div className="slider-ticks"><span>40</span><span>50</span><span>60</span><span>70</span><span>80</span></div>
        </div>
        <div className="field">
          <label>DSR (총부채상환비율) <span className="hint">{dsr}%</span></label>
          <input type="range" className="slider" min="30" max="50" step="5" value={dsr} onChange={(e) => setDsr(+e.target.value)} />
          <div className="slider-ticks"><span>30</span><span>35</span><span>40</span><span>45</span><span>50</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <SegSel label="대출 금리" hint="연이율" value={rate} setValue={setRate}
          options={[{value: 3.5, label: '3.5%'}, {value: 4.0, label: '4.0%'}, {value: 4.5, label: '4.5%'}, {value: 5.0, label: '5.0%'}, {value: 5.5, label: '5.5%'}]} />
        <SegSel label="대출 기간" value={years} setValue={setYears}
          options={[{value: 10, label: '10년'}, {value: 20, label: '20년'}, {value: 30, label: '30년'}, {value: 40, label: '40년'}]} />
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">대출 가능 한도</div>
          <div className="big t-num">{window.fmtKRW(r.finalLimit)}<small>원</small></div>
          <div className="sub">
            <div>월 상환액 <b className="t-num">{window.fmtKRW(r.monthlyPayment)}원</b></div>
            <div>총 이자 <b className="t-num">{window.fmtKRW(r.totalInterest)}원</b></div>
            <div>소득 대비 <b className="t-num">{r.incomeRatio.toFixed(1)}%</b></div>
          </div>
          <div className="compare-line">
            <span className={`compare-pill ${r.bottleneck === 'LTV' ? 'down' : 'up'}`}>
              {r.bottleneck} 제한
            </span>
            <span className="compare-note">
              LTV 한도 {window.fmtKRW(r.limitLtv)}원 · DSR 한도 {window.fmtKRW(r.limitDsr)}원 중 낮은 값
            </span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'limit', label: '대출 가능', value: r.finalLimit, color: 'var(--accent)' },
            { key: 'down', label: '자기자금', value: Math.max(0, house * 10000 - r.finalLimit), color: '#6B8E50' },
          ]}
          total={house * 10000}
          centerLabel="LOAN"
          centerValue={`${Math.round((r.finalLimit / (house * 10000)) * 100)}%`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>계산 과정 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>주택가 × LTV {ltv}%</span><span className="v t-num">{window.fmtKRW(r.limitLtv)}원</span></div>
          <div className="row"><span>연소득 × DSR {dsr}% (원리금 환산)</span><span className="v t-num">{window.fmtKRW(r.limitDsr)}원</span></div>
          <div className="row tot"><span>최종 한도 (낮은 값)</span><span className="v t-num">{window.fmtKRW(r.finalLimit)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '취득세', desc: '주택 매수 시 세금' },
        { name: '중개수수료', desc: '거래금액별 법정 상한' },
        { name: 'DSR 계산기', desc: '총부채원리금상환비율' },
      ]} />
    </>
  );
}

// ============================================================
// 3) 종합소득세
// ============================================================
function IncomeTaxForm() {
  const [biz, setBiz] = React.useState(3000);
  const [emp, setEmp] = React.useState(0);
  const [ded, setDed] = React.useState(300);
  const r = React.useMemo(() => window.computeIncomeTax({
    businessIncomeMan: biz, employmentIncomeMan: emp, deductionsMan: ded,
  }), [biz, emp, ded]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>소득 입력</div>
        <div className="step done"><span className="dot">2</span>공제</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <NumberField label="사업 소득" hint="연 총수입, 만원" value={biz} setValue={setBiz} max={500000} />
      <NumberField label="근로 소득" hint="연봉, 만원" value={emp} setValue={setEmp} max={500000} />
      <NumberField label="추가 소득공제" hint="신용카드, 보험 등, 만원" value={ded} setValue={setDed} max={5000} />

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">납부할 세액 (소득세 + 지방세)</div>
          <div className="big t-num">{window.fmtKRW(r.totalTax)}<small>원</small></div>
          <div className="sub">
            <div>과세표준 <b className="t-num">{window.fmtKRW(r.taxBase)}원</b></div>
            <div>적용 세율 <b className="t-num">{(r.appliedRate * 100).toFixed(0)}%</b></div>
            <div>실효세율 <b className="t-num">{r.effectiveRate.toFixed(1)}%</b></div>
          </div>
          <div className="compare-line">
            <span className="compare-tag">2026 누진세율표 기준</span>
            <span className="compare-note">실제는 가족·의료비 등 추가 공제 가능</span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'income', label: '실수입', value: Math.max(0, r.totalIncome - r.totalTax), color: 'var(--accent)' },
            { key: 'tax', label: '세금', value: r.tax, color: '#C2553C' },
            { key: 'local', label: '지방세', value: r.localTax, color: '#B5803C' },
          ]}
          total={Math.max(1, r.totalIncome)}
          centerLabel="TAX"
          centerValue={`${r.effectiveRate.toFixed(0)}%`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>누진세율 적용 과정 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>종합소득 금액</span><span className="v t-num">{window.fmtKRW(r.totalIncome)}원</span></div>
          <div className="row"><span>− 인적공제 + 추가공제</span><span className="v neg t-num">− {window.fmtKRW(1_500_000 + ded * 10000)}원</span></div>
          <div className="row"><span>과세표준</span><span className="v t-num">{window.fmtKRW(r.taxBase)}원</span></div>
          <div className="row"><span>× 누진세율 {(r.appliedRate * 100).toFixed(0)}%</span><span className="v t-num">{window.fmtKRW(r.tax)}원</span></div>
          <div className="row"><span>+ 지방소득세 (10%)</span><span className="v t-num">+ {window.fmtKRW(r.localTax)}원</span></div>
          <div className="row tot"><span>총 납부세액</span><span className="v neg t-num">− {window.fmtKRW(r.totalTax)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '부가가치세', desc: '사업자 매출/매입' },
        { name: '연말정산 환급', desc: '근로자 환급액' },
        { name: '4대보험료', desc: '국민·건강·고용·산재' },
      ]} />
    </>
  );
}

// ============================================================
// 4) 실업급여
// ============================================================
function UnemploymentForm() {
  const [daily, setDaily] = React.useState(12);
  const [age, setAge] = React.useState('50미만');
  const [insured, setInsured] = React.useState(3);
  const r = React.useMemo(() => window.computeUnemployment({
    avgDailyWageMan: daily, ageGroup: age, insuredYears: insured,
  }), [daily, age, insured]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>평균임금</div>
        <div className="step done"><span className="dot">2</span>가입기간</div>
        <div className="step active"><span className="dot">3</span>급여액</div>
      </div>

      <div className="field">
        <label>이직 전 1일 평균임금 <span className="hint">월급 ÷ 30일, 만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={daily.toLocaleString()}
            onChange={(e) => setDaily(Math.min(100, Math.max(0, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">월급 약 {(daily * 30).toLocaleString()}만원</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{window.fmtKRW(daily * 10000)}원 / 일</span>
        </div>
      </div>

      <SegSel label="연령" value={age} setValue={setAge}
        options={[{value: '50미만', label: '50세 미만'}, {value: '50이상', label: '50세 이상 / 장애인'}]} />

      <div className="field">
        <label>고용보험 가입기간 <span className="hint">{insured}년</span></label>
        <input type="range" className="slider" min="0" max="20" step="1" value={insured} onChange={(e) => setInsured(+e.target.value)} />
        <div className="slider-ticks"><span>0</span><span>1년</span><span>3년</span><span>5년</span><span>10년+</span></div>
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">예상 총 수령액</div>
          <div className="big t-num">{window.fmtKRW(r.total)}<small>원</small></div>
          <div className="sub">
            <div>1일 급여 <b className="t-num">{window.fmtKRW(r.dailyBenefit)}원</b></div>
            <div>월 환산 <b className="t-num">{window.fmtKRW(r.monthly)}원</b></div>
            <div>지급일수 <b className="t-num">{r.days}일</b></div>
          </div>
          <div className="compare-line">
            {r.isMax && <span className="compare-pill down">상한 적용 (1일 66,000원)</span>}
            {r.isMin && <span className="compare-pill up">하한 적용 (최저시급 80%)</span>}
            {!r.isMax && !r.isMin && <span className="compare-tag">평균임금 60% 기준</span>}
            <span className="compare-note">{age} · 가입 {insured}년</span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'days', label: `지급 ${r.days}일`, value: r.days, color: 'var(--accent)' },
            { key: 'rest', label: '미지급', value: Math.max(0, 270 - r.days), color: 'var(--hair)' },
          ]}
          total={270}
          centerLabel="일수"
          centerValue={`${r.days}`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>지급 기준 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>이직 전 평균임금 × 60%</span><span className="v t-num">{window.fmtKRW(daily * 10000 * 0.6)}원</span></div>
          <div className="row"><span>적용 1일 급여 (상·하한 적용)</span><span className="v t-num">{window.fmtKRW(r.dailyBenefit)}원</span></div>
          <div className="row"><span>× 지급일수</span><span className="v t-num">{r.days}일</span></div>
          <div className="row tot"><span>예상 총 수령액</span><span className="v t-num">{window.fmtKRW(r.total)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '퇴직금', desc: '근속 1년 이상 시' },
        { name: '연봉 실수령액', desc: '재취업 시 월급 계산' },
        { name: '국민연금 예상', desc: '노후 연금 수령액' },
      ]} />
    </>
  );
}

window.SeveranceForm = SeveranceForm;
window.MortgageForm = MortgageForm;
window.IncomeTaxForm = IncomeTaxForm;
window.UnemploymentForm = UnemploymentForm;

// ============================================================
// 5) 양도소득세
// ============================================================
function CapitalGainsForm() {
  const [acquire, setAcquire] = React.useState(50000);  // 5억
  const [sale, setSale] = React.useState(80000);        // 8억
  const [expenses, setExpenses] = React.useState(1500); // 1500만
  const [yearsHeld, setYearsHeld] = React.useState(5);
  const [yearsLived, setYearsLived] = React.useState(5);
  const [status, setStatus] = React.useState('one_under12');

  const r = React.useMemo(() => window.computeCapitalGains({
    acquirePriceMan: acquire, salePriceMan: sale, expensesMan: expenses,
    yearsHeld, yearsLived, houseStatus: status,
  }), [acquire, sale, expenses, yearsHeld, yearsLived, status]);

  const isNontax = r.status === 'nontax';

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>가격</div>
        <div className="step done"><span className="dot">2</span>주택수·기간</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <SegSel label="주택 보유 상황" hint="세율과 공제가 달라집니다" value={status} setValue={setStatus}
        options={[
          { value: 'one_under12', label: '1주택 (12억↓)' },
          { value: 'one_over12', label: '1주택 (12억↑)' },
          { value: 'multi', label: '다주택' },
        ]} />

      <NumberField label="취득가액" hint="구매 당시 가격, 만원" value={acquire} setValue={setAcquire} max={500000} />
      <NumberField label="양도가액" hint="매도 가격, 만원" value={sale} setValue={setSale} max={500000} />
      <NumberField label="필요경비" hint="취득세·중개수수료·인테리어, 만원" value={expenses} setValue={setExpenses} max={50000} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>보유 기간 <span className="hint">{yearsHeld}년</span></label>
          <input type="range" className="slider" min="0" max="20" step="1" value={yearsHeld}
            onChange={(e) => setYearsHeld(+e.target.value)} />
          <div className="slider-ticks"><span>0</span><span>2년</span><span>5년</span><span>10년</span><span>20년+</span></div>
        </div>
        <div className="field">
          <label>거주 기간 <span className="hint">{yearsLived}년 · 1주택만 영향</span></label>
          <input type="range" className="slider" min="0" max="20" step="1" value={yearsLived}
            onChange={(e) => setYearsLived(+e.target.value)} />
          <div className="slider-ticks"><span>0</span><span>2년</span><span>5년</span><span>10년</span><span>20년+</span></div>
        </div>
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">{isNontax ? '비과세 (납부 없음)' : '납부할 양도소득세'}</div>
          <div className="big t-num">
            {isNontax ? '0' : window.fmtKRW(r.totalTax)}<small>원</small>
          </div>
          <div className="sub">
            <div>양도차익 <b className="t-num">{window.fmtKRW(r.gain)}원</b></div>
            {!isNontax && <div>장특공제 <b className="t-num">{(r.ltcdRate * 100).toFixed(0)}% / {window.fmtKRW(r.ltcd)}원</b></div>}
            <div>실 수익 <b className="t-num">{window.fmtKRW(r.netGain)}원</b></div>
          </div>
          <div className="compare-line">
            <span className={`compare-pill ${isNontax ? 'up' : 'down'}`}>
              {isNontax ? '✓ 비과세' : `${(r.appliedRate * 100).toFixed(0)}% 세율 적용`}
            </span>
            <span className="compare-note">{r.message}</span>
          </div>
        </div>
        <DonutChart
          segs={isNontax ? [
            { key: 'net', label: '실 수익', value: r.gain || 1, color: 'var(--accent)' },
          ] : [
            { key: 'net', label: '실 수익', value: Math.max(0, r.netGain), color: 'var(--accent)' },
            { key: 'tax', label: '양도세', value: r.tax, color: '#C2553C' },
            { key: 'local', label: '지방세', value: r.localTax, color: '#B5803C' },
          ]}
          total={Math.max(1, r.gain)}
          centerLabel="NET"
          centerValue={r.gain > 0 ? `${Math.round((Math.max(0, r.netGain) / r.gain) * 100)}%` : '—'}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>계산 과정 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>양도가액 − 취득가액 − 경비</span><span className="v t-num">{window.fmtKRW(r.gain)}원</span></div>
          {!isNontax && <>
            <div className="row"><span>과세대상 양도차익</span><span className="v t-num">{window.fmtKRW(r.taxableBase)}원</span></div>
            <div className="row"><span>− 장기보유특별공제 ({(r.ltcdRate * 100).toFixed(0)}%)</span><span className="v neg t-num">− {window.fmtKRW(r.ltcd)}원</span></div>
            <div className="row"><span>− 양도소득 기본공제 (250만)</span><span className="v neg t-num">− 2,500,000원</span></div>
            <div className="row"><span>과세표준</span><span className="v t-num">{window.fmtKRW(r.taxableGain)}원</span></div>
            <div className="row"><span>× 양도세율 {(r.appliedRate * 100).toFixed(0)}%</span><span className="v t-num">{window.fmtKRW(r.tax)}원</span></div>
            <div className="row"><span>+ 지방소득세 (10%)</span><span className="v t-num">+ {window.fmtKRW(r.localTax)}원</span></div>
            <div className="row tot"><span>총 납부세액</span><span className="v neg t-num">− {window.fmtKRW(r.totalTax)}원</span></div>
          </>}
          {isNontax && <div className="row tot"><span>비과세 적용</span><span className="v pos t-num">납부 없음</span></div>}
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '취득세', desc: '주택 매수 시 세금' },
        { name: '종합부동산세', desc: '보유 시 매년 부과' },
        { name: '중개수수료', desc: '거래금액별 법정 상한' },
      ]} />
    </>
  );
}

window.CapitalGainsForm = CapitalGainsForm;
