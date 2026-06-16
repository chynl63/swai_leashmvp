/**
 * 데모 활동 로그를 Google Sheets `events` 시트에 기록.
 * (헤더: id | type | detail | created_at)
 * Sheets URL이 없으면 조용히 무시한다. 전송 실패도 데모를 막지 않는다(fire-and-forget).
 */
import { hasSheetDB, sheetInsert } from "./sheetdb";

export function logEvent(type: string, detail = ""): void {
  if (!hasSheetDB || typeof window === "undefined") return;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  sheetInsert("events", {
    id,
    type,
    detail,
    created_at: new Date().toISOString(),
  }).catch(() => {});
}
