"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SortableHeader } from "./sortable-header";

export type TableColumn<T> = {
  /** Unique column id — also used as row field when `render` is omitted */
  key: string;
  title: ReactNode;
  width?: string;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  /** Custom cell renderer. Falls back to `row[key]` when omitted */
  render?: (row: T, rowIndex: number) => ReactNode;
};

export type DataTableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  className?: string;
  tableClassName?: string;
  /** Stable row key — defaults to index */
  rowKey?: keyof T | ((row: T, index: number) => string | number);
  emptyMessage?: ReactNode;
  onRowClick?: (row: T, index: number) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
};

function resolveRowKey<T>(
  row: T,
  index: number,
  rowKey?: keyof T | ((row: T, index: number) => string | number)
): string | number {
  if (!rowKey) return index;
  if (typeof rowKey === "function") return rowKey(row, index);
  const value = row[rowKey];
  if (value == null) return index;
  return String(value);
}

function getCellValue<T>(row: T, key: string): ReactNode {
  const record = row as Record<string, unknown>;
  const value = record[key];
  if (value == null) return null;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return value as ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  className,
  tableClassName,
  rowKey,
  emptyMessage = "No data found.",
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table
        className={cn(
          "w-full table-fixed border-collapse text-sm",
          tableClassName
        )}
        style={{ tableLayout: "fixed" }}
      >
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width || "auto",
                  minWidth: col.width || "auto",
                  whiteSpace: "nowrap",
                }}
                className={cn(
                  "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground",
                  col.headerClassName,
                  col.className
                )}
              >
                {col.sortable && onSort ? (
                  <SortableHeader
                    label={col.title}
                    columnKey={col.key}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                ) : (
                  col.title
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm font-semibold text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={resolveRowKey(row, rowIndex, rowKey)}
                className={cn(
                  "transition-colors hover:bg-muted/30",
                  onRowClick && "cursor-pointer"
                )}
                onClick={
                  onRowClick ? () => onRowClick(row, rowIndex) : undefined
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      width: col.width || "auto",
                      minWidth: col.width || "auto",
                      wordBreak: "break-word",
                    }}
                    className={cn(
                      "px-4 py-4 text-sm font-medium text-foreground",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : getCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
