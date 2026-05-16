'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeBrokerFee } from '@/lib/calc';

export function BrokerFeeForm() {
  const [type, setType] = useState<'sale' | 'jeonse' | 'wolse'>('sale');
  const [price, setPrice] = useState(50000);
  const [deposit, setDeposit] = useState(5000);
  const [monthly, setMonthly] = useState(100);

  const r = useMemo(() => computeBrokerFee({
    priceMan: price, type,
    depositMan: deposit, monthlyMan: monthly,
  }), [type, price, deposit, monthly]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>거래 유형</div>
        <div className="step done"><span className="dot">2</span>금액</div>
        <div className="step active"><span className="dot">3</span>법정 상한</div>
      </div>

      <div className="field">
        <label>거래 유형</label>
        <div className="seg" role="group">
          <button className={type === 'sale' ? 'on' : ''} onClick={() => setType('sale')}>매매</button>
          <button className={type === 'jeonse' ? 'on' : ''} onClick={() => setType('jeonse')}>전세</button>
          <button className={type === 'wolse' ? 'on' : ''} onClick={() => setType('wolse')}>월세</button>
        </div>
      </div>

      {type !== 'wolse' ? (
        <div className="field">
          <label>{type === 'sale' ? '매매가' : '전세보증금'} <span className="hint">만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={price.toLocaleString()}
              onChange={(e) => setPrice(Math.min(500000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
          <div className="unit-readout">
            <span className="korean">{manToKorean(price) || '0원'}</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label>보증금 <span className="hint">만원</span></label>
            <div className="input-wrap">
              <input type="text" inputMode="numeric" value={deposit.toLocaleString()}
                onChange={(e) => setDeposit(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
              <span className="suffix">만원</span>
            </div>
          </div>
          <div className="field">
            <label>월세 <span className="hint">만원/월</span></label>
            <div className="input-wrap">
              <input type="text" inputMode="numeric" value={monthly.toLocaleString()}
                onChange={(e) => setMonthly(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
              <span className="suffix">만원</span>
            </div>
          </div>
        </div>
      )}

      <div className="result-card">
        <div className="lbl">중개수수료 (VAT 포함)</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
        <div className="sub">
          <div>적용 요율 <b className="t-num">{r.rate.toFixed(2)}%</b></div>
          <div>수수료 <b className="t-num">{fmtKRW(r.fee)}원</b></div>
          <div>VAT (10%) <b className="t-num">+ {fmtKRW(r.vat)}원</b></div>
          {type === 'wolse' && <div>환산보증금 <b className="t-num">{fmtKRW(r.price)}원</b></div>}
        </div>
        <div className="compare-line">
          <span className="compare-pill">{r.note}</span>
          <span className="compare-note">공인중개사법 시행규칙 — 법정 상한</span>
        </div>
      </div>
    </>
  );
}
