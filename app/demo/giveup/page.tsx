"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logEvent } from "@/lib/log";
import { BARRIER_LABEL, type BarrierType } from "@/lib/profiles";
import Character from "@/components/Character";

const REASONS = [
  "너무 귀찮아서",
  "시간이 오래 걸려서",
  "벌칙이 어려워서",
  "그 앱, 그렇게까지 급하진 않아서",
  "그냥 안 쓰기로 했어요",
];

function GiveupInner() {
  const router = useRouter();
  const barrier = useSearchParams().get("barrier") ?? "";
  const barrierLabel =
    BARRIER_LABEL[barrier as BarrierType]?.label ?? barrier ?? "벌칙";
  const [other, setOther] = useState("");

  const submit = (reason: string) => {
    // 포기 사유 로깅 (어느 벌칙에서 포기했는지 + 사유)
    logEvent("giveup_reason", `${barrier || "?"} | ${reason}`.slice(0, 180));
    router.replace("/demo/transition?kind=resist");
  };

  return (
    <div className="flex flex-1 flex-col px-6 pt-8">
      <div className="flex flex-col items-center text-center">
        <Character view="front" size={110} />
        <h2 className="mt-4 text-[20px] font-semibold text-ink">
          왜 포기했어요?
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          {barrierLabel} 중에 그만뒀어요. 솔직히 알려주시면
          <br />
          검증에 큰 도움이 됩니다. (응모와 무관)
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {REASONS.map((r) => (
          <button
            key={r}
            onClick={() => submit(r)}
            className="rounded-xl border border-line bg-white px-4 py-3 text-left text-[15px] text-ink active:scale-[0.99]"
          >
            {r}
          </button>
        ))}
      </div>

      {/* 기타 직접 입력 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (other.trim()) submit(`기타: ${other.trim()}`);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder="기타 (직접 입력)"
          className="flex-1 rounded-xl border border-line bg-card px-4 py-3 text-[14px] outline-none focus:border-ochre"
        />
        <button
          type="submit"
          disabled={!other.trim()}
          className="btn-primary px-4 text-[14px] disabled:opacity-40"
        >
          제출
        </button>
      </form>

      <button
        onClick={() => submit("무응답")}
        className="mb-6 mt-4 text-center text-[13px] text-ink-3 underline underline-offset-2"
      >
        응답 안 하고 산책 잇기
      </button>
    </div>
  );
}

export default function Giveup() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <GiveupInner />
    </Suspense>
  );
}
