'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import {
  computeSalary, computeSeverance, computeMortgage,
  computeIncomeTax, computeUnemployment, computeCapitalGains,
} from '@/lib/calc';

// ===== 공통 빌딩 블록 =====
function NumberField({ label, hint, value, setValue, max = 100000, suffix = '만원', withReadout = true }: any) {
  return (
    <div className="field">
      <label>{label} {hint && <span className="hint">{hint}</span>}</label>
      <div className="input-wrap">
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString()}
          onChange={(e) => {
            const n = +e.target.value.replace(/[^0-9]/g, '') || 0;
            setValue(Math.min(max, Math.max(0, n)));
          }}
        />
        <span className="suffix">{suffix}</span>
      </div>
      {withReadout && (
        <div className="unit-readout">
          <span className="korean">{manToKorean(value) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(value * 10000)}원</span>
        </div>
      )}
    </div>
  );
}

function SegSel({ label, hint, value, setValue, options }: any) {
  return (
    <div className="field">
      <label>{label} {hint && <span className="hint">{hint}</span>}</label>
      <div className="seg" role="group">
        {options.map((o: any) => (
          <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => setValue(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segs, total, centerLabel, centerValue }: any) {
  const C = 2 * Math.PI * 60;
  let off = 0;
  const arcs = segs.map((s: any) => {
    const len = (s.value / total) * C;
    const arc = { ...s, dasharray: `${Math.max(0, len)} ${C}`, dashoffset: -off };
    off += len;
    return arc;
  });
  return (
    <div className="donut">
      <svg viewBox="0 0 160 160" width="140" height="140">
        <circle cx="80" cy="80" r="60" fill="none" stroke="var(--hair)" strokeWidth="22" />
        {arcs.map((a: any) => (
          <circle key={a.key} cx="80" cy="80" r="60" fill="none"
            stroke={a.color} strokeWidth="22"
            strokeDasharray={a.dasharray} strokeDashoffset={a.dashoffset}
            transform="rotate(-90 80 80)" strokeLinecap="butt"
          />
        ))}
        <text x="80" y="76" textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)" letterSpacing="0.1em">{centerLabel}</text>
        <text x="80" y="94" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ink)" fontFamily="var(--font-sans)">{centerValue}</text>
      </svg>
      <div className="legend">
        {arcs.map((a: any) => (
          <div key={a.key} className="legend-row">
            <span className="legend-dot" style={{ background: a.color }}></span>
            <span className="legend-label">{a.label}</span>
            <span className="legend-val t-num">{Math.round((a.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function RelatedCalcs({ items }: any) {
  return (
    <div className="related-calcs">
      <div className="related-head">
        <span className="t-eyebrow">다음에 해볼만한 계산</span>
        <span className="related-hint">함께 보면 좋은 계산기</span>
      </div>
      <div className="related-grid">
        {items.map((it: any, i: number) => (
          <a key={i} className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">{String(i + 2).padStart(2, '0')}</div>
            <div className="related-name">{it.name}</div>
            <div className="related-desc">{it.desc}</div>
            <span className="related-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function SeveranceForm() {
  const [avgMonthly, setAvg] = useState(350);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const r = useMemo(() => computeSeverance({ avgMonthlyMan: avgMonthly, yearsServed: years, monthsServed: months }), [avgMonthly, years, months]);
  const presets = [
    { label: '3년', y: 3, m: 0 },
    { label: '5년', y: 5, m: 0 },
    { label: '10년', y: 10, m: 0 },
    { label: '15년', y: 15, m: 0 },
    { label: '20년+', y: 20, m: 0 },
  ];

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>월급</div>
        <div className="step done"><span className="dot">2</span>근속</div>
        <div className="step active"><span className="dot">3</span>퇴직금</div>
      </div>

      <div className="preset-row">
        <span className="preset-label">빠른 선택</span>
        {presets.map(p => (
          <button key={p.label} className={`preset-chip ${years === p.y && months === p.m ? 'on' : ''}`}
            onClick={() => { setYears(p.y); setMonths(p.m); }}>{p.label}</button>
        ))}
      </div>

      <NumberField label="최근 3개월 평균 월급" hint="세전, 만원" value={avgMonthly} setValue={setAvg} max={50000} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>근속 연수</label>
          <div className="input-wrap">
            <input type="number" value={years} min="0" max="40" onChange={(e) => setYears(+e.target.value || 0)} />
            <span className="suffix">년</span>
          </div>
        </div>
        <div className="field">
          <label>+ 추가 개월 수</label>
          <div className="input-wrap">
            <input type="number" value={months} min="0" max="11" onChange={(e) => setMonths(+e.target.value || 0)} />
            <span className="suffix">개월</span>
          </div>
        </div>
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">예상 퇴직금 (세전)</div>
          <div className="big t-num">{fmtKRW(r.severance)}<small>원</small></div>
          <div className="sub">
            <div>재직일수 <b className="t-num">{r.days.toLocaleString()}일</b></div>
            <div>1일 평균임금 <b className="t-num">{fmtKRW(r.avgDaily)}원</b></div>
            <div>세후 예상 <b className="t-num">{fmtKRW(r.net)}원</b></div>
          </div>
          <div className="compare-line">
            <span className="compare-tag">근로기준법 제34조 기준</span>
            <span className="compare-note">실제는 퇴직 시점 평균임금 기준</span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'net', label: '세후 수령', value: r.net, color: 'var(--accent)' },
            { key: 'tax', label: '퇴직소득세', value: r.tax, color: '#C2553C' },
          ]}
          total={r.severance}
          centerLabel="NET"
          centerValue={`${Math.round((r.net / r.severance) * 100)}%`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>계산 과정 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>최근 3개월 임금총액</span><span className="v t-num">{fmtKRW(avgMonthly * 10000 * 3)}원</span></div>
          <div className="row"><span>÷ 90일 = 1일 평균임금</span><span className="v t-num">{fmtKRW(r.avgDaily)}원</span></div>
          <div className="row"><span>× 30일 × (재직일수 / 365)</span><span className="v t-num">{fmtKRW(r.severance)}원</span></div>
          <div className="row"><span>− 퇴직소득세 (간이)</span><span className="v neg t-num">− {fmtKRW(r.tax)}원</span></div>
          <div className="row tot"><span>최종 수령 예상</span><span className="v t-num">{fmtKRW(r.net)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '실업급여', desc: '퇴직 후 받을 수 있는 급여' },
        { name: '국민연금 예상', desc: '노후 연금 수령액' },
        { name: '연봉 실수령액', desc: '재취업 시 월급 계산' },
      ]} />
    </>
  );
}