"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logEvent } from "@/lib/log";
import { sheetInsert } from "@/lib/sheetdb";
import { makeId } from "@/lib/id";
import Character from "@/components/Character";

/**
 * 해제 완료 직전 — 완료자 설문 + 추첨 응모.
 * 모든 벌칙을 통과한(=차단을 푼) 사람만 도달.
 * 퍼널: unblock_complete(도달) → complete_survey(설문) → entry(응모 제출).
 */
const Q1 = [
  { v: "네", label: "네, 풀었을 것" },
  { v: "아니오", label: "아니오, 상금 때문" },
  { v: "모르겠음", label: "모르겠음" },
];

export default function EntryPage() {
  const router = useRouter();
  const [noPrize, setNoPrize] = useState<string | null>(null); // 상금 없었어도?
  const [annoy, setAnnoy] = useState<number | null>(null); // 귀찮음 1~5
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logEvent("unblock_complete");
  }, []);

  const proceed = (withEntry: boolean) => {
    logEvent(
      "complete_survey",
      `상금없어도=${noPrize ?? "무응답"} | 귀찮음=${annoy ?? "무응답"}`
    );
    if (withEntry) {
      const value = email.trim();
      logEvent("entry", value || "(이메일 미입력)");
      sheetInsert("entries", {
        id: makeId(),
        email: value,
        created_at: new Date().toISOString(),
      }).catch(() => {});
    }
    setSent(true);
    setTimeout(() => router.replace("/demo/transition?kind=hurt"), 1300);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    proceed(true);
  };

  if (sent) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
        <Character view="front" effect="sparkle" size={120} />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-[18px] font-semibold text-ink"
        >
          고마워요! 🎉
        </motion.p>
        <p className="mt-2 text-[13px] text-ink-2">차단을 해제할게요...</p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pt-6">
      <div className="flex flex-col items-center text-center">
        <Character view="front" size={92} />
        <h2 className="mt-3 text-[19px] font-semibold text-ink">
          벌칙 통과! 차단 해제 직전
        </h2>
        <p className="mt-1 text-[13px] text-ink-2">
          짧은 질문 2개만 답해주세요 (검증용)
        </p>
      </div>

      {/* Q1 — 상금 없었어도? */}
      <div className="mt-5">
        <p className="text-[14px] font-medium text-ink">
          추첨 상금이 없었어도 끝까지 풀었을까요?
        </p>
        <div className="mt-2 flex gap-2">
          {Q1.map((o) => (
            <button
              key={o.v}
              onClick={() => setNoPrize(o.v)}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-[12px] font-medium transition ${
                noPrize === o.v
                  ? "border-ochre bg-ochre-light text-ochre-dark"
                  : "border-line bg-white text-ink-2"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Q2 — 얼마나 귀찮았나 */}
      <div className="mt-4">
        <p className="text-[14px] font-medium text-ink">
          방금 벌칙, 얼마나 귀찮았나요?
        </p>
        <div className="mt-2 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setAnnoy(n)}
              className={`flex-1 rounded-lg border py-2.5 text-[15px] font-semibold transition ${
                annoy === n
                  ? "border-ochre bg-ochre text-white"
                  : "border-line bg-white text-ink-2"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-ink-3">
          <span>안 귀찮음</span>
          <span>매우 귀찮음</span>
        </div>
      </div>

      {/* 응모 */}
      <div className="mt-5 rounded-xl bg-ochre-light px-4 py-3 text-center text-[13px] text-ochre-dark">
        🎁 응모하면 <b>배달의민족 2만원권</b>을 5명께 드려요
      </div>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-2.5 pb-4">
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
          onClick={() => proceed(false)}
          className="py-1.5 text-[13px] text-ink-3 underline underline-offset-2"
        >
          응모 없이 해제
        </button>
      </form>
    </div>
  );
}
