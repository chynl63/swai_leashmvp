/**
 * 방문자 로깅 → Google Sheets `visitors` 탭.
 * 기존 스키마에 맞춤: id | landingUrl | ip | referer | time_stamp | utm | device | email | advice
 * (A열 헤더가 `id` 여야 insert가 동작합니다.)
 *
 * 세션당 1회만 기록한다(sessionStorage 가드).
 */
import { hasSheetDB, sheetInsert } from "./sheetdb";

const ONCE_KEY = "leash-visit-logged";

async function fetchIp(): Promise<string> {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const j = await r.json();
    return j?.ip ?? "";
  } catch {
    return "";
  }
}

export function logVisit(): void {
  if (!hasSheetDB || typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(ONCE_KEY)) return;
    sessionStorage.setItem(ONCE_KEY, "1");
  } catch {
    /* sessionStorage 불가해도 진행 */
  }

  const params = new URLSearchParams(window.location.search);
  const device = window.innerWidth < 768 ? "mobile" : "desktop";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  fetchIp().then((ip) => {
    sheetInsert("visitors", {
      id,
      landingUrl: window.location.href,
      ip,
      referer: document.referrer || "",
      time_stamp: new Date().toISOString(),
      utm: params.get("utm") ?? "",
      device,
    }).catch(() => {});
  });
}
