"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "./AppIcon";

/** 묶여있는 앱 — 접힘/펼침 아코디언 (spec §4.4) */
export default function AppListAccordion({
  groupName,
  apps,
}: {
  groupName: string;
  apps: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="text-[17px] font-semibold text-ink">{groupName}</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-ochre">
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M1.5 1.5L8 8L1.5 14.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {apps.map((name) => (
              <div
                key={name}
                className="flex items-center gap-3 border-t border-line px-5 py-3"
              >
                <AppIcon name={name} size={38} dim />
                <span className="text-[16px] text-ink">{name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
