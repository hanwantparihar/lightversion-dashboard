import {

  LayoutDashboard,

  BarChart3,

  ShoppingCart,

  Users,

  Package,

  MessageSquare,

  Settings,

  CreditCard,

  FileText,

  LifeBuoy,

  Bell,

  ClipboardList,

  Table2,

  Maximize2,

  Columns3,

  KeyRound,

  Component,

  BookOpen,

  type LucideIcon,

} from "lucide-react";



export type NavChild = {

  id: string;

  path: string;

  label: string;

};



export type NavItem =

  | { sec: string; id?: never; path?: never; label?: never; icon?: never; badge?: never; children?: never }

  | {

    id: string;

    path: string;

    label: string;

    icon: LucideIcon;

    badge?: string;

    sec?: never;

    children?: never;

  }

  | {

    id: string;

    label: string;

    icon: LucideIcon;

    children: NavChild[];

    sec?: never;

    path?: never;

    badge?: never;

  };



export const NAV: NavItem[] = [

  { sec: "Main" },

  { id: "dashboard", path: "/", label: "Dashboard", icon: LayoutDashboard },

  { id: "analytics", path: "/analytics", label: "Analytics", icon: BarChart3 },

  // { id: "orders", path: "/orders", label: "Orders", icon: ShoppingCart, badge: "24" },

  { sec: "Manage" },

  {

    id: "user-g",

    label: "User Management",

    icon: ClipboardList,

    children: [

      { id: "user-list", path: "/users", label: "User list" },

      { id: "user-create", path: "/users/create", label: "Create user" },

      { id: "user-roles", path: "/users/roles", label: "Role management" },

    ],

  },

  // { id: "products", path: "/manage/products", label: "Products", icon: Package },

  // { id: "customers", path: "/manage/customers", label: "Customers", icon: Users },

  // { id: "messages", path: "/manage/messages", label: "Messages", icon: MessageSquare, badge: "8" },

  // { id: "invoices", path: "/manage/invoices", label: "Invoices", icon: FileText },

  { sec: "Components" },

  {

    id: "forms-g",

    label: "Forms",

    icon: ClipboardList,

    children: [

      { id: "forms", path: "/forms", label: "Form Elements" },

      { id: "form-layouts", path: "/forms/layouts", label: "Form Layouts" },

      { id: "form-wizard", path: "/forms/wizard", label: "Form Wizard" },

      { id: "rich-editor", path: "/forms/rich-editor", label: "Rich Text Editor" },

      { id: "file-upload", path: "/forms/file-upload", label: "File Upload" },

    ],

  },

  {

    id: "tables-g",

    label: "Tables",

    icon: Table2,

    children: [

      { id: "basic-tables", path: "/tables/basic", label: "Basic Tables" },

      { id: "data-tables", path: "/tables/data", label: "Data Tables" },

      { id: "editable-tables", path: "/tables/editable", label: "Editable Tables" },

    ],

  },

  {

    id: "charts-g",

    label: "Charts",

    icon: BarChart3,

    children: [

      { id: "apex-charts", path: "/charts/line-bar", label: "Line & Bar Charts" },

      { id: "advanced-charts", path: "/charts/advanced", label: "Advanced Charts" },

      { id: "analytics-widgets", path: "/charts/widgets", label: "Analytics Widgets" },

    ],

  },

  // { id: "modals", path: "/modals", label: "Modals", icon: Maximize2 },

  {

    id: "ui-components-g",

    label: "UI Components",

    icon: Component,

    children: [

      { id: "ui-alert", path: "/ui-components/alert", label: "Alert" },

      { id: "ui-buttons", path: "/ui-components/buttons", label: "Buttons" },

      { id: "modals", path: "/modals", label: "Modals" },

    ],

  },

  // { id: "kanban", path: "/kanban", label: "Kanban Board", icon: Columns3 },

  // { id: "notifications", path: "/notifications", label: "Notifications", icon: Bell },

  { sec: "Other" },

  {

    id: "docs-g",

    label: "Documentation",

    icon: BookOpen,

    children: [

      { id: "docs-installation", path: "/docs/installation", label: "Installation Guide" },

      { id: "docs-basic-setup", path: "/docs/basic-setup", label: "Basic Setup" },

    ],

  },

  {

    id: "auth-g",

    label: "Authentication",

    icon: KeyRound,

    children: [

      { id: "auth-login", path: "/auth/login", label: "Login" },

      { id: "auth-register", path: "/auth/register", label: "Register" },

      { id: "auth-forgot", path: "/auth/forgot-password", label: "Forgot Password" },

      { id: "auth-reset", path: "/auth/reset-password", label: "Reset Password" },

      // { id: "auth-2fa", path: "/auth/two-factor", label: "Two-Factor Auth" },

    ],

  },

  // { sec: "System" },

  // { id: "billing", path: "/system/billing", label: "Billing", icon: CreditCard },

  // { id: "settings", path: "/system/settings", label: "Settings", icon: Settings },

  // { id: "support", path: "/system/support", label: "Support", icon: LifeBuoy },

];



function buildNavMeta(nav: NavItem[]) {

  const titles: Record<string, string> = {};

  const groups: Record<string, string> = {};



  for (const item of nav) {

    if ("path" in item && item.path) {

      titles[item.path] = item.label;

    }

    if ("children" in item && item.children) {

      for (const child of item.children) {

        titles[child.path] = child.label;

        groups[child.path] = item.label;

      }

    }

  }



  return { titles, groups };

}



const meta = buildNavMeta(NAV);



export const PAGE_TITLES: Record<string, string> = meta.titles;

export const BREADCRUMB_GROUPS: Record<string, string> = meta.groups;



export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  if (/^\/users\/profile\/\d+$/.test(pathname)) return "Edit profile";

  return "Dashboard";
}

export function getBreadcrumbGroup(pathname: string): string | undefined {
  if (BREADCRUMB_GROUPS[pathname]) return BREADCRUMB_GROUPS[pathname];

  if (pathname.startsWith("/users/profile")) return "User Management";
  if (pathname.startsWith("/users/roles")) return "User Management";

  return undefined;
}


