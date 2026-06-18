/**
 * 데모 활동 로그를 Google Sheets `events` 시트에 기록.
 * (헤더: id | type | detail | created_at)
 * Sheets URL이 없으면 조용히 무시한다. 전송 실패도 데모를 막지 않는다(fire-and-forget).
 */
import { hasSheetDB, sheetInsert } from "./sheetdb";
import { makeId } from "./id";

export function logEvent(type: string, detail = ""): void {
  if (!hasSheetDB || typeof window === "undefined") return;
  // 각 이벤트는 별도 행 → 매번 고유한 6자 id (UV 재사용 시 업서트로 덮어써짐)
  sheetInsert("events", {
    id: makeId(),
    type,
    detail,
    created_at: new Date().toISOString(),
  }).catch(() => {});
}
