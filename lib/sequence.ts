"use client";

import type { BarrierType } from "./profiles";

const ROUTE: Record<BarrierType, string> = {
  math: "/demo/barrier/math",
  typing: "/demo/barrier/typing",
  wait: "/demo/barrier/wait",
  guardian: "/demo/barrier/guardian",
  fine: "/demo/barrier/fine",
};

type RouterLike = { replace: (href: string) => void };

/** 벌칙 시퀀스를 시작 (interrupt → 첫 벌칙) */
export function startSequence(router: RouterLike, sequence: BarrierType[]) {
  advance(router, sequence);
}

/**
 * 남은 벌칙으로 진행. 비면 상처(해제) 전환으로.
 * @param remaining 아직 수행 안 한 벌칙들 (현재 것 포함)
 */
export function advance(router: RouterLike, remaining: BarrierType[]) {
  if (remaining.length === 0) {
    router.replace("/demo/transition?kind=hurt");
    return;
  }
  const [next, ...rest] = remaining;
  const q = rest.length ? `?seq=${rest.join(",")}` : "";
  router.replace(`${ROUTE[next]}${q}`);
}

/** URL의 seq 파라미터를 BarrierType[]로 파싱 */
export function parseSeq(seq: string | null): BarrierType[] {
  if (!seq) return [];
  return seq.split(",").filter(Boolean) as BarrierType[];
}
