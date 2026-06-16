/**
 * 타이머 유틸 + 데모 가속 (spec §7)
 *
 * | 실제   | 데모  | 비율 |
 * | 1시간  | 1분   | 60배 |
 * | 5분(벤치) | 15초 | 20배 |
 * | 3분(대기) | 15초 | 12배 |
 */

export const ACCEL = {
  block: 60, // 차단 타이머
  bench: 20, // 벤치(팝콘) 타이머
  wait: 12, // 대기 벌칙
} as const;

/** 초 → "H:MM:SS" (시간이 0이면 "M:SS") */
export function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
  return `${m}:${pad(sec)}`;
}

/** 초 → "M:SS" (항상 분:초) */
export function formatMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * 실제 경과(ms) → 데모 화면상 경과(초).
 * fast=true면 ratio배 가속.
 */
export function scaledElapsedSeconds(
  realElapsedMs: number,
  ratio: number,
  fast: boolean
): number {
  const realSec = realElapsedMs / 1000;
  return fast ? realSec * ratio : realSec;
}
