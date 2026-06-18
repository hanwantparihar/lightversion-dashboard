"use client";

import { Edit3, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type TableColumn } from "@/components/tables/data-table";
import {
  PERMISSION_LABELS,
  type Role,
  type RolePermissions,
} from "@/lib/roles-data";

type RolesListProps = {
  roles: Role[];
  userCounts: Record<string, number>;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

function PermissionBadges({ permissions }: { permissions: RolePermissions }) {
  const active = (Object.keys(permissions) as (keyof RolePermissions)[]).filter(
    (key) => permissions[key]
  );

  if (active.length === 0) {
    return (
      <span className="text-xs font-semibold text-muted-foreground">
        Read only
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map((key) => (
        <span key={key} className="rb r-e text-[11px]">
          {PERMISSION_LABELS[key]}
        </span>
      ))}
    </div>
  );
}

export function RolesList({
  roles,
  userCounts,
  onEdit,
  onDelete,
}: RolesListProps) {
  const columns: TableColumn<Role>[] = [
    {
      key: "name",
      title: "Role",
      width: "200px",
      render: (role) => (
        <div className="flex items-center gap-2">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
            style={{ background: role.color }}
          >
            <Shield size={15} />
          </div>
          <span className="font-bold">{role.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      width: "280px",
      render: (role) => (
        <span className="text-muted-foreground">{role.description}</span>
      ),
    },
    {
      key: "users",
      title: "Users",
      width: "80px",
      render: (role) => (
        <span className="font-bold">{userCounts[role.name] ?? 0}</span>
      ),
    },
    {
      key: "permissions",
      title: "Permissions",
      width: "240px",
      render: (role) => <PermissionBadges permissions={role.permissions} />,
    },
    {
      key: "actions",
      title: "Actions",
      width: "100px",
      render: (role) => {
        const count = userCounts[role.name] ?? 0;
        const isProtected = role.id === "admin";

        return (
          <div className="fc g2">
            <Button
              type="button"
              variant="success"
              size="icon"
              aria-label={`Edit ${role.name}`}
              onClick={() => onEdit(role)}
            >
              <Edit3 />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              aria-label={`Delete ${role.name}`}
              onClick={() => onDelete(role)}
              disabled={isProtected || count > 0}
              title={
                isProtected
                  ? "Admin role cannot be deleted"
                  : count > 0
                    ? "Reassign users before deleting"
                    : "Delete role"
              }
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={roles}
      rowKey="id"
      emptyMessage="No roles found."
    />
  );
}
