"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLeash } from "@/lib/store";
import { advance, parseSeq } from "@/lib/sequence";
import { ACCEL, formatMS } from "@/lib/timer";
import GiveUpBar from "@/components/GiveUpBar";

const WAIT_SECONDS = 180; // 3:00

function WaitInner() {
  const router = useRouter();
  const remaining = parseSeq(useSearchParams().get("seq"));
  const demoFast = useLeash((s) => s.demoFast);

  const start = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [resetFlash, setResetFlash] = useState(false);

  useEffect(() => {
    const ratio = demoFast ? ACCEL.wait : 1;
    const id = setInterval(() => {
      const scaled = ((Date.now() - start.current) / 1000) * ratio;
      setElapsed(scaled);
      if (scaled >= WAIT_SECONDS) {
        clearInterval(id);
        advance(router, remaining);
      }
    }, 200);
    return () => clearInterval(id);
  }, [demoFast, remaining, router]);

  // 화면 이탈 시 리셋 (Page Visibility + blur)
  useEffect(() => {
    const resetTimer = () => {
      start.current = Date.now();
      setElapsed(0);
      setResetFlash(true);
      setTimeout(() => setResetFlash(false), 1200);
    };
    const onVis = () => {
      if (document.hidden) resetTimer();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", resetTimer);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", resetTimer);
    };
  }, []);

  const left = Math.max(0, WAIT_SECONDS - elapsed);
  const pct = Math.min(100, (elapsed / WAIT_SECONDS) * 100);

  return (
    <div className="flex flex-1 flex-col px-8">
      <GiveUpBar barrier="wait" />
      <div className="flex flex-1 flex-col items-center justify-center">
      <div className="tnum text-[64px] font-semibold text-ochre">
        {formatMS(left)}
      </div>
      <p className="mt-2 text-[17px] font-medium text-ink">기다리세요</p>

      <div className="mt-8 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-ochre transition-[width] duration-200 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p
        className={`mt-6 text-[13px] transition-colors ${
          resetFlash ? "font-semibold text-danger" : "text-ink-3"
        }`}
      >
        {resetFlash
          ? "화면을 떠나서 처음부터 리셋됐어요!"
          : "이 화면을 떠나면 리셋됩니다"}
      </p>
      </div>
    </div>
  );
}

export default function WaitBarrier() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <WaitInner />
    </Suspense>
  );
}
