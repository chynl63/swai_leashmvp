import StatusBar from "@/components/StatusBar";
import DemoToggle from "@/components/DemoToggle";
import HomeIndicator from "@/components/HomeIndicator";
import RouteBeacon from "@/components/RouteBeacon";

/**
 * 데모 "화면" 레이아웃 — 기기 베젤 없이 화면 콘텐츠만 채운다.
 * 랜딩 페이지의 <iframe src="/demo">로 임베드되어 폰 프레임 안에서 동작한다.
 * (직접 /demo 방문 시에는 브라우저를 가득 채우는 풀스크린 앱으로 보인다.)
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-bg">
      <RouteBeacon />
      <StatusBar />
      <div className="no-scrollbar relative flex flex-1 flex-col overflow-y-auto">
        {children}
      </div>
      <DemoToggle />
      <HomeIndicator />
    </div>
  );
}
