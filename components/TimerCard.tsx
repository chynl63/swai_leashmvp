"use client";

import { formatHMS } from "@/lib/timer";

/**
 * 투톤 타이머 카드 (spec §4.4)
 * 왼쪽 오커=경과(걸어온 길) / 오른쪽 다크=남음. 경과 비율에 따라 동적 변화.
 * 큰 숫자=남은 시간, 작은 숫자=경과 시간.
 */
export default function TimerCard({
  groupName,
  elapsedSec,
  totalSec,
}: {
  groupName: string;
  elapsedSec: number;
  totalSec: number;
}) {
  const ratio = totalSec > 0 ? Math.min(1, elapsedSec / totalSec) : 0;
  const remaining = Math.max(0, totalSec - elapsedSec);

  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-[28px] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      {/* 투톤 배경 */}
      <div className="absolute inset-0 flex">
        <div
          className="h-full bg-ochre transition-[width] duration-700 ease-linear"
          style={{ width: `${ratio * 100}%` }}
        />
        <div className="h-full flex-1 bg-walk-dark" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative flex h-full flex-col items-center justify-center gap-1">
        <div className="rounded-full bg-white/55 px-4 py-1 text-[14px] font-semibold text-ink backdrop-blur-sm">
          {groupName}
        </div>
        <div className="tnum text-[58px] font-bold leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          {formatHMS(remaining)}
        </div>
        <div className="tnum text-[18px] font-medium text-white/85">
          {formatHMS(elapsedSec)}
        </div>
      </div>
    </div>
  );
}
