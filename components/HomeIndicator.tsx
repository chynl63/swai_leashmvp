"use client";

import { usePathname, useRouter } from "next/navigation";

/** iOS 홈 인디케이터 = 홈 버튼. 누르면 시뮬 홈 화면(스프링보드)으로 나간다. */
export default function HomeIndicator() {
  const router = useRouter();
  const path = usePathname();
  const onSpringboard = path === "/demo/springboard";

  return (
    <button
      onClick={() => {
        if (!onSpringboard) router.push("/demo/springboard");
      }}
      aria-label="홈"
      className="group flex h-[26px] w-full shrink-0 items-center justify-center"
    >
      <span className="h-[5px] w-[134px] rounded-full bg-black/80 transition-transform group-active:scale-x-110" />
    </button>
  );
}
