"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLeash } from "@/lib/store";
import { useBlockTimer, useMounted } from "@/lib/hooks";
import { startSequence } from "@/lib/sequence";
import { summaryFor } from "@/lib/profiles";
import { logEvent } from "@/lib/log";
import Character from "@/components/Character";
import PrizeBanner from "@/components/PrizeBanner";

export default function Interrupt() {
  const router = useRouter();
  const mounted = useMounted();
  const groupName = useLeash((s) => s.groupName);
  const barriers = useLeash((s) => s.barriers);
  const isActive = useLeash((s) => s.isActive);
  const durationMinutes = useLeash((s) => s.durationMinutes);
  const { elapsedSec, totalSec } = useBlockTimer();
  const logged = useRef(false);

  useEffect(() => {
    if (mounted && !isActive) router.replace("/demo");
  }, [mounted, isActive, router]);

  // 인터럽트 도달 1회 로깅 (퍼널 시작점)
  useEffect(() => {
    if (mounted && isActive && !logged.current) {
      logged.current = true;
      logEvent("interrupt_reached");
    }
  }, [mounted, isActive]);

  if (!mounted || !isActive) return <div className="flex-1" />;

  // 벤치 조건: 2시간+ 산책 & 절반 이상 경과
  const benchEligible = durationMinutes >= 120 && elapsedSec >= totalSec / 2;

  const startPenalty = () => {
    logEvent("unblock_start", barriers.join("+"));
    startSequence(router, barriers);
  };

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-6">
      <div className="rounded-full bg-muted px-5 py-1.5 text-[16px] font-semibold text-ink">
        {groupName}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <Character view="front" effect="rain" size={195} />
        </motion.div>
        <p className="mt-7 text-[18px] font-medium text-ink-2">
          한창 재밌었는데...
        </p>
      </div>

      <PrizeBanner className="mb-3 w-full" />

      <div className="flex w-full flex-col gap-2.5 pb-6">
        {benchEligible && (
          <button
            onClick={() => router.replace("/demo/transition?kind=bench-enter")}
            className="btn-soft py-3.5 text-[15px]"
          >
            딱 5분만 사용하기
          </button>
        )}
        <button
          onClick={startPenalty}
          className="btn-soft py-3.5 text-[15px]"
        >
          벌칙 풀고 차단 해제하기 · {summaryFor(barriers)}
        </button>
        <button
          onClick={() => router.replace("/demo/transition?kind=resist")}
          className="btn-primary py-3.5 text-[15px]"
        >
          그냥 두고 산책 계속하기
        </button>
      </div>
    </div>
  );
}
