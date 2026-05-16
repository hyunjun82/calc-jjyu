'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeAcquisitionTax } from '@/lib/calc';

export function AcquisitionTaxForm() {
  const [price, setPrice] = useState(50000);
  const [owned, setOwned] = useState(1);
  const [adjusted, setAdjusted] = useState(false);
  const [type, setType] = useState<'house' | 'land'>('house');

  const r = useMemo(() => computeAcquisitionTax({
    housePriceMan: price, housesOwned: owned, isAdjusted: adjusted, type,
  }), [price, owned, adjusted, type]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>유형·가격</div>
        <div className="step done"><span className="dot">2</span>주택수</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <div className="field">
        <label>취득 유형</label>
        <div className="seg" role="group">
          <button className={type === 'house' ? 'on' : ''} onClick={() => setType('house')}>주택</button>
          <button className={type === 'land' ? 'on' : ''} onClick={() => setType('land')}>토지/상가</button>
        </div>
      </div>

      <div className="field">
        <label>취득가액 <span className="hint">만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={price.toLocaleString()}
            onChange={(e) => setPrice(Math.min(500000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">{manToKorean(price) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(price * 10000)}원</span>
        </div>
      </div>

      {type === 'house' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label>보유 주택수 (취득 포함)</label>
            <div className="seg" role="group">
              {[1, 2, 3, 4].map(n => (
                <button key={n} className={owned === n ? 'on' : ''} onClick={() => setOwned(n)}>{n}{n === 4 ? '↑' : ''}주택</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>조정대상지역</label>
            <div className="seg" role="group">
              <button className={!adjusted ? 'on' : ''} onClick={() => setAdjusted(false)}>비조정</button>
              <button className={adjusted ? 'on' : ''} onClick={() => setAdjusted(true)}>조정대상</button>
            </div>
          </div>
        </div>
      )}

      <div className="result-card">
        <div className="lbl">총 납부세액 (취득세 + 농특세 + 교육세)</div>
        <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
        <div className="sub">
          <div>취득세 ({r.rate.toFixed(2)}%) <b className="t-num">{fmtKRW(r.acquisitionTax)}원</b></div>
          <div>농어촌특별세 <b className="t-num">{fmtKRW(r.farmTax)}원</b></div>
          <div>지방교육세 <b className="t-num">{fmtKRW(r.eduTax)}원</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{r.breakdown}</span>
          <span className="compare-note">지방세법 11조 · 2026년 기준</span>
        </div>
      </div>
    </>
  );
}
