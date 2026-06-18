/**
 * 감시자 승인 (spec §4.6 · 소셜 프레셔 핵심 차별점)
 *
 * 백엔드: Google Sheets (`approval_requests` 시트, 헤더: id | guardian_name | status | created_at)
 *   - 설정돼 있으면 Sheets에 기록 + 폴링으로 상태 변화 감지 → 다른 기기에서도 동작
 *   - 같은 브라우저 탭 간에는 BroadcastChannel로 즉시 반영
 *   - Sheets URL이 없으면 BroadcastChannel/localStorage 폴백 (오프라인 데모)
 */
import { hasSheetDB, sheetInsert, sheetRead } from "./sheetdb";
import { makeId } from "./id";

export type ApprovalStatus = "pending" | "approved" | "denied";
export type Approval = {
  token: string;
  guardianName: string;
  status: ApprovalStatus;
  createdAt: number;
};

const TABLE = "approval_requests";
const LS_PREFIX = "leash-approval:";
const channelName = "leash-approval";

const lsKey = (token: string) => LS_PREFIX + token;

export function makeToken(): string {
  return makeId();
}

function broadcast(token: string, status: ApprovalStatus) {
  try {
    const bc = new BroadcastChannel(channelName);
    bc.postMessage({ token, status });
    bc.close();
  } catch {
    /* no-op */
  }
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
  // 같은 브라우저 폴백용
  try {
    localStorage.setItem(lsKey(token), JSON.stringify(record));
  } catch {
    /* no-op */
  }
  if (hasSheetDB) {
    await sheetInsert(TABLE, {
      id: token,
      guardian_name: guardianName,
      status: "pending",
      created_at: new Date().toISOString(),
    }).catch(() => {});
  }
}

export async function getApproval(token: string): Promise<Approval | null> {
  if (hasSheetDB) {
    try {
      const row = (await sheetRead(TABLE, token)) as Record<
        string,
        unknown
      > | null;
      if (row && row.id != null) {
        return {
          token,
          guardianName: String(row.guardian_name ?? "감시자"),
          status: (String(row.status || "pending") as ApprovalStatus),
          createdAt: Date.now(),
        };
      }
    } catch {
      /* fall through to localStorage */
    }
  }
  try {
    const raw = localStorage.getItem(lsKey(token));
    return raw ? (JSON.parse(raw) as Approval) : null;
  } catch {
    return null;
  }
}

export async function setApprovalStatus(
  token: string,
  status: ApprovalStatus
): Promise<void> {
  // 같은 브라우저 폴백 갱신 + 즉시 알림
  try {
    const raw = localStorage.getItem(lsKey(token));
    if (raw) {
      const rec = JSON.parse(raw) as Approval;
      rec.status = status;
      localStorage.setItem(lsKey(token), JSON.stringify(rec));
    }
  } catch {
    /* no-op */
  }
  broadcast(token, status);

  if (hasSheetDB) {
    // insert는 같은 id면 업서트(상태 갱신)
    await sheetInsert(TABLE, { id: token, status }).catch(() => {});
  }
}

/** 상태 변화를 구독. 정리 함수 반환. */
export function watchApproval(
  token: string,
  cb: (status: ApprovalStatus) => void
): () => void {
  let stopped = false;

  // 1) 같은 브라우저 탭 즉시 반영
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
        cb((JSON.parse(e.newValue) as Approval).status);
      } catch {
        /* no-op */
      }
    }
  };
  window.addEventListener("storage", onStorage);

  // 2) 다른 기기 반영 — Sheets 폴링
  let poll: ReturnType<typeof setInterval> | null = null;
  if (hasSheetDB) {
    poll = setInterval(async () => {
      if (stopped) return;
      try {
        const row = (await sheetRead(TABLE, token)) as Record<
          string,
          unknown
        > | null;
        const status = row?.status as ApprovalStatus | undefined;
        if (status && status !== "pending") cb(status);
      } catch {
        /* no-op */
      }
    }, 2500);
  }

  return () => {
    stopped = true;
    bc?.close();
    window.removeEventListener("storage", onStorage);
    if (poll) clearInterval(poll);
  };
}
