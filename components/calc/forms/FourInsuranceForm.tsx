'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { compute4Insurance } from '@/lib/calc';

export function FourInsuranceForm() {
  const [wage, setWage] = useState(300);
  const r = useMemo(() => compute4Insurance({ monthlyWageMan: wage }), [wage]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>월 보수</div>
        <div className="step active"><span className="dot">2</span>4대보험료</div>
      </div>

      <div className="field">
        <label>월 보수액 <span className="hint">세전, 만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={wage.toLocaleString()}
            onChange={(e) => setWage(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <input type="range" className="slider" min="100" max="2000" step="10" value={wage}
          onChange={(e) => setWage(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">근로자 부담</div>
        <div className="big t-num">{fmtKRW(r.workerTotal)}<small>원/월</small></div>
        <div className="sub">
          <div>사업주 부담 <b className="t-num">{fmtKRW(r.employerTotal)}원</b></div>
          <div>총 보험료 <b className="t-num">{fmtKRW(r.grandTotal)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">2026년 요율</span>
          <span className="compare-note">국민·건강·고용 근로자/사업주 반반, 산재는 사업주만</span>
        </div>
      </div>

      <details className="breakdown-toggle" open>
        <summary>항목별 보험료 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>국민연금 (4.5%)</span><span className="v t-num">{fmtKRW(r.npWorker)} / {fmtKRW(r.npEmployer)}</span></div>
          <div className="row"><span>건강보험 (3.545%)</span><span className="v t-num">{fmtKRW(r.hiWorker)} / {fmtKRW(r.hiEmployer)}</span></div>
          <div className="row"><span>장기요양 (건보×12.95%)</span><span className="v t-num">{fmtKRW(r.ltcWorker)} / {fmtKRW(r.ltcEmployer)}</span></div>
          <div className="row"><span>고용보험 (0.9% / 1.15%)</span><span className="v t-num">{fmtKRW(r.eiWorker)} / {fmtKRW(r.eiEmployer)}</span></div>
          <div className="row"><span>산재보험 (평균 1.5%)</span><span className="v t-num">0 / {fmtKRW(r.wcEmployer)}</span></div>
          <div className="row tot"><span>합계 (근로자 / 사업주)</span><span className="v t-num">{fmtKRW(r.workerTotal)} / {fmtKRW(r.employerTotal)}</span></div>
        </div>
      </details>
    </>
  );
}
