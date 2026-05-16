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

export function UnemploymentForm() {
  const [daily, setDaily] = useState(12);
  const [age, setAge] = useState<'50미만' | '50이상'>('50미만');
  const [insured, setInsured] = useState(3);
  const r = useMemo(() => computeUnemployment({
    avgDailyWageMan: daily, ageGroup: age, insuredYears: insured,
  }), [daily, age, insured]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>평균임금</div>
        <div className="step done"><span className="dot">2</span>가입기간</div>
        <div className="step active"><span className="dot">3</span>급여액</div>
      </div>

      <div className="field">
        <label>이직 전 1일 평균임금 <span className="hint">월급 ÷ 30일, 만원</span></label>
        <div className="input-wrap">
          <input type="text" inputMode="numeric" value={daily.toLocaleString()}
            onChange={(e) => setDaily(Math.min(100, Math.max(0, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
          <span className="suffix">만원</span>
        </div>
        <div className="unit-readout">
          <span className="korean">월급 약 {(daily * 30).toLocaleString()}만원</span>
          <span className="dot-sep">·</span>
          <span className="raw t-num">{fmtKRW(daily * 10000)}원 / 일</span>
        </div>
      </div>

      <SegSel label="연령" value={age} setValue={setAge}
        options={[{value: '50미만', label: '50세 미만'}, {value: '50이상', label: '50세 이상 / 장애인'}]} />

      <div className="field">
        <label>고용보험 가입기간 <span className="hint">{insured}년</span></label>
        <input type="range" className="slider" min="0" max="20" step="1" value={insured} onChange={(e) => setInsured(+e.target.value)} />
        <div className="slider-ticks"><span>0</span><span>1년</span><span>3년</span><span>5년</span><span>10년+</span></div>
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">예상 총 수령액</div>
          <div className="big t-num">{fmtKRW(r.total)}<small>원</small></div>
          <div className="sub">
            <div>1일 급여 <b className="t-num">{fmtKRW(r.dailyBenefit)}원</b></div>
            <div>월 환산 <b className="t-num">{fmtKRW(r.monthly)}원</b></div>
            <div>지급일수 <b className="t-num">{r.days}일</b></div>
          </div>
          <div className="compare-line">
            {r.isMax && <span className="compare-pill down">상한 적용 (1일 66,000원)</span>}
            {r.isMin && <span className="compare-pill up">하한 적용 (최저시급 80%)</span>}
            {!r.isMax && !r.isMin && <span className="compare-tag">평균임금 60% 기준</span>}
            <span className="compare-note">{age} · 가입 {insured}년</span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'days', label: `지급 ${r.days}일`, value: r.days, color: 'var(--accent)' },
            { key: 'rest', label: '미지급', value: Math.max(0, 270 - r.days), color: 'var(--hair)' },
          ]}
          total={270}
          centerLabel="일수"
          centerValue={`${r.days}`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>지급 기준 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>이직 전 평균임금 × 60%</span><span className="v t-num">{fmtKRW(daily * 10000 * 0.6)}원</span></div>
          <div className="row"><span>적용 1일 급여 (상·하한 적용)</span><span className="v t-num">{fmtKRW(r.dailyBenefit)}원</span></div>
          <div className="row"><span>× 지급일수</span><span className="v t-num">{r.days}일</span></div>
          <div className="row tot"><span>예상 총 수령액</span><span className="v t-num">{fmtKRW(r.total)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '퇴직금', desc: '근속 1년 이상 시' },
        { name: '연봉 실수령액', desc: '재취업 시 월급 계산' },
        { name: '국민연금 예상', desc: '노후 연금 수령액' },
      ]} />
    </>
  );
}