"use client";

import { useEffect } from "react";

/** /demo 세그먼트 에러 바운더리 — 흰 화면 대신 복구 UI. 오래된 상태가 원인이면 초기화로 해결. */
export default function DemoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 오래된 저장 상태가 원인인 경우가 많아 자동 정리 시도
    try {
      localStorage.removeItem("leash-demo");
    } catch {
      /* no-op */
    }
    // eslint-disable-next-line no-console
    console.error("[demo error]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-[40px]">🐾</div>
      <p className="text-[16px] font-medium text-ink">잠깐 문제가 생겼어요</p>
      <p className="text-[13px] leading-relaxed text-ink-2">
        데모를 다시 불러오면 정상으로 돌아와요.
      </p>
      <button
        onClick={() => {
          try {
            localStorage.removeItem("leash-demo");
          } catch {
            /* no-op */
          }
          reset();
          if (typeof window !== "undefined") window.location.reload();
        }}
        className="btn-primary px-6 py-3 text-[14px]"
      >
        초기화하고 다시 시도
      </button>
    </div>
  );
}
