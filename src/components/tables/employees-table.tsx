"use client";

import { DataTable, type TableColumn } from "./data-table";

export type EmployeeRow = {
  id: number;
  n: string;
  p: string;
  o: string;
  a: number;
  d: string;
  s: number;
};

type EmployeesTableProps = {
  employees: EmployeeRow[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
};

export function EmployeesTable({
  employees,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage = "No results.",
}: EmployeesTableProps) {
  const columns: TableColumn<EmployeeRow>[] = [
    { key: "id", title: "ID", width: "72px", sortable: true },
    {
      key: "n",
      title: "Name",
      width: "180px",
      sortable: true,
      render: (row) => <span className="font-bold">{row.n}</span>,
    },
    { key: "p", title: "Position", width: "160px", sortable: true },
    {
      key: "o",
      title: "Office",
      width: "140px",
      sortable: true,
      render: (row) => <span className="font-semibold">{row.o}</span>,
    },
    { key: "a", title: "Age", width: "80px", sortable: true },
    {
      key: "d",
      title: "Start date",
      width: "130px",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{row.d}</span>
      ),
    },
    {
      key: "s",
      title: "Salary",
      width: "120px",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-emerald-600">
          ${row.s.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={employees}
      rowKey="id"
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={onSort}
      emptyMessage={emptyMessage}
      tableClassName="tv-so"
    />
  );
}
