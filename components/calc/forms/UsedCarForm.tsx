'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeUsedCar } from '@/lib/calc';

export function UsedCarForm() {
  const [newPrice, setNewPrice] = useState(3000);
  const [years, setYears] = useState(3);
  const [km, setKm] = useState(45000);

  const r = useMemo(() => computeUsedCar({
    newPriceMan: newPrice, yearsOld: years, kmDriven: km,
  }), [newPrice, years, km]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>신차가</div>
        <div className="step done"><span className="dot">2</span>연식·주행</div>
        <div className="step active"><span className="dot">3</span>시세</div>
      </div>

      <div className="field">
        <label>신차 출시가 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={newPrice.toLocaleString()}
            onChange={(e) => setNewPrice(Math.min(50000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(newPrice) || '0원'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연식 (사용연수) <span className="hint">{years}년</span></label>
          <input type="range" className="slider" min="0" max="20" step="1" value={years}
            onChange={(e) => setYears(+e.target.value)} />
        </div>
        <div className="field">
          <label>주행거리 <span className="hint">{(km / 10000).toFixed(1)}만km</span></label>
          <input type="range" className="slider" min="0" max="300000" step="5000" value={km}
            onChange={(e) => setKm(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">예상 중고 시세</div>
        <div className="big t-num">{fmtKRW(r.estimatedPrice)}<small>원</small></div>
        <div className="sub">
          <div>한국식 <b className="t-num">{manToKorean(r.estimatedMan) || '0원'}</b></div>
          <div>감가 <b className="t-num">− {fmtKRW(r.depreciation)}원</b></div>
          <div>잔존가치 <b className="t-num">{r.adjustedRate}%</b> (기본 {r.baseRate}%)</div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{r.note}</span>
          <span className="compare-note">감가 모델 (참고용) · 실제 시세는 상태·옵션·시장 따라 다름</span>
        </div>
      </div>
    </>
  );
}
