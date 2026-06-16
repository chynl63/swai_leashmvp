import PhoneFrame from "@/components/PhoneFrame";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
