"use client";

import { Table2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui";
import { PageStack, PageGrid, DataTable, type TableColumn } from "@/components";
import { RoleBadge } from "@/components/tables/role-badge";
import { StatusBadge } from "@/components/tables/status-badge";
import { TableActions } from "@/components/tables/table-actions";
import type { AppUser } from "@/lib/users-data";

const users: AppUser[] = [
  {
    id: 1,
    name: "Laura Mitchell",
    firstName: "Laura",
    lastName: "Mitchell",
    email: "laura@example.com",
    phone: "",
    location: "",
    company: "",
    jobTitle: "",
    role: "Admin",
    status: "Active",
    date: "Feb 28",
    bio: "",
    timezone: "",
    initials: "LM",
    avatarColor: "#2563eb",
    emailNotifications: false,
    pushNotifications: false,
    marketingEmails: false,
  },
  {
    id: 2,
    name: "James Carter",
    firstName: "James",
    lastName: "Carter",
    email: "james@example.com",
    phone: "",
    location: "",
    company: "",
    jobTitle: "",
    role: "Editor",
    status: "Active",
    date: "Feb 27",
    bio: "",
    timezone: "",
    initials: "JC",
    avatarColor: "#10b981",
    emailNotifications: false,
    pushNotifications: false,
    marketingEmails: false,
  },
  {
    id: 3,
    name: "Sophia Nguyen",
    firstName: "Sophia",
    lastName: "Nguyen",
    email: "sophia@example.com",
    phone: "",
    location: "",
    company: "",
    jobTitle: "",
    role: "Viewer",
    status: "Inactive",
    date: "Feb 25",
    bio: "",
    timezone: "",
    initials: "SN",
    avatarColor: "#7c3aed",
    emailNotifications: false,
    pushNotifications: false,
    marketingEmails: false,
  },
];

const columns: TableColumn<AppUser>[] = [
  { key: "id", title: "ID", width: "72px", render: (row) => `#${row.id}` },
  {
    key: "name",
    title: "Name",
    width: "200px",
    render: (row) => <span className="font-bold">{row.name}</span>,
  },
  {
    key: "email",
    title: "Email",
    width: "220px",
    render: (row) => (
      <span className="text-muted-foreground">{row.email}</span>
    ),
  },
  {
    key: "role",
    title: "Role",
    width: "120px",
    render: (row) => <RoleBadge role={row.role} />,
  },
  {
    key: "status",
    title: "Status",
    width: "120px",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "date",
    title: "Date",
    width: "120px",
    render: (row) => (
      <span className="text-muted-foreground">{row.date}</span>
    ),
  },
  {
    key: "actions",
    title: "Actions",
    width: "120px",
    render: () => <TableActions />,
  },
];

export default function BasicTables() {
  return (
    <PageStack>
      <Card>
        <CardHeader className="mb-4">
          <CardTitle className="fc g2">
            <Table2 size={16} />
            DataTable (reusable)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} rows={users} rowKey="id" />
        </CardContent>
      </Card>

      <PageGrid cols={2}>
        <Card>
          <CardHeader className="mb-4">
            <CardTitle>Compact columns</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns.filter((c) =>
                ["id", "name", "role", "status"].includes(c.key)
              )}
              rows={users}
              rowKey="id"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="mb-4">
            <CardTitle>Custom styling</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              rows={users}
              rowKey="id"
              tableClassName="[&_thead]:bg-primary/10"
            />
          </CardContent>
        </Card>
      </PageGrid>
    </PageStack>
  );
}
