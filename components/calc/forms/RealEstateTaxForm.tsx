'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeRealEstateTax } from '@/lib/calc';

export function RealEstateTaxForm() {
  const [price, setPrice] = useState(150000);
  const [multi, setMulti] = useState(false);

  const r = useMemo(() => computeRealEstateTax({
    publicPriceMan: price, isMulti: multi,
  }), [price, multi]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>공시가격</div>
        <div className="step done"><span className="dot">2</span>주택수</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <div className="field">
        <label>주택수</label>
        <div className="seg" role="group">
          <button className={!multi ? 'on' : ''} onClick={() => setMulti(false)}>1주택 (12억 공제)</button>
          <button className={multi ? 'on' : ''} onClick={() => setMulti(true)}>다주택 (9억 공제)</button>
        </div>
      </div>

      <div className="field">
        <label>공시가격 합계 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={price.toLocaleString()}
            onChange={(e) => setPrice(Math.min(1000000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(price) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(price * 10000)}원</span>
        </div>
        <input type="range" className="slider" min="0" max="500000" step="1000" value={price}
          onChange={(e) => setPrice(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">{r.eligible ? '예상 종합부동산세' : '과세 대상 아님'}</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원/년</small></div>
        <div className="sub">
          <div>기본공제 차감 후 <b className="t-num">{fmtKRW(r.taxableBase)}원</b></div>
          <div>종부세 본세 <b className="t-num">{fmtKRW(r.tax)}원</b></div>
          <div>농어촌특별세 (20%) <b className="t-num">{fmtKRW(r.farmTax)}원</b></div>
          <div>적용 세율 <b className="t-num">{r.appliedRate.toFixed(1)}%</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.eligible ? 'down' : 'up'}`}>
            {r.eligible ? `${multi ? '다주택' : '1주택'} 누진` : '✓ 공제 이하'}
          </span>
          <span className="compare-note">공정시장가액비율 60% · 종합부동산세법</span>
        </div>
      </div>
    </>
  );
}
