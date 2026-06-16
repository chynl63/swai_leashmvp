import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PROFILES, type Profile, profileByKey } from "./profiles";
import { logEvent } from "./log";

export type HistoryEntry = {
  time: string; // "14:23"
  app: string;
  result: string; // "참음 ✅" | "벌금 ₩2,250" | "벤치 🍿" | "줄 끊음"
};

type LeashState = {
  // 설정
  nickname: string;
  demoFast: boolean; // ⚡ 데모 가속
  profileKey: string;
  blockedApps: string[];
  durationMinutes: number;

  // 세션
  isActive: boolean;
  startedAt: number | null; // ms (실제 시각)

  // 통계
  walkMinutes: number; // 누적 산책(분, 데모 화면 기준)
  resists: number;
  breaks: number; // 줄 끊은 횟수
  finesTotal: number; // 이번 달 누적 벌금
  fineCountToday: number; // 오늘 벌금 시도 횟수 (에스컬레이션)
  history: HistoryEntry[];

  // actions
  setNickname: (v: string) => void;
  toggleDemoFast: () => void;
  setProfile: (key: string) => void;
  toggleApp: (name: string) => void;
  setDuration: (min: number) => void;
  startBlock: () => void;
  endBlock: (reason: "completed" | "broken") => void;
  recordResist: () => void;
  recordBench: () => void;
  recordFine: (amount: number) => void;
  reset: () => void;

  // derived
  profile: () => Profile;
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
  profileKey: PROFILES[0].key,
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
      setProfile: (key) => set({ profileKey: key }),
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
          `${s.profile().name} · ${s.durationMinutes}분 · ${s.blockedApps.join("/")}`
        );
        set({ isActive: true, startedAt: Date.now() });
      },

      endBlock: (reason) =>
        set((s) => {
          logEvent(
            reason === "completed" ? "session_completed" : "leash_broken",
            s.profile().name
          );
          const added =
            s.startedAt != null
              ? Math.round(
                  ((Date.now() - s.startedAt) / 1000 / 60) *
                    (s.demoFast ? 60 : 1)
                )
              : 0;
          const entry: HistoryEntry =
            reason === "completed"
              ? {
                  time: nowTimeLabel(),
                  app: s.profile().name,
                  result: "산책 완주 🏠",
                }
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
          logEvent("resist", s.profile().name);
          return {
          resists: s.resists + 1,
          history: [
            {
              time: nowTimeLabel(),
              app: s.blockedApps[Math.floor(Math.random() * Math.max(1, s.blockedApps.length))] ?? "앱",
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

      profile: () => profileByKey(get().profileKey),
    }),
    {
      name: "leash-demo",
      // profile()는 함수이므로 직렬화 제외
      partialize: (s) => {
        const { profile, ...rest } = s as LeashState & Record<string, unknown>;
        void profile;
        return rest as LeashState;
      },
    }
  )
);
