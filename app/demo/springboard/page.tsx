"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLeash } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { appMeta } from "@/components/AppIcon";

type Tile = {
  name: string;
  emoji: string;
  color: string;
  blocked: boolean;
  leash?: boolean;
};

const SYSTEM_GRID: { name: string; emoji: string; color: string }[] = [
  { name: "사진", emoji: "🌄", color: "#1C1C1E" },
  { name: "설정", emoji: "⚙️", color: "#8E8E93" },
  { name: "날씨", emoji: "⛅", color: "#3478F7" },
  { name: "시계", emoji: "⏰", color: "#1C1C1E" },
  { name: "캘린더", emoji: "📅", color: "#FFFFFF" },
  { name: "지도", emoji: "🗺️", color: "#A0D9A0" },
  { name: "계산기", emoji: "🧮", color: "#1C1C1E" },
  { name: "App Store", emoji: "🅰️", color: "#3478F7" },
];

const DOCK: { name: string; emoji: string; color: string }[] = [
  { name: "전화", emoji: "📞", color: "#30B650" },
  { name: "메시지", emoji: "💬", color: "#34C759" },
  { name: "카메라", emoji: "📸", color: "#3A3A3C" },
];

const container = {
  show: { transition: { staggerChildren: 0.025 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1 },
};

function IconTile({
  tile,
  onTap,
}: {
  tile: Tile;
  onTap: (t: Tile) => void;
}) {
  return (
    <motion.button
      variants={item}
      whileTap={{ scale: 0.88 }}
      onClick={() => onTap(tile)}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative">
        <div
          className="flex h-[58px] w-[58px] items-center justify-center rounded-[15px] text-[30px] shadow-sm"
          style={{ background: tile.color }}
        >
          {tile.emoji}
        </div>
        {tile.blocked && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ochre text-[11px] shadow">
            🔒
          </span>
        )}
      </div>
      <span className="max-w-[64px] truncate text-[11px] text-white drop-shadow">
        {tile.name}
      </span>
    </motion.button>
  );
}

export default function Springboard() {
  const router = useRouter();
  const mounted = useMounted();
  const blockedApps = useLeash((s) => s.blockedApps);
  const isActive = useLeash((s) => s.isActive);

  const [opening, setOpening] = useState<Tile | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!mounted) return <div className="flex-1" />;

  const blockedTiles: Tile[] = blockedApps.map((n) => {
    const m = appMeta(n);
    return { name: n, emoji: m.short, color: m.color, blocked: true };
  });
  const systemTiles: Tile[] = SYSTEM_GRID.map((s) => ({ ...s, blocked: false }));
  const gridTiles = [...blockedTiles, ...systemTiles];

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1700);
  };

  const tap = (t: Tile) => {
    if (t.leash) {
      router.push("/demo");
      return;
    }
    if (t.blocked && isActive) {
      // 앱이 열리는 듯한 줌인 → 인터럽트가 막아섬
      setOpening(t);
      setTimeout(() => router.push("/demo/interrupt"), 480);
      return;
    }
    if (t.blocked) flash(`${t.name} 열림 · 지금은 잠겨 있지 않아요`);
    else flash(`${t.name} 열림 · 잠기지 않은 앱`);
  };

  const leashTile: Tile = {
    name: "Leash",
    emoji: "🔗",
    color: "#E8A835",
    blocked: false,
    leash: true,
  };

  return (
    <div
      className="relative flex flex-1 flex-col"
      style={{
        background:
          "linear-gradient(165deg, #FDF3E0 0%, #EfECE6 45%, #DAD9DE 100%)",
      }}
    >
      {/* 앱 그리드 */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-x-4 gap-y-5 px-6 pt-6"
      >
        {gridTiles.map((t) => (
          <motion.div key={t.name} variants={item}>
            <IconTile tile={t} onTap={tap} />
          </motion.div>
        ))}
      </motion.div>

      {/* 안내 */}
      {isActive && (
        <p className="mt-6 px-6 text-center text-[12px] text-ink-3">
          🔒 표시된 앱을 눌러보세요. 산책 중이라 막힙니다.
        </p>
      )}

      <div className="flex-1" />

      {/* Dock */}
      <div className="mx-3 mb-2 flex items-center justify-around rounded-[26px] bg-white/35 p-3 backdrop-blur-xl">
        {DOCK.map((d) => (
          <IconTile
            key={d.name}
            tile={{ ...d, blocked: false }}
            onTap={(t) => flash(`${t.name} 열림 · 잠기지 않은 앱`)}
          />
        ))}
        <IconTile tile={leashTile} onTap={tap} />
      </div>

      {/* 토스트 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[26px] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-4 py-2 text-[12px] text-white"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 앱 열리는 줌인 효과 */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: opening.color }}
              initial={{ scale: 0.25, borderRadius: "26%" }}
              animate={{ scale: 1.6, borderRadius: "0%" }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.span
              className="relative text-[64px]"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              {opening.emoji}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
