import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PROFILES,
  type BarrierType,
  profileByKey,
  sortBarriers,
} from "./profiles";
import { logEvent } from "./log";

export type HistoryEntry = {
  time: string; // "14:23"
  app: string;
  result: string;
};

type LeashState = {
  // 설정
  nickname: string;
  demoFast: boolean;
  groupName: string; // 차단 그룹 이름 (프리셋명 or 커스텀)
  barriers: BarrierType[]; // 해제 벌칙 시퀀스 (설정 시점 확정)
  blockedApps: string[];
  durationMinutes: number;

  // 세션
  isActive: boolean;
  startedAt: number | null;

  // 통계 / 보상
  walkMinutes: number;
  resists: number;
  breaks: number;
  finesTotal: number;
  fineCountToday: number;
  history: HistoryEntry[];

  // actions
  setNickname: (v: string) => void;
  toggleDemoFast: () => void;
  applyPreset: (key: string) => void;
  toggleBarrier: (b: BarrierType) => void;
  setGroupName: (v: string) => void;
  toggleApp: (name: string) => void;
  setDuration: (min: number) => void;
  startBlock: () => void;
  endBlock: (reason: "completed" | "broken") => void;
  recordResist: () => void;
  recordBench: () => void;
  recordFine: (amount: number) => void;
  reset: () => void;
};

function nowTimeLabel(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

const DEFAULTS = {
  nickname: "주인님",
  demoFast: true,
  groupName: PROFILES[0].name,
  barriers: [...PROFILES[0].sequence] as BarrierType[],
  blockedApps: ["인스타그램", "유튜브", "틱톡"],
  durationMinutes: 120,
  isActive: false,
  startedAt: null as number | null,
  walkMinutes: 0,
  resists: 0,
  breaks: 0,
  finesTotal: 0,
  fineCountToday: 0,
  history: [] as HistoryEntry[],
};

export const useLeash = create<LeashState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setNickname: (v) => set({ nickname: v }),
      toggleDemoFast: () => set((s) => ({ demoFast: !s.demoFast })),

      applyPreset: (key) => {
        const p = profileByKey(key);
        set({ groupName: p.name, barriers: sortBarriers([...p.sequence]) });
      },

      toggleBarrier: (b) =>
        set((s) => {
          const has = s.barriers.includes(b);
          const next = has
            ? s.barriers.filter((x) => x !== b)
            : [...s.barriers, b];
          return { barriers: sortBarriers(next), groupName: "커스텀 차단" };
        }),

      setGroupName: (v) => set({ groupName: v }),
      toggleApp: (name) =>
        set((s) => ({
          blockedApps: s.blockedApps.includes(name)
            ? s.blockedApps.filter((a) => a !== name)
            : [...s.blockedApps, name],
        })),
      setDuration: (min) => set({ durationMinutes: min }),

      startBlock: () => {
        const s = get();
        logEvent(
          "session_start",
          `${s.groupName} · ${s.durationMinutes}분 · 벌칙[${s.barriers.join("+")}] · 앱[${s.blockedApps.join("/")}]`
        );
        set({ isActive: true, startedAt: Date.now() });
      },

      endBlock: (reason) =>
        set((s) => {
          const added =
            s.startedAt != null
              ? Math.round(
                  ((Date.now() - s.startedAt) / 1000 / 60) *
                    (s.demoFast ? 60 : 1)
                )
              : 0;
          logEvent(
            reason === "completed" ? "session_completed" : "leash_broken",
            s.groupName
          );
          const entry: HistoryEntry =
            reason === "completed"
              ? { time: nowTimeLabel(), app: s.groupName, result: "산책 완주 🏠" }
              : {
                  time: nowTimeLabel(),
                  app: s.blockedApps[0] ?? "앱",
                  result: "줄 끊음 ✂️",
                };
          return {
            isActive: false,
            startedAt: null,
            walkMinutes: s.walkMinutes + Math.max(0, added),
            breaks: reason === "broken" ? s.breaks + 1 : s.breaks,
            history: [entry, ...s.history].slice(0, 12),
          };
        }),

      recordResist: () =>
        set((s) => {
          logEvent("resist", s.groupName);
          return {
            resists: s.resists + 1,
            history: [
              {
                time: nowTimeLabel(),
                app:
                  s.blockedApps[
                    Math.floor(Math.random() * Math.max(1, s.blockedApps.length))
                  ] ?? "앱",
                result: "참음 ✅",
              },
              ...s.history,
            ].slice(0, 12),
          };
        }),

      recordBench: () =>
        set((s) => {
          logEvent("bench", s.blockedApps[0] ?? "앱");
          return {
            history: [
              {
                time: nowTimeLabel(),
                app: s.blockedApps[0] ?? "앱",
                result: "벤치 🍿",
              },
              ...s.history,
            ].slice(0, 12),
          };
        }),

      recordFine: (amount) =>
        set((s) => {
          logEvent("fine", `₩${amount.toLocaleString("ko-KR")}`);
          return {
            finesTotal: s.finesTotal + amount,
            fineCountToday: s.fineCountToday + 1,
          };
        }),

      reset: () => set({ ...DEFAULTS }),
    }),
    { name: "leash-demo" }
  )
);
