"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Character from "@/components/Character";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#0E0E0E] px-6">
      <motion.div
        className="flex w-full max-w-[400px] flex-col items-center text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-[15px] font-medium tracking-[0.3em] text-ochre">
          LEASH
        </div>
        <h1 className="mt-3 text-[32px] font-bold leading-tight text-white">
          스마트폰에 목줄을 채워라
        </h1>

        <motion.div
          className="my-10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Character view="front" effect="sparkle" size={190} />
        </motion.div>

        <p className="text-[15px] leading-relaxed text-white/55">
          의지박약 인간을 위한
          <br />
          하드코어 스크린타임 앱
        </p>

        <button
          onClick={() => router.push("/demo")}
          className="btn-primary mt-9 w-full max-w-[300px] py-4 text-[16px]"
        >
          사용해보기
        </button>

        <p className="mt-6 text-[12px] text-white/30">
          웹 체험 데모 · 실제 차단은 iOS 앱에서 동작합니다
        </p>
      </motion.div>
    </div>
  );
}
