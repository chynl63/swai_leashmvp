"use client";

import StatusBar from "./StatusBar";
import DemoToggle from "./DemoToggle";

/**
 * iPhone 목업 프레임.
 * - 데스크톱(md+): 어두운 배경 위 중앙에 375×812 디바이스 + Leash 브랜딩
 * - 모바일: 풀스크린 (100dvh)
 */
export default function PhoneFrame({
  children,
  statusBarDark = false,
}: {
  children: React.ReactNode;
  statusBarDark?: boolean;
}) {
  return (
    <div className="min-h-[100dvh] w-full md:flex md:items-center md:justify-center md:bg-[#0E0E0E]">
      {/* 데스크톱 사이드 브랜딩 (왼쪽) */}
      <div className="hidden lg:flex lg:w-[320px] lg:flex-col lg:items-start lg:gap-4 lg:pl-16 lg:pr-10 lg:text-white">
        <div className="text-[34px] font-bold tracking-tight">Leash</div>
        <p className="text-[15px] leading-relaxed text-white/60">
          스마트폰에 목줄을 채워라.
          <br />
          의지박약 인간을 위한
          <br />
          하드코어 스크린타임 앱.
        </p>
        <p className="mt-4 text-[13px] text-white/35">
          웹 체험 데모 — 실제 차단은
          <br />
          iOS 앱에서 동작합니다.
        </p>
      </div>

      {/* 디바이스 */}
      <div className="relative mx-auto flex h-[100dvh] w-full flex-col bg-bg md:h-[812px] md:w-[375px] md:overflow-hidden md:rounded-[44px] md:border-[10px] md:border-black md:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        {/* 다이나믹 아일랜드 (데스크톱만) */}
        <div className="pointer-events-none absolute left-1/2 top-[10px] z-30 hidden h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-black md:block" />

        <StatusBar dark={statusBarDark} />

        {/* 앱 콘텐츠 */}
        <div className="no-scrollbar relative flex flex-1 flex-col overflow-y-auto">
          {children}
        </div>

        {/* 데모 가속 토글 (스크롤과 무관하게 프레임 하단 고정) */}
        <DemoToggle />

        {/* 홈 인디케이터 */}
        <div className="flex h-[22px] shrink-0 items-center justify-center">
          <div className="h-[5px] w-[134px] rounded-full bg-black/80" />
        </div>
      </div>

      {/* 데스크톱 사이드 브랜딩 (오른쪽 / 푸터) */}
      <div className="hidden lg:flex lg:w-[320px] lg:flex-col lg:gap-2 lg:pl-10 lg:pr-16 lg:text-white/40">
        <a
          href="https://github.com/chynl63/swai_leashmvp"
          target="_blank"
          rel="noreferrer"
          className="text-[13px] underline-offset-2 hover:underline"
        >
          GitHub
        </a>
        <span className="text-[13px]">SWAI · 창업 과제 데모</span>
      </div>
    </div>
  );
}
