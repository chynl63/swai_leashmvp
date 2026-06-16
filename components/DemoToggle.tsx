"use client";

import { useEffect, useState } from "react";
import { useLeash } from "@/lib/store";

/** ⚡ 데모 가속 ON/OFF (spec §7) */
export default function DemoToggle() {
  const demoFast = useLeash((s) => s.demoFast);
  const toggleDemoFast = useLeash((s) => s.toggleDemoFast);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={toggleDemoFast}
      className="pointer-events-auto absolute bottom-[28px] right-3 z-40 rounded-full border border-line bg-white/85 px-2.5 py-1 text-[10px] font-medium text-ink-2 shadow-sm backdrop-blur"
      title="1시간=1분 가속 (교수님 시연용)"
    >
      ⚡ 데모 가속 {demoFast ? "ON" : "OFF"}
    </button>
  );
}
