'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeCompound } from '@/lib/calc';

export function CompoundForm() {
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(50);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const r = useMemo(() => computeCompound({
    principalMan: principal, monthlyMan: monthly, rate, years,
  }), [principal, monthly, rate, years]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>초기금·적립</div>
        <div className="step done"><span className="dot">2</span>수익률·기간</div>
        <div className="step active"><span className="dot">3</span>최종 자산</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>초기 투자금 <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={principal.toLocaleString()}
              onChange={(e) => setPrincipal(Math.min(1000000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>월 적립금 <span className="hint">만원/월</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={monthly.toLocaleString()}
              onChange={(e) => setMonthly(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연 수익률 <span className="hint">{rate}%</span></label>
          <input type="range" className="slider" min="1" max="20" step="0.5" value={rate}
            onChange={(e) => setRate(+e.target.value)} />
          <div className="slider-ticks"><span>1%</span><span>5%</span><span>10%</span><span>20%</span></div>
        </div>
        <div className="field">
          <label>기간 <span className="hint">{years}년</span></label>
          <input type="range" className="slider" min="1" max="40" step="1" value={years}
            onChange={(e) => setYears(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">{years}년 후 최종 자산</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
        <div className="sub">
          <div>총 투자금 <b className="t-num">{fmtKRW(r.totalInvested)}원</b></div>
          <div>복리 수익 <b className="t-num">{fmtKRW(r.totalGain)}원</b></div>
          <div>수익률 <b className="t-num">{r.gainRatio.toFixed(0)}%</b></div>
          <div>한국식 <b className="t-num">{manToKorean(Math.round(r.total / 10000))}</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill up">{(r.total / r.totalInvested).toFixed(2)}배 성장</span>
          <span className="compare-note">월복리 적립식 · 수익은 매월 자동 재투자</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>연도별 자산 추이 <span className="chev">▼</span></summary>
        <div className="breakdown">
          {r.yearly.filter((_, i) => i % Math.max(1, Math.floor(years / 10)) === 0 || i === r.yearly.length - 1).map(y => (
            <div className="row" key={y.year}>
              <span>{y.year}년차</span>
              <span className="v t-num">{fmtKRW(y.total)}원</span>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}
