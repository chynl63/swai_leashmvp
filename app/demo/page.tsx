"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLeash } from "@/lib/store";
import { useMounted, useBlockTimer } from "@/lib/hooks";
import {
  PROFILES,
  DURATIONS,
  APPS,
  CANON_ORDER,
  BARRIER_LABEL,
  summaryFor,
} from "@/lib/profiles";
import TabBar from "@/components/TabBar";
import TimerCard from "@/components/TimerCard";
import Footprints from "@/components/Footprints";
import AppListAccordion from "@/components/AppListAccordion";
import AppIcon from "@/components/AppIcon";

export default function Home() {
  const mounted = useMounted();
  const isActive = useLeash((s) => s.isActive);

  if (!mounted) return <div className="flex-1" />;
  return (
    <div className="flex flex-1 flex-col">
      {isActive ? <Blocking /> : <Setup />}
      <TabBar />
    </div>
  );
}

/* ───────────────────────── 차단 전 (설정) ───────────────────────── */
function Setup() {
  const router = useRouter();
  const {
    groupName,
    barriers,
    applyPreset,
    toggleBarrier,
    blockedApps,
    toggleApp,
    durationMinutes,
    setDuration,
    startBlock,
  } = useLeash();

  const durIdx = DURATIONS.indexOf(durationMinutes as (typeof DURATIONS)[number]);
  const stepDur = (dir: number) => {
    const next = Math.min(
      DURATIONS.length - 1,
      Math.max(0, (durIdx < 0 ? 1 : durIdx) + dir)
    );
    setDuration(DURATIONS[next]);
  };
  const durLabel = (m: number) => (m % 60 === 0 ? `${m / 60}시간` : `${m}분`);

  const canStart = blockedApps.length > 0 && barriers.length > 0;
  const start = () => {
    if (!canStart) return;
    startBlock();
    router.push("/demo/walk");
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-3 no-scrollbar">
      <h1 className="text-[26px] font-bold text-ink">Leash</h1>

      <div className="glass-card flex flex-col gap-5 p-5">
        {/* 빠른 설정 (프리셋) */}
        <div>
          <label className="text-[13px] text-ink-2">빠른 설정</label>
          <div className="mt-2 flex gap-2">
            {PROFILES.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-2.5 transition ${
                  p.name === groupName
                    ? "border-ochre bg-ochre-light"
                    : "border-line bg-white"
                }`}
              >
                <span className="text-[18px]">{p.badge}</span>
                <span className="text-[12px] font-medium text-ink">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 앱 선택 */}
        <div>
          <label className="text-[13px] text-ink-2">묶을 앱</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {APPS.map((a) => {
              const on = blockedApps.includes(a.name);
              return (
                <button
                  key={a.name}
                  onClick={() => toggleApp(a.name)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`rounded-[22%] ${on ? "ring-2 ring-ochre ring-offset-2" : ""}`}
                  >
                    <AppIcon name={a.name} size={44} dim={!on} />
                  </div>
                  <span className="text-[10px] text-ink-3">{a.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 차단 시간 */}
        <div>
          <label className="text-[13px] text-ink-2">차단 시간</label>
          <div className="mt-2 flex items-center justify-center gap-8">
            <button
              onClick={() => stepDur(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[18px] text-ink"
            >
              ◀
            </button>
            <span className="tnum w-[80px] text-center text-[26px] font-semibold text-ochre">
              {durLabel(durationMinutes)}
            </span>
            <button
              onClick={() => stepDur(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[18px] text-ink"
            >
              ▶
            </button>
          </div>
        </div>

        {/* 해제 벌칙 직접 선택 */}
        <div>
          <label className="text-[13px] text-ink-2">
            해제 벌칙 <span className="text-ink-3">(설정 후 변경 불가)</span>
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {CANON_ORDER.map((b) => {
              const on = barriers.includes(b);
              const meta = BARRIER_LABEL[b];
              const order = on ? barriers.indexOf(b) + 1 : null;
              return (
                <button
                  key={b}
                  onClick={() => toggleBarrier(b)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                    on ? "border-ochre bg-ochre-light" : "border-line bg-white"
                  }`}
                >
                  <span className="text-[18px]">{meta.emoji}</span>
                  <span className="flex-1 text-[14px] font-medium text-ink">
                    {meta.label}
                  </span>
                  <span className="text-[12px] text-ink-3">{meta.short}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      on ? "bg-ochre text-white" : "bg-muted text-ink-3"
                    }`}
                  >
                    {order ?? ""}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[12px] text-ink-3">
            해제하려면 순서대로: {summaryFor(barriers)}
          </p>
        </div>

        <button
          onClick={start}
          disabled={!canStart}
          className="btn-primary py-4 text-[16px] disabled:opacity-40"
        >
          🔗 목줄 채우기
        </button>
        {!canStart && (
          <p className="-mt-2 text-center text-[12px] text-ink-3">
            앱과 벌칙을 최소 1개씩 선택하세요
          </p>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── 차단 중 ───────────────────────── */
function Blocking() {
  const router = useRouter();
  const { blockedApps, endBlock, groupName } = useLeash();
  const { elapsedSec, totalSec, ended } = useBlockTimer();

  useEffect(() => {
    if (ended) endBlock("completed");
  }, [ended, endBlock]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-3 no-scrollbar">
      <h1 className="text-[26px] font-bold text-ink">Leash</h1>

      <button onClick={() => router.push("/demo/walk")} className="text-left">
        <TimerCard
          groupName={groupName}
          elapsedSec={elapsedSec}
          totalSec={totalSec}
        />
      </button>
      <Footprints className="-mt-1 pl-2" pairs={5} />

      <div className="mt-1">
        <div className="mb-2 text-[14px] text-ink-3">묶여있는 앱</div>
        <AppListAccordion groupName={groupName} apps={blockedApps} />
      </div>

      <button
        onClick={() => router.push("/demo/springboard")}
        className="btn-soft mt-2 py-3.5 text-[15px]"
      >
        🏠 홈 화면으로 나가기
      </button>
      <p className="-mt-2 text-center text-[12px] text-ink-3">
        또는 아래 홈 버튼(가로 바)을 눌러보세요
      </p>
    </div>
  );
}
