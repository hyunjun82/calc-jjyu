# 🤖 Claude Code 작업 지시서

> 이 파일은 Claude Code에게 전달하기 위해 작성되었습니다.
> 이 프로젝트의 코드는 이미 완성되어 있고, 남은 작업은 **GitHub 푸시 + 배포 설정**입니다.

---

## 사용자 요청 요약

- **목표**: 이 Next.js 프로젝트를 기존 GitHub 저장소(`https://github.com/hyunjun82/calc-jjyu`)에 **덮어쓰기 푸시**
- **도메인**: `calc.jjyu.co.kr` (이미 운영 중, 코드만 교체)
- **사용자는 비개발자**: 터미널/Git 사용 익숙하지 않음 — 친절하게 안내 필요

---

## 이 프로젝트 정체

- **Next.js 15** (App Router) + **TypeScript** + **React 18**
- 한국인 일상 계산기 40개 사이트 (calc.jjyu.co.kr)
- 6개 계산기 작동 중 (연봉 실수령액, 양도소득세, 퇴직금, 주담대 한도, 종합소득세, 실업급여)
- 나머지 34개는 placeholder (구조만 있음, 점진적 추가 예정)
- SEO 완성형 페이지: 각 계산기마다 본문 가이드 + FAQ + JSON-LD + 광고 슬롯 3곳
- AdSense 통합 (PUB ID는 `.env.local`에서 주입)
- 작동 확인: `npm install && npm run dev` → `http://localhost:3000`

---

## 폴더 구조

```
.
├── app/                    # Next.js App Router 페이지들
│   ├── page.tsx            # 홈
│   ├── calc/[slug]/page.tsx  # 40개 계산기 페이지
│   ├── category/[cat]/page.tsx
│   ├── about | privacy | terms | contact / page.tsx
│   ├── sitemap.ts | robots.ts
│   ├── layout.tsx | globals.css
├── components/             # React 컴포넌트
│   ├── calc/forms/         # 6개 계산기 폼
│   ├── adsense/AdSlot.tsx
│   └── seo/JsonLd.tsx
├── lib/                    # 순수 로직
│   ├── calc/index.ts       # 계산 함수
│   ├── data/calculators.ts # 40개 메타데이터
│   ├── data/guides.ts      # 본문 가이드 + FAQ
│   └── format.ts
├── public/ads.txt          # 애드센스 (PUB ID 입력 필요)
├── _design-archive/        # 디자인 시안 (참고용, 무시 가능)
├── package.json | tsconfig.json | next.config.mjs
├── README.md | DEPLOY.md
└── .env.example            # 환경변수 양식
```

---

## 해야 할 작업 (순서대로)

### 1. 로컬 빌드 확인

```bash
npm install
npm run build
```

빌드 에러가 나면 **사용자가 직접 고치기 어려울 가능성이 높으니 자동으로 수정**한 뒤 진행해주세요. 자주 나는 에러:

- TypeScript 타입 에러 (`any` 처리)
- `_design-archive/` 내부 파일들 빌드에 포함되면 안 됨 → 필요시 `tsconfig.json`의 `exclude`에 추가
- `'use client'` 누락된 폼 컴포넌트

### 2. 기존 GitHub 저장소 백업

사용자의 기존 코드를 보존하기 위해 백업 브랜치 생성:

```bash
git clone https://github.com/hyunjun82/calc-jjyu.git /tmp/calc-jjyu-old
cd /tmp/calc-jjyu-old
git checkout -b backup-before-nextjs
git push origin backup-before-nextjs
```

### 3. 새 코드로 main 브랜치 덮어쓰기

```bash
cd <원래 프로젝트 폴더>

# Git 초기화 또는 기존 .git 사용
[ -d .git ] || git init -b main

# 원격 등록 (이미 있으면 set-url)
git remote add origin https://github.com/hyunjun82/calc-jjyu.git 2>/dev/null || \
git remote set-url origin https://github.com/hyunjun82/calc-jjyu.git

# _design-archive는 푸시 안 함 (선택)
# echo "_design-archive/" >> .gitignore

git add -A
git commit -m "feat: Next.js 15 계산기 사이트로 전면 교체

- 6개 계산기 작동: 연봉, 양도세, 퇴직금, 주담대, 종소세, 실업급여
- 각 계산기 페이지 SEO 완성 (본문, FAQ, JSON-LD)
- AdSense 슬롯 3곳, sitemap.xml/robots.txt 자동 생성
- 다크모드, 모바일 최적화, ⌘K 검색
- 법적 필수 페이지: /about /privacy /terms /contact"

git push origin main --force
```

### 4. 환경변수 안내

`.env.local` 파일은 Git에 안 올라가므로 사용자가 직접 만들도록 안내:

```bash
NEXT_PUBLIC_SITE_URL=https://calc.jjyu.co.kr
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

배포 환경 (Cloudflare Pages / Vercel) 의 환경변수 설정에도 추가 필요.

### 5. 배포 확인

- 기존 저장소가 Cloudflare Pages 또는 Vercel에 연결되어 있다면 푸시 즉시 자동 빌드 시작
- 사용자에게 배포 대시보드 URL 알려주고 빌드 로그 모니터링 안내
- 도메인 `calc.jjyu.co.kr` 작동 확인

### 6. 빌드 실패 시 대응

대시보드에서 빌드 로그 확인. 흔한 원인:

| 에러 | 해결 |
|---|---|
| `Module not found` | `npm install` 후 다시 푸시 |
| Node 버전 | 환경변수 `NODE_VERSION=20` 설정 |
| TypeScript 타입 | `tsconfig.json` 에서 `"strict": false` 임시 변경 |
| 한글 슬러그 | Next.js는 자동 지원, 문제 시 라우트 확인 |

### 7. SEO 후속 작업 안내

사용자에게 다음 작업 안내:
- Google Search Console: `https://calc.jjyu.co.kr/sitemap.xml` 제출
- 네이버 서치어드바이저: 사이트 등록 + sitemap 제출
- AdSense: `public/ads.txt`에 실제 PUB ID 입력 후 재푸시

---

## 추가 컨텍스트

### 비기술 사용자 대응

- **터미널 명령어 한 번에 1~2개만** — 너무 많이 한 번에 주면 혼란스러워함
- **에러 메시지 캡쳐 보내달라고** 하기보다 미리 해결책 제시
- **GitHub 토큰 인증** 처음이면 `gh auth login` 으로 GitHub CLI 사용 권장

### 알려진 한계

- `_design-archive/` 폴더는 초기 디자인 시안 (HTML 프로토타입). 운영 코드에는 영향 없지만 푸시 시 같이 올라감. 원하면 `.gitignore`에 추가.
- 34개 placeholder 계산기는 클릭 시 "준비 중" 표시. 추후 폼 추가 작업 필요.
- AdSense PUB ID 미입력 시 광고 자리에 점선 플레이스홀더만 표시.

---

## 사용자에게 전달할 메시지 예시

```
완료했습니다.

✅ 빌드 통과
✅ GitHub main 브랜치에 푸시 완료 (backup-before-nextjs에 기존 코드 백업)
✅ Cloudflare Pages가 자동 빌드 시작 (2~5분)

확인하실 곳:
1. https://github.com/hyunjun82/calc-jjyu/actions (빌드 진행 상황)
2. https://calc.jjyu.co.kr (5분 후 새 사이트)

다음으로 하실 일:
1. AdSense PUB ID 받으면 .env에 입력하고 다시 푸시
2. Google Search Console에 sitemap 제출
```
