"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLeash } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { advance, parseSeq } from "@/lib/sequence";
import { fineFor, multiplierLabel, won } from "@/lib/escalation";
import GiveUpBar from "@/components/GiveUpBar";

function FineInner() {
  const router = useRouter();
  const remaining = parseSeq(useSearchParams().get("seq"));
  const mounted = useMounted();
  const fineCountToday = useLeash((s) => s.fineCountToday);
  const finesTotal = useLeash((s) => s.finesTotal);
  const recordFine = useLeash((s) => s.recordFine);

  if (!mounted) return <div className="flex-1" />;

  const amount = fineFor(fineCountToday);
  const ordinal = fineCountToday + 1;

  const pay = () => {
    recordFine(amount);
    advance(router, remaining);
  };

  return (
    <div className="flex flex-1 flex-col px-8 text-center">
      <GiveUpBar barrier="fine" />
      <div className="flex flex-1 flex-col items-center justify-center">
      <p className="text-[15px] text-ink-2">예외 사용권</p>
      <div className="tnum mt-3 text-[44px] font-semibold text-ochre">
        {won(amount)}
      </div>

      <div className="mt-3 rounded-xl bg-ochre-light px-4 py-2 text-[13px] text-ink-2">
        오늘 {ordinal}번째 →{" "}
        {fineCountToday === 0 ? "기본 금액" : `${Math.pow(1.5, fineCountToday).toFixed(2)}배 적용`}
        <br />
        <span className="text-ink-3">{multiplierLabel(fineCountToday)}</span>
      </div>

      <button onClick={pay} className="btn-primary mt-8 w-full py-4 text-[16px]">
        결제하고 열기
      </button>
      <p className="mt-3 text-[12px] text-ink-3">
        (데모 — 실제 결제는 일어나지 않습니다)
      </p>

      <p className="mt-6 text-[13px] text-ink-2">
        이번 달 누적: <span className="font-medium">{won(finesTotal)}</span>
      </p>
      </div>
    </div>
  );
}

export default function FineBarrier() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <FineInner />
    </Suspense>
  );
}
