import {
  LayoutDashboard, BarChart3, Users, Settings, ClipboardList,
  Table2, KeyRound, Component, BookOpen, FileBarChart, Briefcase,
  CreditCard, Shield, FolderOpen, Code2, LifeBuoy, Mail,
  UsersRound, CalendarDays, MessageSquare, FlaskConical, Brain,
  Sparkles, Building2, Tag, Puzzle, Workflow, MonitorDot, HeadphonesIcon, ShieldAlert,
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
  { sec: "Dashboard" },
  { id: "dashboard", path: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", path: "/analytics", label: "Analytics", icon: BarChart3 },

  {
    id: "adv-analytics-g",
    label: "Advanced Analytics",
    icon: Brain,
    children: [
      { id: "analytics-tokens",     path: "/analytics/ai-tokens",  label: "AI Token Tracking"   },
      { id: "analytics-realtime",   path: "/analytics/realtime",   label: "Real-time Analytics" },
      { id: "analytics-geography",  path: "/analytics/geography",  label: "Geography Reports"   },
      { id: "analytics-conversion", path: "/analytics/conversion", label: "Conversion Tracking" },
    ],
  },
  {
  id: "reports-g",
  label: "Advanced Dashboard",
  icon: FileBarChart,
  children: [
    { id: "reports-hub", path: "/reports", label: "Reports Hub" },
    { id: "reports-revenue", path: "/reports/revenue", label: "Revenue Analytics" },
    { id: "reports-users", path: "/reports/users", label: "User Analytics" },
  ],
  },

  { sec: "AI Features" },
  { id: "ai", path: "/ai", label: "AI Workspace", icon: Sparkles },

  // { sec: "Reports" },


  { sec: "Advance Features" },
  {
    id: "tenants-g",
    label: "Multi-Tenant",
    icon: Building2,
    children: [
      { id: "tenants",           path: "/tenants",            label: "Tenant Management"   },
      { id: "tenants-isolation", path: "/tenants/isolation",  label: "Workspace Isolation" },
      { id: "tenants-billing",   path: "/tenants/billing",    label: "Tenant Billing"      },
      { id: "tenants-analytics", path: "/tenants/analytics",  label: "Tenant Analytics"    },
    ],
  },
  {
    id: "white-label-g",
    label: "White Label",
    icon: Tag,
    children: [
      { id: "wl-branding",        path: "/white-label/branding",         label: "Custom Branding"  },
      { id: "wl-domain",          path: "/white-label/domain",           label: "Custom Domain"    },
      { id: "wl-remove-branding", path: "/white-label/remove-branding",  label: "Remove Branding"  },
    ],
  },
  // {
  //   id: "integrations-g",
  //   label: "Integrations",
  //   icon: Puzzle,
  //   children: [
  //     { id: "int-slack",    path: "/integrations/slack",             label: "Slack"             },
  //     { id: "int-zapier",   path: "/integrations/zapier",            label: "Zapier"            },
  //     { id: "int-whatsapp", path: "/integrations/whatsapp",          label: "WhatsApp API"      },
  //     { id: "int-google",   path: "/integrations/google-workspace",  label: "Google Workspace"  },
  //   ],
  // },
  {
    id: "workflows-g",
    label: "Workflow Automation",
    icon: Workflow,
    children: [
      { id: "wf-builder",   path: "/workflows/builder",   label: "Automation Builder"  },
      { id: "wf-triggers",  path: "/workflows/triggers",  label: "Trigger Actions"     },
      { id: "wf-scheduled", path: "/workflows/scheduled", label: "Scheduled Workflows" },
    ],
  },
  {
    id: "monitoring-g",
    label: "Monitoring",
    icon: MonitorDot,
    children: [
      { id: "mon-servers",     path: "/monitoring/servers",     label: "Server Monitoring"    },
      { id: "mon-errors",      path: "/monitoring/errors",      label: "Error Tracking"       },
      { id: "mon-performance", path: "/monitoring/performance", label: "Performance Analytics"},
    ],
  },
  // {
  //   id: "enterprise-g",
  //   label: "Enterprise Support",
  //   icon: HeadphonesIcon,
  //   children: [
  //     { id: "ent-support",    path: "/enterprise/priority-support", label: "Priority Support"     },
  //     { id: "ent-onboarding", path: "/enterprise/onboarding",       label: "Dedicated Onboarding" },
  //     { id: "ent-migration",  path: "/enterprise/migration",        label: "Migration Tools"      },
  //   ],
  // },
  // {
  //   id: "enterprise-sec-g",
  //   label: "Enterprise Security",
  //   icon: ShieldAlert,
  //   children: [
  //     { id: "entsec-sso",      path: "/enterprise-security/sso",      label: "SSO Login"       },
  //     { id: "entsec-ldap",     path: "/enterprise-security/ldap",     label: "LDAP Support"    },
  //     { id: "entsec-rbac",     path: "/enterprise-security/rbac",     label: "Advanced RBAC"   },
  //     { id: "entsec-policies", path: "/enterprise-security/policies", label: "Security Policies"},
  //   ],
  // }  ,

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
  
  {
    id: "crm-g",
    label: "CRM",
    icon: Briefcase,
    children: [
      { id: "crm-leads", path: "/crm/leads", label: "Lead Management" },
      { id: "crm-pipeline", path: "/crm/pipeline", label: "Pipeline" },
      { id: "crm-tasks", path: "/crm/tasks", label: "Tasks" },
      { id: "crm-notes", path: "/crm/notes", label: "Notes" },
    ],
  },

  {
    id: "files-g",
    label: "File Manager",
    icon: FolderOpen,
    children: [
      { id: "files-overview", path: "/file-manager", label: "Uploads" },
      { id: "files-gallery", path: "/file-manager/gallery", label: "Media Gallery" },
      { id: "files-storage", path: "/file-manager/storage", label: "Cloud Storage" },
    ],
  },
    {
    id: "team-g",
    label: "Team",
    icon: UsersRound,
    children: [
      { id: "team-workspaces", path: "/team/workspaces", label: "Workspaces" },
      { id: "team-permissions", path: "/team/permissions", label: "Permissions" },
      { id: "team-projects", path: "/team/projects", label: "Shared Projects" },
      { id: "team-comments", path: "/team/comments", label: "Mentions & Comments" },
    ],
  },

  { sec: "General" },
  { id: "settings", path: "/system/settings", label: "Settings", icon: Settings },
  {
    id: "billing-g",
    label: "Billing",
    icon: CreditCard,
    children: [
      { id: "billing-overview",     path: "/system/billing",              label: "Overview"          },
      { id: "billing-plans",        path: "/system/billing/plans",        label: "Subscription Plans"},
      { id: "billing-subscription", path: "/system/billing/subscription", label: "Subscription"      },
      { id: "billing-usage",        path: "/system/billing/usage",        label: "Usage Billing"     },
      { id: "billing-invoices",     path: "/system/billing/invoices",     label: "Invoices"          },
      { id: "billing-coupons",      path: "/system/billing/coupons",      label: "Coupons"           },
      { id: "billing-trials",       path: "/system/billing/trials",       label: "Trial System"      },
    ],
  },
  {
    id: "support-g",
    label: "Support",
    icon: LifeBuoy,
    children: [
      { id: "support-tickets", path: "/system/support", label: "Ticket System" },
      { id: "support-chat", path: "/system/support/chat", label: "Chat Panel" },
    ],
  },
  {
    id: "devtools-g",
    label: "Dev Tools",
    icon: FlaskConical,
    children: [
      { id: "dev-docs",       path: "/developer/docs",       label: "SDK Documentation"   },
      { id: "dev-playground", path: "/developer/playground", label: "API Playground"      },
      { id: "dev-sandbox",    path: "/developer/sandbox",    label: "Sandbox Environment" },
    ],
  },
  // {
  //   id: "developer-api-g",
  //   label: "API Module",
  //   icon: Code2,
  //   children: [
  //     { id: "api-keys", path: "/developer/api", label: "API Keys" },
  //     { id: "api-logs", path: "/developer/api/logs", label: "API Logs" },
  //     { id: "api-webhooks", path: "/developer/api/webhooks", label: "Webhook Support" },
  //   ],
  // },
  // {
  //   id: "settings-g",
  //   label: "Advanced Settings",
  //   icon: Mail,
  //   children: [
  //     { id: "settings-general", path: "/system/settings", label: "Workspace Settings" },
  //     { id: "settings-notifications", path: "/system/settings/email-notifications", label: "Email Notifications" },
  //     { id: "settings-smtp", path: "/system/settings/smtp", label: "SMTP Settings" },
  //   ],
  // },

  // { sec: "Team Collaboration" },
  // {
  //   id: "team-g",
  //   label: "Team",
  //   icon: UsersRound,
  //   children: [
  //     { id: "team-workspaces", path: "/team/workspaces", label: "Workspaces" },
  //     { id: "team-permissions", path: "/team/permissions", label: "Permissions" },
  //     { id: "team-projects", path: "/team/projects", label: "Shared Projects" },
  //     { id: "team-comments", path: "/team/comments", label: "Mentions & Comments" },
  //   ],
  // },

  // { sec: "Advanced UI" },
  // { id: "calendar", path: "/calendar", label: "Calendar", icon: CalendarDays },
  // { id: "chat", path: "/chat", label: "Chat", icon: MessageSquare },
  // { id: "kanban", path: "/kanban", label: "Kanban Board", icon: LayoutDashboard },

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
  {
    id: "ui-components-g",
    label: "UI Components",
    icon: Component,
    children: [
      { id: "ui-alert", path: "/ui-components/alert", label: "Alert" },
      { id: "ui-buttons", path: "/ui-components/buttons", label: "Buttons" },
      { id: "modals", path: "/modals", label: "Modals" },
      { id: "calendar", path: "/calendar", label: "Calendar" },
      { id: "chat", path: "/chat", label: "Chat" },
      { id: "kanban", path: "/kanban", label: "Kanban Board" },
    ],
  },

  

  

  { sec: "Other" },
  {
    id: "auth-g",
    label: "Authentication",
    icon: KeyRound,
    children: [
      { id: "auth-login", path: "/auth/login", label: "Login" },
      { id: "auth-otp", path: "/auth/otp", label: "OTP Login" },
      { id: "auth-register", path: "/auth/register", label: "Register" },
      { id: "auth-forgot", path: "/auth/forgot-password", label: "Forgot Password" },
      { id: "auth-reset", path: "/auth/reset-password", label: "Reset Password" },
      { id: "auth-2fa", path: "/auth/two-factor", label: "Two-Factor Auth" },
    ],
  },
  {
    id: "security-g",
    label: "Advanced Security",
    icon: Shield,
    children: [
      { id: "security-sessions",       path: "/security/sessions",         label: "Session Management" },
      { id: "security-audit-logs",     path: "/security/audit-logs",       label: "Audit Logs"         },
      { id: "security-ip",             path: "/security/ip-restrictions",  label: "IP Restrictions"    },
      { id: "security-activity",       path: "/security/activity",         label: "Activity Tracking"  },
      { id: "security-devices",        path: "/security/devices",          label: "Device Management"  },
    ],
  },
  {
    id: "docs-g",
    label: "Documentation",
    icon: BookOpen,
    children: [
      { id: "docs-installation", path: "/docs/installation", label: "Installation Guide" },
      { id: "docs-basic-setup", path: "/docs/basic-setup", label: "Basic Setup" },
    ],
  },
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
  if (/^\/system\/support\/[^/]+$/.test(pathname)) return "Ticket details";

  return "Dashboard";
}

export function getBreadcrumbGroup(pathname: string): string | undefined {
  if (BREADCRUMB_GROUPS[pathname]) return BREADCRUMB_GROUPS[pathname];

  if (pathname.startsWith("/users/profile")) return "User Management";
  if (pathname.startsWith("/users/roles")) return "User Management";
  if (pathname.startsWith("/crm/")) return "CRM";
  if (pathname.startsWith("/file-manager/")) return "File Manager";
  if (pathname.startsWith("/developer/api")) return "API Module";
  if (pathname.startsWith("/reports/")) return "Advanced Dashboard";
  if (pathname.startsWith("/system/billing")) return "Billing";
  if (pathname.startsWith("/system/support")) return "Support System";
  if (pathname.startsWith("/system/settings")) return "Advanced Settings";
  if (pathname.startsWith("/security/")) return "Advanced Auth";
  if (pathname.startsWith("/team/")) return "Team";
  if (pathname.startsWith("/tenants")) return "Multi-Tenant";
  if (pathname.startsWith("/white-label")) return "White Label";
  if (pathname.startsWith("/integrations")) return "Integrations";
  if (pathname.startsWith("/workflows"))   return "Workflow Automation";
  if (pathname.startsWith("/monitoring"))  return "Monitoring";
  if (pathname.startsWith("/enterprise"))         return "Enterprise Support";
  if (pathname.startsWith("/enterprise-security")) return "Enterprise Security";
  if (pathname.startsWith("/ai/")) return "AI Features";

  return undefined;
}

// Returns the path of the first child in the nav group that owns `pathname`.
// Used by the breadcrumb to make the group segment a clickable link.
export function getGroupPath(pathname: string): string | undefined {
  for (const item of NAV) {
    if (!("children" in item) || !item.children) continue;
    const owns = item.children.some(
      (c) => pathname === c.path || pathname.startsWith(c.path + "/")
    );
    if (owns) return item.children[0].path;
  }
  return undefined;
}