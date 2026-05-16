'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeYearEndTax } from '@/lib/calc';

export function YearEndTaxForm() {
  const [salary, setSalary] = useState(5000);
  const [withholding, setWithholding] = useState(250);
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [card, setCard] = useState(1500);
  const [medical, setMedical] = useState(100);
  const [pension, setPension] = useState(0);

  const r = useMemo(() => computeYearEndTax({
    annualSalaryMan: salary, withholdingMan: withholding,
    dependents, children,
    creditCardMan: card, medicalMan: medical,
    pensionMan: pension, insuranceMan: 100, educationMan: 0,
  }), [salary, withholding, dependents, children, card, medical, pension]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>연봉·원천징수</div>
        <div className="step done"><span className="dot">2</span>가족·공제</div>
        <div className="step active"><span className="dot">3</span>환급/추납</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연 총급여 <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={salary.toLocaleString()}
              onChange={(e) => setSalary(Math.min(100000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>원천징수액 (1년 누적) <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={withholding.toLocaleString()}
              onChange={(e) => setWithholding(Math.min(10000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>부양가족 <span className="hint">본인 제외</span></label>
          <div className="seg" role="group">
            {[0, 1, 2, 3, 4].map(n => (
              <button key={n} className={dependents === n ? 'on' : ''} onClick={() => setDependents(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>20세↓ 자녀</label>
          <div className="seg" role="group">
            {[0, 1, 2, 3, 4].map(n => (
              <button key={n} className={children === n ? 'on' : ''} onClick={() => setChildren(n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>신용카드 <span className="hint">만원/년</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={card.toLocaleString()}
              onChange={(e) => setCard(+e.target.value.replace(/[^0-9]/g, '') || 0)} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>의료비 <span className="hint">만원/년</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={medical.toLocaleString()}
              onChange={(e) => setMedical(+e.target.value.replace(/[^0-9]/g, '') || 0)} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>연금저축 <span className="hint">만원/년</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={pension.toLocaleString()}
              onChange={(e) => setPension(+e.target.value.replace(/[^0-9]/g, '') || 0)} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">{r.isRefund ? '환급액' : '추가 납부액'}</div>
        <div className="big t-num" style={{ color: r.isRefund ? 'var(--accent)' : '#C2553C' }}>
          {fmtKRW(Math.abs(r.refund))}<small>원</small>
        </div>
        <div className="sub">
          <div>결정세액 <b className="t-num">{fmtKRW(r.totalDue)}원</b></div>
          <div>기납부세액 <b className="t-num">{fmtKRW(r.withheld)}원</b></div>
          <div>총 세액공제 <b className="t-num">− {fmtKRW(r.totalCredits)}원</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.isRefund ? 'up' : 'down'}`}>
            {r.isRefund ? '✓ 환급' : '× 추가납부'}
          </span>
          <span className="compare-note">소득세법 · 2026 기준 (간이 추정)</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>공제 내역 자세히 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>산출세액</span><span className="v t-num">{fmtKRW(r.calculatedTax)}원</span></div>
          <div className="row"><span>− 근로소득세액공제</span><span className="v neg t-num">− {fmtKRW(r.earnedCredit)}원</span></div>
          <div className="row"><span>− 자녀세액공제</span><span className="v neg t-num">− {fmtKRW(r.childCredit)}원</span></div>
          <div className="row"><span>− 의료비공제</span><span className="v neg t-num">− {fmtKRW(r.medCredit)}원</span></div>
          <div className="row"><span>− 연금저축공제</span><span className="v neg t-num">− {fmtKRW(r.pensionCredit)}원</span></div>
          <div className="row"><span>− 신용카드공제</span><span className="v neg t-num">− {fmtKRW(r.cardDeduction)}원</span></div>
          <div className="row tot"><span>결정세액 (지방세 포함)</span><span className="v t-num">{fmtKRW(r.totalDue)}원</span></div>
        </div>
      </details>
    </>
  );
}
