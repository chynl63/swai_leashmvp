/**
 * 감시자 승인 (spec §4.6, design memory: 소셜 프레셔 핵심 차별점)
 *
 * - Supabase가 설정돼 있으면 approval_requests 테이블 + Realtime 사용
 * - 없으면 localStorage + BroadcastChannel 폴백 (같은 브라우저 탭 간 동작 → 데모 OK)
 */
import { supabase } from "./supabase";

export type ApprovalStatus = "pending" | "approved" | "denied";
export type Approval = {
  token: string;
  guardianName: string;
  status: ApprovalStatus;
  createdAt: number;
};

const LS_PREFIX = "leash-approval:";
const channelName = "leash-approval";

function lsKey(token: string) {
  return LS_PREFIX + token;
}

/** 랜덤 토큰 */
export function makeToken(): string {
  const a = Math.random().toString(36).slice(2, 8);
  const b = Math.random().toString(36).slice(2, 8);
  return `${a}${b}`;
}

export async function createApproval(
  token: string,
  guardianName: string
): Promise<void> {
  const record: Approval = {
    token,
    guardianName,
    status: "pending",
    createdAt: Date.now(),
  };
  if (supabase) {
    await supabase.from("approval_requests").insert({
      token,
      guardian_name: guardianName,
      status: "pending",
    });
    return;
  }
  localStorage.setItem(lsKey(token), JSON.stringify(record));
}

export async function getApproval(token: string): Promise<Approval | null> {
  if (supabase) {
    const { data } = await supabase
      .from("approval_requests")
      .select("token, guardian_name, status, created_at")
      .eq("token", token)
      .single();
    if (!data) return null;
    return {
      token: data.token,
      guardianName: data.guardian_name,
      status: data.status as ApprovalStatus,
      createdAt: new Date(data.created_at).getTime(),
    };
  }
  const raw = localStorage.getItem(lsKey(token));
  return raw ? (JSON.parse(raw) as Approval) : null;
}

export async function setApprovalStatus(
  token: string,
  status: ApprovalStatus
): Promise<void> {
  if (supabase) {
    await supabase
      .from("approval_requests")
      .update({ status })
      .eq("token", token);
    return;
  }
  const raw = localStorage.getItem(lsKey(token));
  if (!raw) return;
  const rec = JSON.parse(raw) as Approval;
  rec.status = status;
  localStorage.setItem(lsKey(token), JSON.stringify(rec));
  // 다른 탭에 알림
  try {
    new BroadcastChannel(channelName).postMessage({ token, status });
  } catch {
    /* no-op */
  }
}

/** 상태 변화를 구독. 정리 함수 반환. */
export function watchApproval(
  token: string,
  cb: (status: ApprovalStatus) => void
): () => void {
  if (supabase) {
    const ch = supabase
      .channel(`approval-${token}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "approval_requests",
          filter: `token=eq.${token}`,
        },
        (payload) => {
          const status = (payload.new as { status?: ApprovalStatus }).status;
          if (status) cb(status);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }

  // 폴백: BroadcastChannel + storage 이벤트
  let bc: BroadcastChannel | null = null;
  try {
    bc = new BroadcastChannel(channelName);
    bc.onmessage = (e) => {
      if (e.data?.token === token && e.data?.status) cb(e.data.status);
    };
  } catch {
    /* no-op */
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === lsKey(token) && e.newValue) {
      try {
        const rec = JSON.parse(e.newValue) as Approval;
        cb(rec.status);
      } catch {
        /* no-op */
      }
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    bc?.close();
    window.removeEventListener("storage", onStorage);
  };
}
