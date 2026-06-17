"use client";

/**
 * 물리적 iPhone 베젤 + 내부에 실행 중인 데모 앱(iframe).
 * 랜딩 페이지 중앙에 박혀 실제로 동작하는 MVP를 보여준다.
 */
export default function PhoneDevice({ src = "/demo" }: { src?: string }) {
  return (
    <div
      className="relative mx-auto shrink-0 overflow-hidden rounded-[48px] border-[12px] border-black bg-black shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
      style={{
        // 실제 iPhone 비율(390:844) 고정 — 너비/높이 둘 다로 제한
        width: "min(92vw, 410px, calc(86dvh * 390 / 844))",
        aspectRatio: "390 / 844",
      }}
    >
      {/* 다이나믹 아일랜드 */}
      <div className="pointer-events-none absolute left-1/2 top-[11px] z-30 h-[27px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
      <iframe
        src={src}
        title="Leash 데모"
        loading="lazy"
        allow="clipboard-write; clipboard-read"
        className="block h-full w-full border-0 bg-bg"
      />
    </div>
  );
}
