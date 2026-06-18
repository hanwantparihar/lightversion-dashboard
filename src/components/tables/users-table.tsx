"use client";

import { AvatarInitials } from "@/components/common/avatar-initials";
import type { AppUser } from "@/lib/users-data";
import { DataTable, type TableColumn } from "./data-table";
import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";
import { TableActions } from "./table-actions";

/** @deprecated Use AppUser from @/lib/users-data */
export type UserRow = AppUser;

type UsersTableProps = {
  users: AppUser[];
  compact?: boolean;
  showActions?: boolean;
  onEditUser?: (user: AppUser) => void;
  onViewUser?: (user: AppUser) => void;
  emptyMessage?: string;
};

export function UsersTable({
  users,
  compact = false,
  showActions = true,
  onEditUser,
  emptyMessage,
}: UsersTableProps) {
  const columns: TableColumn<AppUser>[] = [
    {
      key: "id",
      title: "ID",
      width: "72px",
      render: (row) => (
        <span className="font-bold text-primary">#{row.id}</span>
      ),
    },
    {
      key: "name",
      title: "Name",
      width: compact ? "220px" : "260px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <AvatarInitials
            bg={row.avatarColor}
            initials={row.initials}
            src={row.avatarUrl}
          />
          <span className="font-bold">{row.name}</span>
        </div>
      ),
    },
    ...(!compact
      ? [
          {
            key: "email",
            title: "Email",
            width: "240px",
            render: (row: AppUser) => (
              <span className="text-muted-foreground">{row.email}</span>
            ),
          } satisfies TableColumn<AppUser>,
        ]
      : []),
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
    ...(!compact
      ? [
          {
            key: "date",
            title: "Date",
            width: "140px",
            render: (row: AppUser) => (
              <span className="text-muted-foreground">{row.date}</span>
            ),
          } satisfies TableColumn<AppUser>,
        ]
      : []),
    ...(showActions && !compact
      ? [
          {
            key: "actions",
            title: "Actions",
            width: "120px",
            render: (row: AppUser) => (
              <TableActions
                onEdit={onEditUser ? () => onEditUser(row) : undefined}
              />
            ),
          } satisfies TableColumn<AppUser>,
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey="id"
      emptyMessage={emptyMessage ?? "No users found."}
    />
  );
}
