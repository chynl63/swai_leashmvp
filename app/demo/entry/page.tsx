"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logEvent } from "@/lib/log";
import { sheetInsert } from "@/lib/sheetdb";
import Character from "@/components/Character";

/**
 * 해제 완료 직전 — 추첨 응모 화면.
 * 모든 벌칙을 통과한(=차단을 푼) 사람만 도달. 이메일로 응모.
 * 퍼널: unblock_complete(도달) → entry(응모 제출).
 */
export default function EntryPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logEvent("unblock_complete");
  }, []);

  const finish = () => router.replace("/demo/transition?kind=hurt");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    logEvent("entry", value || "(이메일 미입력)");
    sheetInsert("entries", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: value,
      created_at: new Date().toISOString(),
    }).catch(() => {});
    setSent(true);
    setTimeout(finish, 1400);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
      <Character view="front" effect="sparkle" size={130} />

      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <p className="text-[18px] font-semibold text-ink">응모 완료! 🎉</p>
          <p className="mt-2 text-[13px] text-ink-2">
            차단을 해제할게요...
          </p>
        </motion.div>
      ) : (
        <>
          <p className="mt-5 text-[18px] font-semibold text-ink">
            벌칙 통과! 차단 해제 직전이에요
          </p>
          <div className="mt-4 rounded-xl bg-ochre-light px-4 py-3 text-[13px] text-ochre-dark">
            🎁 응모하면 <b>배달의민족 2만원권</b>을 5명께 드려요
          </div>

          <form onSubmit={submit} className="mt-5 flex w-full flex-col gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 (당첨 안내용)"
              className="w-full rounded-xl border border-line bg-card px-4 py-3.5 text-center text-[15px] outline-none focus:border-ochre"
            />
            <button type="submit" className="btn-primary py-3.5 text-[15px]">
              응모하고 차단 해제
            </button>
            <button
              type="button"
              onClick={finish}
              className="py-2 text-[13px] text-ink-3 underline underline-offset-2"
            >
              응모 없이 해제
            </button>
          </form>
        </>
      )}
    </div>
  );
}
