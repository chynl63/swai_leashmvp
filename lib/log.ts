/**
 * 데모 활동 로그를 Google Sheets `events` 시트에 기록.
 * (헤더: id | type | detail | created_at)
 * Sheets URL이 없으면 조용히 무시한다. 전송 실패도 데모를 막지 않는다(fire-and-forget).
 */
import { hasSheetDB, sheetInsert } from "./sheetdb";
import { makeId, getUV } from "./id";

export function logEvent(type: string, detail = ""): void {
  if (!hasSheetDB || typeof window === "undefined") return;
  // id: 행 식별용(매번 고유) / uv: 사람 식별용(같은 사람=같은 값, visitors id와 동일)
  sheetInsert("events", {
    id: makeId(),
    uv: getUV(),
    type,
    detail,
    created_at: new Date().toISOString(),
  }).catch(() => {});
}
