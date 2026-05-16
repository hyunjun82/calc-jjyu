'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeOvertime } from '@/lib/calc';

export function OvertimeForm() {
  const [hourly, setHourly] = useState(12000);
  const [overtime, setOvertime] = useState(10);
  const [night, setNight] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const [holidayExtra, setHolidayExtra] = useState(0);

  const r = useMemo(() => computeOvertime({
    hourlyWage: hourly,
    overtimeHours: overtime, nightHours: night,
    holidayHours: holiday, holidayExtraHours: holidayExtra,
  }), [hourly, overtime, night, holiday, holidayExtra]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>시급</div>
        <div className="step done"><span className="dot">2</span>가산 시간</div>
        <div className="step active"><span className="dot">3</span>수당 합계</div>
      </div>

      <div className="field">
        <label>통상임금 시급 <span className="hint">원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={hourly.toLocaleString()}
            onChange={(e) => setHourly(Math.min(200000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">원</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연장근로 <span className="hint">×1.5배 · {overtime}h</span></label>
          <input type="range" className="slider" min="0" max="50" step="1" value={overtime}
            onChange={(e) => setOvertime(+e.target.value)} />
        </div>
        <div className="field">
          <label>야간근로 (22~06시) <span className="hint">+0.5배 · {night}h</span></label>
          <input type="range" className="slider" min="0" max="30" step="1" value={night}
            onChange={(e) => setNight(+e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>휴일근로 (8h 이내) <span className="hint">×1.5배 · {holiday}h</span></label>
          <input type="range" className="slider" min="0" max="8" step="1" value={holiday}
            onChange={(e) => setHoliday(+e.target.value)} />
        </div>
        <div className="field">
          <label>휴일근로 (8h 초과) <span className="hint">×2배 · {holidayExtra}h</span></label>
          <input type="range" className="slider" min="0" max="8" step="1" value={holidayExtra}
            onChange={(e) => setHolidayExtra(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">가산수당 총합</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
        <div className="sub">
          <div>연장수당 <b className="t-num">{fmtKRW(r.overtimePay)}원</b></div>
          <div>야간 가산 <b className="t-num">{fmtKRW(r.nightPay)}원</b></div>
          <div>휴일수당 <b className="t-num">{fmtKRW(r.holidayPay)}원</b></div>
          <div>휴일 8h↑ <b className="t-num">{fmtKRW(r.holidayExtraPay)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">근로기준법 56조</span>
          <span className="compare-note">연장·야간·휴일 가산율 법정 (2026)</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>가산율 기준 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>연장근로 (1일 8h 초과)</span><span className="v t-num">통상임금 × 1.5</span></div>
          <div className="row"><span>야간근로 (22:00 ~ 06:00)</span><span className="v t-num">통상임금 × 0.5 가산</span></div>
          <div className="row"><span>휴일근로 (8h 이내)</span><span className="v t-num">통상임금 × 1.5</span></div>
          <div className="row"><span>휴일근로 (8h 초과분)</span><span className="v t-num">통상임금 × 2.0</span></div>
        </div>
      </details>
    </>
  );
}
