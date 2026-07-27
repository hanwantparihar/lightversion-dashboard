// ── Enterprise Support mock data ──────────────────────────────────────────────

// ── Priority Support ──────────────────────────────────────────────────────────
export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketStatus   = "open" | "in_progress" | "waiting" | "resolved" | "closed";

export interface SupportTicket {
  id: string; subject: string; description: string;
  priority: TicketPriority; status: TicketStatus;
  tenant: string; tenantAvatar: string; tenantColor: string;
  assignee: string; assigneeAvatar: string;
  slaDeadline: string; slaBreached: boolean;
  createdAt: string; updatedAt: string;
  channel: "email" | "slack" | "portal" | "phone";
  tags: string[];
  messages: { id: string; author: string; avatar: string; role: "customer" | "agent"; content: string; ts: string }[];
}

export interface SLAPolicy {
  plan: string; color: string;
  responseTime: string; resolutionTime: string;
  support: string; dedicated: boolean;
}

export const SLA_POLICIES: SLAPolicy[] = [
  { plan: "Enterprise", color: "#f59e0b", responseTime: "1 hour",  resolutionTime: "4 hours",  support: "24/7 phone + Slack", dedicated: true  },
  { plan: "Pro",        color: "#7c3aed", responseTime: "4 hours", resolutionTime: "24 hours", support: "Business hours email", dedicated: false },
  { plan: "Starter",    color: "#94a3b8", responseTime: "24 hours",resolutionTime: "72 hours", support: "Email only",          dedicated: false },
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TKT-0041", subject: "Production database connection pool exhausted",
    description: "Our db-primary server keeps hitting 100/100 connections causing 503s in production.",
    priority: "critical", status: "in_progress",
    tenant: "Initech", tenantAvatar: "IN", tenantColor: "#10b981",
    assignee: "Alice Morgan", assigneeAvatar: "AM",
    slaDeadline: "2h remaining", slaBreached: false,
    createdAt: "Today 08:14 AM", updatedAt: "10 min ago",
    channel: "slack", tags: ["database","production","p0"],
    messages: [
      { id: "m1", author: "Raj Patel",    avatar: "RP", role: "customer", content: "We're seeing 503 errors across all API endpoints. Looks like the DB pool is exhausted. Need urgent help.", ts: "08:14 AM" },
      { id: "m2", author: "Alice Morgan", avatar: "AM", role: "agent",    content: "Hi Raj, I'm on this now. Can you share your current pg_stat_activity output? I'll check your connection limits on our side.", ts: "08:22 AM" },
      { id: "m3", author: "Raj Patel",    avatar: "RP", role: "customer", content: "Shared via Slack. Pool is at 100/100, most connections in idle state.", ts: "08:35 AM" },
      { id: "m4", author: "Alice Morgan", avatar: "AM", role: "agent",    content: "Found it — PgBouncer config has pool_mode=session which prevents connection reuse. Switching to transaction mode. Rolling out now.", ts: "09:48 AM" },
    ],
  },
  {
    id: "TKT-0040", subject: "SSO login failing for SAML users after cert rotation",
    description: "SAML authentication stopped working after our IdP rotated certificates.",
    priority: "high", status: "open",
    tenant: "Acme Corp", tenantAvatar: "AC", tenantColor: "#2563eb",
    assignee: "Unassigned", assigneeAvatar: "??",
    slaDeadline: "3h 20min remaining", slaBreached: false,
    createdAt: "Today 09:05 AM", updatedAt: "1 hr ago",
    channel: "email", tags: ["auth","sso","saml"],
    messages: [
      { id: "m1", author: "Alex Turner", avatar: "AT", role: "customer", content: "After rotating our Okta signing cert, SAML SSO stopped working for all users. Error: invalid_signature.", ts: "09:05 AM" },
    ],
  },
  {
    id: "TKT-0039", subject: "WhatsApp template rejected without clear reason",
    description: "Our payment_failed template was rejected by Meta. Need help understanding why.",
    priority: "medium", status: "waiting",
    tenant: "Skyline Tech", tenantAvatar: "ST", tenantColor: "#ef4444",
    assignee: "Ben Clarke", assigneeAvatar: "BC",
    slaDeadline: "18h remaining", slaBreached: false,
    createdAt: "Yesterday 3:00 PM", updatedAt: "4 hr ago",
    channel: "portal", tags: ["whatsapp","template"],
    messages: [
      { id: "m1", author: "Chris Lin",  avatar: "CL", role: "customer", content: "Template payment_failed was rejected. Meta's rejection reason is just 'POLICY_VIOLATION' with no details.", ts: "3:00 PM" },
      { id: "m2", author: "Ben Clarke", avatar: "BC", role: "agent",    content: "Hi Chris, I've escalated to our Meta partnership team. They've requested 48h to investigate. I'll update you as soon as I hear back.", ts: "5:30 PM" },
    ],
  },
  {
    id: "TKT-0038", subject: "Billing invoice showing wrong tax calculation",
    description: "July invoice shows 25% VAT but our account is registered in UAE (0% VAT).",
    priority: "medium", status: "resolved",
    tenant: "Quantum Co", tenantAvatar: "QC", tenantColor: "#8b5cf6",
    assignee: "Alice Morgan", assigneeAvatar: "AM",
    slaDeadline: "Resolved", slaBreached: false,
    createdAt: "Jun 30", updatedAt: "Jul 1",
    channel: "email", tags: ["billing","tax"],
    messages: [
      { id: "m1", author: "Yuki Tanaka", avatar: "YT", role: "customer", content: "Invoice INV-2026-005 shows 25% VAT. We're UAE registered and should be 0%.", ts: "Jun 30" },
      { id: "m2", author: "Alice Morgan",avatar: "AM", role: "agent",    content: "Confirmed — your tax region wasn't set correctly. I've corrected it and re-issued the invoice with a credit note for the difference.", ts: "Jul 1"  },
    ],
  },
];

// ── Dedicated Onboarding ──────────────────────────────────────────────────────
export interface OnboardingSession {
  id: string; tenant: string; tenantAvatar: string; tenantColor: string;
  csm: string; csmAvatar: string; plan: string;
  phase: "kickoff" | "setup" | "training" | "go_live" | "completed";
  progress: number; startDate: string; targetDate: string;
  nextSession: string; nextTopic: string;
}

export interface OnboardingTask {
  id: string; phase: string; title: string; description: string;
  completed: boolean; dueDate: string; owner: "customer" | "nexora";
}

export const ONBOARDING_SESSIONS: OnboardingSession[] = [
  { id: "ob1", tenant: "Acme Corp",    tenantAvatar: "AC", tenantColor: "#2563eb", csm: "Alice Morgan",  csmAvatar: "AM", plan: "Enterprise", phase: "training",  progress: 62, startDate: "Jun 10, 2026", targetDate: "Jul 25, 2026", nextSession: "Tomorrow 2:00 PM", nextTopic: "API integration workshop" },
  { id: "ob2", tenant: "Initech",      tenantAvatar: "IN", tenantColor: "#10b981", csm: "Ben Clarke",    csmAvatar: "BC", plan: "Enterprise", phase: "go_live",   progress: 88, startDate: "May 1, 2026",  targetDate: "Jul 15, 2026", nextSession: "Jul 10, 3:00 PM",  nextTopic: "Go-live checklist review"  },
  { id: "ob3", tenant: "Nova Systems", tenantAvatar: "NS", tenantColor: "#06b6d4", csm: "Cara Singh",    csmAvatar: "CS", plan: "Pro",        phase: "setup",     progress: 28, startDate: "Jun 28, 2026", targetDate: "Aug 1, 2026",  nextSession: "Jul 12, 11:00 AM", nextTopic: "Workspace & team setup"    },
  { id: "ob4", tenant: "Skyline Tech", tenantAvatar: "ST", tenantColor: "#ef4444", csm: "Alice Morgan",  csmAvatar: "AM", plan: "Enterprise", phase: "kickoff",   progress: 10, startDate: "Jul 1, 2026",  targetDate: "Aug 15, 2026", nextSession: "Jul 8, 10:00 AM",  nextTopic: "Requirements discovery"   },
  { id: "ob5", tenant: "Quantum Co",   tenantAvatar: "QC", tenantColor: "#8b5cf6", csm: "Ben Clarke",    csmAvatar: "BC", plan: "Pro",        phase: "completed", progress: 100,startDate: "Apr 10, 2026", targetDate: "May 31, 2026", nextSession: "—",                nextTopic: "Ongoing CSM check-ins"    },
];

export const ONBOARDING_TASKS: OnboardingTask[] = [
  { id: "t1",  phase: "Kickoff",  title: "Intro call & goal alignment",      description: "Meet the team, define success metrics",          completed: true,  dueDate: "Day 1",  owner: "nexora"   },
  { id: "t2",  phase: "Kickoff",  title: "Requirements document shared",     description: "Send pre-onboarding questionnaire",               completed: true,  dueDate: "Day 2",  owner: "nexora"   },
  { id: "t3",  phase: "Setup",    title: "Workspace created & configured",   description: "Provision workspace, set region & isolation",     completed: true,  dueDate: "Day 3",  owner: "nexora"   },
  { id: "t4",  phase: "Setup",    title: "SSO / SAML configured",            description: "Connect customer IdP (Okta/Azure/Google)",        completed: true,  dueDate: "Day 5",  owner: "customer" },
  { id: "t5",  phase: "Setup",    title: "Custom domain verified",           description: "DNS records added and SSL provisioned",            completed: false, dueDate: "Day 7",  owner: "customer" },
  { id: "t6",  phase: "Training", title: "Admin training session (2h)",      description: "Walk through settings, users, billing",           completed: true,  dueDate: "Week 2", owner: "nexora"   },
  { id: "t7",  phase: "Training", title: "Developer API workshop",           description: "Cover SDK, webhooks, and sandbox",                completed: false, dueDate: "Week 2", owner: "nexora"   },
  { id: "t8",  phase: "Training", title: "Team invitations sent",            description: "Customer to invite all team members",             completed: false, dueDate: "Week 2", owner: "customer" },
  { id: "t9",  phase: "Go Live",  title: "Go-live checklist completed",      description: "Review all setup, security, and billing items",   completed: false, dueDate: "Week 3", owner: "nexora"   },
  { id: "t10", phase: "Go Live",  title: "Production cutover",               description: "Switch traffic from old system",                  completed: false, dueDate: "Week 3", owner: "customer" },
];

// ── Migration Tools ───────────────────────────────────────────────────────────
export type MigrationStatus = "pending" | "running" | "completed" | "failed" | "paused";

export interface Migration {
  id: string; name: string; tenant: string; tenantAvatar: string; tenantColor: string;
  source: string; destination: string; status: MigrationStatus;
  totalRecords: number; migratedRecords: number; failedRecords: number;
  startedAt: string; estimatedCompletion: string; duration: string;
  tables: { name: string; total: number; migrated: number; status: MigrationStatus }[];
  logs: { ts: string; level: "info" | "warn" | "error"; message: string }[];
}

export const MIGRATIONS: Migration[] = [
  {
    id: "mg1", name: "Acme — Salesforce → Nexora CRM",
    tenant: "Acme Corp", tenantAvatar: "AC", tenantColor: "#2563eb",
    source: "Salesforce (v59)", destination: "Nexora AI CRM",
    status: "completed", totalRecords: 48_420, migratedRecords: 48_420, failedRecords: 0,
    startedAt: "Jun 28, 9:00 AM", estimatedCompletion: "Jun 28, 11:30 AM", duration: "2h 14m",
    tables: [
      { name: "contacts",  total: 22_400, migrated: 22_400, status: "completed" },
      { name: "companies", total: 4_200,  migrated: 4_200,  status: "completed" },
      { name: "deals",     total: 18_820, migrated: 18_820, status: "completed" },
      { name: "activities",total: 3_000,  migrated: 3_000,  status: "completed" },
    ],
    logs: [
      { ts: "09:00:02", level: "info",  message: "Migration started — 48,420 total records" },
      { ts: "09:48:14", level: "info",  message: "contacts table completed (22,400/22,400)" },
      { ts: "10:12:33", level: "info",  message: "companies table completed (4,200/4,200)"  },
      { ts: "11:08:50", level: "info",  message: "deals table completed (18,820/18,820)"    },
      { ts: "11:14:07", level: "info",  message: "Migration completed successfully ✓"       },
    ],
  },
  {
    id: "mg2", name: "Initech — MySQL → Nexora DB",
    tenant: "Initech", tenantAvatar: "IN", tenantColor: "#10b981",
    source: "MySQL 8.0", destination: "Nexora DB (Postgres 16)",
    status: "running", totalRecords: 124_800, migratedRecords: 84_320, failedRecords: 14,
    startedAt: "Today 8:00 AM", estimatedCompletion: "Today 1:30 PM", duration: "2h 10m (running)",
    tables: [
      { name: "users",     total: 14_200, migrated: 14_200, status: "completed" },
      { name: "orders",    total: 88_400, migrated: 62_100, status: "running"   },
      { name: "products",  total: 12_200, migrated: 8_020,  status: "running"   },
      { name: "analytics", total: 10_000, migrated: 0,      status: "pending"   },
    ],
    logs: [
      { ts: "08:00:01", level: "info",  message: "Migration started — 124,800 total records" },
      { ts: "08:12:44", level: "info",  message: "users table completed (14,200/14,200)"     },
      { ts: "09:30:22", level: "warn",  message: "14 records skipped — invalid email format" },
      { ts: "10:10:07", level: "info",  message: "orders table in progress (62,100/88,400)"  },
    ],
  },
  {
    id: "mg3", name: "Nova — CSV bulk import",
    tenant: "Nova Systems", tenantAvatar: "NS", tenantColor: "#06b6d4",
    source: "CSV files (4 files)", destination: "Nexora AI",
    status: "failed", totalRecords: 8_400, migratedRecords: 3_200, failedRecords: 248,
    startedAt: "Yesterday 2:00 PM", estimatedCompletion: "—", duration: "14m (failed)",
    tables: [
      { name: "customers", total: 4_200, migrated: 3_200, status: "failed"    },
      { name: "invoices",  total: 4_200, migrated: 0,     status: "pending"   },
    ],
    logs: [
      { ts: "14:00:01", level: "info",  message: "Import started — 4 CSV files, 8,400 records" },
      { ts: "14:06:12", level: "warn",  message: "248 rows have missing required fields"        },
      { ts: "14:14:55", level: "error", message: "Import aborted — column mismatch on row 3201: expected 'phone_number', got 'tel'" },
    ],
  },
];
