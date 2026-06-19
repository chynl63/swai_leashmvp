"use client";

import { useState } from "react";
import { sheetInsert } from "@/lib/sheetdb";
import { makeId } from "@/lib/id";

type State = "idle" | "sending" | "sent" | "error";

/** 이메일 + 한마디 → Google Sheets `advice` 탭에 저장 */
export default function AdviceForm() {
  const [email, setEmail] = useState("");
  const [advice, setAdvice] = useState("");
  const [state, setState] = useState<State>("idle");

  const valid = advice.trim().length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || state === "sending") return;
    setState("sending");
    const id = makeId();
    try {
      const ok = await sheetInsert("advice", {
        id,
        email: email.trim(),
        advice: advice.trim(),
        created_at: new Date().toISOString(),
      });
      if (!ok) throw new Error("insert failed");
      setState("sent");
      setEmail("");
      setAdvice("");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="bg-bg px-5 py-20">
      <div className="mx-auto max-w-[520px] text-center">
        <span className="text-[13px] font-medium tracking-[0.2em] text-ochre">
          FEEDBACK
        </span>
        <h2 className="mt-3 text-[28px] font-bold leading-tight sm:text-[34px]">
          이 데모, 어땠나요?
        </h2>
        <p className="mt-3 text-[15px] text-ink-2">
          한 마디 남겨주시면 큰 힘이 됩니다. (이메일은 선택)
        </p>

        {state === "sent" ? (
          <div className="mt-8 rounded-2xl border border-ochre/20 bg-ochre-light p-8">
            <div className="text-[28px]">🐶</div>
            <p className="mt-2 text-[16px] font-semibold text-ink">
              고마워요! 잘 받았어요.
            </p>
            <button
              onClick={() => setState("idle")}
              className="mt-4 text-[13px] text-ochre underline underline-offset-2"
            >
              한 번 더 남기기
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 text-left">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 (선택)"
              className="w-full rounded-xl border border-line bg-card px-4 py-3.5 text-[15px] outline-none focus:border-ochre"
            />
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows={4}
              placeholder="하고 싶은 말, 개선 아이디어, 칭찬 무엇이든…"
              className="w-full resize-none rounded-xl border border-line bg-card px-4 py-3.5 text-[15px] outline-none focus:border-ochre"
            />
            <button
              type="submit"
              disabled={!valid || state === "sending"}
              className="btn-primary py-3.5 text-[15px] disabled:opacity-40"
            >
              {state === "sending" ? "보내는 중..." : "한 마디 보내기"}
            </button>
            {state === "error" && (
              <p className="text-center text-[13px] text-danger">
                전송에 실패했어요. 잠시 후 다시 시도해주세요.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
