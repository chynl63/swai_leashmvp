"use client";

import { useEffect, useState } from "react";

/** iOS 상태바 (시간, 셀룰러, 와이파이, 배터리) */
export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  const fg = dark ? "#fff" : "#1A1A1A";

  return (
    <div
      className="relative z-20 flex h-[50px] shrink-0 items-center justify-between px-7"
      style={{ color: fg }}
    >
      <span className="ml-1 text-[16px] font-semibold tnum">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* 셀룰러 */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          {[3, 6, 9, 12].map((h, i) => (
            <rect
              key={i}
              x={i * 4.5}
              y={12 - h}
              width="3"
              height={h}
              rx="1"
              fill={fg}
            />
          ))}
        </svg>
        {/* 와이파이 */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 11.5l2-2.6a2.6 2.6 0 0 0-4 0L8 11.5zM3.2 6a7.6 7.6 0 0 1 9.6 0l1.6-2A10.1 10.1 0 0 0 1.6 4L3.2 6z"
            fill={fg}
          />
        </svg>
        {/* 배터리 */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.5"
            stroke={fg}
            strokeOpacity="0.5"
          />
          <rect x="2" y="2" width="17" height="9" rx="2" fill={fg} />
          <rect x="24" y="4" width="2" height="5" rx="1" fill={fg} fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
