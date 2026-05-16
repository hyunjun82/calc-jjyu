'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeWeeklyHoliday } from '@/lib/calc';

export function WeeklyHolidayForm() {
  const [hourly, setHourly] = useState(10030);
  const [weekly, setWeekly] = useState(40);

  const r = useMemo(() => computeWeeklyHoliday({
    hourlyWage: hourly, weeklyHours: weekly,
  }), [hourly, weekly]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>시급</div>
        <div className="step done"><span className="dot">2</span>주 근로시간</div>
        <div className="step active"><span className="dot">3</span>주휴수당</div>
      </div>

      <div className="field">
        <label>시급 <span className="hint">원 · 2026 최저시급 10,030원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={hourly.toLocaleString()}
            onChange={(e) => setHourly(Math.min(200000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">원</span>
        </div>
        <div className="preset-row">
          <button className={`preset-chip ${hourly === 10030 ? 'on' : ''}`} onClick={() => setHourly(10030)}>최저시급</button>
          <button className={`preset-chip ${hourly === 12000 ? 'on' : ''}`} onClick={() => setHourly(12000)}>12,000원</button>
          <button className={`preset-chip ${hourly === 15000 ? 'on' : ''}`} onClick={() => setHourly(15000)}>15,000원</button>
        </div>
      </div>

      <div className="field">
        <label>주 소정근로시간 <span className="hint">{weekly}시간</span></label>
        <input type="range" className="slider" min="5" max="52" step="1" value={weekly}
          onChange={(e) => setWeekly(+e.target.value)} />
        <div className="slider-ticks"><span>5h</span><span>15h</span><span>40h</span><span>52h</span></div>
      </div>

      <div className="result-card">
        <div className="lbl">{r.eligible ? '주휴수당 (주당)' : '대상 아님'}</div>
        <div className="big t-num" style={{ color: r.eligible ? 'var(--ink)' : '#C2553C' }}>
          {fmtKRW(r.weeklyHoliday)}<small>원</small>
        </div>
        <div className="sub">
          <div>주휴 시간 <b className="t-num">{r.holidayHours}시간</b></div>
          <div>월 주휴수당 합계 <b className="t-num">{fmtKRW(r.monthlyHoliday)}원</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.eligible ? 'up' : 'down'}`}>
            {r.eligible ? '✓ 대상' : '× 대상 아님'}
          </span>
          <span className="compare-note">{r.message} · 근로기준법 55조</span>
        </div>
      </div>
    </>
  );
}
