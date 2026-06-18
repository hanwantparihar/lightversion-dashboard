"use client";

import Link from "next/link";
import { Edit3 } from "lucide-react";
import { DropdownSelect } from "@/components/ui";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { DataTable, type TableColumn } from "@/components/tables/data-table";
import { RoleBadge } from "@/components/tables/role-badge";
import { StatusBadge } from "@/components/tables/status-badge";
import type { AppUser } from "@/lib/users-data";

type UserRolesTableProps = {
  users: AppUser[];
  roleNames: string[];
  roleDrafts: Record<number, string>;
  onRoleChange: (userId: number, role: string) => void;
  selectedIds: number[];
  onToggleSelect: (userId: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
};

export function UserRolesTable({
  users,
  roleNames,
  roleDrafts,
  onRoleChange,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: UserRolesTableProps) {
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  const columns: TableColumn<AppUser>[] = [
    {
      key: "select",
      title: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onToggleSelectAll(e.target.checked)}
          aria-label="Select all users"
        />
      ),
      width: "48px",
      headerClassName: "text-center",
      className: "text-center",
      render: (user) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(user.id)}
          onChange={() => onToggleSelect(user.id)}
          aria-label={`Select ${user.name}`}
        />
      ),
    },
    {
      key: "name",
      title: "User",
      width: "240px",
      render: (user) => (
        <div className="flex items-center gap-2">
          <AvatarInitials bg={user.avatarColor} initials={user.initials} />
          <span className="font-bold">{user.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      width: "240px",
      render: (user) => (
        <span className="text-muted-foreground">{user.email}</span>
      ),
    },
    {
      key: "role",
      title: "Current role",
      width: "130px",
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: "assignRole",
      title: "Assign role",
      width: "160px",
      render: (user) => {
        const draftRole = roleDrafts[user.id] ?? user.role;
        const changed = draftRole !== user.role;

        return (
          <DropdownSelect
            value={draftRole}
            onChange={(role) => onRoleChange(user.id, role)}
            style={{
              width: 140,
              borderColor: changed ? "var(--pr)" : undefined,
            }}
            options={roleNames.map((role) => ({
              value: role,
              label: role,
            }))}
          />
        );
      },
    },
    {
      key: "status",
      title: "Status",
      width: "120px",
      render: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      width: "80px",
      render: (user) => (
        <Link
          href={`/users/profile/${user.id}`}
          className="ab"
          aria-label={`Edit ${user.name}`}
          title="Edit user"
        >
          <Edit3 size={14} />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey="id"
      emptyMessage="No users found."
    />
  );
}
