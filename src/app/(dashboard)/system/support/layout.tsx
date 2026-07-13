import { SupportProvider } from "@/contexts/support-context";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SupportProvider>{children}</SupportProvider>;
}
