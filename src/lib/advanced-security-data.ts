// ── Advanced Security mock data ───────────────────────────────────────────────

export type AuditLog = {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  resource: string;
  ip: string;
  location: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
};

export type IpRule = {
  id: string;
  label: string;
  ip: string;
  type: "allow" | "deny";
  addedBy: string;
  addedAt: string;
  active: boolean;
};

export type ActivityEvent = {
  id: string;
  user: string;
  avatar: string;
  color: string;
  action: string;
  detail: string;
  category: "auth" | "data" | "settings" | "billing" | "api";
  timestamp: string;
};

export type ManagedDevice = {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet";
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastSeen: string;
  trusted: boolean;
  current: boolean;
};

// ── Audit Logs ────────────────────────────────────────────────────────────────
export const AUDIT_LOGS: AuditLog[] = [
  { id: "a1",  action: "User login",           actor: "alice@nexora.ai",  actorRole: "owner",  resource: "/auth/login",          ip: "192.168.1.10",  location: "San Francisco, US", severity: "info",     timestamp: "Jul 1, 2026 · 09:02 AM" },
  { id: "a2",  action: "API key created",       actor: "ben@nexora.ai",    actorRole: "admin",  resource: "/developer/api",       ip: "10.0.0.4",      location: "London, UK",         severity: "warning",  timestamp: "Jul 1, 2026 · 09:14 AM" },
  { id: "a3",  action: "Role changed",          actor: "alice@nexora.ai",  actorRole: "owner",  resource: "/users/roles",         ip: "192.168.1.10",  location: "San Francisco, US", severity: "warning",  timestamp: "Jul 1, 2026 · 09:45 AM" },
  { id: "a4",  action: "Failed login attempt",  actor: "unknown",          actorRole: "—",      resource: "/auth/login",          ip: "203.0.113.55",  location: "Unknown",           severity: "critical", timestamp: "Jul 1, 2026 · 10:03 AM" },
  { id: "a5",  action: "Billing plan changed",  actor: "alice@nexora.ai",  actorRole: "owner",  resource: "/system/billing",      ip: "192.168.1.10",  location: "San Francisco, US", severity: "info",     timestamp: "Jul 1, 2026 · 10:22 AM" },
  { id: "a6",  action: "Webhook deleted",       actor: "cara@nexora.ai",   actorRole: "editor", resource: "/developer/webhooks",  ip: "172.16.0.8",    location: "Berlin, DE",        severity: "warning",  timestamp: "Jul 1, 2026 · 11:05 AM" },
  { id: "a7",  action: "User deleted",          actor: "ben@nexora.ai",    actorRole: "admin",  resource: "/users/manage",        ip: "10.0.0.4",      location: "London, UK",         severity: "critical", timestamp: "Jul 1, 2026 · 11:30 AM" },
  { id: "a8",  action: "2FA disabled",          actor: "dan@nexora.ai",    actorRole: "editor", resource: "/security",            ip: "10.10.1.22",    location: "Toronto, CA",       severity: "critical", timestamp: "Jul 1, 2026 · 12:00 PM" },
  { id: "a9",  action: "Settings updated",      actor: "alice@nexora.ai",  actorRole: "owner",  resource: "/system/settings",    ip: "192.168.1.10",  location: "San Francisco, US", severity: "info",     timestamp: "Jul 1, 2026 · 12:48 PM" },
  { id: "a10", action: "Export triggered",      actor: "eva@nexora.ai",    actorRole: "viewer", resource: "/reports/revenue",    ip: "172.16.0.9",    location: "Paris, FR",         severity: "warning",  timestamp: "Jul 1, 2026 · 01:10 PM" },
];

// ── IP Rules ─────────────────────────────────────────────────────────────────
export const IP_RULES: IpRule[] = [
  { id: "ip1", label: "Office Network",       ip: "192.168.1.0/24",  type: "allow", addedBy: "alice@nexora.ai", addedAt: "Jun 10, 2026", active: true  },
  { id: "ip2", label: "VPN Gateway",          ip: "10.0.0.0/8",      type: "allow", addedBy: "ben@nexora.ai",   addedAt: "Jun 12, 2026", active: true  },
  { id: "ip3", label: "Known threat actor",   ip: "203.0.113.55",    type: "deny",  addedBy: "alice@nexora.ai", addedAt: "Jul 1, 2026",  active: true  },
  { id: "ip4", label: "Blocked region proxy", ip: "185.220.101.0/24",type: "deny",  addedBy: "alice@nexora.ai", addedAt: "Jun 28, 2026", active: true  },
  { id: "ip5", label: "Dev machine (Frank)",  ip: "172.16.0.8",      type: "allow", addedBy: "frank@nexora.ai", addedAt: "May 20, 2026", active: false },
];

// ── Activity Events ───────────────────────────────────────────────────────────
export const ACTIVITY_EVENTS: ActivityEvent[] = [
  { id: "ev1",  user: "Alice Morgan", avatar: "AM", color: "#2563eb", action: "Logged in",              detail: "Chrome on macOS · SF, US",       category: "auth",     timestamp: "2 min ago"  },
  { id: "ev2",  user: "Ben Clarke",   avatar: "BC", color: "#7c3aed", action: "Created API key",        detail: "nexora-prod-v3",                  category: "api",      timestamp: "18 min ago" },
  { id: "ev3",  user: "Cara Singh",   avatar: "CS", color: "#10b981", action: "Updated project",        detail: "Dashboard Redesign",              category: "data",     timestamp: "45 min ago" },
  { id: "ev4",  user: "Alice Morgan", avatar: "AM", color: "#2563eb", action: "Changed billing plan",   detail: "Starter → Pro",                   category: "billing",  timestamp: "1 hr ago"   },
  { id: "ev5",  user: "Dan Reeves",   avatar: "DR", color: "#f59e0b", action: "Disabled 2FA",           detail: "TOTP method removed",             category: "settings", timestamp: "2 hr ago"   },
  { id: "ev6",  user: "Eva Lopes",    avatar: "EL", color: "#ef4444", action: "Exported report",        detail: "Revenue Q2 2026.csv",             category: "data",     timestamp: "3 hr ago"   },
  { id: "ev7",  user: "Ben Clarke",   avatar: "BC", color: "#7c3aed", action: "Revoked webhook",        detail: "order.created endpoint",          category: "api",      timestamp: "5 hr ago"   },
  { id: "ev8",  user: "Frank Wu",     avatar: "FW", color: "#06b6d4", action: "Updated SMTP settings",  detail: "smtp.mailgun.org:587",            category: "settings", timestamp: "6 hr ago"   },
  { id: "ev9",  user: "Alice Morgan", avatar: "AM", color: "#2563eb", action: "Invited team member",    detail: "frank@nexora.ai (viewer)",        category: "data",     timestamp: "8 hr ago"   },
  { id: "ev10", user: "Cara Singh",   avatar: "CS", color: "#10b981", action: "Logged in",              detail: "Firefox on Windows · Berlin, DE", category: "auth",     timestamp: "10 hr ago"  },
];

// ── Devices ───────────────────────────────────────────────────────────────────
export const MANAGED_DEVICES: ManagedDevice[] = [
  { id: "d1", name: "Alice's MacBook Pro", type: "desktop", os: "macOS 14",    browser: "Chrome 125",  ip: "192.168.1.10", location: "San Francisco, US", lastSeen: "Just now",   trusted: true,  current: true  },
  { id: "d2", name: "Alice's iPhone 15",   type: "mobile",  os: "iOS 17",      browser: "Safari 17",   ip: "192.168.1.21", location: "San Francisco, US", lastSeen: "1 hr ago",   trusted: true,  current: false },
  { id: "d3", name: "Work iPad",           type: "tablet",  os: "iPadOS 17",   browser: "Safari 17",   ip: "10.0.0.9",     location: "London, UK",         lastSeen: "2 days ago", trusted: true,  current: false },
  { id: "d4", name: "Ben's Windows PC",    type: "desktop", os: "Windows 11",  browser: "Edge 124",    ip: "10.0.0.4",     location: "London, UK",         lastSeen: "3 hr ago",  trusted: true,  current: false },
  { id: "d5", name: "Unknown device",      type: "mobile",  os: "Android 13",  browser: "Chrome 124",  ip: "203.0.113.55", location: "Unknown",           lastSeen: "Jul 1",     trusted: false, current: false },
];
