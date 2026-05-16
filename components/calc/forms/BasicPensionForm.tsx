'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeBasicPension } from '@/lib/calc';

export function BasicPensionForm() {
  const [age, setAge] = useState(70);
  const [couple, setCouple] = useState(false);
  const [income, setIncome] = useState(100);

  const r = useMemo(() => computeBasicPension({
    age, isCouple: couple, monthlyIncomeMan: income,
  }), [age, couple, income]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>나이·가구</div>
        <div className="step done"><span className="dot">2</span>소득인정액</div>
        <div className="step active"><span className="dot">3</span>수급액</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>나이 <span className="hint">{age}세</span></label>
          <input type="range" className="slider" min="60" max="100" step="1" value={age}
            onChange={(e) => setAge(+e.target.value)} />
        </div>
        <div className="field">
          <label>가구</label>
          <div className="seg" role="group">
            <button className={!couple ? 'on' : ''} onClick={() => setCouple(false)}>단독</button>
            <button className={couple ? 'on' : ''} onClick={() => setCouple(true)}>부부</button>
          </div>
        </div>
      </div>

      <div className="field">
        <label>월 소득인정액 <span className="hint">만원 · 근로/사업/금융+재산 환산</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={income.toLocaleString()}
            onChange={(e) => setIncome(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <input type="range" className="slider" min="0" max="400" step="5" value={income}
          onChange={(e) => setIncome(+e.target.value)} />
        <div className="slider-ticks"><span>0</span><span>100만</span><span>200만</span><span>400만</span></div>
      </div>

      <div className="result-card">
        <div className="lbl">{r.eligible ? '예상 월 수급액' : '수급 불가'}</div>
        <div className="big t-num" style={{ color: r.eligible ? 'var(--ink)' : '#C2553C' }}>
          {fmtKRW(r.monthly)}<small>원/월</small>
        </div>
        <div className="sub">
          <div>연 합계 <b className="t-num">{fmtKRW(r.annual)}원</b></div>
          <div>최대 수급액 <b className="t-num">{fmtKRW(r.maxPension)}원</b></div>
          <div>선정기준액 <b className="t-num">{fmtKRW(r.threshold)}원</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.eligible ? 'up' : 'down'}`}>
            {r.eligible ? '✓ 수급 대상' : '× 수급 불가'}
          </span>
          <span className="compare-note">{r.reason} · 2026년 보건복지부 기준</span>
        </div>
      </div>
    </>
  );
}
