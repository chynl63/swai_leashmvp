# 🔗 Leash — 스마트폰에 목줄을 채워라

의지박약 인간을 위한 하드코어 스크린타임 앱 · **웹 체험 데모**

> 원본은 iOS 네이티브 앱(Expo + FamilyControls)입니다. 웹에서는 실제 앱 차단이
> 불가능하므로, 핵심 플로우(차단 → 산책 → 인터럽트 → 벌칙/벤치/참기)를
> 인터랙티브 시뮬레이션으로 체험할 수 있게 만들었습니다.

## 컨셉

차단 중인 상태를 **"폰이 산책 중"** 이라는 메타포로 표현합니다.
차단을 풀려면 설정 시점에 정해둔 심리적 장벽(수학 문제 · 타이핑 · 대기 ·
벌금 에스컬레이션 · 감시자 SMS 승인)을 통과해야 합니다.

## 실행 방법

```bash
git clone https://github.com/chynl63/swai_leashmvp.git
cd swai_leashmvp
npm install
npm run dev
```

http://localhost:3000 접속.

### 환경변수 (선택)

감시자 승인 기능은 **Supabase Realtime**으로 동작하지만, 키가 없으면
같은 브라우저 탭 간 **BroadcastChannel 폴백**으로 자동 동작하므로
데모는 환경변수 없이도 완전히 체험할 수 있습니다.

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://edcoazlosntzjmjthqpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Supabase를 쓸 경우 [`supabase/schema.sql`](supabase/schema.sql)을 SQL 에디터에서 실행하세요.

## 배포 (Netlify)

이 저장소는 Netlify에 그대로 연결하면 됩니다.

- `netlify.toml`에 `@netlify/plugin-nextjs`가 설정되어 있어 App Router의
  SSR/동적 라우트(`/approve/[token]`)까지 동작합니다.
- Netlify 대시보드 → **Site settings → Environment variables**에 위 키를 등록하면
  Supabase Realtime이 활성화됩니다(미등록 시 폴백 동작).
- Build command `npm run build`, Publish directory `.next` (toml에 기재됨).

## 체험 가이드

1. **사용해보기** 클릭
2. 차단 프로필(🟡공부 / 🟠취침 / 🔴하드코어) 선택 → 앱 선택 → 시간 설정 → **목줄 채우기**
3. **산책 화면**: 타이머 + 걷는 캐릭터. 30초 가만히 두면 캐릭터가 돌아봅니다(응시 감지)
4. **차단된 앱 열어보기** → 인터럽트 화면에서 **벌칙 / 벤치(5분) / 참기** 체험
5. **감시자 승인(하드코어)**: 링크를 복사해 새 탭에서 열면 승인/거부 → 실시간 반영
6. 하단 **⚡ 데모 가속 ON/OFF** 토글로 실시간(1h=1min) 가속을 끄고 켤 수 있습니다

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 상태 | Zustand (+ persist) |
| 백엔드 | Supabase (Realtime, PostgreSQL) |
| 애니메이션 | Framer Motion |
| 폰트 | Pretendard |
| 배포 | Netlify |

## 디자인 원칙

- **골든 오커 `#E8A835`** 가 앱 전체 유일한 컬러 포인트
- 목줄 찬 폰 캐릭터(정면/옆/응시) — line-art SVG, 이미지 스왑 애니메이션
- 미니멀 · 드라이 · 자조적 톤

## 프로젝트 구조

```
app/
  page.tsx                 랜딩
  demo/
    layout.tsx             iPhone 목업 프레임
    page.tsx               홈 (차단 전/중)
    walk/                  산책 상태 + 응시 감지
    interrupt/             인터럽트 (3/2버튼)
    transition/            전환 화면 (참기/벤치/상처/완주)
    bench/                 팝콘 타임
    barrier/{math,typing,wait,fine,guardian}/
    stats/                 통계
  approve/[token]/         감시자 승인 웹페이지 (프레임 밖)
components/                PhoneFrame, StatusBar, TabBar, Character, TimerCard ...
lib/                       store, timer, escalation, math-generator, approval, supabase
public/characters/         캐릭터 SVG
```
