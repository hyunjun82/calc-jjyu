'use client';
import { useState, useMemo, useEffect } from 'react';
import { convertUnit, UNIT_CATEGORIES } from '@/lib/calc';

const CATEGORY_LABELS: Record<string, string> = {
  length: '길이', weight: '무게', area: '넓이', volume: '부피', temperature: '온도',
};

export function UnitForm() {
  const [category, setCategory] = useState<keyof typeof UNIT_CATEGORIES>('length');
  const [from, setFrom] = useState<string>('m');
  const [to, setTo] = useState<string>('cm');
  const [value, setValue] = useState<number>(1);

  useEffect(() => {
    const units = UNIT_CATEGORIES[category];
    setFrom(units[0]);
    setTo(units[1] || units[0]);
  }, [category]);

  const r = useMemo(() => convertUnit({ category, from, to, value }), [category, from, to, value]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>분류</div>
        <div className="step done"><span className="dot">2</span>단위</div>
        <div className="step active"><span className="dot">3</span>결과</div>
      </div>

      <div className="field">
        <label>분류</label>
        <div className="seg" role="group">
          {(Object.keys(UNIT_CATEGORIES) as Array<keyof typeof UNIT_CATEGORIES>).map(c => (
            <button key={c} className={category === c ? 'on' : ''} onClick={() => setCategory(c)}>
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>값</label>
        <div className="input-wrap">
          <input type="text" inputMode="decimal" value={value}
            onChange={(e) => setValue(+e.target.value.replace(/[^0-9.\-]/g, '') || 0)} />
          <span className="suffix">{from}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>변환 전</label>
          <div className="input-wrap">
            <select value={from} onChange={(e) => setFrom(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--hair)', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}>
              {UNIT_CATEGORIES[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>변환 후</label>
          <div className="input-wrap">
            <select value={to} onChange={(e) => setTo(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--hair)', borderRadius: 8, background: 'var(--card)', color: 'var(--ink)' }}>
              {UNIT_CATEGORIES[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">{value} {from} =</div>
        <div className="big t-num">{r.result.toLocaleString(undefined, { maximumFractionDigits: 6 })}<small> {to}</small></div>
        <div className="compare-line">
          <span className="compare-pill">SI 표준 + 한국 전통 단위</span>
          <span className="compare-note">국제 단위계 (SI) 정의 기준</span>
        </div>
      </div>
    </>
  );
}
