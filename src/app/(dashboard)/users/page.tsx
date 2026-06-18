"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search, UserPlus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Input,
  DropdownSelect,
  Button,
} from "@/components/ui";
import { PageStack, UsersTable, TablePagination } from "@/components";
import { useUsers } from "@/contexts/users-context";
import { useRoles } from "@/contexts/roles-context";
import { USER_STATUSES } from "@/lib/users-data";
import type { AppUser } from "@/lib/users-data";

const PAGE_SIZES = [5, 10, 25] as const;

export default function UsersPage() {
  const router = useRouter();
  const { users } = useUsers();
  const { roleNames } = useRoles();
  const roleFilterOptions = ["All", ...roleNames];
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      const matchesRole = role === "All" || u.role === role;
      const matchesStatus = status === "All" || u.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageUsers = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    setPage(1);
  }, [search, role, status, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToEdit = (user: AppUser) => {
    router.push(`/users/profile/${user.id}`);
  };

  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle className="fc g2">
            <Users size={18} />
            All Users
          </CardTitle>
          <Button size="sm">
            <UserPlus size={14} className="mr-1" />
            Add User
          </Button>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          <div className="dt-f">
            <div
              className="fc g2"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--mt-fg)" }}
            >
              Show
              <DropdownSelect
                style={{ width: 66 }}
                value={String(pageSize)}
                onChange={(v) => setPageSize(Number(v))}
                options={PAGE_SIZES.map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
              />
              entries
            </div>
            <div className="fc g2" style={{ flexWrap: "wrap" }}>
              <DropdownSelect
                style={{ width: 120 }}
                value={role}
                onChange={setRole}
                placeholder="All roles"
                options={roleFilterOptions.map((r) => ({
                  value: r,
                  label: r === "All" ? "All roles" : r,
                }))}
              />
              <DropdownSelect
                style={{ width: 130 }}
                value={status}
                onChange={setStatus}
                placeholder="All statuses"
                options={USER_STATUSES.map((s) => ({
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
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: 220,
                    height: 36,
                    paddingLeft: 34,
                    borderRadius: 9,
                  }}
                />
              </div>
            </div>
          </div>

          <UsersTable
            users={pageUsers}
            onEditUser={goToEdit}
            onViewUser={goToEdit}
            emptyMessage="No users match your filters."
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
    </PageStack>
  );
}
