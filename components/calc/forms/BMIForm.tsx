'use client';
import { useState, useMemo } from 'react';
import { computeBMI } from '@/lib/calc';

export function BMIForm() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const r = useMemo(() => computeBMI({ heightCm: height, weightKg: weight }), [height, weight]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>키</div>
        <div className="step done"><span className="dot">2</span>체중</div>
        <div className="step active"><span className="dot">3</span>결과</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>키 <span className="hint">cm</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="decimal" value={height}
              onChange={(e) => setHeight(Math.min(250, Math.max(50, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
            <span className="suffix">cm</span>
          </div>
          <input type="range" className="slider" min="100" max="220" step="1" value={height}
            onChange={(e) => setHeight(+e.target.value)} />
        </div>
        <div className="field">
          <label>체중 <span className="hint">kg</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="decimal" value={weight}
              onChange={(e) => setWeight(Math.min(300, Math.max(20, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
            <span className="suffix">kg</span>
          </div>
          <input type="range" className="slider" min="30" max="150" step="0.5" value={weight}
            onChange={(e) => setWeight(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">BMI 지수</div>
        <div className="big t-num">{r.bmi}<small> kg/m²</small></div>
        <div className="sub">
          <div>분류 <b style={{ color: r.color }}>{r.category}</b></div>
          <div>정상 체중 범위 <b className="t-num">{r.normalMin} ~ {r.normalMax} kg</b></div>
          <div>이상 체중 대비 <b className="t-num">{r.diff > 0 ? '+' : ''}{r.diff} kg</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill" style={{ background: r.color, color: 'white' }}>{r.category}</span>
          <span className="compare-note">대한비만학회 / WHO 아시아-태평양 기준</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>BMI 분류 기준 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>저체중</span><span className="v t-num">18.5 미만</span></div>
          <div className="row"><span>정상</span><span className="v t-num">18.5 ~ 22.9</span></div>
          <div className="row"><span>과체중</span><span className="v t-num">23.0 ~ 24.9</span></div>
          <div className="row"><span>비만 1단계</span><span className="v t-num">25.0 ~ 29.9</span></div>
          <div className="row"><span>비만 2단계</span><span className="v t-num">30.0 ~ 34.9</span></div>
          <div className="row"><span>비만 3단계 (고도)</span><span className="v t-num">35.0 이상</span></div>
        </div>
      </details>
    </>
  );
}
