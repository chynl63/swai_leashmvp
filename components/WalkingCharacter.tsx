"use client";

import { useEffect, useState } from "react";

/** 몸통을 가운데로 (목줄은 왼쪽으로 흘림). 몸통 중심이 width의 ~68% → 50%로 당김 */
const SHIFT = "-17%";

const FADE_MASK = "linear-gradient(to left, #000 14%, transparent 86%)";

/**
 * 산책 중 캐릭터 — side-a(다리 벌림) ↔ side-b(다리 모음)를 반복해 걷는 느낌.
 * 발자국은 발(화면 중앙)에서 생겨 왼쪽으로 멀어지며 점점 옅어진다.
 */
export default function WalkingCharacter({ size = 200 }: { size?: number }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 620);
    return () => clearInterval(id);
  }, []);

  const w = size * (214 / 260);

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative"
        style={{ width: w, height: size, overflow: "visible" }}
      >
        <img
          src={frame === 0 ? "/characters/side-a.svg" : "/characters/side-b.svg"}
          alt="산책 중인 캐릭터"
          className="walk-bob"
          style={
            { width: w, height: size, "--char-shift": SHIFT } as React.CSSProperties
          }
        />
      </div>

      {/* 발자국 레인: 오른쪽 끝(= 캐릭터 발)에서 생겨 왼쪽으로 흐르며 페이드 */}
      <div className="relative mt-2 h-[18px] w-full">
        <div
          className="absolute right-1/2 top-0 h-full w-[230px] overflow-hidden"
          style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
        >
          <div className="treadmill absolute left-0 top-0 flex gap-8">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="flex shrink-0 flex-col gap-0.5">
                <span className="block h-[6px] w-[11px] rounded-full bg-ink-3/55" />
                <span className="ml-2 block h-[6px] w-[11px] rounded-full bg-ink-3/55" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
