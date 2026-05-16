'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeNationalPension } from '@/lib/calc';

export function NationalPensionForm() {
  const [income, setIncome] = useState(300);
  const [months, setMonths] = useState(240);

  const r = useMemo(() => computeNationalPension({
    avgMonthlyIncomeMan: income, insuredMonths: months,
  }), [income, months]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>평균소득</div>
        <div className="step done"><span className="dot">2</span>가입기간</div>
        <div className="step active"><span className="dot">3</span>노령연금</div>
      </div>

      <div className="field">
        <label>가입 중 평균 월소득 (B값) <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={income.toLocaleString()}
            onChange={(e) => setIncome(Math.min(2000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <input type="range" className="slider" min="50" max="1000" step="10" value={income}
          onChange={(e) => setIncome(+e.target.value)} />
      </div>

      <div className="field">
        <label>가입 기간 <span className="hint">{(months / 12).toFixed(1)}년 / {months}개월</span></label>
        <input type="range" className="slider" min="0" max="480" step="12" value={months}
          onChange={(e) => setMonths(+e.target.value)} />
        <div className="slider-ticks"><span>0</span><span>10년</span><span>20년</span><span>30년</span><span>40년</span></div>
      </div>

      <div className="result-card">
        <div className="lbl">{r.eligible ? '예상 월 노령연금' : '수급 자격 미달'}</div>
        <div className="big t-num" style={{ color: r.eligible ? 'var(--ink)' : '#C2553C' }}>
          {fmtKRW(r.monthly)}<small>원/월</small>
        </div>
        <div className="sub">
          <div>연 합계 <b className="t-num">{fmtKRW(r.annual)}원</b></div>
          <div>A값 (전체 평균) <b className="t-num">{fmtKRW(r.A)}원</b></div>
          <div>B값 (본인 평균) <b className="t-num">{fmtKRW(r.B)}원</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.eligible ? 'up' : 'down'}`}>
            {r.eligible ? '✓ 수급 자격' : '× 10년 미만'}
          </span>
          <span className="compare-note">{r.reason} · 국민연금공단 산식</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>국민연금 산식 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>기본 공식</span><span className="v t-num">(A + B) × 0.5</span></div>
          <div className="row"><span>20년 가입 시</span><span className="v t-num">기본액 × 100%</span></div>
          <div className="row"><span>20년 초과</span><span className="v t-num">+ 매년 5% 가산</span></div>
          <div className="row"><span>10~20년</span><span className="v t-num">기본액 × (가입년/20)</span></div>
        </div>
      </details>
    </>
  );
}
