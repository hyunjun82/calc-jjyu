'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeVAT } from '@/lib/calc';

export function VATForm() {
  const [sales, setSales] = useState(5000);
  const [purchases, setPurchases] = useState(3000);
  const [type, setType] = useState<'general' | 'simple'>('general');
  const [simpleRate, setSimpleRate] = useState(15);

  const r = useMemo(() => computeVAT({
    salesMan: sales, purchasesMan: purchases, type, simpleRate,
  }), [sales, purchases, type, simpleRate]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>과세 유형</div>
        <div className="step done"><span className="dot">2</span>매출·매입</div>
        <div className="step active"><span className="dot">3</span>납부세액</div>
      </div>

      <div className="field">
        <label>과세 유형</label>
        <div className="seg" role="group">
          <button className={type === 'general' ? 'on' : ''} onClick={() => setType('general')}>일반과세자</button>
          <button className={type === 'simple' ? 'on' : ''} onClick={() => setType('simple')}>간이과세자</button>
        </div>
      </div>

      {type === 'simple' && (
        <div className="field">
          <label>업종 부가율 <span className="hint">{simpleRate}%</span></label>
          <div className="seg" role="group">
            <button className={simpleRate === 10 ? 'on' : ''} onClick={() => setSimpleRate(10)}>도소매 10%</button>
            <button className={simpleRate === 15 ? 'on' : ''} onClick={() => setSimpleRate(15)}>음식·숙박 15%</button>
            <button className={simpleRate === 20 ? 'on' : ''} onClick={() => setSimpleRate(20)}>제조 20%</button>
            <button className={simpleRate === 30 ? 'on' : ''} onClick={() => setSimpleRate(30)}>서비스 30%</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>매출액 <span className="hint">공급가액, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={sales.toLocaleString()}
              onChange={(e) => setSales(Math.min(10000000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
        <div className="field">
          <label>매입액 <span className="hint">공급가액, 만원</span></label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={purchases.toLocaleString()}
              onChange={(e) => setPurchases(Math.min(10000000, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">만원</span>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">{r.refund ? '환급세액' : '납부할 부가세'}</div>
        <div className="big t-num" style={{ color: r.refund ? 'var(--accent)' : 'var(--ink)' }}>
          {fmtKRW(Math.abs(r.vat))}<small>원</small>
        </div>
        <div className="sub">
          <div>매출세액 <b className="t-num">{fmtKRW(r.salesVAT)}원</b></div>
          <div>매입세액공제 <b className="t-num">− {fmtKRW(r.purchaseVAT)}원</b></div>
          <div>실효세율 <b className="t-num">{r.effectiveRate.toFixed(2)}%</b></div>
        </div>
        <div className="compare-line">
          <span className={`compare-pill ${r.refund ? 'up' : ''}`}>
            {r.refund ? '환급' : type === 'general' ? '일반과세 10%' : `간이 ${simpleRate}%×10%`}
          </span>
          <span className="compare-note">부가가치세법 · 2026년 기준</span>
        </div>
      </div>
    </>
  );
}
