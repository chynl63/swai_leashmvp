/** 추첨 상금 고지 배너 — "지금 풀면 응모"라는 유인을 결정 순간에 노출 */
export default function PrizeBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-xl bg-ochre-light px-3 py-2 text-center text-[12px] leading-snug text-ochre-dark ${className}`}
    >
      <span className="text-[15px]">🎁</span>
      <span>
        지금 차단을 풀면 <b>배달의민족 2만원권</b> 추첨 응모 · 5명
      </span>
    </div>
  );
}
