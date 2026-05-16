'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeHealthInsurance } from '@/lib/calc';

export function HealthInsuranceForm() {
  const [type, setType] = useState<'employee' | 'local'>('employee');
  const [wage, setWage] = useState(300);
  const [income, setIncome] = useState(2000);
  const [property, setProperty] = useState(10000);
  const [carValue, setCarValue] = useState(0);
  const [carYears, setCarYears] = useState(5);

  const r = useMemo(() => computeHealthInsurance({
    type, monthlyWageMan: wage,
    incomeMan: income, propertyMan: property,
    carValueMan: carValue, vehicleYears: carYears,
  }), [type, wage, income, property, carValue, carYears]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>가입 유형</div>
        <div className="step done"><span className="dot">2</span>입력</div>
        <div className="step active"><span className="dot">3</span>월 보험료</div>
      </div>

      <div className="field">
        <label>가입자 유형</label>
        <div className="seg" role="group">
          <button className={type === 'employee' ? 'on' : ''} onClick={() => setType('employee')}>직장 가입자</button>
          <button className={type === 'local' ? 'on' : ''} onClick={() => setType('local')}>지역 가입자</button>
        </div>
      </div>

      {type === 'employee' ? (
        <div className="field">
          <label>월 보수액 <span className="hint">세전, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={wage.toLocaleString()}
              onChange={(e) => setWage(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      ) : (
        <>
          <div className="field">
            <label>연 소득 <span className="hint">만원</span></label>
            <div className="input-wrap">
              <input type="text" inputMode="numeric" value={income.toLocaleString()}
                onChange={(e) => setIncome(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
              <span className="suffix">만원</span>
            </div>
          </div>
          <div className="field">
            <label>재산 과세표준 <span className="hint">만원</span></label>
            <div className="input-wrap">
              <input type="text" inputMode="numeric" value={property.toLocaleString()}
                onChange={(e) => setProperty(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
              <span className="suffix">만원</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>자동차 가액 <span className="hint">4년↓ 또는 4천만↑만 부과</span></label>
              <div className="input-wrap">
                <input type="text" inputMode="numeric" value={carValue.toLocaleString()}
                  onChange={(e) => setCarValue(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
                <span className="suffix">만원</span>
              </div>
            </div>
            <div className="field">
              <label>사용연수 <span className="hint">{carYears}년</span></label>
              <input type="range" className="slider" min="0" max="15" step="1" value={carYears}
                onChange={(e) => setCarYears(+e.target.value)} />
            </div>
          </div>
        </>
      )}

      <div className="result-card">
        <div className="lbl">월 보험료 (본인 부담)</div>
        <div className="big t-num">{fmtKRW(r.workerTotal)}<small>원/월</small></div>
        <div className="sub">
          {type === 'employee' && <div>사업주 부담 <b className="t-num">{fmtKRW(r.employerTotal)}원</b></div>}
          {type === 'local' && <>
            <div>부과 점수 <b className="t-num">{r.totalPoint.toLocaleString()}점</b></div>
            <div>소득/재산/차 <b className="t-num">{r.incomePoint}/{r.propertyPoint}/{r.carPoint}</b></div>
          </>}
          <div>총 보험료 <b className="t-num">{fmtKRW(r.grandTotal)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{type === 'employee' ? '직장 3.545% (반반)' : '지역 점수제 208원/점'}</span>
          <span className="compare-note">건강보험공단 2026 기준</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>건강보험 + 장기요양 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>건강보험 (본인)</span><span className="v t-num">{fmtKRW(r.workerHI)}원</span></div>
          <div className="row"><span>장기요양 (본인)</span><span className="v t-num">{fmtKRW(r.workerLTC)}원</span></div>
          {type === 'employee' && <>
            <div className="row"><span>건강보험 (사업주)</span><span className="v t-num">{fmtKRW(r.employerHI)}원</span></div>
            <div className="row"><span>장기요양 (사업주)</span><span className="v t-num">{fmtKRW(r.employerLTC)}원</span></div>
          </>}
        </div>
      </details>
    </>
  );
}
