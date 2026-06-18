export function RoleBadge({ role }: { role: string }) {
  const variant =
    role === "Admin" ? "r-a" : role === "Editor" ? "r-e" : "r-v";
  return <span className={`rb ${variant}`}>{role}</span>;
}
