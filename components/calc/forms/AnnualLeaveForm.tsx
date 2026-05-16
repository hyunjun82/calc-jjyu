'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeAnnualLeave } from '@/lib/calc';

export function AnnualLeaveForm() {
  const [monthly, setMonthly] = useState(300);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [unused, setUnused] = useState(5);
  const [years, setYears] = useState(3);

  const r = useMemo(() => computeAnnualLeave({
    monthlyWageMan: monthly, weeklyHours, unusedDays: unused, yearsServed: years,
  }), [monthly, weeklyHours, unused, years]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>임금·근속</div>
        <div className="step done"><span className="dot">2</span>미사용 일수</div>
        <div className="step active"><span className="dot">3</span>수당</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>월 통상임금 <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={monthly.toLocaleString()}
              onChange={(e) => setMonthly(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>주 소정근로 <span className="hint">{weeklyHours}시간</span></label>
          <input type="range" className="slider" min="15" max="40" step="1" value={weeklyHours}
            onChange={(e) => setWeeklyHours(+e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>근속 연수 <span className="hint">{years}년</span></label>
          <input type="range" className="slider" min="0.5" max="25" step="0.5" value={years}
            onChange={(e) => setYears(+e.target.value)} />
        </div>
        <div className="field">
          <label>미사용 연차 <span className="hint">{unused}일</span></label>
          <input type="range" className="slider" min="0" max="25" step="1" value={unused}
            onChange={(e) => setUnused(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">연차수당 (미사용 {unused}일분)</div>
        <div className="big t-num">{fmtKRW(r.annualLeavePay)}<small>원</small></div>
        <div className="sub">
          <div>발생 연차 <b className="t-num">{r.earnedDays}일</b> / 년</div>
          <div>1일 통상임금 <b className="t-num">{fmtKRW(r.dailyWage)}원</b></div>
          <div>시급 <b className="t-num">{fmtKRW(r.hourly)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">근로기준법 60조</span>
          <span className="compare-note">1년차 15일, 3년차부터 매 2년 +1일 (최대 25일)</span>
        </div>
      </div>
    </>
  );
}
