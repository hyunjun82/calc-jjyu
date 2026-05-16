'use client';
import { useState, useMemo } from 'react';
import { convertCurrency, CURRENCIES, EXCHANGE_RATES } from '@/lib/calc';

export function ExchangeForm() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KRW');
  const [amount, setAmount] = useState(1);

  const r = useMemo(() => convertCurrency({ from, to, amount }), [from, to, amount]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>통화 선택</div>
        <div className="step done"><span className="dot">2</span>금액</div>
        <div className="step active"><span className="dot">3</span>환산</div>
      </div>

      <div className="field">
        <label>금액</label>
        <div className="input-wrap">
          <input type="text" inputMode="decimal" value={amount}
            onChange={(e) => setAmount(Math.max(0, +e.target.value.replace(/[^0-9.]/g, '') || 0))} />
          <span className="suffix">{from}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end' }}>
        <div className="field">
          <label>변환 전</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--hair)', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}>
            {CURRENCIES.map(c => (
              <option key={c} value={c}>{c} — {c === 'KRW' ? '한국 원' : EXCHANGE_RATES[c]?.name || c}</option>
            ))}
          </select>
        </div>
        <button onClick={swap} className="preset-chip" style={{ padding: '12px 16px', height: 44 }}>⇄</button>
        <div className="field">
          <label>변환 후</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--hair)', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}>
            {CURRENCIES.map(c => (
              <option key={c} value={c}>{c} — {c === 'KRW' ? '한국 원' : EXCHANGE_RATES[c]?.name || c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">{amount.toLocaleString()} {from} =</div>
        <div className="big t-num">
          {r.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          <small> {to}</small>
        </div>
        <div className="sub">
          <div>1 {from} = <b className="t-num">{r.rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">2026 평균 환율</span>
          <span className="compare-note">참고용 · 실거래 환율은 매시간 변동, 은행마다 다름</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>주요 통화 환율 (KRW 기준) <span className="chev">▼</span></summary>
        <div className="breakdown">
          {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
            <div key={code} className="row">
              <span>{info.name}{info.per ? ` (${info.per}단위)` : ''}</span>
              <span className="v t-num">{info.rate.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}
