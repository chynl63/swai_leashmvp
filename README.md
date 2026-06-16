# 🔗 Leash — 스마트폰에 목줄을 채워라

> **의지박약 인간을 위한 하드코어 스크린타임 앱 · 웹 체험 데모**
> 한양대학교 창업 수업(SWAI) 과제 제출용

원본은 iOS 네이티브 앱(Expo + React Native + FamilyControls)입니다.
웹에서는 실제 앱 차단이 불가능하므로, 앱의 **핵심 플로우를 그대로 체험**할 수 있는
인터랙티브 시뮬레이션으로 재구성했습니다.

---

## ⚡ TL;DR — 가장 빠른 실행 (3줄)

```bash
npm install
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

- **별도 설정(환경변수·DB·API 키)이 전혀 필요 없습니다.** 클론 → 설치 → 실행이면 끝입니다.
- 모든 기능(감시자 승인 포함)이 키 없이도 완전히 동작합니다. 자세한 내용은 아래
  [Supabase 키가 꼭 필요한가요?](#supabase-키가-꼭-필요한가요) 참고.

---

## 0. 사전 준비물

| 항목 | 버전 | 비고 |
|------|------|------|
| **Node.js** | **18.18 이상** (20 LTS 이상 권장) | `node -v` 로 확인 |
| npm | Node에 기본 포함 | `npm -v` |
| 인터넷 연결 | 권장 | 폰트(Pretendard) CDN 로드용. 오프라인이어도 시스템 폰트로 동작 |

> 개발·검증 환경: Node 26 / npm 11 (Node 18·20·22에서도 동일하게 동작합니다.
> `package-lock.json`으로 의존성 버전이 고정되어 있습니다.)

---

## 1. 실행 방법 (단계별)

```bash
# 1) 저장소 클론
git clone https://github.com/chynl63/swai_leashmvp.git
cd swai_leashmvp

# 2) 의존성 설치
npm install

# 3) 개발 서버 실행
npm run dev
```

→ 터미널에 `Local: http://localhost:3000` 이 뜨면 브라우저에서 접속하세요.

**프로덕션 빌드로 확인하고 싶다면:**

```bash
npm run build   # 타입체크 + 빌드 (경고 없이 통과해야 정상)
npm run start   # http://localhost:3000
```

> **포트 3000이 이미 사용 중이면?** `npm run dev -- -p 3001` 처럼 다른 포트를 지정하세요.

---

## 2. 무엇을 보게 되나요 (체험 가이드)

데스크톱에서는 화면 중앙에 **iPhone 목업 프레임**이 뜨고 그 안에서 앱이 동작합니다.
모바일/좁은 화면에서는 풀스크린으로 보입니다.

1. 랜딩 화면에서 **사용해보기** 클릭
2. **차단 설정** — 프로필(🟡 공부 / 🟠 취침 / 🔴 하드코어) 선택 → 묶을 앱 선택 →
   차단 시간(◀ ▶) 설정 → **🔗 목줄 채우기**
3. **산책 화면** — 큰 타이머 + 걷는 캐릭터 + 발자국.
   👉 마우스/화면을 **30초간 가만히 두면** 캐릭터가 돌아보며 "왜 아직 쳐다봐?" (응시 감지)
4. **차단된 앱 열어보기 (시뮬)** 버튼 → **인터럽트 화면**
   - **앱 끄고 산책하도록 놔두기** (참기) → 홍조 전환 → 산책 복귀
   - **딱 5분만 사용하기** (벤치, 2시간+ & 절반 경과 시에만 노출) → 팝콘 타임
   - **벌칙 수행하고 줄 끊기** → 프로필별로 정해진 벌칙을 **순서대로** 통과해야 해제
5. **벌칙 종류** (프로필에 따라 자동 배정 — 해제 시점엔 선택 불가)
   - 🟡 공부 모드: **수학 문제 5개 연속**
   - 🟠 취침 모드: **타이핑 과제 → 3분 대기** (대기 중 화면을 벗어나면 리셋됨)
   - 🔴 하드코어: **감시자 승인 → 벌금(에스컬레이션) → 5분 대기**
6. **감시자 승인 체험** (🔴 하드코어 선택 시): 화면의 **승인 링크 복사** 또는
   **새 탭에서 직접 승인하기** → 승인을 누르면 원래 탭에 **실시간으로 해제 반영**
7. 하단 탭바의 **통계** 탭에서 누적 산책/연속 기록/벌금/히스토리 확인

### ⚡ 데모 가속 토글
실제 2시간을 기다릴 수 없으므로 화면 우하단에 **⚡ 데모 가속 ON/OFF** 토글이 있습니다.
- ON(기본): 1시간 = 1분 (60배), 벤치 5분 = 15초, 대기 3분 = 15초
- OFF: 실제 시간 그대로 (실시간으로 보고 싶으실 때)

---

## Supabase 키가 꼭 필요한가요?

**아니요 — 데모 실행과 모든 기능 체험에는 필요 없습니다.**

감시자 승인은 두 가지 방식으로 동작하도록 설계했습니다.

| 환경 | 동작 방식 | 비고 |
|------|-----------|------|
| **키 없음 (기본)** | BroadcastChannel 폴백 | **같은 브라우저의 다른 탭**에서 승인하면 실시간 반영. 클론 직후 바로 됨 |
| **키 있음** | Supabase Realtime | **다른 기기/폰**에서 승인해도 실시간 반영 (진짜 서버 기반) |

> 명세서상 "Supabase Realtime 기술 시연"이 가산 요소라, **실제 Realtime을 시연하고
> 싶을 때만** 아래처럼 키를 넣으면 됩니다. 넣지 않아도 데모는 완전합니다.

### (선택) Supabase 실시간 활성화

1. 프로젝트 루트에 `.env.local` 파일 생성:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://edcoazlosntzjmjthqpz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key
   SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_key
   ```
   (anon key는 Supabase 대시보드 → Project Settings → API 에서 확인)
2. Supabase SQL 에디터에서 [`supabase/schema.sql`](supabase/schema.sql) 실행
3. 서버 재시작 (`npm run dev`)

키가 채워져 있으면 감시자 화면에 "Supabase Realtime으로 실시간 연결됨"이,
비어 있으면 "데모 모드 — 같은 브라우저 탭 간 실시간 연결"이 표시됩니다.

> `.env.local`은 보안상 git에 포함되지 않습니다(`.gitignore`). 템플릿은
> [`.env.example`](.env.example)에 있습니다.

---

## 3. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 상태 관리 | Zustand (localStorage persist) |
| 백엔드(선택) | Supabase (Realtime / PostgreSQL) |
| 애니메이션 | Framer Motion |
| 폰트 | Pretendard |
| 배포 | Netlify |

---

## 4. 프로젝트 구조

```
app/
  layout.tsx                 전역 레이아웃 (폰트/메타)
  page.tsx                   랜딩 페이지
  demo/
    layout.tsx               iPhone 목업 프레임 래퍼
    page.tsx                 홈 대시보드 (차단 전 설정 / 차단 중)
    walk/page.tsx            산책 상태 + 응시 감지
    interrupt/page.tsx       인터럽트 (3버튼 / 2버튼)
    transition/page.tsx      전환 화면 (참기·벤치·상처·완주 공용)
    bench/page.tsx           벤치(팝콘 타임) 타이머
    barrier/
      math/page.tsx          수학 문제 5연속
      typing/page.tsx        타이핑 과제
      wait/page.tsx          대기 (화면 이탈 시 리셋)
      fine/page.tsx          벌금 에스컬레이션
      guardian/page.tsx      감시자 승인 (Realtime/폴백)
    stats/page.tsx           통계 탭
  approve/[token]/page.tsx   감시자 승인 웹페이지 (프레임 밖, 별도 URL)
components/                  PhoneFrame, StatusBar, TabBar, Character(SVG),
                             TimerCard, TransitionScreen, GlassCard, ...
lib/                         store(Zustand), timer, escalation, math-generator,
                             approval(Realtime+폴백), supabase, profiles, sequence
public/characters/           캐릭터 line-art SVG
supabase/schema.sql          (선택) Supabase 테이블 스키마
```

---

## 5. 배포 (Netlify)

이 저장소는 Netlify에 그대로 연결하면 배포됩니다.

- 루트의 [`netlify.toml`](netlify.toml)에 `@netlify/plugin-nextjs`가 설정되어 있어
  App Router의 SSR/동적 라우트(`/approve/[token]`)까지 동작합니다.
- Build command `npm run build`, Publish directory `.next` (toml에 기재됨).
- Supabase Realtime을 켜려면 Netlify → Site settings → Environment variables에
  위 키들을 등록하세요. (미등록 시 폴백 모드로 동작)

---

## 6. 자주 묻는 / 문제 해결

| 증상 | 해결 |
|------|------|
| `npm install` 중 오류 | Node 버전이 18.18 이상인지 확인 (`node -v`) |
| 포트 3000 사용 중 | `npm run dev -- -p 3001` |
| 폰트가 기본 폰트로 보임 | 인터넷 연결 확인 (Pretendard는 CDN 로드, 오프라인이면 시스템 폰트로 대체) |
| 화면이 이전 상태로 시작됨 | 진행 상태가 localStorage에 저장됩니다. 초기화하려면 브라우저
  개발자도구 → Application → Local Storage → `leash-demo` 삭제 후 새로고침 |
| 감시자 승인이 다른 기기에서 안 됨 | 키 없는 기본 모드는 **같은 브라우저 탭** 간만 동작합니다.
  다른 기기 시연은 위 Supabase 키 설정 필요 |

---

## 7. 핵심 디자인 원칙

- **골든 오커 `#E8A835`** — 앱 전체에서 유일하게 쓰는 컬러 포인트(나머지는 흑백/회색)
- 목줄 찬 폰 캐릭터(정면·옆모습·응시) — line-art SVG, 이미지 스왑 기반 걷기 애니메이션
- 차단 = "폰의 산책"이라는 메타포. 미니멀·드라이·자조적인 톤
