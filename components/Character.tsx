"use client";

import { motion } from "framer-motion";

export type CharView = "front" | "side" | "back";
export type CharEffect = "none" | "rain" | "tear" | "blush" | "sparkle";

const INK = "#1A1A1A";
const OCHRE = "#E8A835";

/** 목줄 찬 폰 캐릭터 (line-art). viewBox 214×260. */
export default function Character({
  view = "front",
  walking = false,
  effect = "none",
  size = 150,
  className = "",
}: {
  view?: CharView;
  walking?: boolean;
  effect?: CharEffect;
  size?: number;
  className?: string;
}) {
  const width = size * (214 / 260);

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height: size }}
      aria-label="Leash 캐릭터"
    >
      {/* 빗금 (rain) — 머리 위 */}
      {effect === "rain" && (
        <div className="pointer-events-none absolute left-1/2 top-[-14%] flex -translate-x-1/2 gap-[6px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="block w-[2.5px] rounded-full"
              style={{
                height: size * 0.22,
                background:
                  "linear-gradient(to bottom, rgba(26,26,26,0), rgba(26,26,26,0.55))",
              }}
            />
          ))}
        </div>
      )}

      {/* 반짝 (sparkle) — 우상단 */}
      {effect === "sparkle" && (
        <motion.img
          src="/characters/sparkle.svg"
          alt=""
          className="pointer-events-none absolute right-[2%] top-[4%]"
          style={{ width: size * 0.22 }}
          animate={{ scale: [0.85, 1.1, 0.85], rotate: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}

      <motion.svg
        viewBox="0 0 214 260"
        width={width}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          walking
            ? { y: [0, -5, 0], rotate: [-1.2, 1.2, -1.2] }
            : { y: 0, rotate: 0 }
        }
        transition={
          walking
            ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        style={{ overflow: "visible" }}
      >
        {/* 몸통 */}
        <rect
          x={view === "front" ? 89.68 : 88.68}
          y="4.5"
          width="113.318"
          height="211.173"
          rx="27.5"
          stroke={INK}
          strokeWidth="9"
          fill="#fff"
        />
        {/* 다리 */}
        <path
          d={
            view === "front"
              ? "M124.318 216.28L109.64 255.422"
              : "M123.319 216.28L108.641 255.422"
          }
          stroke={INK}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d={
            view === "front"
              ? "M163.46 216.28L178.139 255.422"
              : "M162.462 216.28L177.14 255.422"
          }
          stroke={INK}
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* 목줄 (유일한 컬러 포인트) */}
        <path
          d="M1.095 26.963C3.325 23.149 8.225 21.865 12.039 24.095C21.444 29.594 27.766 35.967 32.212 42.927C36.587 49.775 38.929 56.874 40.776 63.328C44.584 76.642 46.49 86.859 56.42 96.004C65.291 104.173 72.144 107.725 77.666 109.381C83.291 111.068 88.092 111 94.001 111H205.105C209.523 111.001 213.105 114.583 213.105 119.001C213.105 123.419 209.523 127.001 205.105 127.001H89.001C88.731 127.001 88.463 126.987 88.2 126.961C83.764 126.841 78.668 126.386 73.07 124.707C64.737 122.208 55.822 117.204 45.582 107.774C31.625 94.92 28.751 79.47 25.393 67.729C23.656 61.656 21.818 56.379 18.728 51.54C15.709 46.814 11.28 42.186 3.963 37.907C0.149 35.677 -1.135 30.777 1.095 26.963Z"
          fill={OCHRE}
        />

        {/* 정면 얼굴 */}
        {view === "front" && (
          <>
            <circle cx="124.318" cy="73.391" r="4.89" fill={INK} />
            <circle cx="168.353" cy="73.391" r="4.89" fill={INK} />
            <path
              d="M136.55 90.516H170.799"
              stroke={INK}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* 눈물 */}
            {effect === "tear" && (
              <motion.path
                d="M168 80 C 163 90, 173 90, 168 80 Z"
                fill="#5B9BD5"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: [0, 1, 1], y: [0, 8, 10] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            {/* 홍조 */}
            {effect === "blush" && (
              <>
                <ellipse cx="112" cy="92" rx="11" ry="6" fill="#F2A9A0" opacity="0.7" />
                <ellipse cx="181" cy="92" rx="11" ry="6" fill="#F2A9A0" opacity="0.7" />
              </>
            )}
          </>
        )}

        {/* 옆모습 얼굴 (걷기) */}
        {view === "side" && (
          <>
            <circle cx="179.668" cy="68.498" r="4.89" fill={INK} />
            <path
              d="M184.561 88.069H199.239"
              stroke={INK}
              strokeWidth="9"
              strokeLinecap="round"
            />
          </>
        )}
      </motion.svg>
    </div>
  );
}
