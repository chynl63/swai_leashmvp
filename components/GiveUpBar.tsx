"use client";

import { useRouter } from "next/navigation";
import { logEvent } from "@/lib/log";

/**
 * 벌칙 화면 상단의 '포기' 바.
 * 벌칙을 그만두고 차단을 유지(산책 계속)한다 = 참기와 동일 처리.
 * → 포기를 별도 이벤트(penalty_giveup)로 로깅 후 resist 전환(참음 + 산책 복귀).
 */
export default function GiveUpBar({ barrier }: { barrier?: string }) {
  const router = useRouter();
  const giveUp = () => {
    // 포기자 존재 로깅 + 어느 벌칙에서 포기했는지
    logEvent("penalty_giveup", barrier ?? "");
    // 포기 사유 설문으로
    router.replace(`/demo/giveup?barrier=${barrier ?? ""}`);
  };
  return (
    <div className="flex justify-end pt-3">
      <button
        onClick={giveUp}
        className="rounded-full bg-muted px-3.5 py-1.5 text-[12px] font-medium text-ink-2 active:scale-95"
      >
        ✕ 포기 (응모도 포기)
      </button>
    </div>
  );
}
