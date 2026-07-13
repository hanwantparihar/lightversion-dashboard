"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Plus, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Input,
  DropdownSelect,
  Badge,
  Button,
} from "@/components/ui";
import { PageStack, DataTable, TablePagination } from "@/components";
import type { TableColumn } from "@/components";
import { AddTaskModal } from "@/components/crm/add-task-modal";
import { useCrm } from "@/contexts/crm-context";
import type { CrmTask } from "@/lib/crm-data";
const PAGE_SIZES = [5, 10, 25] as const;

function PriorityBadge({ priority }: { priority: string }) {
  const variant =
    priority === "High"
      ? "destructive"
      : priority === "Medium"
        ? "default"
        : "secondary";
  return <Badge variant={variant}>{priority}</Badge>;
}

function TaskStatusBadge({ status }: { status: string }) {
  const variant =
    status === "Done" ? "default" : status === "In Progress" ? "outline" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function TasksPage() {
  const { tasks } = useCrm();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter((t) => {
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.leadName.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q);
      const matchesStatus = status === "All" || t.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageTasks = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, status, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns: TableColumn<CrmTask>[] = [
    { key: "title", title: "Task", sortable: true },
    { key: "leadName", title: "Lead" },
    {
      key: "priority",
      title: "Priority",
      render: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <TaskStatusBadge status={row.status} />,
    },
    { key: "dueDate", title: "Due Date" },
    { key: "assignee", title: "Assignee" },
  ];

  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare size={18} />
            Tasks
          </CardTitle>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={14} />
            Add Task
          </Button>
        </CardHeader>        <CardContent style={{ padding: 0 }}>
          <div className="dt-f">
            <div className="fc g2" style={{ fontSize: 13, fontWeight: 600, color: "var(--mt-fg)" }}>
              Show
              <DropdownSelect
                style={{ width: 66 }}
                value={String(pageSize)}
                onChange={(v) => setPageSize(Number(v))}
                options={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))}
              />
              entries
            </div>
            <div className="fc g2" style={{ flexWrap: "wrap" }}>
              <DropdownSelect
                style={{ width: 140 }}
                value={status}
                onChange={setStatus}
                options={["All", "Todo", "In Progress", "Done"].map((s) => ({
                  value: s,
                  label: s === "All" ? "All statuses" : s,
                }))}
              />
              <div style={{ position: "relative" }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--mt-fg)",
                  }}
                />
                <Input
                  placeholder="Search tasks…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: 220, height: 36, paddingLeft: 34, borderRadius: 9 }}
                />
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={pageTasks}
            rowKey="id"
            emptyMessage="No tasks match your filters."
          />

          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
    </PageStack>
  );
}