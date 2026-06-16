"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Character, { type CharEffect, type CharView } from "./Character";

/** 2~2.5초 전환 화면 공용 컴포넌트 (spec §4.5, §4.7, §4.8) */
export default function TransitionScreen({
  view = "front",
  effect = "none",
  lines,
  groupName,
  durationMs = 2500,
  onDone,
}: {
  view?: CharView;
  effect?: CharEffect;
  lines: string[];
  groupName?: string;
  durationMs?: number;
  onDone: () => void;
}) {
  useEffect(() => {
    const id = setTimeout(onDone, durationMs);
    return () => clearTimeout(id);
  }, [durationMs, onDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      {groupName && (
        <div className="absolute top-[60px] rounded-full bg-muted px-5 py-1.5 text-[16px] font-semibold text-ink">
          {groupName}
        </div>
      )}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <Character view={view} effect={effect} size={190} />
      </motion.div>
      <motion.p
        className="mt-8 whitespace-pre-line text-[17px] font-medium leading-relaxed text-ink-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {lines.join("\n")}
      </motion.p>
    </div>
  );
}
