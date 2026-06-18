export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Active" ? "s-a" : status === "Inactive" ? "s-i" : "s-p";
  return <span className={`rb ${variant}`}>{status}</span>;
}
