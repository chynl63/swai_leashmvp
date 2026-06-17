/** 차단 프로필 + 장벽 시퀀스 + 앱 목록 (spec §4.2, design memory: 장벽=설정 시점 확정) */

export type BarrierType = "math" | "typing" | "wait" | "guardian" | "fine";
export type BarrierLevel = "easy" | "medium" | "hardcore";

export type Profile = {
  key: string;
  name: string; // "공부 모드"
  level: BarrierLevel;
  badge: string; // 🟡🟠🔴
  /** 줄 끊기 시 순차 수행할 벌칙 (설정 시점 확정) */
  sequence: BarrierType[];
  summary: string; // 인터럽트에서 표시할 한 줄
};

export const PROFILES: Profile[] = [
  {
    key: "study",
    name: "공부 모드",
    level: "easy",
    badge: "🟡",
    sequence: ["math"],
    summary: "수학 문제 5개 연속",
  },
  {
    key: "sleep",
    name: "취침 모드",
    level: "medium",
    badge: "🟠",
    sequence: ["typing", "wait"],
    summary: "타이핑 과제 → 3분 대기",
  },
  {
    key: "hardcore",
    name: "하드코어",
    level: "hardcore",
    badge: "🔴",
    sequence: ["guardian", "fine", "wait"],
    summary: "감시자 승인 → 벌금 → 5분 대기",
  },
];

export function profileByKey(key: string): Profile {
  return PROFILES.find((p) => p.key === key) ?? PROFILES[0];
}

export const BARRIER_LABEL: Record<
  BarrierType,
  { label: string; emoji: string; short: string }
> = {
  math: { label: "수학 문제", emoji: "🧮", short: "수학 5문제" },
  typing: { label: "타이핑 과제", emoji: "⌨️", short: "반성문 타이핑" },
  wait: { label: "대기 시간", emoji: "⏳", short: "3분 대기" },
  guardian: { label: "감시자 승인", emoji: "📩", short: "감시자 승인" },
  fine: { label: "예외 사용권", emoji: "💰", short: "벌금 결제" },
};

/** 벌칙 정렬 기준(수행 순서). 능동 과제 → 결제/승인 → 마지막 대기(쿨다운). */
export const CANON_ORDER: BarrierType[] = [
  "math",
  "typing",
  "fine",
  "guardian",
  "wait",
];

/** 선택된 벌칙들을 수행 순서대로 정렬 */
export function sortBarriers(barriers: BarrierType[]): BarrierType[] {
  return CANON_ORDER.filter((b) => barriers.includes(b));
}

/** 인터럽트/설정에서 보여줄 한 줄 요약 */
export function summaryFor(barriers: BarrierType[]): string {
  if (barriers.length === 0) return "벌칙 없음 (바로 해제)";
  return sortBarriers(barriers)
    .map((b) => BARRIER_LABEL[b].label)
    .join(" → ");
}

/**
 * 검증 실험용 고정 벌칙 세트 (사용자 선택 비활성 — 마찰을 통제변수로 고정).
 * 바꾸려면 이 배열만 수정. 너무 쉬우면 포기 신호가 안 나오니 '적당히 귀찮게'.
 */
export const FIXED_BARRIERS: BarrierType[] = ["math", "wait"];
export const FIXED_GROUP_NAME = "집중 모드";

/** 차단 시간 선택지 (분) */
export const DURATIONS = [60, 120, 240, 360, 480] as const;

/** 시뮬레이션용 앱 목록 */
export type DemoApp = {
  name: string;
  short: string; // 아이콘 글자
  color: string;
};

export const APPS: DemoApp[] = [
  { name: "인스타그램", short: "📷", color: "#E1306C" },
  { name: "유튜브", short: "▶", color: "#FF0000" },
  { name: "틱톡", short: "♪", color: "#000000" },
  { name: "X (트위터)", short: "𝕏", color: "#1D1D1D" },
  { name: "릴스", short: "🎬", color: "#833AB4" },
  { name: "쿠팡", short: "🛒", color: "#E94E2B" },
];
