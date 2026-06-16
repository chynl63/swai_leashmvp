"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLeash } from "@/lib/store";
import { useBlockTimer, useMounted } from "@/lib/hooks";
import { formatHMS } from "@/lib/timer";
import Character from "@/components/Character";
import Footprints from "@/components/Footprints";
import TemptationToast from "@/components/TemptationToast";

/** 응시 감지 임계값 (실제 초) */
const GAZE = { look: 30, hint: 90, stare: 180 };

export default function Walk() {
  const router = useRouter();
  const mounted = useMounted();
  const groupName = useLeash((s) => s.groupName);
  const blockedApps = useLeash((s) => s.blockedApps);
  const isActive = useLeash((s) => s.isActive);
  const endBlock = useLeash((s) => s.endBlock);
  const { elapsedSec, remaining, ended } = useBlockTimer();

  const [idle, setIdle] = useState(0);
  const lastActive = useRef(Date.now());

  // 사용자 활동 → idle 리셋
  useEffect(() => {
    const reset = () => (lastActive.current = Date.now());
    const evs = ["mousemove", "touchstart", "keydown", "scroll", "click"];
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    const id = setInterval(
      () => setIdle((Date.now() - lastActive.current) / 1000),
      500
    );
    return () => {
      evs.forEach((e) => window.removeEventListener(e, reset));
      clearInterval(id);
    };
  }, []);

  // 차단 만료 → 완주 전환
  useEffect(() => {
    if (mounted && ended && isActive) {
      router.replace("/demo/transition?kind=completed");
    }
  }, [mounted, ended, isActive, router]);

  // 활성 세션 없으면 홈으로
  useEffect(() => {
    if (mounted && !isActive) router.replace("/demo");
  }, [mounted, isActive, router]);

  if (!mounted || !isActive) return <div className="flex-1" />;

  const gazing = idle >= GAZE.look;
  const bubble =
    idle >= GAZE.stare
      ? null
      : idle >= GAZE.hint
        ? "...산책 끝나면 부를게"
        : idle >= GAZE.look
          ? "왜 아직 쳐다봐?"
          : null;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-6">
      <TemptationToast
        apps={blockedApps}
        onOpen={() => router.push("/demo/interrupt")}
      />
      <div className="rounded-full bg-muted px-5 py-1.5 text-[16px] font-semibold text-ink">
        {groupName}
      </div>

      <div className="tnum mt-7 text-[56px] font-bold leading-none text-ink">
        {formatHMS(remaining)}
      </div>
      <div className="tnum mt-2 text-[16px] font-medium text-ochre">
        {formatHMS(elapsedSec)}째 걷는 중
      </div>

      {/* 캐릭터 + 발자국 */}
      <div className="relative mt-12 flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {gazing ? (
            <motion.div
              key="gaze"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {bubble && (
                <div className="mb-4 rounded-2xl bg-ink px-4 py-2 text-[14px] font-medium text-white">
                  {bubble}
                </div>
              )}
              <Character view="front" size={170} />
            </motion.div>
          ) : (
            <motion.div
              key="walk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-3"
            >
              <Footprints pairs={3} />
              <Character view="side" walking size={150} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => router.push("/demo")}
        className="mb-6 mt-4 text-[15px] font-medium text-ochre"
      >
        자세히 보기
      </button>

      {/* 홈 버튼을 눌러 나가서 차단된 앱을 직접 열어보는 흐름 */}
      <button
        onClick={() => router.push("/demo/springboard")}
        className="mb-6 text-[12px] text-ink-3 underline underline-offset-2"
      >
        🏠 홈 화면으로 나가기
      </button>
    </div>
  );
}
