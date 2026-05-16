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

export function CapitalGainsForm() {
  const [acquire, setAcquire] = useState(50000);  // 5억
  const [sale, setSale] = useState(80000);        // 8억
  const [expenses, setExpenses] = useState(1500); // 1500만
  const [yearsHeld, setYearsHeld] = useState(5);
  const [yearsLived, setYearsLived] = useState(5);
  const [status, setStatus] = useState('one_under12');

  const r = useMemo(() => computeCapitalGains({
    acquirePriceMan: acquire, salePriceMan: sale, expensesMan: expenses,
    yearsHeld, yearsLived, houseStatus: status,
  }), [acquire, sale, expenses, yearsHeld, yearsLived, status]);

  const isNontax = r.status === 'nontax';

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>가격</div>
        <div className="step done"><span className="dot">2</span>주택수·기간</div>
        <div className="step active"><span className="dot">3</span>세액</div>
      </div>

      <SegSel label="주택 보유 상황" hint="세율과 공제가 달라집니다" value={status} setValue={setStatus}
        options={[
          { value: 'one_under12', label: '1주택 (12억↓)' },
          { value: 'one_over12', label: '1주택 (12억↑)' },
          { value: 'multi', label: '다주택' },
        ]} />

      <NumberField label="취득가액" hint="구매 당시 가격, 만원" value={acquire} setValue={setAcquire} max={500000} />
      <NumberField label="양도가액" hint="매도 가격, 만원" value={sale} setValue={setSale} max={500000} />
      <NumberField label="필요경비" hint="취득세·중개수수료·인테리어, 만원" value={expenses} setValue={setExpenses} max={50000} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>보유 기간 <span className="hint">{yearsHeld}년</span></label>
          <input type="range" className="slider" min="0" max="20" step="1" value={yearsHeld}
            onChange={(e) => setYearsHeld(+e.target.value)} />
          <div className="slider-ticks"><span>0</span><span>2년</span><span>5년</span><span>10년</span><span>20년+</span></div>
        </div>
        <div className="field">
          <label>거주 기간 <span className="hint">{yearsLived}년 · 1주택만 영향</span></label>
          <input type="range" className="slider" min="0" max="20" step="1" value={yearsLived}
            onChange={(e) => setYearsLived(+e.target.value)} />
          <div className="slider-ticks"><span>0</span><span>2년</span><span>5년</span><span>10년</span><span>20년+</span></div>
        </div>
      </div>

      <div className="result-card result-with-chart">
        <div className="result-text">
          <div className="lbl">{isNontax ? '비과세 (납부 없음)' : '납부할 양도소득세'}</div>
          <div className="big t-num">
            {isNontax ? '0' : fmtKRW(r.totalTax)}<small>원</small>
          </div>
          <div className="sub">
            <div>양도차익 <b className="t-num">{fmtKRW(r.gain)}원</b></div>
            {!isNontax && <div>장특공제 <b className="t-num">{(r.ltcdRate * 100).toFixed(0)}% / {fmtKRW(r.ltcd)}원</b></div>}
            <div>실 수익 <b className="t-num">{fmtKRW(r.netGain)}원</b></div>
          </div>
          <div className="compare-line">
            <span className={`compare-pill ${isNontax ? 'up' : 'down'}`}>
              {isNontax ? '✓ 비과세' : `${(r.appliedRate * 100).toFixed(0)}% 세율 적용`}
            </span>
            <span className="compare-note">{r.message}</span>
          </div>
        </div>
        <DonutChart
          segs={isNontax ? [
            { key: 'net', label: '실 수익', value: r.gain || 1, color: 'var(--accent)' },
          ] : [
            { key: 'net', label: '실 수익', value: Math.max(0, r.netGain), color: 'var(--accent)' },
            { key: 'tax', label: '양도세', value: r.tax, color: '#C2553C' },
            { key: 'local', label: '지방세', value: r.localTax, color: '#B5803C' },
          ]}
          total={Math.max(1, r.gain)}
          centerLabel="NET"
          centerValue={r.gain > 0 ? `${Math.round((Math.max(0, r.netGain) / r.gain) * 100)}%` : '—'}
        />
      </div>

      <details className="breakdown-toggle">
        <summary>계산 과정 자세히 보기 <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>양도가액 − 취득가액 − 경비</span><span className="v t-num">{fmtKRW(r.gain)}원</span></div>
          {!isNontax && <>
            <div className="row"><span>과세대상 양도차익</span><span className="v t-num">{fmtKRW(r.taxableBase)}원</span></div>
            <div className="row"><span>− 장기보유특별공제 ({(r.ltcdRate * 100).toFixed(0)}%)</span><span className="v neg t-num">− {fmtKRW(r.ltcd)}원</span></div>
            <div className="row"><span>− 양도소득 기본공제 (250만)</span><span className="v neg t-num">− 2,500,000원</span></div>
            <div className="row"><span>과세표준</span><span className="v t-num">{fmtKRW(r.taxableGain)}원</span></div>
            <div className="row"><span>× 양도세율 {(r.appliedRate * 100).toFixed(0)}%</span><span className="v t-num">{fmtKRW(r.tax)}원</span></div>
            <div className="row"><span>+ 지방소득세 (10%)</span><span className="v t-num">+ {fmtKRW(r.localTax)}원</span></div>
            <div className="row tot"><span>총 납부세액</span><span className="v neg t-num">− {fmtKRW(r.totalTax)}원</span></div>
          </>}
          {isNontax && <div className="row tot"><span>비과세 적용</span><span className="v pos t-num">납부 없음</span></div>}
        </div>
      </details>

      <RelatedCalcs items={[
        { name: '취득세', desc: '주택 매수 시 세금' },
        { name: '종합부동산세', desc: '보유 시 매년 부과' },
        { name: '중개수수료', desc: '거래금액별 법정 상한' },
      ]} />
    </>
  );
}