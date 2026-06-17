"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** iframe(데모) → 부모(랜딩)로 현재 화면 경로를 알림. 랜딩의 안내 말풍선이 이를 듣고 바뀐다. */
export default function RouteBeacon() {
  const path = usePathname();
  useEffect(() => {
    try {
      window.parent?.postMessage({ type: "leash-route", path }, "*");
    } catch {
      /* no-op */
    }
  }, [path]);
  return null;
}
