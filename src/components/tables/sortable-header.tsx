"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

type SortableHeaderProps = {
  label: ReactNode;
  columnKey: string;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
};

export function SortableHeader({
  label,
  columnKey,
  sortKey,
  sortDirection,
  onSort,
}: SortableHeaderProps) {
  if (!onSort) return <>{label}</>;

  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-inherit"
      onClick={() => onSort(columnKey)}
    >
      {label}
      <span className={`si ${sortKey === columnKey ? sortDirection : ""}`}>
        <ChevronUp size={11} className="su" />
        <ChevronDown size={11} className="sd" style={{ marginTop: -3 }} />
      </span>
    </button>
  );
}
