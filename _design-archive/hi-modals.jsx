/* global React */
const { useState: _us, useEffect: _ue, useMemo: _um, useRef: _ur } = React;
const useState = _us, useEffect = _ue, useMemo = _um, useRef = _ur;

// ============================================================
// ⌘K Command Palette
// ============================================================
function CommandK({ open, onClose, onPick }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const allItems = useMemo(() => {
    const { categories, top6 } = window.CALC_DATA;
    const top = top6.map(t => ({ ...t, catName: '인기', group: '인기 TOP 6' }));
    const rest = categories.flatMap(c =>
      c.items.map((it, i) => ({
        ...it, num: `${c.id}.${String(i + 1).padStart(2, '0')}`,
        catName: c.name, group: c.name,
      }))
    );
    return [...top, ...rest];
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return allItems.slice(0, 14);
    const needle = q.trim().toLowerCase();
    return allItems.filter(it =>
      it.name.toLowerCase().includes(needle) ||
      it.desc.toLowerCase().includes(needle) ||
      it.catName.toLowerCase().includes(needle)
    ).slice(0, 14);
  }, [q, allItems]);

  const grouped = useMemo(() => {
    const m = new Map();
    filtered.forEach(it => {
      if (!m.has(it.group)) m.set(it.group, []);
      m.get(it.group).push(it);
    });
    return [...m.entries()];
  }, [filtered]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);
  useEffect(() => { setIdx(0); }, [q, open]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === 'Escape') { onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(filtered.length - 1, i + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); const picked = filtered[idx]; if (picked) onPick(picked); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, idx, filtered, onClose, onPick]);

  if (!open) return null;

  let cursor = 0;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          {window.Ic.search(18)}
          <input
            ref={inputRef} className="cmdk-input"
            placeholder="연봉, 양도세, 퇴직금…"
            value={q} onChange={(e) => setQ(e.target.value)}
          />
          <span className="kbd">esc</span>
        </div>
        <div className="cmdk-results" ref={listRef}>
          {filtered.length === 0 && (
            <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
              "{q}" 에 해당하는 계산기가 없습니다.
            </div>
          )}
          {grouped.map(([groupName, items]) => (
            <div key={groupName} className="cmdk-group">
              <div className="cmdk-group-label">{groupName}</div>
              {items.map((it) => {
                const myIdx = cursor++;
                return (
                  <div
                    key={`${groupName}-${it.name}`}
                    className={`cmdk-item ${myIdx === idx ? 'active' : ''}`}
                    onMouseEnter={() => setIdx(myIdx)}
                    onClick={() => onPick(it)}
                  >
                    <span className="ico">{it.num || '·'}</span>
                    <span className="label">{it.name}</span>
                    <span className="cat-tag">{it.catName}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-footer">
          <span>{filtered.length}개 결과</span>
          <div className="keys">
            <span><span className="kbd">↑</span><span className="kbd">↓</span> 이동</span>
            <span><span className="kbd">{window.Ic.ret()}</span> 선택</span>
            <span><span className="kbd">esc</span> 닫기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Calculator Modal — 연봉 실수령액 (실제 작동)
// 다른 계산기는 "준비중" placeholder
// ============================================================
function CalcModal({ open, item, onClose }) {
  const [salary, setSalary] = React.useState(5000); // 만원
  const [dependents, setDependents] = React.useState(1);
  const [children, setChildren] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const formKind = React.useMemo(() => {
    const n = item?.name || '';
    if (n.includes('연봉')) return 'salary';
    if (n.includes('양도')) return 'capital';
    if (n.includes('퇴직금')) return 'severance';
    if (n.includes('주택담보') || n.includes('주담대')) return 'mortgage';
    if (n.includes('종합소득세')) return 'incometax';
    if (n.includes('실업급여')) return 'unemployment';
    return 'coming';
  }, [item]);

  const r = React.useMemo(() => {
    if (formKind !== 'salary') return null;
    return window.computeSalary({ annualMan: salary, dependents, children });
  }, [salary, dependents, children, formKind]);

  if (!open || !item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="calc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calc-head">
          <div>
            <div className="eye">
              <span className="t-eyebrow">{item.catName || '계산기'} {item.num ? `· ${item.num}` : ''}</span>
              <span className="chip chip-accent" style={{ height: 22 }}>⌐ {item.time || '30초'}</span>
            </div>
            <h2>{item.name}</h2>
            <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 4 }}>{item.desc}</div>
          </div>
          <button className="calc-close" onClick={onClose} aria-label="닫기">{window.Ic.close()}</button>
        </div>

        <div className="calc-body">
          {formKind === 'salary' && <SalaryForm
            salary={salary} setSalary={setSalary}
            dependents={dependents} setDependents={setDependents}
            children_={children} setChildren={setChildren}
            r={r}
          />}
          {formKind === 'severance' && <window.SeveranceForm />}
          {formKind === 'capital' && <window.CapitalGainsForm />}
          {formKind === 'mortgage' && <window.MortgageForm />}
          {formKind === 'incometax' && <window.IncomeTaxForm />}
          {formKind === 'unemployment' && <window.UnemploymentForm />}
          {formKind === 'coming' && <ComingSoon item={item} />}
        </div>

        <div className="calc-foot">
          <span className="calc-foot-source">출처: 국세청 2026 간이세액표 (참고용)</span>
          <div className="calc-foot-actions">
            <button className="btn ghost" onClick={(e) => {
              const url = window.location.href.split('?')[0] + `?calc=salary&v=${Date.now()}`;
              navigator.clipboard?.writeText(url);
              const btn = e.currentTarget;
              const orig = btn.textContent;
              btn.textContent = '✓ 링크 복사됨';
              setTimeout(() => { btn.textContent = orig; }, 1600);
            }}>🔗 결과 링크 복사</button>
            <button className="btn primary" onClick={() => {
              alert('카카오톡 공유 (실제 배포 시 Kakao SDK 연동)');
            }}>카톡으로 공유</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalaryForm({ salary, setSalary, dependents, setDependents, children_, setChildren, r }) {
  const { fmtKRW, fmtMan, manToKorean, compareToAverage } = window;
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
            <span className="related-arrow">{window.Ic.arrow(14)}</span>
          </a>
          <a className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">03</div>
            <div className="related-name">연말정산 환급</div>
            <div className="related-desc">이 연봉으로 얼마 돌려받을까</div>
            <span className="related-arrow">{window.Ic.arrow(14)}</span>
          </a>
          <a className="related-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="related-num">04</div>
            <div className="related-name">종합소득세</div>
            <div className="related-desc">부수입·사이드잡 있다면</div>
            <span className="related-arrow">{window.Ic.arrow(14)}</span>
          </a>
        </div>
      </div>
    </>
  );
}

function ComingSoon({ item }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-3)' }}>
      <div style={{ fontSize: 48, marginBottom: 12, fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-2)' }}>
        Coming soon
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
        <b style={{ color: 'var(--ink)' }}>{item.name}</b> 계산기는 곧 추가됩니다.<br />
        지금은 시안 단계라 <b style={{ color: 'var(--ink-2)' }}>"연봉 실수령액"</b>만 실제로 작동합니다.
      </div>
      <button className="btn primary" style={{ marginTop: 24 }} onClick={() => {
        // 임시: 연봉 모달로 점프
      }}>출시 알림 받기</button>
    </div>
  );
}

window.CommandK = CommandK;
window.CalcModal = CalcModal;
