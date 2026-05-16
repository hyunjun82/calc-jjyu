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

export function IncomeTaxForm() {
  const [biz, setBiz] = useState(3000);
  const [emp, setEmp] = useState(0);
  const [ded, setDed] = useState(300);
  const r = useMemo(() => computeIncomeTax({
    businessIncomeMan: biz, employmentIncomeMan: emp, deductionsMan: ded,
  }), [biz, emp, ded]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>소득 입력</div>
        <div className="step done"><span className="dot">2</span>공제</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <NumberField label="사업 소득" hint="연 총수입, 만원" value={biz} setValue={setBiz} max={500000} />
      <NumberField label="근로 소득" hint="연봉, 만원" value={emp} setValue={setEmp} max={500000} />
      <NumberField label="추가 소득공제" hint="신용카드, 보험 등, 만원" value={ded} setValue={setDed} max={5000} />

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">납부할 세액 (소득세 + 지방세)</div>
          <div className="big t-num">{fmtKRW(r.totalTax)}<small>원</small></div>
          <div className="sub">
            <div>과세표준 <b className="t-num">{fmtKRW(r.taxBase)}원</b></div>
            <div>적용 세율 <b className="t-num">{(r.appliedRate * 100).toFixed(0)}%</b></div>
            <div>실효세율 <b className="t-num">{r.effectiveRate.toFixed(1)}%</b></div>
          </div>
          <div className="compare-line">
            <span className="compare-tag">2026 누진세율표 기준</span>
            <span className="compare-note">실제는 가족·의료비 등 추가 공제 가능</span>
          </div>
        </div>
        <DonutChart
          segs={[
            { key: 'income', label: '실수입', value: Math.max(0, r.totalIncome - r.totalTax), color: 'var(--accent)' },
            { key: 'tax', label: '세금', value: r.tax, color: '#C2553C' },
            { key: 'local', label: '지방세', value: r.localTax, color: '#B5803C' },
          ]}
          total={Math.max(1, r.totalIncome)}
          centerLabel="TAX"
          centerValue={`${r.effectiveRate.toFixed(0)}%`}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>누진세율 적용 과정 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>종합소득 금액</span><span className="v t-num">{fmtKRW(r.totalIncome)}원</span></div>
          <div className="row"><span>− 인적공제 + 추가공제</span><span className="v neg t-num">− {fmtKRW(1_500_000 + ded * 10000)}원</span></div>
          <div className="row"><span>과세표준</span><span className="v t-num">{fmtKRW(r.taxBase)}원</span></div>
          <div className="row"><span>× 누진세율 {(r.appliedRate * 100).toFixed(0)}%</span><span className="v t-num">{fmtKRW(r.tax)}원</span></div>
          <div className="row"><span>+ 지방소득세 (10%)</span><span className="v t-num">+ {fmtKRW(r.localTax)}원</span></div>
          <div className="row tot"><span>총 납부세액</span><span className="v neg t-num">− {fmtKRW(r.totalTax)}원</span></div>
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '부가가치세', desc: '사업자 매출/매입' },
        { name: '연말정산 환급', desc: '근로자 환급액' },
        { name: '4대보험료', desc: '국민·건강·고용·산재' },
      ]} />
    </>
  );
}