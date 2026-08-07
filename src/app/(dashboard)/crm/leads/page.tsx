"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, Search, Users, Trophy, Inbox, TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Input,
  DropdownSelect,
  Button,
  Badge,
} from "@/components/ui";
import { PageStack, DataTable, TablePagination, StatsGrid } from "@/components";
import type { TableColumn } from "@/components";
import { AddLeadModal } from "@/components/crm/add-lead-modal";
import { useCrm } from "@/contexts/crm-context";
import { LEAD_STATUSES, type Lead } from "@/lib/crm-data";
import { spA, spB, spC, spD } from "@/lib/data";
const PAGE_SIZES = [5, 10, 25] as const;

function LeadStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    New: "secondary",
    Contacted: "outline",
    Qualified: "default",
    Proposal: "default",
    Won: "default",
    Lost: "destructive",
  };
  return (
    <Badge variant={(colors[status] as "default" | "secondary" | "outline" | "destructive") ?? "outline"}>
      {status}
    </Badge>
  );
}

export default function LeadsPage() {
  const { leads } = useCrm();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q);
      const matchesStatus = status === "All" || l.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageLeads = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const wonCount = leads.filter((l) => l.status === "Won").length;
  const newCount = leads.filter((l) => l.status === "New").length;
  const openCount = leads.filter((l) => !["Won", "Lost"].includes(l.status)).length;

  useEffect(() => {
    setPage(1);
  }, [search, status, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns: TableColumn<Lead>[] = [
    { key: "name", title: "Name", sortable: true, width: "150px" },
    { key: "company", title: "Company", sortable: true, width: "150px" },
    { key: "email", title: "Email", width: "180px" },
    { key: "source", title: "Source", width: "120px" },
    {
      key: "status",
      title: "Status",
      width: "120px",
      render: (row) => <LeadStatusBadge status={row.status} />,
    },
    {
      key: "value",
      title: "Value",
      width: "100px",
      render: (row) => `$${row.value.toLocaleString()}`,
    },
    { key: "assignee", title: "Assignee", width: "120px" },
    { key: "createdAt", title: "Created", width: "100px" },
  ];

  return (
    <PageStack>
      <StatsGrid
        stats={[
          {
            icon: Users,
            grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            value: String(leads.length),
            label: "Total Leads",
            change: `${newCount} new`,
            up: true,
            spark: spA,
            color: "#2563eb",
          },
          {
            icon: Inbox,
            grad: "linear-gradient(135deg,#06b6d4,#0891b2)",
            value: String(openCount),
            label: "Open Leads",
            change: `${leads.filter(l => l.status === "Contacted").length} contacted`,
            up: true,
            spark: spB,
            color: "#06b6d4",
          },
          {
            icon: TrendingUp,
            grad: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            value: String(leads.filter(l => l.status === "Qualified").length),
            label: "Qualified",
            change: `${leads.filter(l => l.status === "Proposal").length} in proposal`,
            up: true,
            spark: spC,
            color: "#7c3aed",
          },
          {
            icon: Trophy,
            grad: "linear-gradient(135deg,#10b981,#059669)",
            value: String(wonCount),
            label: "Won",
            change: `$${leads.filter(l => l.status === "Won").reduce((s, l) => s + l.value, 0).toLocaleString()}`,
            up: true,
            spark: spD,
            color: "#10b981",
          },
        ]}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Users size={18} />
            Lead Management
          </CardTitle>
          <Button size="sm" onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
            <UserPlus size={14} />
            Add Lead
          </Button>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          <div className="dt-f flex-col md:flex-row gap-3 md:gap-0">
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
            <div className="fc g2 flex-wrap">
              <DropdownSelect
                style={{ width: 140, minWidth: 140 }}
                value={status}
                onChange={setStatus}
                options={["All", ...LEAD_STATUSES].map((s) => ({
                  value: s,
                  label: s === "All" ? "All statuses" : s,
                }))}
              />
              <div style={{ position: "relative", flex: "1 1 auto", minWidth: 200 }}>
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
                  placeholder="Search leads…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", height: 36, paddingLeft: 34, borderRadius: 9 }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              rows={pageLeads}
              rowKey="id"
              emptyMessage="No leads match your filters."
            />
          </div>

          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} />
    </PageStack >
  );
}