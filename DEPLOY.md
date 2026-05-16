# 🚀 calc.jjyu.co.kr — GitHub & 배포 단계별 가이드

> 이 폴더(`nextjs-app/`)는 그대로 GitHub에 올려서 Cloudflare Pages 또는 Vercel에서 배포할 수 있는 Next.js 15 프로젝트입니다.

---

## 1단계. 로컬에서 먼저 확인

```bash
cd nextjs-app
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 → 사이트 동작 확인.

---

## 2단계. GitHub 저장소 만들고 푸시

### A) GitHub에서 새 저장소 만들기

1. https://github.com/new 접속
2. **Repository name**: `calc-jjyu` (원하는 이름)
3. **Public** 또는 **Private** 선택
4. **README, .gitignore, license는 추가하지 마세요** (이미 있음)
5. **Create repository** 클릭

### B) 로컬에서 푸시

```bash
cd nextjs-app

# Git 초기화 (처음 한 번만)
git init
git branch -M main

# GitHub 저장소 연결 (YOUR_USERNAME 본인 GitHub 사용자명으로)
git remote add origin https://github.com/YOUR_USERNAME/calc-jjyu.git

# 첫 커밋 & 푸시
git add .
git commit -m "Initial: calc.jjyu.co.kr 계산기 사이트"
git push -u origin main
```

> **인증 안 됨**: GitHub는 더 이상 비밀번호 인증을 지원하지 않습니다.
> - GitHub 사이트 → Settings → Developer settings → Personal access tokens → Generate
> - 푸시할 때 비밀번호 자리에 토큰 입력
> - 또는 GitHub CLI (`brew install gh`, `gh auth login`) 사용 권장

---

## 3단계-A. Cloudflare Pages 배포 (추천)

> jjyu.co.kr이 Cloudflare DNS로 관리된다면 가장 간단합니다.

1. **Cloudflare 대시보드** → 좌측 메뉴 **Workers & Pages** → **Create application** → **Pages** 탭 → **Connect to Git**
2. GitHub 인증 → `calc-jjyu` 저장소 선택
3. **Set up builds and deployments**:
   - **Project name**: `calc-jjyu`
   - **Production branch**: `main`
   - **Framework preset**: **Next.js**
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `nextjs-app` (저장소 안에 `nextjs-app/` 하위 폴더로 푸시했을 경우)
   - **Environment variables** 추가:
     ```
     NODE_VERSION = 20
     NEXT_PUBLIC_SITE_URL = https://calc.jjyu.co.kr
     NEXT_PUBLIC_ADSENSE_CLIENT = (애드센스 승인 후 입력)
     NEXT_PUBLIC_GA_ID = (애널리틱스 ID)
     ```
4. **Save and Deploy** → 2~5분 빌드 → `calc-jjyu.pages.dev` 로 우선 배포

### 하위 도메인 연결 (`calc.jjyu.co.kr`)

1. 프로젝트 → **Custom domains** 탭 → **Set up a custom domain**
2. `calc.jjyu.co.kr` 입력 → **Continue**
3. **jjyu.co.kr이 Cloudflare DNS면**: 자동으로 CNAME 추가 → 끝
4. **다른 곳(가비아 등)에 DNS 있다면**: 거기 콘솔에서 다음 추가:
   ```
   Type:  CNAME
   Name:  calc
   Value: calc-jjyu.pages.dev
   TTL:   자동
   ```
5. 5분~24시간 후 `https://calc.jjyu.co.kr` 접속 가능

---

## 3단계-B. Vercel 배포 (대안)

1. **vercel.com/new** → GitHub 저장소 import
2. **Configure Project**:
   - **Root Directory**: `nextjs-app` 선택 (Edit 클릭)
   - **Framework**: Next.js 자동 감지
   - **Environment Variables**: 위와 동일하게 추가
3. **Deploy** → 1~3분 → `calc-jjyu.vercel.app`
4. **Settings → Domains** → `calc.jjyu.co.kr` 추가
5. 안내된 CNAME 또는 A 레코드 DNS에 추가

> 차이점:
> - **Cloudflare Pages**: 한국 트래픽 더 빠름, 무료 무제한
> - **Vercel**: Next.js 100% 호환, ISR/Edge Functions 완벽 지원

---

## 4단계. 검색 노출 (출시 직후 1주 안에)

### Google Search Console
1. https://search.google.com/search-console 접속
2. **속성 추가** → `https://calc.jjyu.co.kr` (도메인 또는 URL 접두어)
3. 소유권 인증 (DNS TXT 레코드 또는 HTML 파일)
4. **Sitemaps** → `https://calc.jjyu.co.kr/sitemap.xml` 제출
5. **URL 검사** → 홈 URL 입력 → **색인 생성 요청**

### 네이버 서치어드바이저
1. https://searchadvisor.naver.com 접속
2. 사이트 등록 → 소유 확인 → **사이트맵 제출** → `/sitemap.xml`
3. **수집 요청** 으로 빠른 인덱싱

---

## 5단계. 애드센스 신청 (트래픽 100+ 누적 후)

1. **public/ads.txt** 파일 편집:
   ```
   google.com, pub-실제PUBID, DIRECT, f08c47fec0942fa0
   ```
2. `git push` → 자동 재배포
3. https://www.google.com/adsense → 사이트 추가 → `calc.jjyu.co.kr`
4. 승인 (1주~수주) → PUB ID 받아서 `.env`에 입력 → 재배포

### 통과 가능성 ↑ 체크리스트

- ✅ 도메인 14일 이상 (이미 jjyu.co.kr 있음)
- ✅ 본문 500자+ × 페이지 (각 계산기 가이드)
- ✅ FAQ 5개+
- ✅ `/privacy`, `/terms`, `/about`, `/contact`
- ✅ 모바일 최적화
- ✅ 광고 슬롯 ≤ 3개/페이지

---

## 6단계. 이후 변경 → 자동 배포

```bash
# 코드 수정 후
cd nextjs-app
git add .
git commit -m "변경 내용 한 줄 설명"
git push
```

GitHub에 푸시되면 Cloudflare/Vercel이 **자동으로 감지하고 재배포**합니다 (2~5분).

---

## ❓ 자주 막히는 부분

| 문제 | 해결 |
|---|---|
| `git push` 인증 실패 | GitHub Personal Access Token 발급 |
| Cloudflare 빌드 실패: "Module not found" | Root directory를 `nextjs-app`으로 설정했는지 확인 |
| 도메인 연결 후 404 | DNS 전파 대기 (최대 24시간), `nslookup calc.jjyu.co.kr` 로 확인 |
| 한글 URL이 깨짐 | Next.js는 한글 URL 자동 지원, 브라우저가 percent-encode 표시할 뿐 |
| 빌드는 됐는데 빈 화면 | 환경변수 `NEXT_PUBLIC_SITE_URL` 확인 |
