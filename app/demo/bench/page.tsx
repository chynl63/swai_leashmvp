"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLeash } from "@/lib/store";
import { ACCEL, formatMS } from "@/lib/timer";

const BENCH_SECONDS = 300; // 5:00

export default function Bench() {
  const router = useRouter();
  const demoFast = useLeash((s) => s.demoFast);
  const start = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const ratio = demoFast ? ACCEL.bench : 1;
    const id = setInterval(() => {
      const scaled = ((Date.now() - start.current) / 1000) * ratio;
      setElapsed(scaled);
      if (scaled >= BENCH_SECONDS) {
        clearInterval(id);
        router.replace("/demo/transition?kind=bench-end");
      }
    }, 200);
    return () => clearInterval(id);
  }, [demoFast, router]);

  const left = Math.max(0, BENCH_SECONDS - elapsed);
  const pct = Math.min(100, (elapsed / BENCH_SECONDS) * 100);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="text-[40px]">🍿</div>
      <p className="mt-2 text-[18px] font-semibold text-ink">팝콘 타임</p>

      <div className="tnum mt-6 text-[60px] font-semibold text-ochre">
        {formatMS(left)}
      </div>

      <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-ochre transition-[width] duration-200 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-7 text-[15px] text-ink-2">지금은 자유시간!</p>
      <p className="mt-1 text-[12px] text-ink-3">
        시간이 끝나면 다시 산책으로 돌아가요
      </p>
    </div>
  );
}
