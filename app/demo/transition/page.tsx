"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLeash } from "@/lib/store";
import TransitionScreen from "@/components/TransitionScreen";
import type { CharEffect, CharView } from "@/components/Character";

type Kind = "resist" | "bench-enter" | "bench-end" | "hurt" | "completed";

const CONFIG: Record<
  Kind,
  { view: CharView; effect: CharEffect; lines: string[]; ms: number; next: string }
> = {
  resist: {
    view: "front",
    effect: "blush",
    lines: ["주인님이 최고예용!", "그럼 산책 좀 더 하다 올게용!"],
    ms: 2500,
    next: "/demo/walk",
  },
  "bench-enter": {
    view: "front",
    effect: "none",
    lines: ["딱 5분만 드릴게요!", "더는 없어용~"],
    ms: 2500,
    next: "/demo/bench",
  },
  "bench-end": {
    view: "front",
    effect: "sparkle",
    lines: ["시간이 다 됐어요 주인님!", "이제 다시 산책할 시간이에요! 야호~"],
    ms: 2500,
    next: "/demo/walk",
  },
  hurt: {
    view: "front",
    effect: "tear",
    lines: ["그게 주인님의 뜻이라면...", "그치만 전 오늘 큰 상처를 받았어요"],
    ms: 2800,
    next: "/demo",
  },
  completed: {
    view: "side",
    effect: "sparkle",
    lines: ["산책 끝! 무사히 집에 왔어요 🏠", "오늘도 잘 참았어요, 주인님!"],
    ms: 2800,
    next: "/demo",
  },
};

function TransitionInner() {
  const router = useRouter();
  const params = useSearchParams();
  const kind = (params.get("kind") as Kind) ?? "resist";
  const cfg = CONFIG[kind] ?? CONFIG.resist;

  const recordResist = useLeash((s) => s.recordResist);
  const recordBench = useLeash((s) => s.recordBench);
  const endBlock = useLeash((s) => s.endBlock);
  const did = useRef(false);

  // 부수효과 1회 실행
  useEffect(() => {
    if (did.current) return;
    did.current = true;
    if (kind === "resist") recordResist();
    else if (kind === "bench-enter") recordBench();
    else if (kind === "hurt") endBlock("broken");
    else if (kind === "completed") endBlock("completed");
  }, [kind, recordResist, recordBench, endBlock]);

  return (
    <TransitionScreen
      view={cfg.view}
      effect={cfg.effect}
      lines={cfg.lines}
      durationMs={cfg.ms}
      onDone={() => router.replace(cfg.next)}
    />
  );
}

export default function Transition() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <TransitionInner />
    </Suspense>
  );
}
