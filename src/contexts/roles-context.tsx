"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  roles as initialRoles,
  type Role,
  type RolePermissions,
} from "@/lib/roles-data";

type RolesContextValue = {
  roles: Role[];
  roleNames: string[];
  addRole: (data: {
    name: string;
    description: string;
    color: string;
    permissions: RolePermissions;
  }) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => boolean;
  getRoleByName: (name: string) => Role | undefined;
};

const RolesContext = createContext<RolesContextValue | null>(null);

export function RolesProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const roleNames = useMemo(() => roles.map((r) => r.name), [roles]);

  const getRoleByName = useCallback(
    (name: string) => roles.find((r) => r.name === name),
    [roles]
  );

  const addRole = useCallback(
    (data: {
      name: string;
      description: string;
      color: string;
      permissions: RolePermissions;
    }) => {
      const id = data.name.toLowerCase().replace(/\s+/g, "-");
      setRoles((prev) => [
        ...prev,
        {
          id,
          name: data.name,
          description: data.description,
          color: data.color,
          permissions: data.permissions,
          userCount: 0,
        },
      ]);
    },
    []
  );

  const updateRole = useCallback((id: string, data: Partial<Role>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  }, []);

  const deleteRole = useCallback((id: string) => {
    if (id === "admin") return false;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    return true;
  }, []);

  const value = useMemo(
    () => ({
      roles,
      roleNames,
      addRole,
      updateRole,
      deleteRole,
      getRoleByName,
    }),
    [roles, roleNames, addRole, updateRole, deleteRole, getRoleByName]
  );

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
}

export function useRoles() {
  const ctx = useContext(RolesContext);
  if (!ctx) {
    throw new Error("useRoles must be used within RolesProvider");
  }
  return ctx;
}
