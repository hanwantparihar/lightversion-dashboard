export type RolePermissions = {
  users: boolean;
  products: boolean;
  orders: boolean;
  settings: boolean;
  billing: boolean;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  permissions: RolePermissions;
};

export const PERMISSION_LABELS: Record<keyof RolePermissions, string> = {
  users: "Users",
  products: "Products",
  orders: "Orders",
  settings: "Settings",
  billing: "Billing",
};

export const roles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all modules and system settings.",
    userCount: 3,
    color: "#2563eb",
    permissions: { users: true, products: true, orders: true, settings: true, billing: true },
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can manage content, products, and orders.",
    userCount: 5,
    color: "#10b981",
    permissions: { users: false, products: true, orders: true, settings: false, billing: false },
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to dashboards and reports.",
    userCount: 4,
    color: "#7c3aed",
    permissions: { users: false, products: false, orders: false, settings: false, billing: false },
  },
];
