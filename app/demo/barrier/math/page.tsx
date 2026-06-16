"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { generateProblems } from "@/lib/math-generator";
import { advance, parseSeq } from "@/lib/sequence";
import GiveUpBar from "@/components/GiveUpBar";

const TOTAL = 5;

function MathInner() {
  const router = useRouter();
  const remaining = parseSeq(useSearchParams().get("seq"));

  const problems = useMemo(() => generateProblems(TOTAL), []);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [shake, setShake] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = parseInt(value.replace(/[, ]/g, ""), 10);
    if (guess === problems[idx].answer) {
      if (idx + 1 >= TOTAL) {
        advance(router, remaining);
      } else {
        setIdx(idx + 1);
        setValue("");
      }
    } else {
      setWrong((w) => w + 1);
      setShake(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(120);
      setValue("");
      setTimeout(() => setShake(false), 420);
    }
  };

  return (
    <div className="flex flex-1 flex-col px-6 pt-2">
      <GiveUpBar barrier="math" />
      <div className="mt-2 text-[14px] font-medium text-ink-3">
        수학 문제 {idx + 1}/{TOTAL}
      </div>
      {/* 진행 점 */}
      <div className="mt-3 flex gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < idx ? "bg-ochre" : i === idx ? "bg-ochre/40" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          key={idx}
          className={`tnum text-[42px] font-semibold text-ink ${shake ? "shake" : ""}`}
        >
          {problems[idx].question} = ?
        </motion.div>

        <form onSubmit={submit} className="mt-10 flex w-full flex-col items-center gap-4">
          <input
            autoFocus
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="정답 입력"
            className={`tnum w-full rounded-xl border bg-card px-4 py-4 text-center text-[24px] outline-none ${
              shake ? "border-danger" : "border-line focus:border-ochre"
            }`}
          />
          <button type="submit" className="btn-primary w-full py-4 text-[16px]">
            확인
          </button>
        </form>

        {wrong > 0 && (
          <p className="mt-4 text-[13px] text-danger">오답 {wrong}회 · 처음부터는 아니에요, 이 문제만 다시</p>
        )}
      </div>
    </div>
  );
}

export default function MathBarrier() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <MathInner />
    </Suspense>
  );
}
