import { UsersProvider } from "@/contexts/users-context";
import { RolesProvider } from "@/contexts/roles-context";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsersProvider>
      <RolesProvider>{children}</RolesProvider>
    </UsersProvider>
  );
}
