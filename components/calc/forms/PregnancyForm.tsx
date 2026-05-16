'use client';
import { useState, useMemo } from 'react';
import { computePregnancy } from '@/lib/calc';

export function PregnancyForm() {
  const today = new Date();
  const defaultLmp = new Date(today.getTime() - 70 * 86400000).toISOString().slice(0, 10);
  const [lmp, setLmp] = useState(defaultLmp);
  const r = useMemo(() => computePregnancy({ lmpDate: lmp }), [lmp]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>마지막 생리일</div>
        <div className="step active"><span className="dot">2</span>주수 / 예정일</div>
      </div>

      <div className="field">
        <label>마지막 생리 시작일 (LMP) <span className="hint">Naegele 공식 기준</span></label>
        <div className="input-wrap">
          <input type="date" value={lmp} max={today.toISOString().slice(0, 10)}
            onChange={(e) => setLmp(e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">임신 주수</div>
        <div className="big t-num">{r.label}</div>
        <div className="sub">
          <div>총 <b className="t-num">{r.totalDays}일</b> 경과</div>
          <div>{r.trimester}</div>
          <div>출산까지 <b className="t-num">{r.daysToDue > 0 ? `${r.daysToDue}일 남음` : `${Math.abs(r.daysToDue)}일 지남`}</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill up">출산예정일 {r.dueDateKr}</span>
          <span className="compare-note">진행률 {r.progress.toFixed(0)}%</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>임신 시기 구분 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>1삼분기 (초기)</span><span className="v t-num">0 ~ 12주</span></div>
          <div className="row"><span>2삼분기 (중기)</span><span className="v t-num">13 ~ 26주</span></div>
          <div className="row"><span>3삼분기 (후기)</span><span className="v t-num">27 ~ 40주</span></div>
          <div className="row tot"><span>출산예정일</span><span className="v t-num">LMP + 280일</span></div>
        </div>
      </details>
    </>
  );
}
