# Leash Web MVP — 구현 명세서

> 학교 창업 수업 과제용 웹 체험 데모
> GitHub: https://github.com/chynl63/swai_leashmvp
> Supabase URL: https://edcoazlosntzjmjthqpz.supabase.co

---

## 0. 프로젝트 개요

**Leash**는 "의지박약 인간을 위한 하드코어 스크린타임 앱"이다. iOS 네이티브 앱의 핵심 플로우를 웹에서 체험할 수 있는 인터랙티브 데모를 만든다.

### 핵심 체험 플로우
```
랜딩 → 사용해보기 → 차단 설정 → 산책 시작
→ 차단된 앱 열기 시도 → 인터럽트 화면
→ 벌칙 수행 or 벤치(5분) or 참기
→ 대시보드 (통계)
```

### 반응형 구현 방식
- **데스크톱**: 화면 중앙에 iPhone 목업 프레임(375×812 비율). 그 안에서 앱이 동작. 주변은 어두운 배경 + "Leash" 브랜딩
- **모바일**: "사용해보기" 버튼 탭 → 풀스크린 앱 체험 (브라우저 UI 최소화, 실제 폰 앱처럼 느껴지도록)

---

## 1. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 상태 관리 | Zustand |
| 백엔드 | Supabase (Auth, PostgreSQL, Realtime) |
| 배포 | Vercel |
| 애니메이션 | Framer Motion |
| 폰트 | Pretendard (Google Fonts 또는 CDN) |

### 환경변수 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://edcoazlosntzjmjthqpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(Supabase 대시보드에서 확인)
SUPABASE_SERVICE_ROLE_KEY=(Supabase 대시보드에서 확인)
```

---

## 2. 디자인 시스템

### 컬러 팔레트
```
Background
- Primary:    #F7F7F8 (쿨 오프화이트)
- Secondary:  #FFFFFF (카드)
- Tertiary:   #ECECEE (입력 필드, 비활성)

Text
- Primary:    #1A1A1A
- Secondary:  #6B6B6B
- Tertiary:   #A0A0A0

Accent (Golden Ochre — 앱 전체 유일한 컬러 포인트)
- Main:       #E8A835
- Light:      #FDF3E0
- Dark:       #B8841A

Semantic
- Danger:     #E24B4A
- Success:    #4CAF50

Border
- Default:    #E5E5E8
- Emphasis:   #D5D5D8
```

### 글래스모피즘 (주요 카드에만)
```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.7);
border: 0.5px solid rgba(255, 255, 255, 0.5);
border-radius: 16px;
```

### 타이포그래피
- 폰트: Pretendard
- 벌금/타이머 숫자: 36px, font-weight 600, #E8A835
- 화면 제목: 22px, font-weight 500
- 본문: 15px, font-weight 400
- 캡션: 13px, font-weight 400, #6B6B6B

### 컴포넌트 스타일
- 글래스 카드: 위 글래스모피즘 스펙, border-radius 16px
- 일반 카드: bg white, border 0.5px #E5E5E8, border-radius 12px
- 버튼 Primary: bg #E8A835, text white, border-radius 8px
- 버튼 Ghost: transparent, text #6B6B6B
- 진행바: #ECECEE 트랙, #E8A835 fill

---

## 3. iPhone 목업 프레임

### 데스크톱 레이아웃
```
┌──────────────────────────────────────────────┐
│             (어두운 배경 #0E0E0E)              │
│                                              │
│     Leash 로고 + 서브카피                      │
│                                              │
│        ┌──────────────────┐                  │
│        │  (iPhone 프레임)   │                  │
│        │   375 × 812      │                  │
│        │   border-radius   │                  │
│        │   40px            │                  │
│        │                   │                  │
│        │   [앱 콘텐츠]      │                  │
│        │                   │                  │
│        │                   │                  │
│        └──────────────────┘                  │
│                                              │
│     GitHub · 만든 사람                         │
└──────────────────────────────────────────────┘
```

- iPhone 프레임: 실제 iPhone 17 비율, 노치/다이나믹 아일랜드 포함
- 프레임 안에서만 앱이 동작 (overflow hidden)
- 상단 상태바(시간, 와이파이, 배터리) 하드코딩으로 표시
- 하단 홈 인디케이터 바 표시

### 모바일 레이아웃
```
[랜딩 페이지]
  "Leash — 스마트폰에 목줄을 채워라"
  [사용해보기] 버튼
     ↓ 탭
  [풀스크린 앱 체험]
  - 상태바 숨김 (CSS: 100dvh)
  - 하단 홈바만 표시
  - 실제 앱처럼 느껴지도록
```

---

## 4. 화면별 상세 구현

### 4.1 랜딩 페이지 (데스크톱 + 모바일 공통)

```
Leash
스마트폰에 목줄을 채워라

[캐릭터 일러스트 — 정면 응시]

의지박약 인간을 위한 하드코어 스크린타임 앱

[사용해보기] ← 골든 오커 버튼
```

- 데스크톱: 이 랜딩이 iPhone 프레임 바깥에 보이고, "사용해보기" 누르면 iPhone 프레임 안에서 앱 시작
- 모바일: 풀스크린 랜딩, "사용해보기" 누르면 앱 체험 시작

### 4.2 홈 대시보드 (차단 전)

```
┌─────────────────────────────┐
│ Leash                  [⚙️] │
│                             │
│ ┌─────────────────────────┐ │
│ │  [차단 프로필 선택 ⌄]     │ │
│ │                          │ │
│ │  앱 아이콘 행 (시뮬)      │ │
│ │  📱📱📱 외 3개           │ │
│ │                          │ │
│ │  차단 시간 선택            │ │
│ │  ◀  2h  ▶               │ │
│ │                          │ │
│ │  [🔗 목줄 채우기]         │ │
│ └─────────────────────────┘ │
│                             │
│  ── 이번 주 ──              │
│  산책 0시간 · 줄 끊기 0회    │
│                             │
│      [홈]  [통계]            │
└─────────────────────────────┘
```

- 차단 프로필: "공부 모드" / "취침 모드" / "하드코어" 프리셋 3개 (셀렉트 메뉴)
- 앱 선택: 실제 FamilyControls 없으므로 시뮬레이션. 인스타/유튜브/틱톡/트위터 등 아이콘을 토글로 선택
- 차단 시간: 1h / 2h / 4h / 6h / 8h (실제 타이머는 데모용으로 가속 가능 — 1시간=1분 등)
- 벌칙 설정: 프로필별 프리셋으로 자동 배정. 🟡약함=수학3개, 🟠보통=타이핑+3분대기, 🔴하드코어=문자+벌금+5분대기

### 4.3 산책 상태 화면 (차단 중 — Leash 앱 실행 시)

```
┌─────────────────────────────┐
│                             │
│      [차단 그룹 이름]        │
│                             │
│        2:13:42              │
│     1:46:18째 걷는 중        │
│                             │
│                             │
│    [캐릭터 뒷모습 걷기]       │
│    .... (발자국)             │
│                             │
│                             │
│                             │
│        자세히 보기            │
└─────────────────────────────┘
```

- 타이머: 데모용 가속 (실제 시간의 60배 — 1분=1시간)
- 캐릭터: char-back-walk.png ↔ char-back-stand.png 600ms 간격 스왑
- 발자국: 캐릭터 왼쪽에 회색 점 패턴
- "자세히 보기" → 홈 대시보드 (차단 중 상태)
- **응시 감지**: 30초 무동작 → 캐릭터 char-front.png로 전환 + "왜 아직 쳐다봐?" / 1분30초 → "...산책 끝나면 부를게" / 3분+ → 말풍선 없이 응시만

### 4.4 홈 대시보드 (차단 중)

```
┌─────────────────────────────┐
│ Leash                  [⚙️] │
│                             │
│ ┌───────────────────────┐   │
│ │ [차단 그룹 이름]        │   │
│ │ ■■■■■■□□□□ 투톤 카드   │   │
│ │  2:13:42              │   │
│ │  1:46:18              │   │
│ │  .... (발자국)         │   │
│ └───────────────────────┘   │
│                             │
│  묶여있는 앱                 │
│ ┌───────────────────────┐   │
│ │ 차단 그룹 이름     ⌄    │   │
│ └───────────────────────┘   │
│                             │
│ [차단된 앱 열어보기 시뮬] 버튼 │
│                             │
│      [홈]  [통계]            │
└─────────────────────────────┘
```

- 투톤 타이머 카드: 왼쪽 #E8A835 (경과) / 오른쪽 #262626 (남은), 비율이 경과 시간에 따라 동적 변화
- **"차단된 앱 열어보기"** 버튼: 웹에서는 실제 앱 차단이 불가하므로 이 버튼으로 인터럽트 플로우 진입을 시뮬레이션
- 묶인 앱 리스트: 접힘/펼침 아코디언 (⌄/⌃)

### 4.5 인터럽트 화면 (3버튼 — 벤치 있을 때)

차단된 앱 열기를 시뮬하면 이 화면이 뜬다.

```
┌─────────────────────────────┐
│      [차단 그룹 이름]        │
│                             │
│                             │
│                             │
│    [캐릭터 정면 + 빗금]      │
│    "한창 재밌었는데..."       │
│                             │
│                             │
│  [딱 5분만 사용하기]          │  ← 벤치 조건 충족 시만
│  [벌칙 받고 줄 끊기]          │
│  [앱 끄고 산책하도록 놔두기]   │  ← 골든 오커
└─────────────────────────────┘
```

- 벤치 조건: 2시간+ 산책 & 절반 경과 & 미사용. 미충족 시 2버튼 variant
- 각 버튼 탭 시 전환 화면 2.5초 (스킵 불가):
  - 벤치: char-front.png + "딱 5분만 드릴게요! 더는 없어용~" → 5분 타이머 시작
  - 벌칙: 벌칙 수행 화면으로 이동
  - 참기: char-front.png + 홍조 + "주인님이 최고예용! 그럼 산책 좀 더 하다 올게용!" → 산책 상태 복귀

### 4.6 벌칙 수행 화면들

#### 수학 문제
```
문제 1/5

  247 × 38 = ?

  [_________]  입력 필드

  [확인]

  오답 시: 빨간 흔들림 + 진동(모바일) + 오답 카운트
  정답 시: 다음 문제
  5문제 연속 정답 → 벌칙 완료
```

#### 타이핑 과제
```
아래 문장을 정확히 따라 쓰세요

"나는 지금 시간을 낭비하고 있으며
 이 앱을 여는 것이 부끄럽습니다"

[_________________________]

  정확도: 0/32자
  오타 시 빨간 하이라이트
  완벽히 일치해야 완료
```

#### 대기 시간
```
      3:00

  기다리세요

  ████████░░░░ 진행바

  (이 화면을 떠나면 리셋됩니다)
```
- 탭/포커스 벗어나면 타이머 리셋 (Page Visibility API)

#### 벌금 결제 (시뮬레이션)
```
    예외 사용권

     ₩3,375

  오늘 3번째 → 1.5배 적용
  기본 ₩1,500 × 1.5²

  [결제하고 열기]  ← 실제 결제 없음, 탭하면 완료 처리

  이번 달 누적: ₩23,625
```

#### 감시자 승인
```
    감시자 승인 대기 중

  엄마에게 승인 요청을 보냈어요

  [승인 링크 복사하기]  ← 클립보드에 URL 복사

  링크를 감시자에게 보내주세요
  감시자가 승인하면 자동으로 해제됩니다

  ⏳ 대기 중...
```
- 승인 링크: `/approve/{token}` 경로의 웹 페이지
- 감시자가 링크를 열면 "승인/거부" 버튼이 보이는 간단한 페이지
- Supabase Realtime으로 승인 시 즉시 해제 반영
- 데모용: 같은 브라우저에서 새 탭으로 열어 직접 승인해볼 수 있게 (셀프 승인 방지는 데모에서 비활성)

### 4.7 벌칙 완료 → 상처 화면

```
┌─────────────────────────────┐
│      [차단 그룹 이름]        │
│                             │
│                             │
│    [캐릭터 정면 + 눈물]      │
│                             │
│  그게 주인님의 뜻이라면...    │
│  그치만 전 오늘 큰 상처를     │
│  받았어요                    │
│                             │
│                             │
│  (2초 후 자동 전환)           │
│  → "차단이 해제되었습니다"    │
└─────────────────────────────┘
```

### 4.8 벤치 (5분 사용) 플로우

```
"딱 5분만 드릴게요!" (2.5초)
  → 5분 타이머 화면 (데모에서는 30초로 가속)
    ┌─────────────────────┐
    │   🍿 팝콘 타임       │
    │      4:32            │
    │   ████████░░ 진행바   │
    │                      │
    │  지금은 자유시간!      │
    └─────────────────────┘
  → 시간 종료
  → "시간이 다 됐어요 주인님! 이제 다시 산책할 시간이에요! 야호~" (2.5초)
  → 산책 상태 복귀
```

### 4.9 통계 탭

```
┌─────────────────────────────┐
│ 통계                        │
│                             │
│  이번 주 산책                │
│  ┌───────────────────────┐  │
│  │  32시간               │  │
│  │  월 화 수 목 금 토 일   │  │
│  │  ██ ██ ██ ██ ░░ ░░ ░░ │  │
│  └───────────────────────┘  │
│                             │
│  연속 기록 🔥               │
│  4일째 줄 안 끊는 중         │
│                             │
│  이번 달 벌금               │
│  ₩23,625                   │
│                             │
│  해제 시도 히스토리          │
│  14:23 인스타 · 참음 ✅     │
│  11:05 유튜브 · 벌금 ₩2,250 │
│  09:30 틱톡 · 참음 ✅       │
│                             │
│      [홈]  [통계]            │
└─────────────────────────────┘
```

---

## 5. Supabase DB 스키마

```sql
-- 데모 유저 (간소화)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 차단 세션
CREATE TABLE block_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  profile_name TEXT NOT NULL, -- "공부 모드" 등
  blocked_apps TEXT[] NOT NULL, -- ["인스타그램", "유튜브"]
  barrier_type TEXT NOT NULL, -- easy, medium, hardcore
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- 해제 시도
CREATE TABLE unlock_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES block_sessions(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- resist, bench, penalty_math, penalty_typing, penalty_wait, penalty_fine, penalty_guardian
  succeeded BOOLEAN DEFAULT false,
  fine_amount INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

-- 감시자 승인 요청
CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES block_sessions(id),
  user_id UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  guardian_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, denied
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 일별 통계
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  total_walk_minutes INTEGER DEFAULT 0,
  total_resists INTEGER DEFAULT 0,
  total_breaks INTEGER DEFAULT 0,
  total_fines INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);
```

---

## 6. 캐릭터 에셋

`public/characters/` 에 투명 배경 PNG로 배치:

```
public/characters/
├── char-front.png        # 정면 (인터럽트, 응시)
├── char-side.png         # 옆모습
├── char-back-walk.png    # 뒷모습 다리 벌림 (걷기 프레임 A)
├── char-back-stand.png   # 뒷모습 다리 모음 (걷기 프레임 B)
├── effect-surprise.png   # 반짝 이펙트 (오버레이용)
├── effect-blush.png      # 홍조 (오버레이용)
├── effect-rain.png       # 빗금 (오버레이용)
├── effect-tear.png       # 눈물 (오버레이용)
└── footprints.png        # 발자국 패턴
```

- 걷기 애니메이션: char-back-walk ↔ char-back-stand, 600ms 간격 반복
- 이펙트는 char-front.png 위에 absolute position으로 오버레이
- 캐릭터가 없는 경우 placeholder로 대체 가능 (나중에 에셋 교체)

---

## 7. 데모용 시간 가속

실제 시간으로 체험하면 2시간을 기다려야 하므로 데모 가속 적용:

| 실제 | 데모 | 비율 |
|------|------|------|
| 1시간 | 1분 | 60배 |
| 2시간 | 2분 | 60배 |
| 5분 (벤치) | 15초 | 20배 |
| 3분 (대기 벌칙) | 15초 | 12배 |

화면 하단에 작은 토글: "⚡ 데모 가속 ON/OFF" — 교수님이 원하면 실시간으로도 볼 수 있도록.

---

## 8. 프로젝트 구조

```
swai_leashmvp/
├── app/
│   ├── layout.tsx                 ← 전역 레이아웃 (Pretendard 폰트)
│   ├── page.tsx                   ← 랜딩 페이지
│   ├── demo/
│   │   ├── layout.tsx             ← iPhone 프레임 래퍼 (데스크톱) / 풀스크린 (모바일)
│   │   ├── page.tsx               ← 홈 대시보드
│   │   ├── walk/
│   │   │   └── page.tsx           ← 산책 상태 화면
│   │   ├── interrupt/
│   │   │   └── page.tsx           ← 인터럽트 화면
│   │   ├── barrier/
│   │   │   ├── math/page.tsx
│   │   │   ├── typing/page.tsx
│   │   │   ├── wait/page.tsx
│   │   │   ├── fine/page.tsx
│   │   │   └── guardian/page.tsx
│   │   ├── bench/
│   │   │   └── page.tsx           ← 벤치 5분 타이머
│   │   ├── stats/
│   │   │   └── page.tsx           ← 통계 탭
│   │   └── transition/
│   │       └── page.tsx           ← 전환 화면 (참기/벤치/상처 공용)
│   └── approve/
│       └── [token]/
│           └── page.tsx           ← 감시자 승인 웹페이지 (iPhone 프레임 밖)
│
├── components/
│   ├── PhoneFrame.tsx             ← iPhone 목업 프레임 (데스크톱 전용)
│   ├── StatusBar.tsx              ← iOS 상태바 (시간, 와이파이, 배터리)
│   ├── TabBar.tsx                 ← 하단 탭바 (홈, 통계)
│   ├── TimerCard.tsx              ← 투톤 타이머 카드
│   ├── Character.tsx              ← 캐릭터 렌더러 (상태별 이미지 + 이펙트 + 걷기 애니메이션)
│   ├── TransitionScreen.tsx       ← 2.5초 전환 화면 공용 컴포넌트
│   ├── GlassCard.tsx              ← 글래스모피즘 카드
│   └── AppIconRow.tsx             ← 묶인 앱 아이콘 행 + 아코디언
│
├── lib/
│   ├── supabase.ts                ← Supabase 클라이언트
│   ├── store.ts                   ← Zustand 스토어 (세션, 타이머, 벌칙 상태)
│   ├── timer.ts                   ← 타이머 유틸 (가속 비율 포함)
│   ├── escalation.ts              ← 벌금 에스컬레이션 계산
│   └── math-generator.ts          ← 수학 문제 랜덤 생성
│
├── public/
│   └── characters/                ← 캐릭터 에셋 (PNG)
│
├── .env.local
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## 9. 핵심 구현 우선순위

교수님 채점에 영향이 큰 순서:

1. **iPhone 프레임 + 반응형** — 첫인상. 데스크톱에서 폰 목업이 보여야 함
2. **산책 상태 + 타이머** — 핵심 UX. 투톤 카드 + 캐릭터 걷기
3. **인터럽트 플로우** — 차별점. 3버튼 → 전환 화면 → 벌칙/참기/벤치
4. **수학 문제 벌칙** — 실제 체험 가능한 벌칙 최소 1종
5. **감시자 승인** — Supabase Realtime 기술 시연 (가산점)
6. **통계 탭** — 대시보드. 데이터 시각화
7. **벌금 에스컬레이션** — 시도할수록 금액 증가하는 로직
8. **벤치 (팝콘 타임)** — 있으면 좋지만 시간 없으면 패스 가능

---

## 10. README.md 내용

```markdown
# 🔗 Leash — 스마트폰에 목줄을 채워라

의지박약 인간을 위한 하드코어 스크린타임 앱 · 웹 체험 데모

## 실행 방법

\`\`\`bash
git clone https://github.com/chynl63/swai_leashmvp.git
cd swai_leashmvp
npm install
\`\`\`

### 환경변수 설정
\`.env.local\` 파일 생성:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://edcoazlosntzjmjthqpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

### 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`
http://localhost:3000 접속

### 배포
Vercel에 연결하여 자동 배포

## 기술 스택
- Next.js 15 + TypeScript
- Tailwind CSS v4
- Supabase (Auth, PostgreSQL, Realtime)
- Framer Motion
- Vercel

## 체험 가이드
1. "사용해보기" 클릭
2. 차단 프로필 선택 → 시간 설정 → "목줄 채우기"
3. 산책 화면에서 "차단된 앱 열어보기" 클릭
4. 인터럽트 화면에서 벌칙/벤치/참기 체험
5. 감시자 승인: 링크를 새 탭에서 열어 승인 테스트
```
