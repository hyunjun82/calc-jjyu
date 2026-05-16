'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeDSR } from '@/lib/calc';

export function DSRForm() {
  const [income, setIncome] = useState(5000);
  const [existing, setExisting] = useState(50);
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(30);

  const r = useMemo(() => computeDSR({
    annualIncomeMan: income,
    existingMonthlyMan: existing,
    newPrincipalMan: principal,
    newRate: rate,
    newYears: years,
  }), [income, existing, principal, rate, years]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>소득·기존부채</div>
        <div className="step done"><span className="dot">2</span>신규 대출</div>
        <div className="step active"><span className="dot">3</span>DSR 판정</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연소득 <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={income.toLocaleString()}
              onChange={(e) => setIncome(Math.min(100000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>기존 월 상환 <span className="hint">만원/월</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={existing.toLocaleString()}
              onChange={(e) => setExisting(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div className="field">
        <label>신규 대출 원금 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={principal.toLocaleString()}
            onChange={(e) => setPrincipal(Math.min(500000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>금리 <span className="hint">{rate}%</span></label>
          <input type="range" className="slider" min="1" max="10" step="0.1" value={rate}
            onChange={(e) => setRate(+e.target.value)} />
        </div>
        <div className="field">
          <label>기간 <span className="hint">{years}년</span></label>
          <input type="range" className="slider" min="1" max="40" step="1" value={years}
            onChange={(e) => setYears(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">DSR 비율 (한도 40%)</div>
        <div className="big t-num" style={{ color: r.passed ? 'var(--accent)' : '#C2553C' }}>
          {r.dsr}<small>%</small>
        </div>
        <div className="sub">
          <div>월 소득 <b className="t-num">{fmtKRW(r.monthlyIncome)}원</b></div>
          <div>신규 월상환 <b className="t-num">{fmtKRW(r.newMonthly)}원</b></div>
          <div>총 월부채 <b className="t-num">{fmtKRW(r.totalMonthly)}원</b></div>
          <div>여유 월상환 <b className="t-num">{fmtKRW(r.remainingMonthly)}원</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.passed ? 'up' : 'down'}`}>
            {r.passed ? '✓ 통과 가능' : `× ${r.overBy}%p 초과`}
          </span>
          <span className="compare-note">금융위 DSR 규제 40% 기준 (2026)</span>
        </div>
      </div>
    </>
  );
}
