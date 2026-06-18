"use client";

/** 루트 레벨 에러 바운더리(레이아웃/하이드레이션 오류까지 포착). 자체 html/body 필요. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          background: "#F7F7F8",
          color: "#1A1A1A",
          fontFamily: "Pretendard, -apple-system, sans-serif",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ fontSize: 40 }}>🐾</div>
        <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
          잠깐 문제가 생겼어요
        </p>
        <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0 }}>
          페이지를 다시 불러오면 정상으로 돌아와요.
        </p>
        <button
          onClick={() => {
            try {
              localStorage.removeItem("leash-demo");
            } catch {
              /* no-op */
            }
            reset();
            if (typeof window !== "undefined") window.location.reload();
          }}
          style={{
            border: "none",
            background: "#E8A835",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 8,
            padding: "12px 22px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          새로고침
        </button>
      </body>
    </html>
  );
}
