"use client";

import { Badge } from "@/components/ui";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { DataTable, type TableColumn } from "./data-table";

export type OrderRow = {
  id: string;
  cust: string;
  date: string;
  amt: string;
  status: string;
  v: string;
  ini: string;
  c: string;
};

type OrdersTableProps = {
  orders: OrderRow[];
  emptyMessage?: string;
};

export function OrdersTable({
  orders,
  emptyMessage = "No orders found.",
}: OrdersTableProps) {
  const columns: TableColumn<OrderRow>[] = [
    {
      key: "id",
      title: "Order",
      width: "120px",
      render: (row) => (
        <span className="font-bold text-primary">{row.id}</span>
      ),
    },
    {
      key: "cust",
      title: "Customer",
      width: "220px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <AvatarInitials bg={row.c} initials={row.ini} />
          <span className="font-semibold">{row.cust}</span>
        </div>
      ),
    },
    {
      key: "date",
      title: "Date",
      width: "140px",
      render: (row) => (
        <span className="text-muted-foreground">{row.date}</span>
      ),
    },
    {
      key: "amt",
      title: "Amount",
      width: "120px",
      render: (row) => <span className="font-bold">{row.amt}</span>,
    },
    {
      key: "status",
      title: "Status",
      width: "130px",
      render: (row) => <Badge variant={row.v as any}>{row.status}</Badge>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={orders}
      rowKey="id"
      emptyMessage={emptyMessage}
    />
  );
}
