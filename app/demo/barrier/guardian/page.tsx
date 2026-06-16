"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { advance, parseSeq } from "@/lib/sequence";
import {
  createApproval,
  makeToken,
  watchApproval,
  type ApprovalStatus,
} from "@/lib/approval";
import { hasSheetDB } from "@/lib/sheetdb";

const GUARDIAN = "엄마";

function GuardianInner() {
  const router = useRouter();
  const remaining = parseSeq(useSearchParams().get("seq"));

  const [token] = useState(() => makeToken());
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [copied, setCopied] = useState(false);
  const created = useRef(false);

  // 승인 요청 생성 + 구독
  useEffect(() => {
    if (created.current) return;
    created.current = true;
    createApproval(token, GUARDIAN);
    const unwatch = watchApproval(token, (s) => setStatus(s));
    return unwatch;
  }, [token]);

  useEffect(() => {
    if (status === "approved") {
      const id = setTimeout(() => advance(router, remaining), 900);
      return () => clearTimeout(id);
    }
  }, [status, remaining, router]);

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/approve/${token}`
      : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* no-op */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      {status === "approved" ? (
        <>
          <div className="text-[44px]">✅</div>
          <p className="mt-3 text-[18px] font-medium text-success">
            {GUARDIAN}이(가) 승인했어요
          </p>
        </>
      ) : status === "denied" ? (
        <>
          <div className="text-[44px]">🚫</div>
          <p className="mt-3 text-[18px] font-medium text-danger">
            {GUARDIAN}이(가) 거부했어요
          </p>
          <button
            onClick={() => router.replace("/demo/walk")}
            className="btn-soft mt-6 px-6 py-3 text-[14px]"
          >
            산책으로 돌아가기
          </button>
        </>
      ) : (
        <>
          <p className="text-[18px] font-medium text-ink">감시자 승인 대기 중</p>
          <p className="mt-2 text-[14px] text-ink-2">
            {GUARDIAN}에게 승인 요청을 보냈어요
          </p>

          <button
            onClick={copy}
            className="btn-primary mt-7 w-full py-3.5 text-[15px]"
          >
            {copied ? "복사됨 ✓" : "🔗 승인 링크 복사하기"}
          </button>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 text-[13px] text-ochre underline underline-offset-2"
          >
            데모: 새 탭에서 직접 승인하기
          </a>

          <p className="mt-6 text-[13px] text-ink-3">
            링크를 감시자에게 보내주세요.
            <br />
            감시자가 승인하면 자동으로 해제됩니다.
          </p>

          <div className="mt-7 flex items-center gap-2 text-[14px] text-ink-2">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-ochre border-t-transparent" />
            대기 중...
          </div>

          <p className="mt-6 text-[11px] text-ink-3">
            {hasSheetDB
              ? "Google Sheets 백엔드 연결됨 — 다른 기기에서도 승인 가능"
              : "데모 모드 — 같은 브라우저 탭 간 실시간 연결"}
          </p>
        </>
      )}
    </div>
  );
}

export default function GuardianBarrier() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <GuardianInner />
    </Suspense>
  );
}
