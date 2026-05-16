'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import {
  computeSalary, computeSeverance, computeMortgage,
  computeIncomeTax, computeUnemployment, computeCapitalGains,
} from '@/lib/calc';

// ===== 공통 빌딩 블록 =====
function NumberField({ label, hint, value, setValue, max = 100000, suffix = '만원', withReadout = true }: any) {
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
          <span className="korean">{manToKorean(value) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(value * 10000)}원</span>
        </div>
      )}
    </div>
  );
}

function SegSel({ label, hint, value, setValue, options }: any) {
  return (
    <div className="field">
      <label>{label} {hint && <span className="hint">{hint}</span>}</label>
      <div className="seg" role="group">
        {options.map((o: any) => (
          <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => setValue(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segs, total, centerLabel, centerValue }: any) {
  const C = 2 * Math.PI * 60;
  let off = 0;
  const arcs = segs.map((s: any) => {
    const len = (s.value / total) * C;
    const arc = { ...s, dasharray: `${Math.max(0, len)} ${C}`, dashoffset: -off };
    off += len;
    return arc;
  });
  return (
    <div className="donut">
      <svg viewBox="0 0 160 160" width="140" height="140">
        <circle cx="80" cy="80" r="60" fill="none" stroke="var(--hair)" strokeWidth="22" />
        {arcs.map((a: any) => (
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
        {arcs.map((a: any) => (
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


function RelatedCalcs({ items }: any) {
  return (
    <div className="related-calcs">
      <div className="related-head">
        <span className="t-eyebrow">다음에 해볼만한 계산</span>
        <span className="related-hint">함께 보면 좋은 계산기</span>
      </div>
      <div className="related-grid">
        {items.map((it: any, i: number) => (
          <a key={i} className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">{String(i + 2).padStart(2, '0')}</div>
            <div className="related-name">{it.name}</div>
            <div className="related-desc">{it.desc}</div>
            <span className="related-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function MortgageForm() {
  const [house, setHouse] = useState(80000);   // 8억
  const [income, setIncome] = useState(6000);  // 6천
  const [ltv, setLtv] = useState(70);
  const [dsr, setDsr] = useState(40);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(30);
  const r = useMemo(() => computeMortgage({
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
          <div className="big t-num">{fmtKRW(r.finalLimit)}<small>원</small></div>
          <div className="sub">
            <div>월 상환액 <b className="t-num">{fmtKRW(r.monthlyPayment)}원</b></div>
            <div>총 이자 <b className="t-num">{fmtKRW(r.totalInterest)}원</b></div>
            <div>소득 대비 <b className="t-num">{r.incomeRatio.toFixed(1)}%</b></div>
          </div>
          <div className="compare-line">
            <span className={`compare-pill ${r.bottleneck === 'LTV' ? 'down' : 'up'}`}>
              {r.bottleneck} 제한
            </span>
            <span className="compare-note">
              LTV 한도 {fmtKRW(r.limitLtv)}원 · DSR 한도 {fmtKRW(r.limitDsr)}원 중 낮은 값
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
          <div className="row"><span>주택가 × LTV {ltv}%</span><span className="v t-num">{fmtKRW(r.limitLtv)}원</span></div>
          <div className="row"><span>연소득 × DSR {dsr}% (원리금 환산)</span><span className="v t-num">{fmtKRW(r.limitDsr)}원</span></div>
          <div className="row tot"><span>최종 한도 (낮은 값)</span><span className="v t-num">{fmtKRW(r.finalLimit)}원</span></div>
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