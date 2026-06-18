"use client";

import { AvatarInitials } from "@/components/common/avatar-initials";
import { DataTable, type TableColumn } from "./data-table";

export type ProductRow = {
  n: string;
  cat?: string;
  sales: string;
  rev: string;
  c: string;
  ini: string;
};

type ProductsTableProps = {
  products: ProductRow[];
  showCategory?: boolean;
  emptyMessage?: string;
};

export function ProductsTable({
  products,
  showCategory = false,
  emptyMessage = "No products found.",
}: ProductsTableProps) {
  const columns: TableColumn<ProductRow>[] = [
    {
      key: "n",
      title: "Product",
      width: "280px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <AvatarInitials bg={row.c} initials={row.ini} />
          <span className="font-semibold">{row.n}</span>
        </div>
      ),
    },
    ...(showCategory
      ? [
          {
            key: "cat",
            title: "Category",
            width: "140px",
            render: (row: ProductRow) => (
              <span className="text-muted-foreground">{row.cat}</span>
            ),
          } satisfies TableColumn<ProductRow>,
        ]
      : []),
    {
      key: "sales",
      title: "Sales",
      width: "100px",
      render: (row) => <span className="font-bold">{row.sales}</span>,
    },
    {
      key: "rev",
      title: "Revenue",
      width: "120px",
      render: (row) => (
        <span className="font-bold text-emerald-600">{row.rev}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={products}
      rowKey="n"
      emptyMessage={emptyMessage}
    />
  );
}
