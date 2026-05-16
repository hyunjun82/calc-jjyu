'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeOrdinaryWage } from '@/lib/calc';

export function OrdinaryWageForm() {
  const [basic, setBasic] = useState(250);
  const [bonus, setBonus] = useState(30);
  const [allowance, setAllowance] = useState(20);
  const [variable, setVariable] = useState(0);
  const [weekly, setWeekly] = useState(40);

  const r = useMemo(() => computeOrdinaryWage({
    basicSalaryMan: basic, fixedBonusMan: bonus,
    fixedAllowanceMan: allowance, variableAllowanceMan: variable,
    weeklyHours: weekly,
  }), [basic, bonus, allowance, variable, weekly]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>고정 임금</div>
        <div className="step done"><span className="dot">2</span>주 근로시간</div>
        <div className="step active"><span className="dot">3</span>시급·일급</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>기본급 <span className="hint">월, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={basic.toLocaleString()}
              onChange={(e) => setBasic(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>정기상여금 <span className="hint">월 환산, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={bonus.toLocaleString()}
              onChange={(e) => setBonus(Math.min(5000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>고정수당 <span className="hint">식대·직책 등, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={allowance.toLocaleString()}
              onChange={(e) => setAllowance(Math.min(2000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>변동수당 (제외) <span className="hint">실적·연장 등, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={variable.toLocaleString()}
              onChange={(e) => setVariable(Math.min(2000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div className="field">
        <label>주 소정근로 <span className="hint">{weekly}시간</span></label>
        <input type="range" className="slider" min="15" max="40" step="1" value={weekly}
          onChange={(e) => setWeekly(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">통상임금 시급</div>
        <div className="big t-num">{fmtKRW(r.hourly)}<small>원</small></div>
        <div className="sub">
          <div>통상임금 월액 <b className="t-num">{fmtKRW(r.ordinaryMonthly)}원</b></div>
          <div>1일 통상임금 (8h) <b className="t-num">{fmtKRW(r.daily)}원</b></div>
          <div>월 소정근로시간 <b className="t-num">{r.monthlyHours}시간</b></div>
          <div>연장수당 단가 (1.5×) <b className="t-num">{fmtKRW(r.overtimeUnitWage)}원/h</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">대법원 2013다89399</span>
          <span className="compare-note">정기성·일률성·고정성 충족 임금만 포함</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>통상임금 포함/제외 기준 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>✓ 포함: 기본급</span><span className="v t-num">{fmtKRW(basic * 10000)}원</span></div>
          <div className="row"><span>✓ 포함: 정기상여금</span><span className="v t-num">{fmtKRW(bonus * 10000)}원</span></div>
          <div className="row"><span>✓ 포함: 고정수당</span><span className="v t-num">{fmtKRW(allowance * 10000)}원</span></div>
          <div className="row"><span>× 제외: 변동수당</span><span className="v neg t-num">− {fmtKRW(r.excludedVariable)}원</span></div>
        </div>
      </details>
    </>
  );
}
