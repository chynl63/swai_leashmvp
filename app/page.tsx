"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Character from "@/components/Character";
import Footprints from "@/components/Footprints";
import PhoneDevice from "@/components/PhoneDevice";
import DemoTips from "@/components/DemoTips";
import AdviceForm from "@/components/AdviceForm";
import { logVisit } from "@/lib/visitor";

const STEPS = [
  { n: "01", t: "목줄을 채운다", d: "차단할 앱과 시간을 정하고 산책을 시작합니다." },
  { n: "02", t: "폰이 산책을 나간다", d: "차단 중인 상태는 '폰의 산책'으로 표현됩니다." },
  { n: "03", t: "줄을 당기면 장벽", d: "앱을 열려 하면 설정 때 정해둔 벌칙이 가로막습니다." },
  { n: "04", t: "통과해야 해제", d: "수학·타이핑·대기·벌금·감시자 승인을 거쳐야만 풀립니다." },
];

const BARRIERS = [
  { e: "🧮", t: "수학 문제", d: "5문제 연속 정답" },
  { e: "⌨️", t: "타이핑 과제", d: "부끄러운 문장 그대로 입력" },
  { e: "⏳", t: "대기 시간", d: "화면을 벗어나면 처음부터" },
  { e: "💰", t: "벌금", d: "시도할수록 1.5배씩 증가" },
  { e: "📩", t: "감시자 승인", d: "엄마가 승인해야 해제" },
];

export default function Landing() {
  useEffect(() => {
    logVisit();
  }, []);

  return (
    <main className="min-h-[100dvh] w-full bg-bg text-ink">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-[1080px] items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ochre" />
            <span className="text-[18px] font-bold tracking-tight">Leash</span>
          </div>
          <nav className="flex items-center gap-5 text-[14px] text-ink-2">
            <a href="#how" className="hover:text-ink">작동 방식</a>
            <a
              href="#demo"
              className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-white"
            >
              체험하기
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-5 pb-20 pt-8 sm:pt-12">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full border border-ochre/30 bg-ochre-light px-4 py-1.5 text-[13px] font-medium text-ochre-dark"
          >
            의지박약 인간을 위한 하드코어 스크린타임 앱
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-6 text-[40px] font-bold leading-[1.15] tracking-tight sm:text-[58px]"
          >
            스마트폰에
            <br />
            <span className="text-ochre">목줄</span>을 채워라
          </motion.h1>

          <motion.div
            className="my-7"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Character view="front" effect="sparkle" size={150} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-[440px] text-[16px] leading-relaxed text-ink-2"
          >
            앱을 막는 건 누구나 합니다. Leash는 차단을 푸는 걸 어렵게 만듭니다.
            해제하려면 직접 정해둔 심리적 장벽을 통과해야 합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8"
          >
            <a href="#demo" className="btn-primary px-7 py-3.5 text-[15px]">
              직접 체험하기 ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Live Demo (dark band) ── */}
      <section id="demo" className="bg-[#161616] px-5 py-20 text-white">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center text-center">
          <span className="text-[13px] font-medium tracking-[0.2em] text-ochre">
            LIVE DEMO
          </span>
          <h2 className="mt-3 text-[30px] font-bold leading-tight sm:text-[40px]">
            폰에 목줄, 직접 채워보세요
          </h2>
          <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-white/55">
            아래 폰은 실제로 동작하는 데모입니다. 앱을 고르고{" "}
            <span className="text-ochre">목줄 채우기</span>를 누른 뒤,
            <br className="hidden sm:block" />
            홈 버튼(아래 바)으로 나가 차단된 앱을 눌러 인터럽트를 체험해보세요.
          </p>

          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ochre px-5 py-2.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(232,168,53,0.45)] sm:text-[17px]"
          >
            🎁 차단 뚫으면 배민 2만원권 쏜다 · 5명 추첨!
          </motion.div>

          <div className="relative mx-auto mt-12 w-fit">
            <DemoTips />
            <PhoneDevice />
          </div>

          <p className="mt-8 text-[12px] text-white/35">
            우하단 <span className="text-white/60">⚡ 데모 가속</span> 토글로
            실시간(1시간=1분) 속도를 끄고 켤 수 있어요.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="px-5 py-20">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[28px] font-bold leading-tight sm:text-[36px]">
              차단을 “산책”으로
              <br className="sm:hidden" /> 바꾸는 흐름
            </h2>
            <Footprints pairs={5} className="mb-2 hidden sm:flex" />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="plain-card p-6">
                <div className="text-[22px] font-bold text-ochre">{s.n}</div>
                <div className="mt-3 text-[17px] font-semibold">{s.t}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Barriers (ochre-light band) ── */}
      <section className="bg-ochre-light px-5 py-20">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <span className="text-[13px] font-medium tracking-[0.2em] text-ochre-dark">
              BARRIERS
            </span>
            <h2 className="mt-3 text-[28px] font-bold leading-tight sm:text-[36px]">
              해제를 가로막는 5가지 장벽
            </h2>
            <p className="mt-3 text-[15px] text-ink-2">
              벌칙은 <b>설정하는 순간</b> 확정됩니다. 충동적인 순간엔 더 쉬운 걸로
              바꿀 수 없어요.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[760px] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BARRIERS.map((b) => (
              <div
                key={b.t}
                className="flex items-center gap-3 rounded-2xl border border-ochre/15 bg-card p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ochre-light text-[20px]">
                  {b.e}
                </div>
                <div>
                  <div className="text-[15px] font-semibold">{b.t}</div>
                  <div className="text-[13px] text-ink-2">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feedback ── */}
      <AdviceForm />

      {/* ── Footer ── */}
      <footer className="bg-[#161616] px-5 py-14 text-white/70">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ochre" />
            <span className="text-[17px] font-bold text-white">Leash</span>
          </div>
          <p className="max-w-[420px] text-[13px] leading-relaxed text-white/45">
            스마트폰에 목줄을 채워라. 실제 앱 차단은 iOS 네이티브 앱에서
            동작하며, 이 페이지는 핵심 플로우를 체험하는 웹 데모입니다.
          </p>
          <p className="mt-1 text-[12px] text-white/30">SWAI 창업 과제 데모</p>
        </div>
      </footer>
    </main>
  );
}
