"use client";

import { usePathname, useRouter } from "next/navigation";

/** 하단 탭바 (홈 / 통계) — 플로팅 pill */
export default function TabBar() {
  const router = useRouter();
  const path = usePathname();
  const onStats = path?.startsWith("/demo/stats");

  return (
    <div className="flex shrink-0 items-center justify-center pb-3 pt-1">
      <div className="flex items-center gap-1 rounded-full bg-white px-2 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => router.push("/demo")}
          className={`flex flex-col items-center gap-0.5 rounded-full px-6 py-1.5 transition ${
            !onStats ? "bg-muted" : ""
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 22 22">
            <rect
              x="11"
              y="2"
              width="12.7"
              height="12.7"
              rx="3"
              transform="rotate(45 11 2)"
              fill={!onStats ? "#E8A835" : "#C7C7CC"}
            />
          </svg>
          <span
            className={`text-[11px] font-medium ${
              !onStats ? "text-ochre" : "text-ink-3"
            }`}
          >
            홈
          </span>
        </button>
        <button
          onClick={() => router.push("/demo/stats")}
          className={`flex flex-col items-center gap-0.5 rounded-full px-6 py-1.5 transition ${
            onStats ? "bg-muted" : ""
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="9" r="8" fill={onStats ? "#1A1A1A" : "#C7C7CC"} />
          </svg>
          <span
            className={`text-[11px] font-medium ${
              onStats ? "text-ink" : "text-ink-3"
            }`}
          >
            통계
          </span>
        </button>
      </div>
    </div>
  );
}
