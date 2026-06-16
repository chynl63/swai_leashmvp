/** 발자국 패턴 (회색 점 페어) */
export default function Footprints({
  pairs = 4,
  className = "",
}: {
  pairs?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Array.from({ length: pairs }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-0.5"
          style={{ opacity: 0.25 + (i / pairs) * 0.45 }}
        >
          <span className="block h-[6px] w-[9px] rounded-full bg-ink-3" />
          <span className="ml-1.5 block h-[6px] w-[9px] rounded-full bg-ink-3" />
        </div>
      ))}
    </div>
  );
}
