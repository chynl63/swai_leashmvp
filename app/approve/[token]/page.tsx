"use client";

import { use, useEffect, useState } from "react";
import {
  getApproval,
  setApprovalStatus,
  type Approval,
  type ApprovalStatus,
} from "@/lib/approval";
import Character from "@/components/Character";

export default function ApprovePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [approval, setApproval] = useState<Approval | null | undefined>(undefined);
  const [acted, setActed] = useState<ApprovalStatus | null>(null);

  useEffect(() => {
    getApproval(token).then(setApproval);
  }, [token]);

  const act = async (status: ApprovalStatus) => {
    await setApprovalStatus(token, status);
    setActed(status);
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#0E0E0E] px-6">
      <div className="w-full max-w-[420px] rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-5 flex justify-center">
          <Character view="front" effect={acted === "approved" ? "blush" : "none"} size={120} />
        </div>

        <div className="text-[13px] font-medium tracking-[0.25em] text-ochre">
          LEASH · 감시자 승인
        </div>

        {approval === undefined ? (
          <p className="mt-6 text-ink-2">불러오는 중...</p>
        ) : approval === null ? (
          <p className="mt-6 text-ink-2">
            유효하지 않거나 만료된 승인 요청이에요.
          </p>
        ) : acted ? (
          <p
            className={`mt-6 text-[18px] font-semibold ${
              acted === "approved" ? "text-success" : "text-danger"
            }`}
          >
            {acted === "approved" ? "승인했어요 ✅" : "거부했어요 🚫"}
            <br />
            <span className="text-[14px] font-normal text-ink-2">
              앱 화면이 자동으로 업데이트됩니다.
            </span>
          </p>
        ) : (
          <>
            <h1 className="mt-4 text-[20px] font-medium text-ink">
              피보호자가 차단 해제를 요청했어요
            </h1>
            <p className="mt-2 text-[14px] text-ink-2">
              {approval.guardianName} 자격으로 승인하시겠어요?
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => act("denied")}
                className="flex-1 rounded-xl bg-muted py-4 text-[15px] font-medium text-ink"
              >
                거부
              </button>
              <button
                onClick={() => act("approved")}
                className="btn-primary flex-1 py-4 text-[15px]"
              >
                승인
              </button>
            </div>
            <p className="mt-5 text-[12px] text-ink-3">
              해제 시 피보호자의 산책(차단)이 즉시 중단됩니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
