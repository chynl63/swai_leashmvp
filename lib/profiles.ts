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

export const BARRIER_LABEL: Record<BarrierType, { label: string; emoji: string }> = {
  math: { label: "수학 문제", emoji: "🧮" },
  typing: { label: "타이핑 과제", emoji: "⌨️" },
  wait: { label: "대기 시간", emoji: "⏳" },
  guardian: { label: "감시자 승인", emoji: "📩" },
  fine: { label: "예외 사용권", emoji: "💰" },
};

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
