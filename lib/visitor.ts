/**
 * 방문자 로깅 → Google Sheets `visitors` 탭.
 * 원본 index.html 방식과 동일: 쿠키 UV id + 로컬 time_stamp + 9개 필드 전부.
 * 스키마: id | landingUrl | ip | referer | time_stamp | utm | device | email | advice
 * (A열 헤더가 `id` 여야 insert 동작)
 *
 * 세션당 1회 호출(중복 API 방지). 같은 사용자는 쿠키 UV가 같아 같은 행으로 업서트됨.
 */
import { hasSheetDB, sheetInsert } from "./sheetdb";
import { getUV } from "./id";

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

  fetchIp().then((ip) => {
    sheetInsert("visitors", {
      id: getUV(),
      landingUrl: window.location.href,
      ip,
      referer: document.referrer || "",
      time_stamp: new Date().toISOString(), // UTC(국제표준시) — 다른 탭과 통일
      utm: params.get("utm") ?? "",
      device,
      email: "",
      advice: "",
    }).catch(() => {});
  });
}
