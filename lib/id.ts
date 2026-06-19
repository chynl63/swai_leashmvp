/**
 * 원본 index.html 방식과 동일한 6자 코드 생성.
 * 예: QR8ST9, GN4LDM
 */
export function makeId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * 방문자 UV id — 원본 getUVfromCookie()와 동일.
 * 쿠키 `user`(180일)에 저장해 재방문 시 같은 id 재사용.
 * (방문자 단위 식별 → visitors 테이블 id로 사용)
 */
export function getUV(): string {
  if (typeof document === "undefined") return makeId();
  const m = document.cookie.match(/(?:^|; )user=([^;]*)/);
  if (m) return m[1];
  const hash = makeId();
  const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `user=${hash}; expires=${expires}; path=/`;
  return hash;
}
