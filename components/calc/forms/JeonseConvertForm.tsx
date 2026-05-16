'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeJeonseConvert } from '@/lib/calc';

export function JeonseConvertForm() {
  const [mode, setMode] = useState<'jeonseToWolse' | 'wolseToJeonse'>('jeonseToWolse');
  const [jeonse, setJeonse] = useState(30000);
  const [deposit, setDeposit] = useState(5000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(5);

  const r = useMemo(() => computeJeonseConvert({
    mode, jeonseMan: jeonse, depositMan: deposit, monthlyMan: monthly,
    conversionRate: rate,
  }), [mode, jeonse, deposit, monthly, rate]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>변환 방향</div>
        <div className="step done"><span className="dot">2</span>금액</div>
        <div className="step active"><span className="dot">3</span>환산</div>
      </div>

      <div className="field">
        <label>변환 방향</label>
        <div className="seg" role="group">
          <button className={mode === 'jeonseToWolse' ? 'on' : ''} onClick={() => setMode('jeonseToWolse')}>전세 → 월세</button>
          <button className={mode === 'wolseToJeonse' ? 'on' : ''} onClick={() => setMode('wolseToJeonse')}>월세 → 전세</button>
        </div>
      </div>

      {mode === 'jeonseToWolse' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label>현 전세보증금 <span className="hint">만원</span></label>
            <div className="input-wrap">
              <input type="text" inputMode="numeric" value={jeonse.toLocaleString()}
                onChange={(e) => setJeonse(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
              <span className="suffix">만원</span>
            </div>
          </div>
          <div className="field">
            <label>전환 후 보증금 <span className="hint">만원</span></label>
            <div className="input-wrap">
              <input type="text" inputMode="numeric" value={deposit.toLocaleString()}
                onChange={(e) => setDeposit(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
              <span className="suffix">만원</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label>월세 보증금 <span className="hint">만원</span></label>
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

      <div className="field">
        <label>전월세전환율 <span className="hint">{rate}% · 한은 기준금리 + 2%</span></label>
        <input type="range" className="slider" min="2" max="10" step="0.1" value={rate}
          onChange={(e) => setRate(+e.target.value)} />
      </div>

      <div className="result-card">
        <div className="lbl">{mode === 'jeonseToWolse' ? '환산 월세' : '환산 전세보증금'}</div>
        <div className="big t-num">
          {mode === 'jeonseToWolse' ? fmtKRW(r.monthlyRent) : fmtKRW(r.jeonse)}
          <small>원{mode === 'jeonseToWolse' ? '/월' : ''}</small>
        </div>
        <div className="sub">
          <div>한국식 <b className="t-num">
            {manToKorean(Math.round((mode === 'jeonseToWolse' ? r.monthlyRent : r.jeonse) / 10000))}
          </b></div>
          <div>전환율 <b className="t-num">{r.conversionRate}%</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{r.formula}</span>
          <span className="compare-note">주택임대차보호법 · 한국은행 기준금리 연동</span>
        </div>
      </div>
    </>
  );
}
