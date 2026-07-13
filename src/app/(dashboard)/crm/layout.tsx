import { CrmProvider } from "@/contexts/crm-context";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CrmProvider>{children}</CrmProvider>;
}
