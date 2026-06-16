"use client";

import { useEffect, useState } from "react";

/** 몸통을 가운데로 (목줄은 왼쪽으로 흘림). 몸통 중심이 width의 ~68% → 50%로 당김 */
const SHIFT = "-17%";

/**
 * 산책 중 캐릭터 — side-a(다리 벌림) ↔ side-b(다리 모음) 프레임을 반복해
 * 실제 걷는 느낌. 발밑 발자국은 트레드밀처럼 왼쪽으로 흐른다.
 */
export default function WalkingCharacter({ size = 190 }: { size?: number }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 450);
    return () => clearInterval(id);
  }, []);

  const w = size * (214 / 260);

  return (
    <div className="flex flex-col items-center">
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

      {/* 트레드밀 발자국 (왼쪽으로 흐름) */}
      <div className="relative mt-3 h-[16px] w-[240px] overflow-hidden">
        <div className="treadmill absolute left-0 top-0 flex gap-7">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex shrink-0 flex-col gap-0.5">
              <span className="block h-[6px] w-[10px] rounded-full bg-ink-3/40" />
              <span className="ml-2 block h-[6px] w-[10px] rounded-full bg-ink-3/40" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
