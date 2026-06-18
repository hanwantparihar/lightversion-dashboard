"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DataTable, type TableColumn } from "./data-table";
export type EditableProductRow = {
  id: number;
  n: string;
  cat: string;
  price: number;
  qty: number;
  s: string;
};

type EditableCell = { rid: number; col: keyof EditableProductRow } | null;

type EditableProductsTableProps = {
  rows: EditableProductRow[];
  onChange: (rows: EditableProductRow[]) => void;
};

function statusClass(s: string) {
  return s === "Active" ? "s-a" : s === "Draft" ? "s-d" : "s-i";
}

export function EditableProductsTable({
  rows,
  onChange,
}: EditableProductsTableProps) {
  const [editing, setEditing] = useState<EditableCell>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (
    rid: number,
    col: keyof EditableProductRow,
    val: string | number
  ) => {
    setEditing({ rid, col });
    setEditValue(String(val));
  };

  const saveEdit = () => {
    if (!editing) return;
    onChange(
      rows.map((r) => {
        if (r.id !== editing.rid) return r;
        let v: string | number = editValue;
        if (editing.col === "price") v = parseFloat(editValue) || 0;
        else if (editing.col === "qty") v = parseInt(editValue, 10) || 0;
        return { ...r, [editing.col]: v };
      })
    );
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  const isEditing = (rid: number, col: keyof EditableProductRow) =>
    editing?.rid === rid && editing?.col === col;

  const editableCell = (
    row: EditableProductRow,
    col: keyof EditableProductRow,
    display?: React.ReactNode
  ) => {
    if (isEditing(row.id, col)) {
      return (
        <input
          className="et-i"
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKey}
        />
      );
    }
    return (
      <span
        className="et-c block w-full cursor-pointer"
        onClick={() => startEdit(row.id, col, row[col])}
      >
        {display ?? row[col]}
      </span>
    );
  };

  const columns: TableColumn<EditableProductRow>[] = [
    {
      key: "id",
      title: "ID",
      width: "55px",
      render: (row) => (
        <span className="text-muted-foreground">#{row.id}</span>
      ),
    },
    {
      key: "n",
      title: "Name",
      width: "200px",
      render: (row) => editableCell(row, "n"),
    },
    {
      key: "cat",
      title: "Category",
      width: "140px",
      render: (row) => editableCell(row, "cat"),
    },
    {
      key: "price",
      title: "Price",
      width: "100px",
      render: (row) =>
        editableCell(
          row,
          "price",
          <span className="font-bold">${row.price.toFixed(2)}</span>
        ),
    },
    {
      key: "qty",
      title: "Qty",
      width: "80px",
      render: (row) => editableCell(row, "qty"),
    },
    {
      key: "s",
      title: "Status",
      width: "120px",
      render: (row) => (
        <span
          className="et-c inline-block cursor-pointer"
          onClick={() => {
            const next =
              row.s === "Active"
                ? "Draft"
                : row.s === "Draft"
                  ? "Inactive"
                  : "Active";
            onChange(
              rows.map((x) => (x.id === row.id ? { ...x, s: next } : x))
            );
          }}
        >
          <span className={`rb ${statusClass(row.s)}`}>{row.s}</span>
        </span>
      ),
    },
    {
      key: "actions",
      title: "Del",
      width: "60px",
      render: (row) => (
        <button
          type="button"
          className="ab dl"
          onClick={() => onChange(rows.filter((x) => x.id !== row.id))}
          aria-label={`Delete ${row.n}`}
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <DataTable columns={columns} rows={rows} rowKey="id" />
  );
}
