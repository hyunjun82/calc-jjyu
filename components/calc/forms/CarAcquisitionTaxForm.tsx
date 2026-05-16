'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeCarAcquisitionTax } from '@/lib/calc';

export function CarAcquisitionTaxForm() {
  const [price, setPrice] = useState(3000);
  const [type, setType] = useState<'normal' | 'commercial' | 'light' | 'eco'>('normal');

  const r = useMemo(() => computeCarAcquisitionTax({
    priceMan: price, type,
  }), [price, type]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>차량 유형</div>
        <div className="step done"><span className="dot">2</span>차량가</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <div className="field">
        <label>차량 유형</label>
        <div className="seg" role="group">
          <button className={type === 'normal' ? 'on' : ''} onClick={() => setType('normal')}>일반 승용차</button>
          <button className={type === 'light' ? 'on' : ''} onClick={() => setType('light')}>경차</button>
          <button className={type === 'eco' ? 'on' : ''} onClick={() => setType('eco')}>친환경차</button>
          <button className={type === 'commercial' ? 'on' : ''} onClick={() => setType('commercial')}>영업용</button>
        </div>
      </div>

      <div className="field">
        <label>차량 가격 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={price.toLocaleString()}
            onChange={(e) => setPrice(Math.min(50000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(price) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(price * 10000)}원</span>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">자동차 취득세</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
        <div className="sub">
          <div>기본 세액 ({r.rate}%) <b className="t-num">{fmtKRW(r.tax)}원</b></div>
          {r.discount > 0 && <div>감면 <b className="t-num">− {fmtKRW(r.discount)}원</b></div>}
        </div>
        <div className="compare-line">
          <span className="compare-pill">{r.breakdown}</span>
          <span className="compare-note">지방세법 12조 · 2026 기준</span>
        </div>
      </div>
    </>
  );
}
