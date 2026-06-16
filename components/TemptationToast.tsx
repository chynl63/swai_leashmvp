"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppIcon from "./AppIcon";

const TEMPLATES = [
  "지금 회원님을 찾고 있어요 👀",
  "새 알림 3개가 도착했어요",
  "친구가 회원님을 언급했습니다",
  "보던 영상, 이어서 볼까요?",
  "좋아요 12개를 받았어요",
  "놓치면 아쉬운 라이브 시작!",
];

/** 산책 중 뜨는 가짜 유혹 푸시 알림 (실감용). 탭하면 인터럽트로. */
export default function TemptationToast({
  apps,
  onOpen,
}: {
  apps: string[];
  onOpen: () => void;
}) {
  const [shown, setShown] = useState<{ app: string; msg: string } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const tick = useRef(0);

  useEffect(() => {
    if (apps.length === 0) return;
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const showOne = () => {
      const app = apps[Math.floor(Math.random() * apps.length)];
      const msg = TEMPLATES[tick.current % TEMPLATES.length];
      tick.current += 1;
      setShown({ app, msg });
      // 7초 뒤 사라지고, 18~30초 뒤 다시
      timers.current.push(
        setTimeout(() => setShown(null), 7000),
        setTimeout(showOne, 7000 + 18000 + Math.random() * 12000)
      );
    };

    // 첫 알림은 5초 뒤
    timers.current.push(setTimeout(showOne, 5000));
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps.length]);

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-40 flex justify-center">
      <AnimatePresence>
        {shown && (
          <motion.button
            key={shown.app + shown.msg + tick.current}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={onOpen}
            className="pointer-events-auto flex w-full max-w-[340px] items-center gap-3 rounded-2xl bg-white/85 p-3 text-left shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          >
            <AppIcon name={shown.app} size={38} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-ink">{shown.app}</div>
              <div className="truncate text-[13px] text-ink-2">{shown.msg}</div>
            </div>
            <span className="rounded-full bg-ochre px-2.5 py-1 text-[11px] font-semibold text-white">
              열기
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
