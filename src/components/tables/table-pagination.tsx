"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <div className={cn("dt-f", className)}>
      <div className="text-[13px] font-semibold text-muted-foreground">
        Showing {rangeStart} to {rangeEnd} of {totalItems}
      </div>
      <div className="fc" style={{ gap: 3 }}>
        <button
          type="button"
          className="dp"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft size={15} />
        </button>
        <button
          type="button"
          className="dp"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            className={cn("dp", p === page && "av")}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="dp"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
        <button
          type="button"
          className="dp"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
}
