/* global React */

// ============================================================
// 연봉 실수령액 계산 (2026년 기준 간이 산식)
// ============================================================
function computeSalary({ annualMan, dependents = 1, children = 0 }) {
  const annual = Math.max(0, annualMan) * 10000; // 원 단위
  const monthlyGross = annual / 12;

  // 4대보험 (근로자 부담분)
  const NP_RATE = 0.045;   // 국민연금 4.5%
  const NP_MAX = 5_900_000; // 월 기준 상한 (대략)
  const HI_RATE = 0.0354;  // 건강보험 3.545%
  const LTC_RATE = 0.1295; // 장기요양 = 건보료 * 12.95%
  const EI_RATE = 0.009;   // 고용보험 0.9%

  const npBase = Math.min(monthlyGross, NP_MAX);
  const np = npBase * NP_RATE;
  const hi = monthlyGross * HI_RATE;
  const ltc = hi * LTC_RATE;
  const ei = monthlyGross * EI_RATE;
  const insurance = np + hi + ltc + ei;

  // 근로소득공제 (간이) — 총급여 기준
  let ec;
  if (annual <= 5_000_000) ec = annual * 0.7;
  else if (annual <= 15_000_000) ec = 3_500_000 + (annual - 5_000_000) * 0.4;
  else if (annual <= 45_000_000) ec = 7_500_000 + (annual - 15_000_000) * 0.15;
  else if (annual <= 100_000_000) ec = 12_000_000 + (annual - 45_000_000) * 0.05;
  else ec = 14_750_000 + (annual - 100_000_000) * 0.02;
  ec = Math.min(ec, 20_000_000);

  // 근로소득금액 → 종합소득공제 (본인 + 부양) → 과세표준
  const personal = (1 + dependents) * 1_500_000;
  const incomeAfter = annual - ec;
  const insuranceYear = insurance * 12;
  const taxBase = Math.max(0, incomeAfter - personal - insuranceYear);

  // 누진세율 (간이)
  const brackets = [
    [14_000_000, 0.06, 0],
    [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000],
    [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000],
    [500_000_000, 0.40, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000],
    [Infinity, 0.45, 65_940_000],
  ];
  let income_tax = 0;
  for (const [limit, rate, deduct] of brackets) {
    if (taxBase <= limit) { income_tax = taxBase * rate - deduct; break; }
  }
  income_tax = Math.max(0, income_tax);

  // 자녀세액공제 (간이)
  const child_credit = children >= 3 ? 350_000 + (children - 2) * 300_000
                     : children === 2 ? 350_000
                     : children === 1 ? 150_000 : 0;

  // 근로소득세액공제 (단순화)
  const work_credit_max = 740_000;
  const work_credit = Math.min(work_credit_max, income_tax * 0.55);

  let income_tax_final = Math.max(0, income_tax - child_credit - work_credit);
  const local_tax = income_tax_final * 0.1; // 지방소득세 10%
  const total_tax_year = income_tax_final + local_tax;
  const total_tax_month = total_tax_year / 12;

  const net_month = monthlyGross - insurance - total_tax_month;

  return {
    monthlyGross: Math.round(monthlyGross),
    netMonth: Math.round(net_month),
    netYear: Math.round(net_month * 12),
    breakdown: {
      np: Math.round(np),
      hi: Math.round(hi),
      ltc: Math.round(ltc),
      ei: Math.round(ei),
      insurance: Math.round(insurance),
      income_tax: Math.round(income_tax_final / 12),
      local_tax: Math.round(local_tax / 12),
      total_tax: Math.round(total_tax_month),
      total_deduct: Math.round(insurance + total_tax_month),
    },
  };
}

const fmtKRW = (n) => new Intl.NumberFormat('ko-KR').format(Math.round(n));
const fmtMan = (n) => {
  const man = Math.round(n / 10000);
  if (man >= 10000) return `${(man / 10000).toFixed(1)}억`;
  return `${fmtKRW(man)}만원`;
};

// ============================================================
// 아이콘 (간단한 인라인 SVG)
// ============================================================
const Ic = {
  search: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  arrow: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  close: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ret: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 10 4 15l5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>,
};

// ============================================================
// AdSense 슬롯 (실제 광고 자리; 와이어 표시)
// ============================================================
function AdSlot({ size = 'leaderboard', label = 'AD · Google AdSense', sizeLabel }) {
  const sizes = {
    leaderboard: '728 × 90 / responsive in-feed',
    rectangle: '300 × 250 medium rectangle',
    responsive: 'responsive · multiplex',
  };
  return (
    <div className={`ad-slot ${size}`} role="complementary" aria-label="advertisement">
      <span className="badge">SPONSORED</span>
      <div className="label">{label}</div>
      <div className="size">{sizeLabel || sizes[size]}</div>
    </div>
  );
}

// ============================================================
// Header
// ============================================================
function Header({ onOpenSearch, dark, onToggleDark }) {
  return (
    <header className="site-header">
      <div className="container row">
        <a href="#" className="brand">
          <span className="mark">계</span>
          <span>계산기 <small>· Korea Life</small></span>
        </a>
        <div className="nav-row">
          <button className="search-trigger" onClick={onOpenSearch} aria-label="검색">
            {Ic.search(14)}
            <span className="label">계산기 검색…</span>
            <span className="gap"></span>
            <span className="kbd">⌘</span><span className="kbd">K</span>
          </button>
          <button className="dark-toggle" onClick={onToggleDark} aria-label="테마 전환">
            {dark ? Ic.sun() : Ic.moon()}
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// Hero
// ============================================================
function Hero({ onOpenSearch }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="grid">
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 22 }}>ISSUE 01 · KOREA LIFE · 2026</div>
            <h1 className="t-display">
              대한민국에서<br/>
              필요한<br/>
              <em className="t-serif-it">모든 계산.</em>
            </h1>
            <div className="meta">
              <button className="btn primary" onClick={onOpenSearch}>{Ic.search(14)} 계산기 찾기<span className="kbd" style={{ marginLeft: 4, borderColor: 'rgba(255,255,255,0.3)' }}>⌘K</span></button>
              <span className="chip">40개 계산기</span>
              <span className="chip">7개 카테고리</span>
              <span className="chip chip-accent">평균 30초</span>
            </div>
          </div>
          <div className="side">
            <div className="hr"></div>
            <div>
              연봉부터 양도세, 퇴직금, 대출 한도까지 — 한국인이 매일 마주치는 숫자들을 한 페이지에서 빠르게.
            </div>
            <div className="pts">
              <div>· 2026년 최신 세율·요율 반영</div>
              <div>· 데이터 출처 명시 (국세청·고용노동부)</div>
              <div>· 광고는 본문 흐름 밖에만</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TOP 6 — Editorial 비대칭 (1 큰 + 5 작은)
// ============================================================
function Top6({ onPick }) {
  const { top6 } = window.CALC_DATA;
  const [feat, ...rest] = top6;
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 6 }}>FEATURED · 인기</div>
            <h2>이번 주 가장 많이 쓴 계산</h2>
          </div>
          <div className="right">월간 1.2M 회 사용</div>
        </div>
        <div className="top6-grid">
          <div className="cell feature" onClick={() => onPick(feat)}>
            <div className="num">{feat.num}</div>
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 8 }}>세금 · FEATURED</div>
              <div className="name">{feat.name}</div>
              <div className="desc">{feat.desc}</div>
              <div className="cta-row">
                <span className="chip chip-accent">⌐ 30초</span>
                <span className="chip">2026년 기준</span>
              </div>
            </div>
            <span className="arrow">{Ic.arrow(22)}</span>
          </div>
          {rest.map((t) => (
            <div key={t.num} className="cell small" onClick={() => onPick(t)}>
              <div className="num">{t.num}</div>
              <div className="name">{t.name}</div>
              <div className="desc">{t.desc}</div>
              <span className="arrow">{Ic.arrow(16)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Category (Editorial 좌 라벨 + 우 그리드)
// ============================================================
function Category({ cat, onPick }) {
  return (
    <div className="cat-block">
      <div className="cat-head">
        <div className="t-eyebrow eyebrow">CATEGORY · {cat.id}</div>
        <h3>{cat.name}</h3>
        <div className="rule"></div>
        <div className="count">{cat.items.length} calculators</div>
      </div>
      <div className="cat-grid">
        {cat.items.map((it, i) => (
          <div key={i} className="item" onClick={() => onPick({ ...it, num: `${cat.id}.${String(i + 1).padStart(2, '0')}`, catName: cat.name })}>
            <div className="name">{it.name}</div>
            <div className="desc">{it.desc}</div>
            <div className="foot">
              <span className="time">⌐ {it.time}</span>
              <span className="arrow">{Ic.arrow(14)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer() {
  return (
    <footer className="site-foot">
      <div className="container">
        <div className="cols">
          <div>
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="mark">계</span>
              <span>계산기</span>
            </div>
            <div style={{ maxWidth: 320, lineHeight: 1.6 }}>
              한국인이 일상에서 필요한 모든 계산을 한 페이지에서. 광고로 운영되지만, 본문 흐름을 방해하지 않습니다.
            </div>
          </div>
          <div>
            <h4>계산기</h4>
            <ul>
              <li><a href="#">전체 보기</a></li>
              <li><a href="#">인기 TOP 6</a></li>
              <li><a href="#">최근 업데이트</a></li>
            </ul>
          </div>
          <div>
            <h4>회사</h4>
            <ul>
              <li><a href="#">소개</a></li>
              <li><a href="#">데이터 출처</a></li>
              <li><a href="#">문의</a></li>
            </ul>
          </div>
          <div>
            <h4>정책</h4>
            <ul>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보</a></li>
              <li><a href="#">광고 정책</a></li>
            </ul>
          </div>
        </div>
        <hr className="hairline" />
        <div className="row" style={{ marginTop: 24 }}>
          <span>© 2026 계산기 · 데이터 출처: 국세청, 고용노동부, 국민연금공단</span>
          <span className="t-mono" style={{ fontSize: 12 }}>v0.1.0 · 2026.04.30</span>
        </div>
      </div>
    </footer>
  );
}

// 한국식 숫자 단위 변환 — "6100만원" → "6천1백만원 = 61,000,000원"
function manToKorean(manValue) {
  const man = Math.round(Math.max(0, manValue));
  if (man === 0) return '';
  const eok = Math.floor(man / 10000);
  const rest = man % 10000;
  const cheon = Math.floor(rest / 1000);
  const baek = Math.floor((rest % 1000) / 100);
  const sip = Math.floor((rest % 100) / 10);
  const il = rest % 10;
  const parts = [];
  if (eok) parts.push(`${eok}억`);
  if (cheon) parts.push(`${cheon}천`);
  if (baek) parts.push(`${baek}백`);
  if (sip) parts.push(`${sip}십`);
  if (il) parts.push(`${il}`);
  return parts.join(' ') + '만원';
}

// 평균 비교 (2024 통계청 임금근로자 평균 월급 약 408만원 = 연 4,896만원 = 4900만원 근사)
function compareToAverage(annualMan) {
  const avgMan = 4900;
  const diff = ((annualMan - avgMan) / avgMan) * 100;
  // 단순 분위 추정 (정확한 분위 아님, 어림치)
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

Object.assign(window, { computeSalary, fmtKRW, fmtMan, manToKorean, compareToAverage, Ic, AdSlot, Header, Hero, Top6, Category, Footer });
