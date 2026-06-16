/**
 * 벌금 에스컬레이션 계산 (spec §4.6, PRD 3.1.2)
 * baseFine × rate^(오늘 시도 횟수)
 */

export const ESCALATION = {
  baseAmount: 1500, // ₩1,500
  rate: 1.5,
} as const;

/** todayAttempts: 오늘 이미 결제한 횟수(0부터). 0번째=기본, 1번째=1.5배, 2번째=2.25배... */
export function fineFor(todayAttempts: number): number {
  const raw = ESCALATION.baseAmount * Math.pow(ESCALATION.rate, todayAttempts);
  // 10원 단위 반올림
  return Math.round(raw / 10) * 10;
}

/** "1.5²" 같은 배수 라벨 */
export function multiplierLabel(todayAttempts: number): string {
  if (todayAttempts === 0) return "기본 금액";
  if (todayAttempts === 1) return "기본 ₩1,500 × 1.5";
  return `기본 ₩1,500 × 1.5${superscript(todayAttempts)}`;
}

function superscript(n: number): string {
  const map: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  return n
    .toString()
    .split("")
    .map((d) => map[d] ?? d)
    .join("");
}

/** ₩ 콤마 포맷 */
export function won(amount: number): string {
  return "₩" + amount.toLocaleString("ko-KR");
}
