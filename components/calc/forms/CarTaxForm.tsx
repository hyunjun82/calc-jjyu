'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeCarTax } from '@/lib/calc';

export function CarTaxForm() {
  const [cc, setCc] = useState(1600);
  const [years, setYears] = useState(3);
  const [commercial, setCommercial] = useState(false);

  const r = useMemo(() => computeCarTax({
    cc, yearsOwned: years, isCommercial: commercial,
  }), [cc, years, commercial]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>차량 정보</div>
        <div className="step done"><span className="dot">2</span>보유 기간</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <div className="field">
        <label>차량 용도</label>
        <div className="seg" role="group">
          <button className={!commercial ? 'on' : ''} onClick={() => setCommercial(false)}>비영업용</button>
          <button className={commercial ? 'on' : ''} onClick={() => setCommercial(true)}>영업용</button>
        </div>
      </div>

      <div className="field">
        <label>배기량 <span className="hint">{cc.toLocaleString()}cc</span></label>
        <input type="range" className="slider" min="800" max="5000" step="100" value={cc}
          onChange={(e) => setCc(+e.target.value)} />
        <div className="slider-ticks"><span>800</span><span>1,600</span><span>2,500</span><span>5,000</span></div>
        <div className="preset-row">
          <button className={`preset-chip ${cc === 1000 ? 'on' : ''}`} onClick={() => setCc(1000)}>모닝</button>
          <button className={`preset-chip ${cc === 1600 ? 'on' : ''}`} onClick={() => setCc(1600)}>아반떼</button>
          <button className={`preset-chip ${cc === 2000 ? 'on' : ''}`} onClick={() => setCc(2000)}>쏘나타</button>
          <button className={`preset-chip ${cc === 3000 ? 'on' : ''}`} onClick={() => setCc(3000)}>그랜저</button>
        </div>
      </div>

      <div className="field">
        <label>차령 (보유기간) <span className="hint">{years}년 · 3년부터 매년 5% 경감 (최대 50%)</span></label>
        <input type="range" className="slider" min="0" max="15" step="1" value={years}
          onChange={(e) => setYears(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">연간 자동차세 (지방교육세 포함)</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
        <div className="sub">
          <div>자동차세 <b className="t-num">{fmtKRW(r.annualTax)}원</b></div>
          <div>지방교육세 (30%) <b className="t-num">{fmtKRW(r.eduTax)}원</b></div>
          <div>반기 납부 (6월/12월) <b className="t-num">{fmtKRW(r.half)}원</b></div>
          {r.reduction > 0 && <div>경감율 <b className="t-num">{r.reduction.toFixed(0)}%</b></div>}
        </div>
        <div className="compare-line">
          <span className="compare-pill">cc당 {r.baseRate}원</span>
          <span className="compare-note">지방세법 127조 · 2026 기준</span>
        </div>
      </div>
    </>
  );
}
