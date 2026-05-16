# 대한민국 모든 계산기 — Next.js 구조 설계서

> **목표**: 현재 HTML 시안을 Next.js (App Router) 로 변환하면서, 검색 노출(SEO)과 애드센스 통과에 최적화된 구조로 재설계.

---

## 1. 디렉토리 구조

```
calc-saas/
├── app/
│   ├── layout.tsx                # 전역 레이아웃 (Header, Footer)
│   ├── page.tsx                  # 홈 (현재 HTML 시안 그대로)
│   ├── globals.css               # 현재 styles.css 이식
│   ├── opengraph-image.tsx       # 동적 OG 이미지 (홈)
│   ├── sitemap.ts                # 동적 sitemap.xml 생성
│   ├── robots.ts                 # robots.txt
│   ├── manifest.ts               # PWA 매니페스트
│   │
│   ├── calc/
│   │   └── [slug]/               # 계산기 1개당 1 URL
│   │       ├── page.tsx          # SEO 페이지 (계산기 + 본문 + FAQ)
│   │       ├── opengraph-image.tsx
│   │       └── layout.tsx        # 카테고리 breadcrumb
│   │
│   ├── category/
│   │   └── [cat]/                # 카테고리 인덱스 (부동산, 세금, …)
│   │       └── page.tsx
│   │
│   ├── about/page.tsx            # 운영자 정보 (애드센스 필수)
│   ├── privacy/page.tsx          # 개인정보처리방침 (필수)
│   ├── terms/page.tsx            # 이용약관 (필수)
│   ├── contact/page.tsx          # 문의 (필수)
│   └── api/
│       └── exchange/route.ts     # 환율 API (서버에서 fetch)
│
├── components/
│   ├── ui/                       # 디자인 시스템 (Header, Footer, Hero, …)
│   ├── calc/                     # 계산기 폼들 (SalaryForm, MortgageForm…)
│   ├── adsense/
│   │   ├── AdSenseScript.tsx     # next/script (Strategy="afterInteractive")
│   │   ├── AdSlot.tsx            # 광고 단위 컴포넌트
│   │   └── InArticleAd.tsx       # 본문 중 광고
│   ├── seo/
│   │   ├── JsonLd.tsx            # 구조화 데이터
│   │   ├── Breadcrumb.tsx
│   │   └── FAQ.tsx
│   └── analytics/
│       └── GoogleAnalytics.tsx
│
├── lib/
│   ├── calc/                     # 순수 계산 로직 (현재 calc-logic.js)
│   │   ├── salary.ts
│   │   ├── severance.ts
│   │   ├── mortgage.ts
│   │   ├── income-tax.ts
│   │   ├── unemployment.ts
│   │   └── capital-gains.ts
│   ├── data/
│   │   ├── calculators.ts        # 40개 계산기 메타 (현재 data.js)
│   │   └── categories.ts
│   └── format.ts                 # fmtKRW, manToKorean
│
├── content/                      # MDX 본문 (각 계산기당 1개)
│   ├── salary.mdx                # 연봉 실수령액 상세 가이드
│   ├── severance.mdx
│   ├── mortgage.mdx
│   └── ...
│
├── public/
│   ├── og/                       # 기본 OG 이미지
│   ├── icons/
│   └── ads.txt                   # 애드센스 ads.txt
│
├── next.config.ts
├── tailwind.config.ts            # 또는 CSS Modules
└── package.json
```

---

## 2. 계산기 URL 슬러그 (40개)

검색 친화적 한글 슬러그를 권장:

| 카테고리 | 계산기 | URL |
|---|---|---|
| 세금 | 연봉 실수령액 | `/calc/연봉-실수령액` (또는 `/calc/salary`) |
| 세금 | 종합소득세 | `/calc/종합소득세` |
| 세금 | 부가가치세 | `/calc/부가가치세` |
| 세금 | 연말정산 환급 | `/calc/연말정산` |
| 세금 | 4대보험료 | `/calc/4대보험` |
| 부동산 | 양도소득세 | `/calc/양도소득세` |
| 부동산 | 취득세 | `/calc/취득세` |
| 부동산 | 종합부동산세 | `/calc/종합부동산세` |
| 부동산 | 중개수수료 | `/calc/중개수수료` |
| 부동산 | 전월세 환산 | `/calc/전월세-환산` |
| 부동산 | LTV/DTI | `/calc/ltv-dti` |
| 금융 | 주택담보대출 | `/calc/주택담보대출` |
| 금융 | 신용대출 | `/calc/신용대출` |
| 금융 | 전세자금대출 | `/calc/전세자금대출` |
| 금융 | DSR | `/calc/dsr` |
| 금융 | 적금/예금 이자 | `/calc/예적금-이자` |
| 금융 | 복리 | `/calc/복리` |
| 노동 | 퇴직금 | `/calc/퇴직금` |
| 노동 | 실업급여 | `/calc/실업급여` |
| 노동 | 연차수당 | `/calc/연차수당` |
| 노동 | 주휴수당 | `/calc/주휴수당` |
| 노동 | 야간·연장수당 | `/calc/야간수당` |
| 노동 | 통상임금 | `/calc/통상임금` |
| 복지 | 기초연금 | `/calc/기초연금` |
| 복지 | 국민연금 | `/calc/국민연금` |
| 복지 | 건강보험료 | `/calc/건강보험료` |
| 복지 | 기초생활수급 | `/calc/기초생활수급` |
| 자동차 | 자동차세 | `/calc/자동차세` |
| 자동차 | 자동차 취득세 | `/calc/자동차-취득세` |
| 자동차 | 유류비 | `/calc/유류비` |
| 자동차 | 과태료 | `/calc/과태료` |
| 자동차 | 중고차 시세 | `/calc/중고차-시세` |
| 일상 | 단위 변환 | `/calc/단위변환` |
| 일상 | 환율 | `/calc/환율` |
| 일상 | 칼로리 | `/calc/칼로리` |
| 일상 | BMI | `/calc/bmi` |
| 일상 | 임신 주수 | `/calc/임신주수` |
| 일상 | 디데이 | `/calc/디데이` |

> 한글 URL은 Google이 잘 인덱싱합니다(percent-encoded 표시되지만 검색 매칭은 한글 그대로). 모바일 공유 시 가독성도 좋습니다.

---

## 3. 계산기 페이지 템플릿 (`app/calc/[slug]/page.tsx`)

각 페이지는 다음 6개 섹션을 가집니다:

```tsx
export default async function CalcPage({ params }) {
  const calc = await getCalculator(params.slug);

  return (
    <article>
      {/* 1. 브레드크럼 + 타이틀 */}
      <header>
        <Breadcrumb items={[
          { name: '홈', href: '/' },
          { name: calc.category, href: `/category/${calc.catSlug}` },
          { name: calc.name },
        ]} />
        <h1>{calc.name} 계산기</h1>
        <p>{calc.subtitle}</p>
      </header>

      {/* 2. 인터랙티브 계산기 (Client Component) */}
      <CalculatorWidget slug={calc.slug} />

      {/* 3. 광고 슬롯 (계산기 직후) */}
      <InArticleAd slot="below-calc" />

      {/* 4. 본문 가이드 (MDX, 500~1500자) */}
      <Guide mdx={calc.content} />

      {/* 5. FAQ (Q&A 5~8개, JSON-LD FAQPage 자동 생성) */}
      <FAQ items={calc.faqs} />

      {/* 6. 관련 계산기 + 신뢰 근거 */}
      <RelatedCalcs items={calc.related} />
      <Sources items={calc.sources} />

      {/* JSON-LD: WebApplication + FAQPage + BreadcrumbList */}
      <JsonLd data={buildCalculatorSchema(calc)} />
    </article>
  );
}

export async function generateStaticParams() {
  return CALCULATORS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const calc = await getCalculator(params.slug);
  return {
    title: `${calc.name} 계산기 - ${calc.subtitle} | 대한민국 모든 계산기`,
    description: calc.metaDescription, // 120~155자
    openGraph: {
      title: calc.name,
      description: calc.metaDescription,
      images: [`/calc/${calc.slug}/opengraph-image`],
    },
    alternates: { canonical: `https://your-domain.com/calc/${calc.slug}` },
  };
}
```

---

## 4. 본문 (MDX) 템플릿 — 애드센스 통과용

각 계산기마다 `content/{slug}.mdx` 에 다음 구조로 작성:

```mdx
---
title: 연봉 실수령액 계산기
metaDescription: 2026년 최신 세율 적용. 연봉을 입력하면 4대보험·세금 차감 후 월 실수령액을 30초 안에 계산합니다.
faqs:
  - q: 연봉 실수령액이란?
    a: 세전 연봉에서 국민연금, 건강보험, 고용보험, 소득세, 지방세를 모두 뺀 실제 통장에 들어오는 금액입니다.
  - q: 연봉 5천만원이면 월 실수령액은 얼마인가요?
    a: 2026년 기준 부양가족 1인 기준 약 354만원 내외입니다. 부양가족 수와 자녀 수에 따라 달라집니다.
  # …5~8개
sources:
  - name: 국세청 2026 간이세액표
    url: https://nts.go.kr/...
  - name: 국민건강보험공단 보험료율
    url: https://nhis.or.kr/...
related: [4대보험, 연말정산, 종합소득세]
---

## 연봉 실수령액 계산 방법

연봉 실수령액은 다음 5가지를 세전 연봉에서 차감합니다:

1. **국민연금** (4.5%) — 월 소득의 4.5%, 상한 590만원
2. **건강보험** (3.545%) — 월 소득의 3.545%
3. **장기요양보험** (건보료의 12.95%)
4. **고용보험** (0.9%)
5. **근로소득세** — 간이세액표에 따른 누진 (6~45%)
6. **지방소득세** — 근로소득세의 10%

### 부양가족 수가 영향을 주는 이유

근로소득세 계산 시 본인 1인 + 부양가족 1인당 150만원의 인적공제가 적용됩니다.
예: 본인 + 배우자 + 자녀 1명 = 부양가족 2명 → 300만원 추가 공제 → 과세표준 감소 → 세금 감소.

…(총 600~1200자)

## 자주 묻는 질문

(JSX `<FAQ>` 컴포넌트가 frontmatter의 `faqs`를 자동으로 렌더링하고 JSON-LD도 생성)
```

---

## 5. JSON-LD 구조화 데이터

각 계산기 페이지에 4종 삽입 → 검색결과 리치 스니펫:

```ts
{
  "@context": "https://schema.org",
  "@graph": [
    // 1. WebApplication (계산기 자체)
    {
      "@type": "WebApplication",
      "name": "연봉 실수령액 계산기",
      "url": "https://your-domain.com/calc/연봉-실수령액",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
      "aggregateRating": { ... } // 후기 누적 시
    },
    // 2. FAQPage (검색결과 펼침박스)
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "...", "acceptedAnswer": { ... } }
      ]
    },
    // 3. BreadcrumbList (검색결과 경로 표시)
    { "@type": "BreadcrumbList", "itemListElement": [ ... ] },
    // 4. HowTo (사용 방법, 일부 계산기)
    { "@type": "HowTo", "name": "연봉으로 실수령액 계산하기", "step": [ ... ] }
  ]
}
```

---

## 6. 애드센스 통합

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// components/adsense/AdSlot.tsx
'use client';
import { useEffect } from 'react';

export function AdSlot({ slot, format = 'auto', responsive = true }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
```

**광고 배치 정책 (UX 침해 X, 정책 통과 ↑):**
1. 헤더 바로 아래 ❌ (계산기 페이지 어색)
2. 계산기 위 ❌ (사용자가 짜증)
3. ✅ **계산기 직후 (결과 본 직후) — 1개**
4. ✅ **본문 가이드 중간 (스크롤 후) — 1개**
5. ✅ **FAQ 아래, 관련 계산기 위 — 1개**
6. ✅ **모바일 sticky bottom — 1개** (선택)

> 한 페이지에 광고 4개 이상은 정책 위반 위험. **3개가 최대**.

---

## 7. sitemap.xml + robots.txt

```ts
// app/sitemap.ts
import { CALCULATORS, CATEGORIES } from '@/lib/data/calculators';

export default function sitemap() {
  const base = 'https://your-domain.com';
  const now = new Date();

  return [
    { url: base, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    ...CATEGORIES.map(c => ({
      url: `${base}/category/${c.slug}`,
      lastModified: now, priority: 0.8, changeFrequency: 'monthly',
    })),
    ...CALCULATORS.map(c => ({
      url: `${base}/calc/${c.slug}`,
      lastModified: now, priority: 0.9, changeFrequency: 'monthly',
    })),
    { url: `${base}/about`, priority: 0.3 },
    { url: `${base}/privacy`, priority: 0.3 },
    { url: `${base}/terms`, priority: 0.3 },
  ];
}
```

```ts
// app/robots.ts
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://your-domain.com/sitemap.xml',
    host: 'https://your-domain.com',
  };
}
```

---

## 8. 성능 (Lighthouse 95+ 목표)

- **모든 계산기 페이지 SSG**: `generateStaticParams` + ISR (24시간)
- **계산기 로직**: 100% 클라이언트 (서버 부담 0)
- **광고 스크립트**: `strategy="afterInteractive"` (LCP 영향 X)
- **이미지**: `next/image` + AVIF/WebP 자동
- **폰트**: `next/font` (Pretendard, Instrument Serif) 셀프호스팅, FOIT 방지
- **CSS**: critical CSS inline, 나머지는 분할 로드
- **번들 분리**: 계산기 폼은 `next/dynamic` 으로 각 페이지에서 lazy load

---

## 9. 검색 노출 전략 (신규 도메인)

| 시점 | 작업 |
|---|---|
| 출시 1주 | Google Search Console / Naver 서치어드바이저 등록, sitemap 제출 |
| 출시 2~3주 | 메인 키워드 5개 모니터링 (연봉 실수령액, 양도세, 퇴직금, 주담대, 실업급여) |
| 출시 1개월 | 검색량 낮은 롱테일 키워드 페이지 보강 (예: "연봉 6000만원 실수령액") |
| 출시 2개월 | 백링크 작업 (Reddit r/korea, 디시인사이드, 클리앙 등 자연스러운 노출) |
| 출시 3개월 | 애드센스 신청 (트래픽 일 100+ 권장) |
| 출시 6개월 | 카테고리별 가이드 페이지 추가 (`/guide/부동산-세금-총정리`) |

---

## 10. 다음 단계

1. **이 시안을 Next.js 프로젝트로 변환** (현재 코드 그대로 이식)
2. **계산기 페이지 1개를 SEO 완성형으로** (연봉 실수령액 → 템플릿 확정)
3. **나머지 39개 계산기 본문(MDX) 작성** (1개당 약 1시간)
4. **광고 슬롯 위치 A/B 테스트** (3개월차 이후)

> 이 문서는 시안 단계의 청사진입니다. 실제 코드 이식은 별도 작업.
