"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLeash } from "@/lib/store";
import { useMounted, useBlockTimer } from "@/lib/hooks";
import { PROFILES, DURATIONS, APPS } from "@/lib/profiles";
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
    profileKey,
    setProfile,
    blockedApps,
    toggleApp,
    durationMinutes,
    setDuration,
    walkMinutes,
    breaks,
    startBlock,
  } = useLeash();

  const profile = PROFILES.find((p) => p.key === profileKey) ?? PROFILES[0];
  const durIdx = DURATIONS.indexOf(durationMinutes as (typeof DURATIONS)[number]);
  const stepDur = (dir: number) => {
    const next = Math.min(
      DURATIONS.length - 1,
      Math.max(0, (durIdx < 0 ? 1 : durIdx) + dir)
    );
    setDuration(DURATIONS[next]);
  };
  const durLabel = (m: number) => (m % 60 === 0 ? `${m / 60}h` : `${m}m`);

  const start = () => {
    if (blockedApps.length === 0) return;
    startBlock();
    router.push("/demo/walk");
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-3 no-scrollbar">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-ink">Leash</h1>
        <span className="text-[20px]">⚙️</span>
      </div>

      <div className="glass-card flex flex-col gap-5 p-5">
        {/* 프로필 선택 */}
        <div>
          <label className="text-[13px] text-ink-2">차단 프로필</label>
          <div className="mt-2 flex gap-2">
            {PROFILES.map((p) => (
              <button
                key={p.key}
                onClick={() => setProfile(p.key)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-2.5 transition ${
                  p.key === profileKey
                    ? "border-ochre bg-ochre-light"
                    : "border-line bg-white"
                }`}
              >
                <span className="text-[18px]">{p.badge}</span>
                <span className="text-[12px] font-medium text-ink">{p.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink-3">
            줄 끊기 벌칙 · {profile.summary}
          </p>
        </div>

        {/* 앱 선택 */}
        <div>
          <label className="text-[13px] text-ink-2">묶을 앱 선택</label>
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
            <span className="tnum w-[64px] text-center text-[28px] font-semibold text-ochre">
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

        <button
          onClick={start}
          disabled={blockedApps.length === 0}
          className="btn-primary py-4 text-[16px] disabled:opacity-40"
        >
          🔗 목줄 채우기
        </button>
      </div>

      {/* 이번 주 */}
      <div className="px-1">
        <div className="text-[13px] text-ink-3">── 이번 주 ──</div>
        <p className="mt-1 text-[14px] text-ink-2">
          산책 {Math.floor(walkMinutes / 60)}시간 {walkMinutes % 60}분 · 줄 끊기{" "}
          {breaks}회
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── 차단 중 ───────────────────────── */
function Blocking() {
  const router = useRouter();
  const { blockedApps, endBlock } = useLeash();
  const profile = useLeash((s) => s.profile());
  const { elapsedSec, totalSec, ended } = useBlockTimer();

  useEffect(() => {
    // 시간 만료 → 완주 처리 후 설정 화면으로
    if (ended) endBlock("completed");
  }, [ended, endBlock]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-3 no-scrollbar">
      <h1 className="text-[26px] font-bold text-ink">Leash</h1>

      <button onClick={() => router.push("/demo/walk")} className="text-left">
        <TimerCard
          groupName={profile.name}
          elapsedSec={elapsedSec}
          totalSec={totalSec}
        />
      </button>
      <Footprints className="-mt-1 pl-2" pairs={5} />

      <div className="mt-1">
        <div className="mb-2 text-[14px] text-ink-3">묶여있는 앱</div>
        <AppListAccordion groupName={profile.name} apps={blockedApps} />
      </div>

      <button
        onClick={() => router.push("/demo/interrupt")}
        className="btn-soft mt-2 py-3.5 text-[15px]"
      >
        📱 차단된 앱 열어보기 (시뮬)
      </button>
    </div>
  );
}
