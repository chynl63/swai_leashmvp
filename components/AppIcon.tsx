import { APPS } from "@/lib/profiles";

export function appMeta(name: string) {
  return (
    APPS.find((a) => a.name === name) ?? {
      name,
      short: name.slice(0, 1),
      color: "#8E8E93",
    }
  );
}

/** 앱 아이콘 (둥근 사각형) */
export default function AppIcon({
  name,
  size = 40,
  dim = false,
}: {
  name: string;
  size?: number;
  dim?: boolean;
}) {
  const meta = appMeta(name);
  return (
    <div
      className="flex items-center justify-center rounded-[22%] font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: meta.color,
        fontSize: size * 0.5,
        opacity: dim ? 0.4 : 1,
        filter: dim ? "grayscale(0.5)" : "none",
      }}
    >
      {meta.short}
    </div>
  );
}
