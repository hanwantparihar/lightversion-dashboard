// Common
export { PageStack, PageGrid } from "@/components/common/page-layout";
export { Placeholder, PlaceholderPage } from "@/components/common/placeholder";
export { AvatarInitials, PI } from "@/components/common/avatar-initials";
export { AlertBox } from "@/components/common/alert-box";
export {
  ToastNotifications,
  TOAST_DURATION_MS,
  type ToastItem,
} from "@/components/common/toast-notifications";

// Dashboard
export { StatCard, type StatCardProps } from "@/components/dashboard/stat-card";
export { StatsGrid } from "@/components/dashboard/stats-grid";

// Charts
export { ChartTip } from "@/components/charts/chart-tip";
export { ChartCard } from "@/components/charts/chart-card";
export { RingChart, Ring } from "@/components/charts/ring-chart";

// Tables — core
export { DataTable, type TableColumn } from "@/components/tables/data-table";
export { TablePagination } from "@/components/tables/table-pagination";
export { SortableHeader } from "@/components/tables/sortable-header";

// Tables — domain
export { RoleBadge } from "@/components/tables/role-badge";
export { StatusBadge } from "@/components/tables/status-badge";
export { TableActions } from "@/components/tables/table-actions";
export { UsersTable, type UserRow } from "@/components/tables/users-table";
export { OrdersTable, type OrderRow } from "@/components/tables/orders-table";
export { ProductsTable, type ProductRow } from "@/components/tables/products-table";
export {
  EmployeesTable,
  type EmployeeRow,
} from "@/components/tables/employees-table";
export {
  EditableProductsTable,
  type EditableProductRow,
} from "@/components/tables/editable-products-table";

// Kanban
export {
  KanbanBoard,
  type KanbanCard,
  type KanbanColumn,
  type KanbanData,
} from "@/components/kanban/kanban-board";

// Users
export { UserEditForm, ProfileForm } from "@/components/users/user-edit-form";
export { UserRolesTable } from "@/components/users/user-roles-table";
export { RolesList } from "@/components/users/roles-list";
