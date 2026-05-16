'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeDeposit } from '@/lib/calc';

export function DepositForm() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [type, setType] = useState<'deposit' | 'saving'>('deposit');
  const [compound, setCompound] = useState<'monthly' | 'simple'>('monthly');
  const [tax, setTax] = useState<'normal' | 'tax_free'>('normal');

  const r = useMemo(() => computeDeposit({
    principalMan: principal, rate, months, type, compound, tax,
  }), [principal, rate, months, type, compound, tax]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>상품 선택</div>
        <div className="step done"><span className="dot">2</span>금액·금리</div>
        <div className="step active"><span className="dot">3</span>만기 수령</div>
      </div>

      <div className="field">
        <label>상품 종류</label>
        <div className="seg" role="group">
          <button className={type === 'deposit' ? 'on' : ''} onClick={() => setType('deposit')}>예금 (목돈)</button>
          <button className={type === 'saving' ? 'on' : ''} onClick={() => setType('saving')}>적금 (월납입)</button>
        </div>
      </div>

      <div className="field">
        <label>{type === 'deposit' ? '예치 원금' : '월 납입액'} <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={principal.toLocaleString()}
            onChange={(e) => setPrincipal(Math.min(100000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(principal) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(principal * 10000)}원</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>연 금리 <span className="hint">{rate}%</span></label>
          <input type="range" className="slider" min="0.5" max="10" step="0.1" value={rate}
            onChange={(e) => setRate(+e.target.value)} />
        </div>
        <div className="field">
          <label>기간 <span className="hint">{months}개월</span></label>
          <input type="range" className="slider" min="1" max="60" step="1" value={months}
            onChange={(e) => setMonths(+e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>이자 계산</label>
          <div className="seg" role="group">
            <button className={compound === 'monthly' ? 'on' : ''} onClick={() => setCompound('monthly')}>월복리</button>
            <button className={compound === 'simple' ? 'on' : ''} onClick={() => setCompound('simple')}>단리</button>
          </div>
        </div>
        <div className="field">
          <label>과세</label>
          <div className="seg" role="group">
            <button className={tax === 'normal' ? 'on' : ''} onClick={() => setTax('normal')}>일반 (15.4%)</button>
            <button className={tax === 'tax_free' ? 'on' : ''} onClick={() => setTax('tax_free')}>비과세</button>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">만기 수령액 (세후)</div>
        <div className="big t-num">{fmtKRW(r.totalReceived)}<small>원</small></div>
        <div className="sub">
          <div>원금 합계 <b className="t-num">{fmtKRW(r.totalPrincipal)}원</b></div>
          <div>세전 이자 <b className="t-num">{fmtKRW(r.interest)}원</b></div>
          <div>세금 차감 <b className="t-num">− {fmtKRW(r.tax)}원</b></div>
          <div>세후 이자 <b className="t-num">{fmtKRW(r.afterTax)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">실효 수익률 {r.effectiveRate.toFixed(2)}%</span>
          <span className="compare-note">이자소득세 14% + 지방소득세 1.4% = 15.4%</span>
        </div>
      </div>
    </>
  );
}
