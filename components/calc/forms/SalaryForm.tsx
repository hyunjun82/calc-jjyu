'use client';
import { useState, useMemo } from 'react';
import { fmtKRW, manToKorean } from '@/lib/format';
import { computeSalary } from '@/lib/calc';

// 평균 비교 (2024 통계청 평균 ~4900만)
function compareToAverage(annualMan: number) {
  const avgMan = 4900;
  const diff = ((annualMan - avgMan) / avgMan) * 100;
  let percentile;
  if (annualMan >= 12000) percentile = '상위 5%';
  else if (annualMan >= 9000) percentile = '상위 10%';
  else if (annualMan >= 7000) percentile = '상위 20%';
  else if (annualMan >= 5500) percentile = '상위 35%';
  else if (annualMan >= 4500) percentile = '평균 근처';
  else if (annualMan >= 3500) percentile = '하위 40%';
  else percentile = '하위 25%';
  return { diff, percentile, avgMan };
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

export function SalaryForm() {
  const [salary, setSalary] = useState(5000);
  const [dependents, setDependents] = useState(1);
  const [children_, setChildren] = useState(0);
  const r = useMemo(() => computeSalary({ annualMan: salary, dependents, children: children_ }), [salary, dependents, children_]);

  const cmp = compareToAverage(salary);
  const presets = [
    { label: '신입', man: 3200 },
    { label: '3년차', man: 4500 },
    { label: '5년차', man: 5500 },
    { label: '10년차', man: 7500 },
    { label: '임원', man: 12000 },
  ];

  // 공제 도넛 차트 데이터
  const monthlyGross = r.monthlyGross;
  const segs = [
    { key: 'net', label: '실수령', value: r.netMonth, color: 'var(--accent)' },
    { key: 'tax', label: '세금', value: r.breakdown.total_tax, color: '#C2553C' },
    { key: 'ins', label: '4대보험', value: r.breakdown.insurance, color: '#6B8E50' },
  ];
  const C = 2 * Math.PI * 60; // 원주 (r=60)
  let off = 0;
  const arcs = segs.map(s => {
    const len = (s.value / monthlyGross) * C;
    const arc = { ...s, dasharray: `${len} ${C}`, dashoffset: -off };
    off += len;
    return arc;
  });

  return (
    <>
      {/* Step indicator */}
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>연봉</div>
        <div className="step done"><span className="dot">2</span>가족 정보</div>
        <div className="step active"><span className="dot">3</span>결과</div>
      </div>

      {/* Quick presets */}
      <div className="preset-row">
        <span className="preset-label">빠른 선택</span>
        {presets.map(p => (
          <button
            key={p.label}
            className={`preset-chip ${salary === p.man ? 'on' : ''}`}
            onClick={() => setSalary(p.man)}
          >
            {p.label} <span className="t-mono" style={{ fontSize: 11, opacity: 0.7 }}>{p.man.toLocaleString()}</span>
          </button>
        ))}
      </div>

      <div className="field">
        <label>
          연봉 <span className="hint">세전, 만원 단위로 입력</span>
        </label>
        <div className="input-wrap">
          <input
            type="text"
            inputMode="numeric"
            value={salary.toLocaleString()}
            onChange={(e) => {
              const n = +e.target.value.replace(/[^0-9]/g, '') || 0;
              setSalary(Math.min(50000, Math.max(0, n)));
            }}
          />
          <span className="suffix">만원</span>
        </div>
        {/* Live unit conversion — 한국식 단위 자동 표시 */}
        <div className="unit-readout">
          <span className="korean">{manToKorean(salary) || '0원'}</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(salary * 10000)}원</span>
        </div>
        <input type="range" className="slider" min="2000" max="20000" step="100"
          value={Math.min(salary, 20000)}
          onChange={(e) => setSalary(+e.target.value)} />
        <div className="slider-ticks">
          <span>2,000</span><span>5,000</span><span>1억</span><span>1.5억</span><span>2억+</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>부양가족 수 <span className="hint">본인 포함 안 함</span></label>
          <div className="seg" role="group">
            {[0, 1, 2, 3, 4].map(n => (
              <button key={n} className={dependents === n ? 'on' : ''} onClick={() => setDependents(n)}>{n}명</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>20세 이하 자녀 <span className="hint">세액공제</span></label>
          <div className="seg" role="group">
            {[0, 1, 2, 3, 4].map(n => (
              <button key={n} className={children_ === n ? 'on' : ''} onClick={() => setChildren(n)}>{n}명</button>
            ))}
          </div>
        </div>
      </div>

      {/* Result card with donut chart */}
      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">월 실수령액 (예상)</div>
          <div className="big t-num">{fmtKRW(r.netMonth)}<small>원</small></div>
          <div className="sub">
            <div>월 세전 <b className="t-num">{fmtKRW(r.monthlyGross)}원</b></div>
            <div>연 실수령 <b className="t-num">{fmtKRW(r.netYear)}원</b></div>
            <div>공제율 <b className="t-num">{((r.breakdown.total_deduct / r.monthlyGross) * 100).toFixed(1)}%</b></div>
          </div>
          <div className="compare-line">
            <span className={`compare-pill ${cmp.diff > 0 ? 'up' : 'down'}`}>
              {cmp.diff > 0 ? '▲' : '▼'} 평균 대비 {cmp.diff > 0 ? '+' : ''}{cmp.diff.toFixed(0)}%
            </span>
            <span className="compare-tag">{cmp.percentile}</span>
            <span className="compare-note">평균 직장인 연봉 {cmp.avgMan.toLocaleString()}만원 기준</span>
          </div>
        </div>
        <div className="donut">
          <svg viewBox="0 0 160 160" width="140" height="140">
            <circle cx="80" cy="80" r="60" fill="none" stroke="var(--hair)" strokeWidth="22" />
            {arcs.map((a, i) => (
              <circle key={a.key} cx="80" cy="80" r="60" fill="none"
                stroke={a.color} strokeWidth="22"
                strokeDasharray={a.dasharray} strokeDashoffset={a.dashoffset}
                transform="rotate(-90 80 80)" strokeLinecap="butt"
              />
            ))}
            <text x="80" y="76" textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)" letterSpacing="0.1em">NET</text>
            <text x="80" y="94" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ink)" fontFamily="var(--font-sans)">
              {Math.round((r.netMonth / r.monthlyGross) * 100)}%
            </text>
          </svg>
          <div className="legend">
            {arcs.map(a => (
              <div key={a.key} className="legend-row">
                <span className="legend-dot" style={{ background: a.color }}></span>
                <span className="legend-label">{a.label}</span>
                <span className="legend-val t-num">{Math.round((a.value / monthlyGross) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>공제 내역 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>국민연금 (4.5%)</span><span className="v neg t-num">− {fmtKRW(r.breakdown.np)}원</span></div>
          <div className="row"><span>건강보험 (3.545%)</span><span className="v neg t-num">− {fmtKRW(r.breakdown.hi)}원</span></div>
          <div className="row"><span>장기요양 (건보 × 12.95%)</span><span className="v neg t-num">− {fmtKRW(r.breakdown.ltc)}원</span></div>
          <div className="row"><span>고용보험 (0.9%)</span><span className="v neg t-num">− {fmtKRW(r.breakdown.ei)}원</span></div>
          <div className="row"><span>소득세 (간이세액표)</span><span className="v neg t-num">− {fmtKRW(r.breakdown.income_tax)}원</span></div>
          <div className="row"><span>지방소득세 (소득세 × 10%)</span><span className="v neg t-num">− {fmtKRW(r.breakdown.local_tax)}원</span></div>
          <div className="row tot"><span>총 공제 합계</span><span className="v neg t-num">− {fmtKRW(r.breakdown.total_deduct)}원</span></div>
        </div>
      </details>

      {/* 관련 계산기 — 사용자의 다음 행동 가이드 + SEO 내부링크 */}
      <div className="related-calcs">
        <div className="related-head">
          <span className="t-eyebrow">다음에 해볼만한 계산</span>
          <span className="related-hint">방금 본 공제, 환급, 부수입까지</span>
        </div>
        <div className="related-grid">
          <a className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">02</div>
            <div className="related-name">4대보험료 계산기</div>
            <div className="related-desc">방금 차감된 보험료를 더 자세히</div>
            <span className="related-arrow">{'→'}</span>
          </a>
          <a className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">03</div>
            <div className="related-name">연말정산 환급</div>
            <div className="related-desc">이 연봉으로 얼마 돌려받을까</div>
            <span className="related-arrow">{'→'}</span>
          </a>
          <a className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">04</div>
            <div className="related-name">종합소득세</div>
            <div className="related-desc">부수입·사이드잡 있다면</div>
            <span className="related-arrow">{'→'}</span>
          </a>
        </div>
      </div>
    </>
  );
}
