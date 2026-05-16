'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeFuelCost } from '@/lib/calc';

export function FuelCostForm() {
  const [distance, setDistance] = useState(1000);
  const [efficiency, setEfficiency] = useState(12);
  const [price, setPrice] = useState(1700);
  const [type, setType] = useState<'gasoline' | 'diesel' | 'lpg' | 'electric'>('gasoline');

  const r = useMemo(() => computeFuelCost({
    distanceKm: distance, fuelEfficiency: efficiency, fuelPrice: price, fuelType: type,
  }), [distance, efficiency, price, type]);

  const setFuelType = (t: typeof type) => {
    setType(t);
    if (t === 'gasoline') setPrice(1700);
    else if (t === 'diesel') setPrice(1550);
    else if (t === 'lpg') setPrice(1100);
    else if (t === 'electric') setPrice(320);
  };

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>연료 유형</div>
        <div className="step done"><span className="dot">2</span>주행·연비</div>
        <div className="step active"><span className="dot">3</span>유류비</div>
      </div>

      <div className="field">
        <label>연료 유형</label>
        <div className="seg" role="group">
          <button className={type === 'gasoline' ? 'on' : ''} onClick={() => setFuelType('gasoline')}>휘발유</button>
          <button className={type === 'diesel' ? 'on' : ''} onClick={() => setFuelType('diesel')}>경유</button>
          <button className={type === 'lpg' ? 'on' : ''} onClick={() => setFuelType('lpg')}>LPG</button>
          <button className={type === 'electric' ? 'on' : ''} onClick={() => setFuelType('electric')}>전기</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>주행거리 <span className="hint">km</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={distance.toLocaleString()}
              onChange={(e) => setDistance(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
            <span className="suffix">km</span>
          </div>
        </div>
        <div className="field">
          <label>{type === 'electric' ? '전비' : '연비'} <span className="hint">{type === 'electric' ? 'km/kWh' : 'km/L'}</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="decimal" value={efficiency}
              onChange={(e) => setEfficiency(Math.max(0.1, +e.target.value.replace(/[^0-9.]/g, '') || 0.1))} />
            <span className="suffix">km/{type === 'electric' ? 'kWh' : 'L'}</span>
          </div>
        </div>
      </div>

      <div className="field">
        <label>{type === 'electric' ? '전기 요금' : '유가'} <span className="hint">원/{type === 'electric' ? 'kWh' : 'L'}</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={price.toLocaleString()}
            onChange={(e) => setPrice(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
          <span className="suffix">원</span>
        </div>
        <input type="range" className="slider" min="100" max="3000" step="10" value={price}
          onChange={(e) => setPrice(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">총 유류비</div>
        <div className="big t-num">{fmtKRW(r.cost)}<small>원</small></div>
        <div className="sub">
          <div>{type === 'electric' ? '소모 전력' : '연료 사용량'} <b className="t-num">{r.fuelUsed}{type === 'electric' ? ' kWh' : ' L'}</b></div>
          <div>km당 비용 <b className="t-num">{r.perKm}원/km</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{type === 'gasoline' ? '휘발유' : type === 'diesel' ? '경유' : type === 'lpg' ? 'LPG' : '전기'}</span>
          <span className="compare-note">주행거리 ÷ {type === 'electric' ? '전비' : '연비'} × 단가</span>
        </div>
      </div>
    </>
  );
}
