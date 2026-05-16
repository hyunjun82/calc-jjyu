/* global React */

// SEO 완성형 계산기 페이지 — 연봉 실수령액 (샘플 1개)
// /calc/연봉-실수령액 으로 변환될 페이지의 시안

function SeoCalcPage() {
  const [calcOpen, setCalcOpen] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [activeItem] = React.useState({
    name: '연봉 실수령액', desc: '내 연봉의 월 실수령액을 30초 안에', time: '30초',
    catName: '세금', num: '02.01',
  });
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  const { Header, Footer, AdSlot, CalcModal, CommandK } = window;

  return (
    <>
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        dark={dark} onToggleDark={() => setDark(d => !d)}
      />

      <main className="seo-article">
        <div className="container">
          {/* 브레드크럼 */}
          <nav className="breadcrumb" aria-label="breadcrumb">
            <a href="#">홈</a>
            <span className="sep">›</span>
            <a href="#">세금</a>
            <span className="sep">›</span>
            <span className="current">연봉 실수령액 계산기</span>
          </nav>

          {/* H1 + 부제 */}
          <header className="seo-head">
            <div className="t-eyebrow" style={{ marginBottom: 10 }}>세금 · CALCULATOR</div>
            <h1>연봉 실수령액 계산기</h1>
            <p className="seo-sub">
              2026년 최신 세율 적용 · 4대보험·소득세 자동 차감 · 30초 안에 월 실수령액 확인
            </p>
            <div className="seo-meta">
              <span className="chip">⏱ 평균 30초</span>
              <span className="chip">📅 2026.04.30 업데이트</span>
              <span className="chip">📊 월 1.2M 사용</span>
              <span className="chip chip-accent">★ 인기 1위</span>
            </div>
          </header>

          {/* 1. 인터랙티브 계산기 — 실제 폼이 페이지에 임베드 */}
          <section className="seo-calc-embed">
            <div className="seo-calc-card">
              <window.SalaryFormStandalone />
            </div>
          </section>

          {/* 2. 광고 슬롯 (계산기 직후) */}
          <AdSlot size="leaderboard" sizeLabel="below-calculator · 970×90 responsive" />

          {/* 3. 본문 가이드 */}
          <section className="seo-guide">
            <h2>연봉 실수령액이란?</h2>
            <p>
              <b>연봉 실수령액</b>은 세전 연봉(계약서상 연봉)에서 4대보험과 세금을 모두 차감하고 실제로 통장에 들어오는 금액을 말합니다. 흔히 "내 월급" 이라고 부르는 그 금액입니다.
            </p>
            <p>
              많은 분들이 연봉 협상 시 "5천만원 받으면 월에 얼마 들어오는지" 궁금해합니다. 이 계산기는 2026년 기준 세율과 보험료율을 정확하게 반영하여 그 답을 30초 안에 제공합니다.
            </p>

            <h2>실수령액에서 차감되는 6가지</h2>
            <p>월급에서 빠져나가는 항목은 정확히 6가지입니다:</p>
            <ol>
              <li><b>국민연금 (4.5%)</b> — 월 소득의 4.5%, 상한 590만원까지만 부과</li>
              <li><b>건강보험 (3.545%)</b> — 월 소득의 3.545%</li>
              <li><b>장기요양보험</b> — 건강보험료의 12.95%</li>
              <li><b>고용보험 (0.9%)</b> — 실업급여 재원</li>
              <li><b>근로소득세</b> — 간이세액표에 따른 누진세 (6%~45%)</li>
              <li><b>지방소득세</b> — 근로소득세의 10%</li>
            </ol>

            <h2>부양가족 수가 영향을 주는 이유</h2>
            <p>
              근로소득세 계산 시 본인 1인과 부양가족 1인당 <b>150만원</b>의 인적공제가 적용됩니다.
              예를 들어 본인 + 배우자 + 자녀 1명 가구라면 부양가족 2명 → 300만원이 과세표준에서 빠지므로 세금이 줄어듭니다.
              여기에 20세 이하 자녀가 있다면 자녀세액공제(1인 15만원, 2인 35만원, 3인째부터 +30만원)가 추가로 차감됩니다.
            </p>

            <h2>연봉별 실수령액 표 (2026, 부양가족 1인 기준)</h2>
            <div className="seo-table">
              <table>
                <thead>
                  <tr><th>연봉</th><th>월 세전</th><th>월 공제</th><th>월 실수령</th><th>공제율</th></tr>
                </thead>
                <tbody>
                  <tr><td>3,000만</td><td>250만</td><td>약 23만</td><td><b>약 227만</b></td><td>9.2%</td></tr>
                  <tr><td>4,000만</td><td>333만</td><td>약 37만</td><td><b>약 296만</b></td><td>11.1%</td></tr>
                  <tr><td>5,000만</td><td>417만</td><td>약 53만</td><td><b>약 364만</b></td><td>12.7%</td></tr>
                  <tr><td>6,000만</td><td>500만</td><td>약 70만</td><td><b>약 430만</b></td><td>14.0%</td></tr>
                  <tr><td>7,000만</td><td>583만</td><td>약 88만</td><td><b>약 495만</b></td><td>15.1%</td></tr>
                  <tr><td>8,000만</td><td>667만</td><td>약 110만</td><td><b>약 557만</b></td><td>16.5%</td></tr>
                  <tr><td>1억</td><td>833만</td><td>약 161만</td><td><b>약 672만</b></td><td>19.3%</td></tr>
                  <tr><td>1.5억</td><td>1,250만</td><td>약 311만</td><td><b>약 939만</b></td><td>24.9%</td></tr>
                </tbody>
              </table>
              <div className="seo-table-note">
                ※ 위 표는 부양가족 1인 · 비과세 소득 없음 가정. 실제 금액은 위 계산기에서 정확히 확인하세요.
              </div>
            </div>
          </section>

          {/* 4. 광고 슬롯 (본문 중간) */}
          <AdSlot size="leaderboard" sizeLabel="in-article · 970×90 responsive" />

          {/* 5. FAQ — JSON-LD 자동 생성 대상 */}
          <section className="seo-faq">
            <h2>자주 묻는 질문</h2>
            <div className="faq-list">
              {[
                {
                  q: '연봉 5,000만원의 월 실수령액은 얼마인가요?',
                  a: '2026년 기준 부양가족 1인 가구의 경우 약 354만원입니다. 부양가족이 늘어나면 세금이 줄어 실수령액이 약간 증가합니다. 정확한 금액은 위 계산기에서 본인의 가족 상황을 입력하세요.',
                },
                {
                  q: '실수령액이 매달 다른 이유는?',
                  a: '회사가 매달 떼어가는 세금은 "예상치"입니다. 연말정산 시점에 1년 실제 소득과 공제를 정산하여 환급 또는 추징됩니다. 또한 3월·12월 등 보너스 지급월은 보너스에도 세금이 부과되어 실수령액이 다릅니다.',
                },
                {
                  q: '이 계산기는 비과세 수당도 포함하나요?',
                  a: '아니요. 식대(월 20만원), 차량유지비(20만원), 자기계발비 등 비과세 항목은 세금이 부과되지 않으므로, 실제 실수령액은 계산기 결과보다 비과세 금액만큼 더 많을 수 있습니다.',
                },
                {
                  q: '연봉 인상하면 실수령액은 얼마나 늘어나나요?',
                  a: '구간에 따라 다릅니다. 연봉 5천만원 → 6천만원이면 월 실수령액은 약 66만원 증가합니다. 그러나 누진세 구간을 넘어가면(1.5억 등) 증가폭이 줄어듭니다. 위 계산기에서 두 연봉을 비교해보세요.',
                },
                {
                  q: '4대보험료는 회사가 절반 부담하지 않나요?',
                  a: '맞습니다. 국민연금·건강보험·고용보험은 회사와 근로자가 절반씩 부담합니다. 이 계산기는 근로자 부담분(절반)만 차감합니다. 산재보험은 100% 회사 부담이므로 표시하지 않습니다.',
                },
                {
                  q: '자영업자도 이 계산기를 쓸 수 있나요?',
                  a: '아니요. 자영업자(사업소득자)는 종합소득세를 다음 해 5월에 신고·납부하는 구조이며, 4대보험도 지역가입자로 다른 산식이 적용됩니다. 자영업자는 "종합소득세" 계산기를 이용하세요.',
                },
              ].map((f, i) => (
                <details key={i} className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 6. 광고 슬롯 (FAQ 아래) */}
          <AdSlot size="leaderboard" sizeLabel="below-faq · 970×90 responsive" />

          {/* 7. 관련 계산기 */}
          <section className="seo-related">
            <h2>관련 계산기</h2>
            <div className="seo-related-grid">
              <a className="card" style={{ padding: 24, display: 'block' }} href="#">
                <div className="t-eyebrow" style={{ marginBottom: 8 }}>세금</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>4대보험료 계산기</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6 }}>국민·건강·고용·산재 보험료 자세히</div>
              </a>
              <a className="card" style={{ padding: 24, display: 'block' }} href="#">
                <div className="t-eyebrow" style={{ marginBottom: 8 }}>세금</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>연말정산 환급 계산기</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6 }}>이 연봉으로 얼마 돌려받을지</div>
              </a>
              <a className="card" style={{ padding: 24, display: 'block' }} href="#">
                <div className="t-eyebrow" style={{ marginBottom: 8 }}>노동</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>퇴직금 계산기</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6 }}>법정 퇴직금 자동 계산</div>
              </a>
            </div>
          </section>

          {/* 8. 출처 / 근거 (E-E-A-T 강화) */}
          <section className="seo-sources">
            <h2>계산 근거 및 출처</h2>
            <ul>
              <li>국세청 <a href="#">2026년 근로소득 간이세액표</a></li>
              <li>국민건강보험공단 <a href="#">2026년 보험료율 (3.545%)</a></li>
              <li>국민연금공단 <a href="#">2026년 기준소득월액 상·하한액</a></li>
              <li>근로기준법 제 17조 — 근로계약서 기재사항</li>
              <li>소득세법 제 55조 — 근로소득세율</li>
            </ul>
            <div className="seo-disclaimer">
              ⚠️ 이 계산기는 참고용이며 실제 급여명세서와 차이가 있을 수 있습니다.
              회사의 비과세 항목, 추가 공제, 회사 자체 규정 등에 따라 실수령액이 달라질 수 있습니다.
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <CommandK open={searchOpen} onClose={() => setSearchOpen(false)} onPick={() => {}} />

      {/* JSON-LD 시뮬레이션 (실제 Next.js에서는 <script type="application/ld+json">) */}
      <details className="dev-jsonld">
        <summary>🛠 개발자용: 이 페이지에 삽입될 JSON-LD 구조화 데이터</summary>
        <pre>{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "연봉 실수령액 계산기",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
              "url": "https://your-domain.com/calc/연봉-실수령액"
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "연봉 5,000만원의 월 실수령액은?",
                  "acceptedAnswer": { "@type": "Answer", "text": "2026년 기준 부양가족 1인 약 354만원..." } },
                "...(나머지 5개)"
              ]
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "홈", "item": "/" },
                { "@type": "ListItem", "position": 2, "name": "세금", "item": "/category/세금" },
                { "@type": "ListItem", "position": 3, "name": "연봉 실수령액 계산기" }
              ]
            }
          ]
        }, null, 2)}</pre>
      </details>
    </>
  );
}

// Standalone form — 페이지에 임베드되는 계산기
function SalaryFormStandalone() {
  const [salary, setSalary] = React.useState(5000);
  const [dependents, setDependents] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const r = React.useMemo(() => window.computeSalary({ annualMan: salary, dependents, children }),
    [salary, dependents, children]);
  return <window.SalaryForm
    salary={salary} setSalary={setSalary}
    dependents={dependents} setDependents={setDependents}
    children_={children} setChildren={setChildren}
    r={r}
  />;
}

window.SeoCalcPage = SeoCalcPage;
window.SalaryFormStandalone = SalaryFormStandalone;
