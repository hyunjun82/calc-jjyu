'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeJeonseLoan } from '@/lib/calc';

export function JeonseLoanForm() {
  const [jeonse, setJeonse] = useState(20000);
  const [rate, setRate] = useState(3.5);
  const [type, setType] = useState<'general' | 'butimmok' | 'shinhon'>('general');
  const r = useMemo(() => computeJeonseLoan({ jeonseMan: jeonse, rate, loanType: type }), [jeonse, rate, type]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>전세금</div>
        <div className="step done"><span className="dot">2</span>대출 종류</div>
        <div className="step active"><span className="dot">3</span>한도·월이자</div>
      </div>

      <div className="field">
        <label>전세 보증금 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={jeonse.toLocaleString()}
            onChange={(e) => setJeonse(Math.min(200000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(jeonse) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(jeonse * 10000)}원</span>
        </div>
      </div>

      <div className="field">
        <label>대출 종류 <span className="hint">정부 상품은 한도 다름</span></label>
        <div className="seg" role="group">
          <button className={type === 'general' ? 'on' : ''} onClick={() => setType('general')}>일반 시중</button>
          <button className={type === 'butimmok' ? 'on' : ''} onClick={() => setType('butimmok')}>버팀목 (~34세)</button>
          <button className={type === 'shinhon' ? 'on' : ''} onClick={() => setType('shinhon')}>신혼부부</button>
        </div>
      </div>

      <div className="field">
        <label>연 금리 <span className="hint">{rate}%</span></label>
        <input type="range" className="slider" min="1" max="8" step="0.1" value={rate}
          onChange={(e) => setRate(+e.target.value)} />
        <div className="slider-ticks"><span>1%</span><span>3%</span><span>5%</span><span>8%</span></div>
      </div>

      <div className="result-card">
        <div className="lbl">대출 한도 (LTV {r.ltv}%)</div>
        <div className="big t-num">{fmtKRW(r.loan)}<small>원</small></div>
        <div className="sub">
          <div>월 이자 <b className="t-num">{fmtKRW(r.monthlyInterest)}원</b></div>
          <div>연 이자 <b className="t-num">{fmtKRW(r.annualInterest)}원</b></div>
          <div>상품 한도 <b className="t-num">{fmtKRW(r.maxLimit)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{type === 'butimmok' ? '버팀목 최대 1.2억' : type === 'shinhon' ? '신혼 최대 2.5억' : '일반 전세금 80%'}</span>
          <span className="compare-note">2026년 기준 · 만기일시상환 (이자만 납부)</span>
        </div>
      </div>
    </>
  );
}
