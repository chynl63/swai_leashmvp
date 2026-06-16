"use client";

import { useLeash } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { won } from "@/lib/escalation";
import TabBar from "@/components/TabBar";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
// 데모 기본 분포(분) — 라이브 산책 시간이 오늘 칸에 더해짐
const BASE_WEEK = [180, 240, 200, 300, 0, 0, 0];

export default function Stats() {
  const mounted = useMounted();
  const { walkMinutes, breaks, finesTotal, resists, history } = useLeash();

  if (!mounted) return <div className="flex-1" />;

  // 오늘 요일 인덱스 (월=0)
  const jsDay = new Date().getDay(); // 일=0
  const todayIdx = (jsDay + 6) % 7;
  const week = BASE_WEEK.map((m, i) => (i === todayIdx ? m + walkMinutes : m));
  const totalMin = week.reduce((a, b) => a + b, 0);
  const maxMin = Math.max(60, ...week);

  const demoHistory =
    history.length > 0
      ? history
      : [
          { time: "14:23", app: "인스타그램", result: "참음 ✅" },
          { time: "11:05", app: "유튜브", result: "벌금 ₩2,250" },
          { time: "09:30", app: "틱톡", result: "참음 ✅" },
        ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-3 no-scrollbar">
        <h1 className="text-[26px] font-bold text-ink">통계</h1>

        {/* 이번 주 산책 */}
        <div className="mt-4 plain-card p-5">
          <div className="text-[13px] text-ink-2">이번 주 산책</div>
          <div className="tnum mt-1 text-[30px] font-semibold text-ink">
            {Math.floor(totalMin / 60)}시간 {totalMin % 60}분
          </div>
          <div className="mt-4 flex h-[90px] items-end gap-2">
            {week.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-md ${
                    i === todayIdx ? "bg-ochre" : "bg-muted"
                  }`}
                  style={{ height: `${Math.max(4, (m / maxMin) * 70)}px` }}
                />
                <span className="text-[11px] text-ink-3">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 연속 기록 */}
        <div className="mt-3 plain-card flex items-center justify-between p-5">
          <div>
            <div className="text-[13px] text-ink-2">연속 기록 🔥</div>
            <div className="mt-1 text-[17px] font-medium text-ink">
              {breaks === 0 ? "4일째 줄 안 끊는 중" : "오늘 줄 끊음 — 연속 리셋"}
            </div>
          </div>
          <div className="text-[28px] font-bold text-ochre">
            {breaks === 0 ? "4" : "0"}
          </div>
        </div>

        {/* 이번 달 벌금 + 참음 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="plain-card p-5">
            <div className="text-[13px] text-ink-2">이번 달 벌금</div>
            <div className="tnum mt-1 text-[22px] font-semibold text-ochre">
              {won(finesTotal)}
            </div>
          </div>
          <div className="plain-card p-5">
            <div className="text-[13px] text-ink-2">참은 횟수</div>
            <div className="tnum mt-1 text-[22px] font-semibold text-ink">
              {resists}회
            </div>
          </div>
        </div>

        {/* 해제 시도 히스토리 */}
        <div className="mb-4 mt-3 plain-card p-5">
          <div className="mb-2 text-[13px] text-ink-2">해제 시도 히스토리</div>
          <div className="flex flex-col">
            {demoHistory.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-t border-line py-2.5 text-[14px] first:border-t-0"
              >
                <span className="tnum text-ink-3">{h.time}</span>
                <span className="flex-1 px-3 text-ink">{h.app}</span>
                <span className="text-ink-2">{h.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
