'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeCreditLoan } from '@/lib/calc';

export function CreditLoanForm() {
  const [principal, setPrincipal] = useState(3000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(5);
  const r = useMemo(() => computeCreditLoan({ principalMan: principal, rate, years }), [principal, rate, years]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>대출액</div>
        <div className="step done"><span className="dot">2</span>금리·기간</div>
        <div className="step active"><span className="dot">3</span>월상환</div>
      </div>

      <div className="field">
        <label>대출 원금 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={principal.toLocaleString()}
            onChange={(e) => setPrincipal(Math.min(100000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(principal) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(principal * 10000)}원</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연 금리 <span className="hint">%</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="decimal" value={rate}
              onChange={(e) => setRate(Math.min(30, Math.max(0, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
            <span className="suffix">%</span>
          </div>
          <input type="range" className="slider" min="0.5" max="20" step="0.1" value={rate}
            onChange={(e) => setRate(+e.target.value)} />
        </div>
        <div className="field">
          <label>대출 기간 <span className="hint">{years}년</span></label>
          <input type="range" className="slider" min="1" max="30" step="1" value={years}
            onChange={(e) => setYears(+e.target.value)} />
          <div className="slider-ticks"><span>1년</span><span>5년</span><span>10년</span><span>20년</span><span>30년</span></div>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">월 상환액 (원리금균등)</div>
        <div className="big t-num">{fmtKRW(r.monthly)}<small>원</small></div>
        <div className="sub">
          <div>총 상환액 <b className="t-num">{fmtKRW(r.totalPayment)}원</b></div>
          <div>총 이자 <b className="t-num">{fmtKRW(r.totalInterest)}원</b></div>
          <div>이자 비율 <b className="t-num">{r.interestRatio.toFixed(1)}%</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">원리금균등 상환</span>
          <span className="compare-note">매월 동일 금액 상환 · 표준 PMT 공식</span>
        </div>
      </div>
    </>
  );
}
