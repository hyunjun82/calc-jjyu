'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeLTVDTI } from '@/lib/calc';

export function LTVDTIForm() {
  const [price, setPrice] = useState(50000);
  const [income, setIncome] = useState(6000);
  const [ltv, setLtv] = useState(70);
  const [dti, setDti] = useState(60);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(30);

  const r = useMemo(() => computeLTVDTI({
    housePriceMan: price, annualIncomeMan: income,
    ltv, dti, rate, years,
  }), [price, income, ltv, dti, rate, years]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>주택가·소득</div>
        <div className="step done"><span className="dot">2</span>LTV·DTI</div>
        <div className="step active"><span className="dot">3</span>한도</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>주택가 <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={price.toLocaleString()}
              onChange={(e) => setPrice(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>연소득 <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={income.toLocaleString()}
              onChange={(e) => setIncome(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>LTV <span className="hint">{ltv}%</span></label>
          <input type="range" className="slider" min="30" max="80" step="5" value={ltv}
            onChange={(e) => setLtv(+e.target.value)} />
          <div className="slider-ticks"><span>30%</span><span>50%</span><span>70%</span><span>80%</span></div>
        </div>
        <div className="field">
          <label>DTI <span className="hint">{dti}%</span></label>
          <input type="range" className="slider" min="30" max="80" step="5" value={dti}
            onChange={(e) => setDti(+e.target.value)} />
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
          <input type="range" className="slider" min="5" max="40" step="1" value={years}
            onChange={(e) => setYears(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">최대 대출 한도</div>
        <div className="big t-num">{fmtKRW(r.finalLimit)}<small>원</small></div>
        <div className="sub">
          <div>LTV 한도 <b className="t-num">{fmtKRW(r.limitLtv)}원</b></div>
          <div>DTI 한도 <b className="t-num">{fmtKRW(r.limitDti)}원</b></div>
          <div>월 상환액 <b className="t-num">{fmtKRW(r.monthlyPayment)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill down">{r.bottleneck} 제약</span>
          <span className="compare-note">실제 LTV {r.actualLTV}% · DTI {r.actualDTI}%</span>
        </div>
      </div>
    </>
  );
}
