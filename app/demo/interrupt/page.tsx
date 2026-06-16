"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLeash } from "@/lib/store";
import { useBlockTimer, useMounted } from "@/lib/hooks";
import { startSequence } from "@/lib/sequence";
import Character from "@/components/Character";

export default function Interrupt() {
  const router = useRouter();
  const mounted = useMounted();
  const profile = useLeash((s) => s.profile());
  const isActive = useLeash((s) => s.isActive);
  const durationMinutes = useLeash((s) => s.durationMinutes);
  const { elapsedSec, totalSec } = useBlockTimer();

  useEffect(() => {
    if (mounted && !isActive) router.replace("/demo");
  }, [mounted, isActive, router]);

  if (!mounted || !isActive) return <div className="flex-1" />;

  // 벤치 조건: 2시간+ 산책 & 절반 이상 경과
  const benchEligible = durationMinutes >= 120 && elapsedSec >= totalSec / 2;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-6">
      <div className="rounded-full bg-muted px-5 py-1.5 text-[16px] font-semibold text-ink">
        {profile.name}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <Character view="front" effect="rain" size={175} />
        </motion.div>
        <p className="mt-7 text-[18px] font-medium text-ink-2">
          한창 재밌었는데...
        </p>
      </div>

      {/* 벌칙은 설정 시점에 확정됨 — 표시만 */}
      <p className="mb-3 text-[12px] text-ink-3">
        줄 끊기 벌칙 · {profile.summary}
      </p>

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
          onClick={() => startSequence(router, profile.sequence)}
          className="btn-soft py-3.5 text-[15px]"
        >
          벌칙을 수행하고 산책을 강제종료하기
        </button>
        <button
          onClick={() => router.replace("/demo/transition?kind=resist")}
          className="btn-primary py-3.5 text-[15px]"
        >
          앱 끄고 산책하도록 놔두기
        </button>
      </div>
    </div>
  );
}
