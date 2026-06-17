"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Tips = { left?: string; right?: string };

function tipsFor(path: string): Tips {
  if (path.startsWith("/demo/barrier"))
    return {
      left: "끝까지 풀어야 차단 해제 + 추첨 응모 🎁",
      right: "귀찮으면 위 '포기' — 차단은 그대로 유지돼요",
    };
  if (path === "/demo/walk")
    return {
      left: "산책 중! 30초 가만히 두면 폰이 뒤돌아봐요 👀",
      right: "맨 아래 홈 버튼을 눌러 다른 앱을 열어보세요",
    };
  if (path === "/demo/springboard")
    return {
      left: "🔒 가 붙은 게 묶여 있는 앱이에요",
      right: "인스타를 눌러보세요 — 막아섭니다",
    };
  if (path === "/demo/interrupt")
    return {
      left: "풀고 싶죠? 풀면 배민 2만원권 추첨 응모 🎁",
      right: "그냥 두면 폰은 산책(차단)을 계속해요",
    };
  if (path === "/demo/entry")
    return { left: "거의 다 왔어요!", right: "이메일 넣고 추첨 응모 🎁" };
  if (path === "/demo/bench")
    return { left: "🍿 팝콘 타임", right: "끝나면 다시 산책으로" };
  if (path === "/demo/stats")
    return { left: "참음 · 줄 끊음 기록", right: "이번 주 산책 시간" };
  // /demo (설정 / 차단 중) 및 기타
  return {
    left: "① 묶을 앱을 고르고 '목줄 채우기'를 눌러요",
    right: "차단이 시작되면 폰이 산책을 나가요 🐾",
  };
}

function Bubble({
  side,
  text,
  delay,
}: {
  side: "left" | "right";
  text: string;
  delay: number;
}) {
  const isLeft = side === "left";
  return (
    <motion.div
      className={`absolute hidden w-[210px] lg:block ${
        isLeft ? "right-full mr-9 text-right" : "left-full ml-9 text-left"
      }`}
      style={{ top: isLeft ? "16%" : "52%" }}
      animate={{ y: [0, -9, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          className="relative rounded-2xl bg-white px-4 py-3 text-[14px] font-medium leading-snug text-ink shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        >
          {text}
          {/* 꼬리 */}
          <span
            className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white ${
              isLeft ? "right-[-5px]" : "left-[-5px]"
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/** 폰 양옆에 떠 있는 화면별 안내 말풍선 (데스크톱 전용). iframe의 RouteBeacon을 구독. */
export default function DemoTips() {
  const [path, setPath] = useState("/demo");

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "leash-route" && typeof e.data.path === "string") {
        setPath(e.data.path);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const tips = tipsFor(path);

  return (
    <>
      {tips.left && <Bubble side="left" text={tips.left} delay={0} />}
      {tips.right && <Bubble side="right" text={tips.right} delay={0.6} />}
    </>
  );
}
