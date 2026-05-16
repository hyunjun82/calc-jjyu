'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeBasicLife } from '@/lib/calc';

export function BasicLifeForm() {
  const [size, setSize] = useState(1);
  const [income, setIncome] = useState(50);

  const r = useMemo(() => computeBasicLife({
    householdSize: size, monthlyIncomeMan: income,
  }), [size, income]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>가구원 수</div>
        <div className="step done"><span className="dot">2</span>소득인정액</div>
        <div className="step active"><span className="dot">3</span>급여 판정</div>
      </div>

      <div className="field">
        <label>가구원 수</label>
        <div className="seg" role="group">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button key={n} className={size === n ? 'on' : ''} onClick={() => setSize(n)}>{n}인</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>월 소득인정액 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={income.toLocaleString()}
            onChange={(e) => setIncome(Math.min(2000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <input type="range" className="slider" min="0" max="500" step="5" value={income}
          onChange={(e) => setIncome(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">생계급여 (예상 월 지원)</div>
        <div className="big t-num">{fmtKRW(r.livingPay)}<small>원/월</small></div>
        <div className="sub">
          <div>가구 중위소득 <b className="t-num">{fmtKRW(r.median)}원</b></div>
          <div>생계급여 기준 (32%) <b className="t-num">{fmtKRW(r.livingThreshold)}원</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.eligibleLiving ? 'up' : 'down'}`}>
            {r.eligibleLiving ? '✓ 생계급여 대상' : '× 생계 미달'}
          </span>
          <span className="compare-note">2026년 중위소득 기준 (보건복지부)</span>
        </div>
      </div>

      <details className="breakdown-toggle" open>
        <summary>급여별 수급 자격 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row">
            <span>생계급여 (중위 32%)</span>
            <span className="v t-num" style={{ color: r.eligibleLiving ? 'var(--accent)' : '#C2553C' }}>
              {r.eligibleLiving ? '✓ 대상' : '× 미달'} · {fmtKRW(r.livingThreshold)}↓
            </span>
          </div>
          <div className="row">
            <span>의료급여 (중위 40%)</span>
            <span className="v t-num" style={{ color: r.eligibleMedical ? 'var(--accent)' : '#C2553C' }}>
              {r.eligibleMedical ? '✓ 대상' : '× 미달'} · {fmtKRW(r.medicalThreshold)}↓
            </span>
          </div>
          <div className="row">
            <span>주거급여 (중위 48%)</span>
            <span className="v t-num" style={{ color: r.eligibleHousing ? 'var(--accent)' : '#C2553C' }}>
              {r.eligibleHousing ? '✓ 대상' : '× 미달'} · {fmtKRW(r.housingThreshold)}↓
            </span>
          </div>
          <div className="row">
            <span>교육급여 (중위 50%)</span>
            <span className="v t-num" style={{ color: r.eligibleEducation ? 'var(--accent)' : '#C2553C' }}>
              {r.eligibleEducation ? '✓ 대상' : '× 미달'} · {fmtKRW(r.educationThreshold)}↓
            </span>
          </div>
        </div>
      </details>
    </>
  );
}
