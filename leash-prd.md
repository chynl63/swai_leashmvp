# Leash — 제품 기획서 (PRD)

> 내 폰에 목줄을 채우다
> 의지박약 인간을 위한 하드코어 스크린타임 앱

## 0. 브랜딩

### 앱 이름
- 영문: **Leash**
- 한국어 표기: **리쉬**
- 앱스토어 서브타이틀: "스마트폰에 목줄을 채워라"

### 브랜드 스토리
스마트폰이 나를 끌고 다니는 게 아니라, 내가 폰에 목줄을 채운다. 주인과 반려동물의 관계를 역전시키는 앱. "Who's walking who?" 도발적이고 자조적인 유머를 기반으로, 처벌과 사회적 압박이라는 실질적 장벽을 세운다.

### 핵심 메타포: 산책
차단을 "폰의 산책"으로 시각화한다. FocusFlight가 집중 시간을 비행으로 풀었듯, Leash는 차단 시간을 산책으로 푼다.

- **차단 시작** = 목줄 채우고 산책 출발
- **차단 중** = 폰이 얌전히 산책 중. 누적 산책 시간이 곧 통계 (거리 환산 없음 — km 표시는 v1.x "산책 코스" 시스템 검토 시 재논의)
- **해제 시도** = 줄 당기기 (느슨한 줄 → 팽팽한 줄로 비주얼 변화)
- **장벽 뚫기** = 줄 끊기
- **차단 완료** = 산책 끝, 귀가
- 누적 스탯: "이번 주 32시간 산책", "줄 끊은 횟수 3회"
- 산책 언어 통일: 경과 = "1:46:18째 걷는 중", 완료 = "산책 끝, 6시간 완주", 해제 = "산책 중단"
- 주의: 캐릭터는 미니멀/드라이하게. 귀여움이 아닌 자조적 유머 톤 유지 (도파민배리어식 캐릭터 수집과 차별화)

### 캐릭터 에셋 (목줄 찬 폰)
둥근 사각형 폰 + 점 눈 + 막대 다리, 골든 오커 목줄이 몸통을 가로질러 감김. 무표정(점 눈 + 일자 입)이 핵심 — 감정은 자세와 시선으로만 표현.

| 뷰 | 프레임 | 용도 |
|---|---|---|
| 정면 (돌아봄) | 정지 1프레임 | 인터럽트 화면 ("...열게?" 침묵의 심판) |
| 옆모습 | 2프레임 (다리 벌림/모음 반복) | 온보딩, 산책 완료 연출 |
| 뒷모습 | 3프레임 (1-2-3-2 핑퐁 루프) | 홈 타이머 카드 (경계선 위에서 걷기) |

- 걸음 템포 600~800ms (느긋하게)
- 구현: Lottie 불필요, Reanimated 이미지 스왑으로 충분
- 사이즈 2단계: 풀(표정 있음) / 미니 24px(눈만, 타이머 카드용)
- 산책 중(옆모습/뒷모습) 줄은 진행 방향 반대쪽으로 흘러야 함

### 응시 감지 (산책 상태 화면)
산책 상태 화면을 멍하니 보고 있으면 캐릭터가 지적한다. 정밀 타이머를 유지하면서 "타이머 구경" 행동만 교정하는 장치.

| 화면 응시 시간 | 캐릭터 동작 | 대사 |
|---|---|---|
| 30초 | 걸음 멈춤, 정면 돌아봄 | "왜 아직 쳐다봐?" |
| 1분 30초 | 정면 응시 유지 | "...산책 끝나면 부를게" |
| 3분+ | 응시만, 대사 없음 | (침묵) |

- 앱이 백그라운드 갔다 오면 타이머 리셋, 캐릭터는 다시 걷기 재개
- 구현: 화면 진입 시 인액티비티 타이머 + 단계별 프레임 스왑/말풍선 토글 (Reanimated)

### 홈 타이머 카드 (산책로)
투톤 카드의 색 경계선 = 폰의 현재 위치. 오커 영역 = 걸어온 길(옅은 발자국 패턴), 다크 영역 = 남은 길. 경계선 위에 미니 캐릭터(뒷모습)가 걷고, 시간이 흐르면 캐릭터가 오른쪽으로 이동. 타이머 숫자에는 옅은 text-shadow를 깔아 경계선이 획을 지날 때 가독성 확보.

### UX 톤 & 인터럽트 메시지
- "줄 안으로 돌아와"
- "산책 끝났어"
- "오늘 3번째 줄 끊으려는 거야?"
- "진짜 풀 거야? 💸"
- "엄마한테 문자 갑니다"
> 
> 작성일: 2026-05-31
> 상태: MVP 기획 확정

---

## 1. 제품 개요

### 1.1 문제 정의

기존 스크린타임(iOS 기본, 도파민배리어 등)은 사용자가 직접 해제할 수 있어 의지가 약한 사람에게는 효과가 없다. 해제 과정에 **실질적인 고통**(돈, 사회적 압박, 시간 낭비)을 부여하여 심리적 장벽을 만들어야 한다.

### 1.2 핵심 가치

- **처벌 기반 동기부여**: 보상(캐릭터, 포인트)이 아닌 처벌(벌금, 망신)로 행동을 억제
- **에스컬레이션**: 해제 시도가 반복될수록 장벽이 강화됨
- **소셜 프레셔**: 혼자가 아닌 감시자의 시선이 존재

### 1.3 경쟁 앱 대비 차별점

| 항목 | 도파민배리어 | Leash (우리 앱) |
|------|------------|------------------------|
| 톤 | 귀엽고 친근 (캐릭터 수집) | 단호하고 직설적 (하드코어) |
| 소셜 기능 | 전화 걸기 (검증 없음) | 감시자 실제 승인 필수 (문자/카톡 링크) |
| 벌금 | 고정 ($0.99 / $9.99) | 커스텀 + 횟수 누적 시 자동 인상 |
| 장벽 조합 | 단일 선택 | 복수 장벽 동시 적용 가능 |
| 통계 | 약함 | 벌금 누적 대시보드, 상세 리포트 |
| 위젯 | 타이머 표시용 (수동적) | 원탭 차단 실행 (능동적) |

---

## 2. 타겟 유저

- 대학생/취준생: 공부해야 하는데 SNS를 끊지 못하는 사람
- 직장인: 업무 중 유튜브/인스타 습관이 있는 사람
- 공통점: 기존 스크린타임을 써봤지만 매번 스스로 해제하는 "의지박약" 유저

---

## 3. MVP 기능 범위

### 3.1 장벽 시스템 (Barrier)

#### 3.1.1 과제형 장벽
- **수학 문제**: 3자리 수 곱셈/나눗셈, 난이도 조절 가능, 연속 정답 필요 (예: 5문제 연속)
- **타이핑 과제**: 지정된 긴 문장을 오타 없이 입력 (예: "나는 지금 시간을 낭비하고 있으며, 이 앱을 여는 것이 부끄럽습니다")
- **대기 시간**: 카운트다운 (1분 / 3분 / 5분 / 10분), 앱을 떠나면 리셋
- **산책 (걸음 수, 프리미엄 시그니처)**: "줄을 끊고 싶으면 네가 대신 산책해" — CoreMotion CMPedometer로 실시간 걸음 수 카운트 (예: 300걸음), 인터럽트 화면에 실시간 카운터 표시. 유일하게 물리적 기상을 강제하는 벌칙. HealthKit 불필요, 동작 인식 권한만 필요

#### 3.1.2 벌금 결제 장벽
- 사전 설정 금액 또는 커스텀 금액
- **에스컬레이션 공식**: `baseFine × 1.5^(todayAttempts)`
  - 1회: ₩1,500
  - 2회: ₩2,250
  - 3회: ₩3,375
  - 4회: ₩5,063
- StoreKit 2 소모성 아이템으로 구현
- 앱스토어 심사용 프레이밍: "예외 사용권 구매" (벌금이라는 표현 사용 금지)

#### 3.1.3 소셜 프레셔 장벽 (감시자 승인)

핵심 차별점. 도파민배리어의 "전화 걸기"와 달리, 감시자가 **실제로 승인해야만** 해제된다.

**플로우**
1. 해제 시도 → 앱이 1회용 승인 토큰 생성 (10분 만료, 1회 사용)
2. 문자(MVP) 또는 카카오톡(v1.1)으로 감시자에게 전송: "채윤님이 인스타그램을 열려고 합니다 → [승인하기]"
3. 감시자가 링크 탭 → 승인 웹페이지 (앱 설치 불필요)
4. 승인/거부 → Supabase Realtime으로 앱에 실시간 전달
5. 승인 시 차단 해제, 거부 시 유지

**채널**
- 문자 (MVP): MessageUI(expo-sms)로 미리 작성된 메시지 + 승인 링크. 유저가 전송 버튼만 누르면 됨
- 카카오톡 (v1.1): 카카오톡 공유 SDK, 버튼형 템플릿 메시지. 알림톡(비즈메시지)은 사업자등록/과금 필요로 보류
- 감시자 푸시 (v1.1): 감시자가 앱 설치한 경우 FCM 푸시로 인앱 승인

**셀프 승인 방지**
- 감시자 등록 시 초대 링크 전송 → 감시자가 본인 기기 브라우저에서 1회 등록 (브라우저에 신뢰 토큰 저장)
- 승인 링크는 등록된 브라우저에서만 동작
- 유저 본인 기기에서 승인 링크를 연 시도는 기록에 남김 ("셀프 승인 시도 1회" — 수치심 장치로 활용)

#### 3.1.4 장벽 조합
- 장벽은 **차단 설정 시점에 확정**된다. 해제 시점에는 선택 불가 — 설정된 벌칙을 그대로 수행해야만 해제 가능
- 사용자가 장벽을 **복수 선택** 가능 (예: 수학 문제 + 문자 전송), 복수일 경우 순차 진행
- 프리셋 제공:
  - 🟡 약함: 수학 문제 3개
  - 🟠 보통: 타이핑 + 3분 대기
  - 🔴 하드코어: 문자 전송 + 벌금 결제 + 5분 대기
- 차단이 활성화된 동안에는 장벽 설정 변경 불가 (변경하려면 현재 차단을 벌칙 수행으로 해제해야 함)

### 3.2 앱 차단 시스템

- iOS: FamilyControls + ManagedSettings + DeviceActivity API (iOS 16+)
- 앱 익스텐션 3개 필요:
  - `ShieldConfigurationExtension` — 차단 화면(인터럽트) 커스텀
  - `DeviceActivityMonitorExtension` — 사용 시간 모니터링
  - `ShieldActionExtension` — 차단 화면 버튼 액션
- Apple에 FamilyControls entitlement 신청 필수 (심사 1~2주)

### 3.3 감시자 시스템

#### 감시자 등록
- 연락처에서 선택 (expo-contacts)
- 등록 시 감시자에게 초대 링크 문자 전송 → 감시자가 본인 기기 브라우저에서 1회 수락 (브라우저에 신뢰 토큰 저장, 이후 승인 링크가 이 브라우저에서만 동작)

#### 감시자 참여 방식
1. **앱 미설치 감시자 (기본)**: 문자 링크 → 웹 승인 페이지. 앱 설치 불필요
2. **앱 설치 감시자 (v1.1)**: FCM 푸시 수신 + 인앱 승인/거부

### 3.4 대시보드

- 현재 차단 중인 앱 목록 + 남은 시간
- 이번 달 벌금 누적 금액
- 이번 주 "참은 횟수" vs "뚫은 횟수"
- 해제 시도 히스토리 (시간, 앱, 사용한 장벽, 성공/포기)

### 3.5 퀵 차단 위젯

앱을 열지 않고 홈화면 위젯에서 **원탭으로 차단 시작**. 차단 접근성을 극한으로 올려 리텐션 확보.

#### 위젯 종류 (MVP: Small만)

| 위젯 | 크기 | 기능 | 시기 |
|------|------|------|------|
| **퀵 차단** | Small | 시간 선택 + 차단 버튼 | MVP |
| 현재 상태 | Small | 남은 차단 시간 표시 | v1.1 |
| 대시보드 | Medium | 참은 횟수 + 벌금 + 차단 버튼 | v1.1 |
| 잠금화면 | Inline | "차단 중 · 2h 13m 남음" | v1.1 |

#### 퀵 차단 위젯 상세 (MVP)

```
┌─────────────────┐
│  🔗 Leash       │
│                 │
│    ◀  2h  ▶    │  ← 시간 조절 (1h / 2h / 4h / 8h)
│                 │
│ ┌─────────────┐ │
│ │  차단하기 🔒  │ │  ← 원탭 차단 시작
│ └─────────────┘ │
└─────────────────┘
```

#### 기술 구현
- **WidgetKit** + **App Intents** (iOS 17+, Interactive Widget)
- 버튼 탭 → App Intent 실행 → FamilyControls 차단 활성화 (앱 미실행)
- App Groups로 메인 앱과 위젯 간 차단 프로필 데이터 공유
- 위젯에서는 마지막으로 사용한 차단 프로필을 기본 적용

#### 차별점
- 도파민배리어 위젯: 타이머 표시용 (수동적)
- Leash 위젯: **원탭 차단 실행** (능동적) — 앱 열 필요 없음

### 3.6 쉼터 시스템 (팝콘 타임, 5분 사용)

산책 중간에 벤치에 앉아 쉬는 5분. 합법적 출구를 하나 둬서 "한 번 뚫었으니 다 망했다" 붕괴(what-the-hell effect)로 인한 이탈을 방지하고, 긴 차단을 겁내지 않고 걸게 만든다.

**앱 내 재화 없음** — 잔액/적립/만료/드랍 시스템을 만들지 않는다. 희소성은 규칙만으로 유지:

- **조건**: 2시간 이상 산책에서만, 산책당 **1회 고정** (길이와 무관)
- **시점**: 산책 절반 경과 후부터 사용 가능 (시작하자마자 쓰는 것 방지)
- **효과**: 차단된 앱 5분 사용 → 자동 재차단. 산책은 끝나지 않음 (줄을 끊는 게 아니라 벤치에 앉는 것)
- **연출**: 사용 중 캐릭터가 벤치에 앉아 팝콘을 먹는다 ("팝콘 타임"). 5분 종료 시 다시 일어나 걷기 시작
- **로깅**: 벤치 사용 시각/직후 행동(벌금 결제 여부)을 기록 — 추후 횟수 조정 판단의 데이터로 활용

---

## 4. 디자인 시스템

### 4.1 비주얼 방향

**Cool off-white + Light gray + Golden ochre accent + Glassmorphism**

쿨 그레이 오프화이트 배경에 글래스모피즘(frosted glass) 카드, 골든 오커 단일 포인트. FocusFlight에서 영감받은 가우시안 블러 레이어링과 섬세한 햅틱 피드백으로 프리미엄 느낌. 열품타(다크), 도파민배리어(파스텔+캐릭터) 모두와 차별화.

### 4.2.1 UI 뉘앙스 (FocusFlight 레퍼런스)

**글래스모피즘 카드**
- 카드 배경: rgba(255, 255, 255, 0.7) + backdrop-blur(20px)
- 카드 border: 0.5px solid rgba(255, 255, 255, 0.5)
- 미묘한 레이어 깊이감, 카드가 배경 위에 살짝 떠있는 느낌
- 과하지 않게, 주요 카드(대시보드, 인터럽트)에만 적용

**깊이감 & 레이어링**
- 배경: 미세한 그라디언트 또는 추상적 도형으로 블러 소스 제공
- 모달/시트: 배경 dim + 글래스 카드로 올라오는 구조
- 인터럽트 화면: 차단된 앱 아이콘이 블러 배경으로 깔림

**햅틱 피드백 (expo-haptics)**
- 차단 앱 터치 시: Heavy impact
- 장벽 선택 시: Medium impact  
- 벌금 결제 확인: Success notification
- 수학 문제 정답: Light impact
- 수학 문제 오답: Error notification (강한 진동)
- "그냥 참을래" 선택: Light impact + 긍정 효과음

**애니메이션 (Reanimated 3 + Moti)**
- 인터럽트 화면 등장: 바텀 시트 스프링 애니메이션
- 벌금 금액 표시: 숫자 카운트업 애니메이션 (slot machine 느낌)
- 진행바: 부드러운 fill 트랜지션
- 카드 전환: fade + scale(0.95 → 1.0)

**타이포그래피 위계**
- 벌금 금액 (핵심 숫자): 36px, font-weight 600, Golden ochre
- 화면 제목: 22px, font-weight 500, Primary text
- 카드 숫자: 20px, font-weight 500, Golden ochre
- 본문: 15px, font-weight 400, Primary text  
- 캡션/힌트: 13px, font-weight 400, Secondary text

### 4.2 컬러 팔레트

```
Background
- Primary:    #F7F7F8 (최상위 배경, 쿨 오프화이트)
- Secondary:  #FFFFFF (카드/컨테이너 배경)
- Tertiary:   #ECECEE (입력 필드, 비활성 영역)

Text
- Primary:    #1A1A1A (제목, 중요 텍스트)
- Secondary:  #6B6B6B (부제, 설명)
- Tertiary:   #A0A0A0 (힌트, 비활성)

Accent (Golden Ochre)
- Main:       #E8A835 (버튼, 주요 숫자, 진행바, CTA)
- Light:      #FDF3E0 (배지 배경, 하이라이트 영역)
- Dark:       #B8841A (눌림 상태, 보조 텍스트)

Semantic
- Danger:     #E24B4A (벌금 경고, 에스컬레이션 강조)
- Success:    #4CAF50 (참기 성공, 완료)
- Info:       #5B9BD5 (안내, 링크)

Border
- Default:    #E5E5E8 (카드 테두리, 구분선)
- Emphasis:   #D5D5D8 (호버, 활성 상태)
```

### 4.3 타이포그래피

- 앱 내 기본 폰트: Pretendard (한국어 최적화, 무료)
- 숫자/벌금 강조: Pretendard Bold, 28~36px
- 본문: Pretendard Regular, 15~16px
- 캡션: Pretendard Regular, 12~13px

### 4.4 컴포넌트 스타일

- 모서리: 16px radius (글래스 카드), 12px (일반 카드), 8px (버튼, 입력)
- 글래스 카드 (주요): rgba(255,255,255,0.7) 배경, backdrop-blur(20px), 0.5px solid rgba(255,255,255,0.5) border, 16px radius
- 일반 카드 (리스트): #FFFFFF 배경, #E5E5E8 border 0.5px, 12px radius
- 버튼 (Primary): #E8A835 배경, #FFFFFF 텍스트, 8px radius
- 버튼 (Secondary): rgba(255,255,255,0.5) 배경, backdrop-blur(12px), #E8A835 텍스트
- 버튼 (Ghost): transparent 배경, border 없음, #6B6B6B 텍스트 ("그냥 참을래" 등)
- 진행바: #ECECEE 트랙, #E8A835 fill, 4px height, rounded
- 구분선: #E5E5E8, 0.5px

### 4.5 UX 톤

- 메시지 톤: 직설적이고 단호한 한국어, 목줄 비유 활용
  - (O) "줄 안으로 돌아와"
  - (O) "오늘 3번째 줄 끊으려는 거야. 벌금 ₩3,375"
  - (O) "엄마한테 문자 갑니다"
  - (O) "산책 끝났어"
  - (X) "잘하고 있어요! 조금만 더 참아보세요~"
- 숫자 강조: 벌금 금액, 시도 횟수를 큰 폰트로 표시
- 햅틱 피드백: 차단 시도 시 강한 진동 (expo-haptics)

---

## 5. 기술 스택

### 5.1 프론트엔드 (모바일 앱)

| 영역 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Expo 56 + React Native 0.85 + React 19 | Custom Dev Client (Expo Go 불가) |
| 언어 | TypeScript | strict mode |
| 라우팅 | Expo Router (SDK 56) | 파일 기반 |
| 서버 상태 | TanStack React Query v5 | Supabase 데이터 |
| 클라이언트 상태 | Zustand v5 | 차단 상태, 장벽 진행도 |
| 스타일 | NativeWind v4 | Tailwind CSS for RN |
| 애니메이션 | React Native Reanimated v4 + Moti | 인터럽트 화면 효과 |
| 폼 | React Hook Form + Zod | 설정 입력 검증 |
| 인앱결제 | react-native-iap v14 | 소모성 아이템 (벌금) |
| 문자 | expo-sms | 감시자 문자 전송 |
| 연락처 | expo-contacts | 감시자 선택 |
| 햅틱 | expo-haptics | 차단 시 진동 |
| 푸시 알림 | expo-notifications + FCM | 감시자 알림 |
| 빌드 | EAS Build + EAS Submit | 앱스토어 배포 |

### 5.2 네이티브 모듈 (Swift)

FamilyControls API는 React Native에서 직접 호출 불가 → Custom Expo Module로 브릿지

```
modules/
├── leash/
│   ├── ios/
│   │   ├── LeashModule.swift      ← 메인 브릿지
│   │   ├── FamilyControlsManager.swift    ← 앱 선택, 차단 설정
│   │   └── ShieldManager.swift            ← 차단 화면 관리
│   └── index.ts                           ← JS 인터페이스
```

### 5.3 iOS 앱 익스텐션 (순수 Swift)

```
extensions/
├── ShieldConfigExtension/          ← 차단 화면 UI 커스텀
├── DeviceActivityMonitorExtension/ ← 사용 시간 모니터링 + 콜백
├── ShieldActionExtension/          ← 차단 화면 버튼 액션 처리
└── QuickBlockWidget/               ← 홈화면 원탭 차단 위젯 (WidgetKit + App Intents)
```

- Xcode에서 타겟 수동 추가 필요
- EAS Build 설정에서 추가 타겟 포함하도록 app.json 설정
- App Groups로 메인 앱과 익스텐션 간 데이터 공유

### 5.4 백엔드

| 영역 | 기술 | 비고 |
|------|------|------|
| DB | Supabase PostgreSQL | 관계형 데이터 |
| Auth | Supabase Auth | Apple Sign In |
| API | Supabase 자동 생성 REST | CRUD |
| 실시간 | Supabase Realtime | 감시자 승인/거부 |
| 서버 함수 | Supabase Edge Functions (Deno) | 벌금 계산, 영수증 검증 |
| 스토리지 | Supabase Storage | 프로필 이미지 등 |
| 푸시 | Firebase Cloud Messaging | 감시자 푸시 전송만 |
| 분석 | Supabase + 자체 이벤트 테이블 | 사용 통계 |

### 5.5 DB 스키마

```sql
-- 유저
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT,
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 감시자 관계
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  guardian_user_id UUID REFERENCES users(id) NULL, -- 앱 설치한 감시자
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  fcm_token TEXT, -- 앱 설치 감시자의 FCM 토큰
  has_app BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending', -- pending, active, declined
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 승인 요청 (소셜 프레셔 장벽)
CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  guardian_id UUID REFERENCES guardians(id),
  attempt_id UUID REFERENCES unlock_attempts(id),
  token TEXT UNIQUE NOT NULL, -- 1회용 승인 토큰
  status TEXT DEFAULT 'pending', -- pending, approved, denied, expired
  self_approval_attempted BOOLEAN DEFAULT false, -- 본인 기기에서 링크 연 기록
  expires_at TIMESTAMPTZ NOT NULL, -- 생성 후 10분
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 차단 프로필
CREATE TABLE block_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL, -- "공부 모드", "취침 모드" 등
  barrier_level TEXT DEFAULT 'medium', -- easy, medium, hardcore
  is_active BOOLEAN DEFAULT false,
  schedule_start TIME, -- 예약 시작 시간
  schedule_end TIME, -- 예약 종료 시간
  schedule_days INTEGER[], -- 0=일, 1=월, ..., 6=토
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 차단 앱 목록
CREATE TABLE blocked_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES block_profiles(id) ON DELETE CASCADE,
  app_token TEXT NOT NULL, -- FamilyControls app token
  app_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 장벽 설정
CREATE TABLE barrier_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES block_profiles(id) ON DELETE CASCADE,
  barrier_type TEXT NOT NULL, -- math, typing, wait, social, payment
  config JSONB DEFAULT '{}',
  -- math: { "difficulty": "hard", "count": 5 }
  -- typing: { "text": "나는 시간을 낭비하고 있습니다", "allow_typo": false }
  -- wait: { "duration_seconds": 300 }
  -- social: { "mode": "random", "guardian_id": null }
  -- payment: { "base_amount": 1500, "escalation_rate": 1.5 }
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 해제 시도 기록
CREATE TABLE unlock_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  profile_id UUID REFERENCES block_profiles(id),
  app_name TEXT,
  barrier_type TEXT NOT NULL,
  succeeded BOOLEAN DEFAULT false, -- true=해제 완료, false=포기
  fine_amount INTEGER DEFAULT 0, -- 결제한 벌금 (원)
  duration_seconds INTEGER, -- 장벽 소요 시간
  attempted_at TIMESTAMPTZ DEFAULT now()
);

-- 벌금 결제 기록
CREATE TABLE fine_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  attempt_id UUID REFERENCES unlock_attempts(id),
  amount INTEGER NOT NULL, -- 원
  product_id TEXT, -- StoreKit product ID
  transaction_id TEXT, -- Apple transaction ID
  status TEXT DEFAULT 'completed', -- completed, refunded
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 일별 통계 (집계용)
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  total_blocks INTEGER DEFAULT 0, -- 차단된 횟수
  total_unlocks INTEGER DEFAULT 0, -- 해제한 횟수
  total_resisted INTEGER DEFAULT 0, -- 참은 횟수
  total_fines INTEGER DEFAULT 0, -- 벌금 합계 (원)
  UNIQUE(user_id, date)
);
```

### 5.6 Edge Functions

```
supabase/functions/
├── calculate-fine/       ← 에스컬레이션 벌금 계산
├── create-approval/      ← 승인 토큰 생성 + 만료 관리
├── approve-unlock/       ← 감시자 승인 처리 (웹페이지 + 브라우저 토큰 검증)
├── verify-receipt/       ← Apple 영수증 검증
└── aggregate-stats/      ← 일별 통계 집계 (cron)
```

승인 웹페이지는 Supabase Edge Function이 직접 HTML 응답하거나, 정적 호스팅(Vercel) + Edge Function API 조합으로 구현.

---

## 6. 프로젝트 구조

```
leash/
├── app/                              ← Expo Router
│   ├── (tabs)/
│   │   ├── index.tsx                 ← 홈 대시보드
│   │   ├── settings.tsx              ← 차단 프로필 관리
│   │   └── stats.tsx                 ← 통계/벌금 내역
│   ├── onboarding/
│   │   ├── index.tsx                 ← 인트로 (3장 슬라이드)
│   │   ├── permissions.tsx           ← FamilyControls 권한
│   │   └── guardian-setup.tsx        ← 감시자 등록
│   ├── profile/
│   │   ├── [id].tsx                  ← 프로필 상세/편집
│   │   ├── select-apps.tsx           ← 차단 앱 선택
│   │   └── select-barriers.tsx       ← 장벽 설정
│   ├── barrier/
│   │   ├── math.tsx                  ← 수학 문제 화면
│   │   ├── typing.tsx                ← 타이핑 과제 화면
│   │   ├── wait.tsx                  ← 대기 카운트다운
│   │   ├── social.tsx                ← 문자 전송 확인
│   │   └── payment.tsx               ← 벌금 결제 화면
│   ├── guardian/
│   │   ├── index.tsx                 ← 감시자용 홈
│   │   ├── approve.tsx               ← 승인/거부 화면
│   │   └── invite.tsx                ← 초대 링크 생성
│   ├── interrupt.tsx                 ← 인터럽트 풀스크린
│   └── _layout.tsx
│
├── modules/                          ← Custom Expo Modules
│   └── leash/
│       ├── ios/
│       │   ├── LeashModule.swift
│       │   ├── FamilyControlsManager.swift
│       │   └── ShieldManager.swift
│       └── index.ts
│
├── extensions/                       ← iOS App Extensions (순수 Swift)
│   ├── ShieldConfigExtension/
│   ├── DeviceActivityMonitorExtension/
│   ├── ShieldActionExtension/
│   └── QuickBlockWidget/             ← WidgetKit + App Intents
│
├── src/
│   ├── api/
│   │   ├── supabase.ts               ← Supabase 클라이언트 설정
│   │   ├── queries/                   ← React Query hooks
│   │   │   ├── useProfile.ts
│   │   │   ├── useUnlockAttempts.ts
│   │   │   ├── useFines.ts
│   │   │   ├── useGuardians.ts
│   │   │   └── useDailyStats.ts
│   │   └── mutations/
│   │       ├── useRecordAttempt.ts
│   │       ├── useProcessFine.ts
│   │       ├── useUpdateProfile.ts
│   │       └── useApproveUnlock.ts
│   ├── stores/
│   │   ├── useBarrierStore.ts         ← 현재 장벽 진행 상태
│   │   ├── useBlockingStore.ts        ← 차단 활성화 상태
│   │   └── useOnboardingStore.ts      ← 온보딩 완료 여부
│   ├── hooks/
│   │   ├── useEscalation.ts           ← 벌금 에스컬레이션 계산
│   │   ├── useBarrierFlow.ts          ← 장벽 순차 진행 로직
│   │   └── useGuardianNotify.ts       ← 감시자 알림 발송
│   ├── components/
│   │   ├── ui/                        ← 공통 (Button, Card, Modal 등)
│   │   ├── barriers/                  ← 장벽 UI 컴포넌트
│   │   │   ├── MathProblem.tsx
│   │   │   ├── TypingChallenge.tsx
│   │   │   ├── WaitTimer.tsx
│   │   │   └── FinePayment.tsx
│   │   └── dashboard/                 ← 대시보드 위젯
│   │       ├── ActiveBlocks.tsx
│   │       ├── FineCounter.tsx
│   │       └── WeeklyChart.tsx
│   ├── constants/
│   │   ├── colors.ts                  ← 디자인 팔레트
│   │   ├── barriers.ts                ← 프리셋 설정
│   │   └── strings.ts                 ← 한국어 문자열
│   ├── types/
│   │   ├── database.ts                ← Supabase 타입 (자동 생성)
│   │   ├── barrier.ts
│   │   └── guardian.ts
│   └── utils/
│       ├── math-generator.ts          ← 수학 문제 생성
│       ├── escalation.ts              ← 벌금 계산 로직
│       └── format.ts                  ← 금액/시간 포맷
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── calculate-fine/index.ts
│   │   ├── notify-guardian/index.ts
│   │   ├── verify-receipt/index.ts
│   │   ├── approve-unlock/index.ts
│   │   └── aggregate-stats/index.ts
│   └── seed.sql
│
├── assets/
│   └── fonts/
│       └── Pretendard/
│
├── app.json
├── eas.json
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 7. 핵심 화면 상세

### 7.1 온보딩 (3장)

1. "이 앱은 당신을 괴롭히기 위해 존재합니다" — 앱 컨셉 소개
2. FamilyControls 권한 요청 — 반드시 허용해야 앱 사용 가능
3. 감시자 등록 — 최소 1명 (나중에 건너뛰기 가능하지만 권장)

### 7.2 홈 대시보드

```
┌─────────────────────────────┐
│ Leash                 [설정] │
│                             │
│ ┌─────────┐ ┌─────────────┐ │
│ │ 참은 횟수 │ │ 뚫은 횟수    │ │
│ │   12회   │ │    3회      │ │
│ └─────────┘ └─────────────┘ │
│                             │
│ 이번 달 벌금                 │
│ ₩ 23,625                   │
│ ████████░░░░ 65% 목표 대비   │
│                             │
│ ─── 차단 중 ───             │
│ 📱 인스타그램  2h 30m 남음   │
│ 📱 유튜브     2h 30m 남음    │
│ 📱 틱톡      2h 30m 남음    │
│                             │
│     [+ 차단 프로필 추가]      │
└─────────────────────────────┘
```

### 7.3 인터럽트 플로우 (핵심 UX)

#### iOS 제약 전제
차단된 앱(인스타 등)을 열면 뜨는 건 **Shield(시스템 차단 화면)**이지 Leash 앱이 아니다. Shield는 ShieldConfiguration 익스텐션이 그리며, 커스텀 범위가 제한적(배경색/아이콘/제목/부제목/버튼 최대 2개, 텍스트만). 캐릭터 애니메이션, 다중 버튼, 전환 연출은 **Leash 앱 안에서만 가능**.

#### 전체 플로우

```
차단된 앱 탭
  → [Shield 화면] (시스템)
      캐릭터 정적 이미지 + "산책 중이에요"
      벤치 가능 상태면 부제목에 "🍿 벤치 사용 가능" 표시
      ├ 버튼① "그냥 참을래" → 앱 닫힘. 끝. (로컬 알림: "잘 참았어요")
      └ 버튼② "Leash에서 해제하기" → 로컬 알림 → Leash 앱 열림
           → [인터럽트 화면] (Leash 앱 내부, 풀 커스텀 UI)
               ├ A. 벤치 (5분 사용)
               ├ B. 벌칙 (강제 종료)
               └ C. 참기 (산책 계속)
```

#### A. 벤치 경로 (5분 사용)
```
"딱 5분만 사용하기" 탭
  → 전환 화면: "딱 5분만 드릴게요! 더는 없어용~" (2.5초, 스킵 불가)
  → 차단 임시 해제 (ManagedSettingsStore 해제 + DeviceActivity 5분 스케줄)
  → 유저가 직접 인스타로 전환 (iOS는 코드로 타 앱 실행 불가)
  → 5분간 사용 (Live Activity 또는 로컬 푸시 1분 전 예고)
  → 5분 종료 → Shield 자동 재차단 (벤치 종료 variant: "시간이 다 됐어요 주인님!")
  → Shield에서 Leash 열면 → "야호~" 화면 (2.5초) → 산책 상태 화면
```
- 벤치 사용 후 인터럽트 재진입 시 2버튼 variant (벤치 버튼 없음)
- 5분 종료 시 협상 다이얼로그 없이 즉시 재차단 (칼같은 종료 = 벤치의 신뢰)

#### B. 벌칙 경로 (강제 종료)
```
"벌칙을 수행하고 산책을 강제 종료하기" 탭
  → 벌칙 수행 화면 (수학/타이핑/대기/결제/감시자승인 — 설정 시 확정된 벌칙)
  → 벌칙 완료
  → 상처 화면: 눈물 + "그게 주인님의 뜻이라면..." (2초, 스킵 불가)
  → 차단 해제
  → 유저가 직접 인스타로 전환
```

#### C. 참기 경로
```
"앱 끄고 산책하도록 놔두기" 탭
  → 전환 화면: 홍조 + "주인님이 최고예용!" (2.5초, 스킵 불가)
  → 산책 상태 화면 복귀 (타이머 계속 진행)
```
- 참기 시 "참은 횟수 +1" 조용히 적립, 산책 완주 화면에서 회수 ("오늘 3번 참았어요")
- Shield에서 직접 참기(버튼①)한 경우 홍조 화면은 생략, 로컬 알림만

#### Shield 화면 (피그마 별도 프레임 필요, 2장)

**Shield 기본** (차단 중)
```
┌─────────────────────────────┐
│    [캐릭터 정적 이미지]       │
│                             │
│     산책 중이에요            │
│  (🍿 벤치 사용 가능 / 없음)  │
│                             │
│  [그냥 참을래]               │
│  [Leash에서 해제하기]        │
└─────────────────────────────┘
```

**Shield 벤치 종료** (5분 후 자동 재차단)
```
┌─────────────────────────────┐
│    [캐릭터 정적 이미지]       │
│                             │
│  시간이 다 됐어요 주인님!     │
│  다시 산책할 시간이에요       │
│                             │
│  [확인]                     │
└─────────────────────────────┘
```

#### 캐릭터 2채널 보이스 규칙

| 상황 | 톤 | 예시 |
|------|------|------|
| 순종 (참기/벤치/완주) | 들뜬 존댓말, 애교 허용 | "주인님이 최고예용!", "야호~" |
| 심판 (응시/시도/강제종료) | 데드팬, 애교 금지, 화내지 않음 | "한창 재밌었는데...", "(침묵)" |

잘했을 때 다정하니까 어겼을 때의 차가움이 더 아프다 — 대비가 죄책감을 증폭시키는 구조.

#### 전환 화면 타이밍 일람

| 화면 | 노출 시간 | 스킵 |
|------|---------|------|
| 참기 (홍조) | 2.5초 | 불가 |
| 벤치 진입 (드릴게요) | 2.5초 | 불가 |
| 벤치 종료 (야호) | 2.5초 | 불가 |
| 강제종료 (눈물) | 2.0초 | 불가 |

### 7.4 벌금 결제 화면

```
┌─────────────────────────────┐
│                             │
│     예외 사용권 구매          │
│                             │
│        ₩3,375               │
│                             │
│   오늘 3번째 → 1.5배 적용    │
│   기본 ₩1,500 × 1.5²        │
│                             │
│   ┌───────────────────┐     │
│   │    결제하고 열기     │     │
│   └───────────────────┘     │
│                             │
│   이번 달 누적: ₩23,625     │
│                             │
│        역시 참을래           │
│                             │
└─────────────────────────────┘
```

---

## 8. 수익 모델

| 항목 | 가격 | 유형 |
|------|------|------|
| 앱 다운로드 | 무료 | — |
| 예외 사용권 (벌금) | ₩1,500~ (에스컬레이션) | 소모성 인앱결제 |
| 프리미엄 구독 | ₩1,900/월, ₩12,900/년 | 자동갱신 구독 |

### 무료 / 프리미엄 분배

원칙: **무료로도 앱의 정체성(차단 + 벌칙 + 감시자)을 온전히 경험. 프리미엄은 강도와 깊이를 판다** — "돈 내면 풀어줄게"가 아니라 "돈 내면 더 꽉 묶어줄게".

| 기능 | 무료 | 프리미엄 |
|------|------|---------|
| 기본 벌칙 (수학/타이핑/대기) | ✅ | ✅ |
| 벌금 결제 (에스컬레이션) | ✅ (자체 수익원) | ✅ |
| 감시자 승인 | 1명 | 복수 등록 + 랜덤 지정 |
| 산책 벌칙 (걸음 수, 시그니처) | — | ✅ |
| 장벽 조합 | 단일만 | 2개+ 조합 |
| 벌칙 커스텀 (난이도/문장/벌금액) | — | ✅ |
| 통계 | 이번 주 요약 | 전체 히스토리 + 시간대 분석 |
| 산책 사운드 (백색소음) | — | ✅ |

### 금지 사항
- 프리미엄에 벌금 할인/면제 절대 금지 — 벌금 수익과 구독 수익이 서로 잠식
- 쉼터(팝콘 타임) 판매/충전 금지 — 규칙 기반 무료 제공만 (3.6 참조). 벌금(완전 해제)과의 가격 충돌 방지

### 산책 사운드 (프리미엄)
차단 중 = 집중/수면 시간이라는 맥락에 맞는 배경음. "차단 도구"에서 "집중 환경"으로 확장하여 졸업 문제(앱이 성공할수록 필요 없어짐) 대응.
- MVP: 백색소음 3~4종 (비 오는 산책, 카페 창가, 새벽 공원) — 정적 오디오 파일
- v1.1: AI 제작 집중 트랙 2~3곡 (가사 없음, 베이스 중심, 출시 전 제작하여 정적 파일로 포함. 생성 도구 유료 플랜의 상업적 이용 약관 확인 필수)

### 리커버리 알림 (졸업 대응)
앱 사용이 끊긴 유저의 스크린타임이 다시 늘면 복귀 유도: "폰 사용 시간이 다시 늘고 있어요. 산책 나갈까요?" 졸업한 유저의 재발 시점이 최대 복귀 기회.

---

## 9. 앱스토어 심사 주의사항

1. **FamilyControls entitlement**: Apple에 사전 신청 필수, 사용 목적 소명서 작성
2. **인앱결제 프레이밍**: "벌금"이 아닌 "예외 사용권" / "프리미엄 접근" 용어 사용
3. **MessageUI 사용**: 자동 전송 불가, 반드시 사용자 확인 화면(MFMessageComposeViewController) 거쳐야 함
4. **개인정보 처리방침**: 연락처 접근, 사용 패턴 수집에 대한 명시 필요
5. **App Tracking Transparency**: 추적하지 않는다면 명시, 추적한다면 ATT 팝업

---

## 10. 개발 페이즈

### Phase 1: 기반 (1~2주)
- [ ] Expo 프로젝트 초기 설정 (Custom Dev Client)
- [ ] Supabase 프로젝트 생성 + DB 마이그레이션
- [ ] 디자인 시스템 구축 (NativeWind + 컬러/타이포 토큰)
- [ ] Supabase Auth (Apple Sign In)
- [ ] 기본 라우팅 + 탭 네비게이션

### Phase 2: 앱 차단 (2~3주)
- [ ] Apple에 FamilyControls entitlement 신청
- [ ] Custom Expo Module 작성 (Swift 브릿지)
- [ ] FamilyControls 앱 피커 연동
- [ ] ShieldConfiguration Extension (차단 화면)
- [ ] DeviceActivityMonitor Extension (시간 모니터링)
- [ ] 인터럽트 화면 UI
- [ ] QuickBlockWidget (WidgetKit + App Intents, 원탭 차단)

### Phase 3: 장벽 시스템 (1~2주)
- [ ] 수학 문제 생성기 + UI
- [ ] 타이핑 과제 + 검증 로직
- [ ] 대기 타이머 (백그라운드 대응)
- [ ] 장벽 조합 + 순차 진행 플로우
- [ ] 에스컬레이션 로직

### Phase 4: 결제 + 소셜 (2주)
- [ ] react-native-iap 설정 + StoreKit 2 연동
- [ ] 소모성 아이템 등록 (App Store Connect)
- [ ] 영수증 검증 Edge Function
- [ ] expo-sms 감시자 문자 전송
- [ ] FCM 감시자 푸시 알림
- [ ] 감시자 원격 승인 (Supabase Realtime)

### Phase 5: 대시보드 + 마무리 (1~2주)
- [ ] 홈 대시보드 UI
- [ ] 통계 차트 (주간/월간)
- [ ] 벌금 내역 조회
- [ ] 온보딩 플로우
- [ ] 한국어 문자열 정리
- [ ] 앱스토어 스크린샷 + 메타데이터
- [ ] EAS Build + Submit

---

## 11. Claude Code 사용 가이드

이 문서를 Claude Code에 넘길 때 다음 순서로 작업 지시:

1. "이 PRD를 읽고 Phase 1부터 시작해줘. Expo 프로젝트 초기 설정 + Supabase 연동해줘."
2. 각 Phase 완료 후 다음 Phase로 진행
3. FamilyControls 관련 Swift 코드는 "modules/leash/ios/ 에 Custom Expo Module로 작성해줘"로 지시
4. 앱 익스텐션은 "extensions/ 폴더에 순수 Swift로 작성하고, app.json에 타겟 추가해줘"로 지시
5. Edge Function은 "supabase/functions/ 에 Deno 런타임으로 작성해줘"로 지시
