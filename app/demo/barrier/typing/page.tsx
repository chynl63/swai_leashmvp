"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { advance, parseSeq } from "@/lib/sequence";
import GiveUpBar from "@/components/GiveUpBar";

const TARGET = "나는 지금 시간을 낭비하고 있으며 이 앱을 여는 것이 부끄럽습니다";

function TypingInner() {
  const router = useRouter();
  const remaining = parseSeq(useSearchParams().get("seq"));
  const [value, setValue] = useState("");

  const matched = value === TARGET;
  const correctCount = (() => {
    let c = 0;
    for (let i = 0; i < value.length && i < TARGET.length; i++) {
      if (value[i] === TARGET[i]) c++;
    }
    return c;
  })();

  useEffect(() => {
    if (matched) {
      const id = setTimeout(() => advance(router, remaining), 500);
      return () => clearTimeout(id);
    }
  }, [matched, remaining, router]);

  return (
    <div className="flex flex-1 flex-col px-6 pt-2">
      <GiveUpBar barrier="typing" />
      <h2 className="mt-2 text-[20px] font-medium text-ink">
        아래 문장을 정확히 따라 쓰세요
      </h2>

      <div className="mt-6 rounded-2xl bg-ochre-light p-5 text-[18px] leading-relaxed">
        {TARGET.split("").map((ch, i) => {
          const typed = value[i];
          const cls =
            typed == null
              ? "text-ink-3"
              : typed === ch
                ? "text-ink"
                : "rounded bg-danger/15 text-danger";
          return (
            <span key={i} className={cls}>
              {ch}
            </span>
          );
        })}
      </div>

      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="여기에 입력..."
        className="mt-5 w-full resize-none rounded-xl border border-line bg-card px-4 py-3 text-[16px] outline-none focus:border-ochre"
      />

      <div className="mt-3 flex items-center justify-between text-[13px]">
        <span className="text-ink-2">
          정확도: {correctCount}/{TARGET.length}자
        </span>
        {matched ? (
          <span className="font-medium text-success">완벽 일치 ✓</span>
        ) : (
          <span className="text-ink-3">완벽히 일치해야 완료</span>
        )}
      </div>
    </div>
  );
}

export default function TypingBarrier() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <TypingInner />
    </Suspense>
  );
}
