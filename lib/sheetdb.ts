/**
 * Google Apps Script + Google Sheets 백엔드 클라이언트.
 *
 * Apps Script 웹앱(doGet)은 CORS 헤더를 주지 않으므로 일반 fetch가 막힌다.
 * 대신 callback 파라미터를 지원하는 JSONP(script 태그 주입) 방식으로 호출한다.
 *
 * 배포된 웹앱 URL을 .env.local 의 NEXT_PUBLIC_SHEET_API_URL 에 넣어야 한다.
 *   NEXT_PUBLIC_SHEET_API_URL=https://script.google.com/macros/s/XXXX/exec
 */

// 배포된 Apps Script 웹앱 URL (공개 NEXT_PUBLIC 값 — 비밀 아님).
// 교수님이 .env 설정 없이 클론만 해도 백엔드가 동작하도록 기본값으로 내장.
// 환경변수로 덮어쓸 수 있음.
const FALLBACK_API =
  "https://script.google.com/macros/s/AKfycbxiiguJwosZ2mr5A2Ndk-keSCRYuZmVR6IOFncBQn5t1lfKj-rujhdKHYwe3zen4wZQfw/exec";

const API = process.env.NEXT_PUBLIC_SHEET_API_URL || FALLBACK_API;
export const hasSheetDB = !!API;

type SheetResponse<T = unknown> = {
  success: boolean;
  mode?: string;
  data: T;
};

let counter = 0;

function jsonp<T = unknown>(
  params: Record<string, string>
): Promise<SheetResponse<T>> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !API) {
      reject(new Error("sheetdb unavailable"));
      return;
    }
    const cb = `__leash_jsonp_${Date.now()}_${counter++}`;
    const script = document.createElement("script");
    const w = window as unknown as Record<string, unknown>;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("jsonp timeout"));
    }, 12000);

    function cleanup() {
      clearTimeout(timer);
      delete w[cb];
      script.remove();
    }

    w[cb] = (data: SheetResponse<T>) => {
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("jsonp network error"));
    };

    const qs = new URLSearchParams({ ...params, callback: cb }).toString();
    script.src = `${API}?${qs}`;
    document.head.appendChild(script);
  });
}

/** 행 읽기. id를 주면 단일 객체, 없으면 배열 반환. */
export async function sheetRead<T = Record<string, unknown>>(
  table: string,
  id?: string
): Promise<T | T[] | null> {
  const res = await jsonp<T | T[]>({
    action: "read",
    table,
    ...(id ? { id } : {}),
  });
  return res.success ? res.data : null;
}

/** 행 삽입(같은 id 있으면 업서트). data는 반드시 id 키 포함. */
export async function sheetInsert(
  table: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const res = await jsonp({
    action: "insert",
    table,
    data: JSON.stringify(data),
  });
  return res.success;
}

/** id 기준 행 업데이트. */
export async function sheetUpdate(
  table: string,
  id: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const res = await jsonp({
    action: "update",
    table,
    id,
    data: JSON.stringify(data),
  });
  return res.success;
}
