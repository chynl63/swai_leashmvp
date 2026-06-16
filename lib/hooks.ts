"use client";

import { useEffect, useState } from "react";
import { useLeash } from "./store";
import { ACCEL } from "./timer";

/**
 * 차단 세션의 실시간 경과/남음(초)을 데모 가속 반영해 계산.
 * 차단이 끝나면 ended=true.
 */
export function useBlockTimer() {
  const startedAt = useLeash((s) => s.startedAt);
  const durationMinutes = useLeash((s) => s.durationMinutes);
  const demoFast = useLeash((s) => s.demoFast);
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 250);
    return () => clearInterval(id);
  }, []);

  const totalSec = durationMinutes * 60;
  const ratio = demoFast ? ACCEL.block : 1;
  const elapsedSec =
    startedAt != null ? ((Date.now() - startedAt) / 1000) * ratio : 0;

  return {
    elapsedSec: Math.min(elapsedSec, totalSec),
    totalSec,
    remaining: Math.max(0, totalSec - elapsedSec),
    ended: elapsedSec >= totalSec,
  };
}

/** mount 여부 (persist 하이드레이션 깜빡임 방지) */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
