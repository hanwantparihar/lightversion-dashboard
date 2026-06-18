"use client";

import { useState } from "react";
import {
  Table2,
  PenLine,
  Plus,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Button } from "@/components/ui";
import { PageStack, EditableProductsTable } from "@/components";
import type { EditableProductRow } from "@/components/tables/editable-products-table";

const initProds: EditableProductRow[] = [
  { id: 1, n: "Wireless Headphones", cat: "Electronics", price: 79.99, qty: 142, s: "Active" },
  { id: 2, n: "Fitness Tracker Pro", cat: "Wearables", price: 149, qty: 88, s: "Active" },
  { id: 3, n: "Organic Green Tea", cat: "Food", price: 24.5, qty: 315, s: "Draft" },
  { id: 4, n: "Office Chair", cat: "Furniture", price: 329.99, qty: 45, s: "Active" },
  { id: 5, n: "Power Bank 20K", cat: "Electronics", price: 45, qty: 220, s: "Inactive" },
  { id: 6, n: "Yoga Mat", cat: "Sports", price: 38.99, qty: 178, s: "Active" },
];

export default function EditableTables() {
  const [rows, setRows] = useState(initProds);

  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between mb-5">
          <CardTitle className="fc g2">
            <PenLine size={16} />
            Editable Product Table
          </CardTitle>
          <div className="fc g2">
            <Button
              type="button"
              size="sm"
              variant="success"
              onClick={() => {
                const nid = rows.length
                  ? Math.max(...rows.map((r) => r.id)) + 1
                  : 1;
                setRows((p) => [
                  ...p,
                  {
                    id: nid,
                    n: "New Product",
                    cat: "General",
                    price: 0,
                    qty: 0,
                    s: "Draft",
                  },
                ]);
              }}
            >
              <Plus />
              Add Row
            </Button>
            <Button
              type="button"
              size="sm"
              variant="warning"
              onClick={() => setRows(initProds)}
            >
              <RotateCcw />
              Undo
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => alert("Saved!")}
            >
              <CheckCircle />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <EditableProductsTable rows={rows} onChange={setRows} />
          <div className="fc g2 border-t px-5 py-3 text-xs font-semibold text-muted-foreground">
            <Table2 size={14} />
            {rows.length} products | Click cell to edit
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
