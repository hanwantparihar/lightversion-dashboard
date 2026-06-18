"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="fc gap-[3px]">
        <Button
          type="button"
          variant="light"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft />
        </Button>
        <Button
          type="button"
          variant="light"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            type="button"
            variant={p === page ? "default" : "light"}
            size="icon"
            className="text-xs"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          type="button"
          variant="light"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
        <Button
          type="button"
          variant="light"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
