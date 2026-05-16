# 🚀 calc.jjyu.co.kr — Next.js 프로젝트

> 한국인이 일상에서 필요한 40개 계산기. Next.js 15 + App Router + TypeScript + SSG.

## ✅ 포함된 것

- **40개 계산기 페이지** (`/calc/[slug]`) 자동 생성 (SSG)
- **6개 작동 계산기**: 연봉 실수령액, 양도소득세, 퇴직금, 주담대 한도, 종합소득세, 실업급여
- **34개 placeholder**: "준비 중" 표시 (구조는 잡혀있음, 폼만 추가하면 됨)
- **카테고리 페이지** 7개 (`/category/[cat]`)
- **법적 필수 페이지**: `/about`, `/privacy`, `/terms`, `/contact` (애드센스 통과용)
- **각 작동 계산기마다**: 본문 가이드 + FAQ (5~7개) + 출처 + 관련 계산기
- **SEO**: 페이지별 title/description, OG, canonical, JSON-LD (WebApplication + FAQPage + BreadcrumbList)
- **sitemap.xml + robots.txt** 자동 생성
- **AdSense 슬롯**: 페이지당 3곳 (계산기 후 · 본문 중 · FAQ 후)
- **`public/ads.txt`**: 양식만 (PUB ID 입력 필요)

## 🚀 즉시 시작

```bash
cd nextjs-app
npm install
npm run dev   # http://localhost:3000
```

## 📦 GitHub & 배포

전체 절차는 **`DEPLOY.md`** 참고. 요약:

1. GitHub에 새 저장소 만들기 → `git push`
2. Cloudflare Pages 또는 Vercel → 저장소 import → 자동 배포
3. Custom domain → `calc.jjyu.co.kr` 연결
4. Search Console + 네이버 서치어드바이저 sitemap 제출
5. 트래픽 누적 후 애드센스 신청

## 🔑 환경 변수

`.env.local` 만들기:

```bash
NEXT_PUBLIC_SITE_URL=https://calc.jjyu.co.kr
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

`.env.local` 없어도 빌드는 됩니다 (광고는 점선 placeholder로 표시).

## 📁 핵심 폴더

```
app/
├── page.tsx                # 홈
├── calc/[slug]/page.tsx    # 40개 계산기 페이지
├── category/[cat]/page.tsx # 7개 카테고리
├── about / privacy / terms / contact
└── sitemap.ts + robots.ts

lib/
├── calc/index.ts           # 6개 계산 로직 (순수 함수)
├── data/calculators.ts     # 40개 메타 + 슬러그
└── data/guides.ts          # 6개 본문 가이드 + FAQ

components/
├── calc/forms/             # 6개 계산기 폼
├── calc/CalculatorWidget.tsx
├── adsense/AdSlot.tsx
└── seo/JsonLd.tsx
```

## 📝 남은 작업 (선택)

- [ ] 34개 placeholder 계산기 → 작동 폼 추가 (1개당 ~30분)
- [ ] 6개 본문 가이드 → 1,000자 이상으로 확장 (애드센스 통과 ↑)
- [ ] 실제 이메일 / 운영자 정보 입력
- [ ] 폰트 → next/font 로 self-host (속도)
- [ ] OG 이미지 동적 생성 (`opengraph-image.tsx`)


---

## 📦 GitHub에 푸시하기

### 처음 한 번만

```bash
# 프로젝트 폴더에서
cd nextjs-app

# Git 초기화
git init
git add .
git commit -m "Initial: calc.jjyu.co.kr 계산기 사이트"

# GitHub에 새 저장소 만들기 → 이름 예: calc-jjyu
# 그다음 (YOUR_USERNAME 본인 GitHub 사용자명으로 바꾸세요):
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/calc-jjyu.git
git push -u origin main
```

### 이후 변경 시

```bash
git add .
git commit -m "변경 내용 설명"
git push
```

---

## ☁️ 배포 — Cloudflare Pages (추천, 무료)

> jjyu.co.kr이 Cloudflare로 관리된다면 이게 가장 빠릅니다.

1. **Cloudflare 대시보드** → **Pages** → **Create a project** → **Connect to Git**
2. GitHub에서 `calc-jjyu` 저장소 선택
3. **Build settings**:
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `nextjs-app` (이 폴더만 배포할 경우)
   - Environment variables: `NODE_VERSION = 20`
4. **Deploy** 클릭

### 하위 도메인 연결 (`calc.jjyu.co.kr`)

1. 배포 완료 후 → 프로젝트 → **Custom domains**
2. **Set up a custom domain** → `calc.jjyu.co.kr` 입력
3. Cloudflare가 자동으로 CNAME 레코드 추가 (jjyu.co.kr이 Cloudflare DNS면 자동)
4. 다른 도메인 등록업체(가비아 등)면 안내된 CNAME을 직접 추가:
   ```
   Type:  CNAME
   Name:  calc
   Value: calc-jjyu.pages.dev  (Cloudflare가 알려주는 주소)
   ```

---

## ☁️ 배포 — Vercel (또 다른 옵션)

> Next.js 만든 회사라 가장 매끄럽지만, 한국 트래픽은 Cloudflare가 빠릅니다.

1. **vercel.com/new** → GitHub 저장소 import
2. **Root Directory**: `nextjs-app` 선택
3. 나머지는 자동 감지 → **Deploy**
4. 배포 완료 후 → **Settings → Domains** → `calc.jjyu.co.kr` 추가
5. DNS에 안내된 CNAME 추가

---

## 🔑 환경 변수 (애드센스용)

`nextjs-app/.env.local` 생성 (Git에 안 올라감):

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://calc.jjyu.co.kr
```

Cloudflare Pages / Vercel 콘솔에도 같은 변수를 추가하세요.

---

## 📁 폴더 구조

```
nextjs-app/
├── app/
│   ├── layout.tsx           # 전역 (Header, Footer, AdSense 스크립트)
│   ├── page.tsx             # 홈 (TOP 6 + 카테고리)
│   ├── globals.css
│   ├── sitemap.ts           # sitemap.xml 자동 생성
│   ├── robots.ts            # robots.txt
│   └── calc/
│       └── [slug]/
│           └── page.tsx     # 40개 계산기 페이지 (SSG)
│
├── components/
│   ├── ui/                  # Header, Footer, Hero, Top6, Category
│   ├── calc/                # SalaryForm, SeveranceForm, MortgageForm…
│   ├── adsense/             # AdSenseScript, AdSlot
│   └── seo/                 # JsonLd, Breadcrumb, FAQ
│
├── lib/
│   ├── calc/                # 순수 계산 로직 (salary.ts, severance.ts…)
│   ├── data/calculators.ts  # 40개 계산기 메타데이터
│   └── format.ts            # fmtKRW, manToKorean
│
├── content/                 # 각 계산기의 본문 가이드 (MDX)
│
└── public/
    └── ads.txt              # 애드센스 ads.txt
```

---

## ✅ 애드센스 통과 체크리스트

- [x] 도메인 14일 이상 보유
- [x] 개인정보처리방침 페이지 (`/privacy`)
- [x] 이용약관 페이지 (`/terms`)
- [x] 운영자 정보 (`/about`)
- [x] 문의 페이지 (`/contact`)
- [x] 각 계산기마다 500자 이상 본문
- [x] FAQ 5개 이상
- [x] `ads.txt` 파일 (`public/ads.txt`)
- [ ] 일 트래픽 100+ (사람 손길)
- [ ] 백링크 1~5개 (커뮤니티에서 자연 노출)

---

## 📊 SEO 체크

- [x] 각 페이지 고유 `<title>`, `<meta description>`
- [x] `canonical` 태그
- [x] Open Graph (페이스북·카톡 미리보기)
- [x] JSON-LD 구조화 데이터 (WebApplication, FAQPage, BreadcrumbList)
- [x] `sitemap.xml` 자동 생성 → Google Search Console 제출
- [x] `robots.txt`
- [x] 모바일 최적화

---

## 📝 다음 작업

1. `.env.local` 작성 → 애드센스 PUB ID, GA ID 입력
2. `public/ads.txt` 작성 (애드센스 승인 후)
3. 도메인 연결 → `calc.jjyu.co.kr`
4. Google Search Console / 네이버 서치어드바이저에 sitemap 제출
5. 일 100명 트래픽 목표 후 애드센스 신청

---

## 📞 문의

이 코드 관련 질문은 jjyu.co.kr 운영자에게.
