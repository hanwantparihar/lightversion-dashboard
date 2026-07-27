// ── Advanced Integrations mock data ───────────────────────────────────────────

export type ConnStatus = "connected" | "disconnected" | "error" | "pending";

// ── Slack ─────────────────────────────────────────────────────────────────────
export interface SlackWorkspace {
  id: string; name: string; teamId: string; botName: string;
  status: ConnStatus; connectedAt: string; channels: string[];
  notifications: Record<string, boolean>;
}

export interface SlackEvent {
  id: string; channel: string; event: string; message: string;
  status: "sent" | "failed"; ts: string;
}

export const SLACK_WORKSPACES: SlackWorkspace[] = [
  {
    id: "sw1", name: "Acme Corp", teamId: "T0ACMECORP", botName: "NexoraBot",
    status: "connected", connectedAt: "Jun 10, 2026",
    channels: ["#alerts", "#deployments", "#billing"],
    notifications: { newUser: true, invoice: true, apiError: true, trialExpiry: true, weeklyReport: false },
  },
  {
    id: "sw2", name: "Initech Dev", teamId: "T0INITECH", botName: "NexoraBot",
    status: "connected", connectedAt: "Apr 22, 2026",
    channels: ["#nexora-alerts"],
    notifications: { newUser: false, invoice: true, apiError: true, trialExpiry: false, weeklyReport: true },
  },
  {
    id: "sw3", name: "Quantum Co", teamId: "T0QUANTUM", botName: "NexoraBot",
    status: "error", connectedAt: "May 5, 2026",
    channels: [],
    notifications: { newUser: false, invoice: false, apiError: false, trialExpiry: false, weeklyReport: false },
  },
];

export const SLACK_EVENTS: SlackEvent[] = [
  { id: "se1", channel: "#alerts",      event: "api.error",       message: "Rate limit hit on /v1/users (429)",       status: "sent",   ts: "10:02 AM" },
  { id: "se2", channel: "#billing",     event: "invoice.paid",    message: "Invoice INV-2026-003 paid — $1,199",      status: "sent",   ts: "9:45 AM"  },
  { id: "se3", channel: "#deployments", event: "deploy.success",  message: "v2.4.1 deployed to production",           status: "sent",   ts: "9:30 AM"  },
  { id: "se4", channel: "#alerts",      event: "user.created",    message: "New user: frank@nexora.ai (viewer)",      status: "sent",   ts: "Yesterday"},
  { id: "se5", channel: "#alerts",      event: "trial.expiring",  message: "Trial expires in 3 days — Peak Labs",     status: "failed", ts: "Yesterday"},
];

export const SLACK_NOTIF_LABELS: Record<string, string> = {
  newUser: "New user registered", invoice: "Invoice paid/failed",
  apiError: "API errors (5xx)", trialExpiry: "Trial expiring soon",
  weeklyReport: "Weekly digest report",
};

// ── Zapier ────────────────────────────────────────────────────────────────────
export interface ZapierZap {
  id: string; name: string; trigger: string; action: string;
  status: "on" | "off" | "error"; runsToday: number; totalRuns: number;
  lastRun: string; app: string; appColor: string;
}

export interface ZapierLog {
  id: string; zapId: string; zapName: string;
  status: "success" | "error" | "skipped";
  detail: string; ts: string;
}

export const ZAPIER_ZAPS: ZapierZap[] = [
  { id: "z1", name: "New User → Add to HubSpot",      trigger: "User created in Nexora",    action: "Create contact in HubSpot",     status: "on",    runsToday: 8,  totalRuns: 142, lastRun: "10:12 AM", app: "HubSpot",   appColor: "#ff7a59" },
  { id: "z2", name: "Invoice Paid → Google Sheets",   trigger: "Invoice marked paid",        action: "Append row to Google Sheet",    status: "on",    runsToday: 3,  totalRuns: 89,  lastRun: "9:48 AM",  app: "Google Sheets", appColor: "#34a853" },
  { id: "z3", name: "Trial Expiry → Slack DM",         trigger: "Trial expires in 1 day",    action: "Send Slack DM to sales rep",    status: "on",    runsToday: 1,  totalRuns: 44,  lastRun: "8:00 AM",  app: "Slack",     appColor: "#4a154b" },
  { id: "z4", name: "API Error → PagerDuty",           trigger: "API error rate > 5%",       action: "Trigger PagerDuty incident",    status: "error", runsToday: 0,  totalRuns: 12,  lastRun: "Jun 28",   app: "PagerDuty", appColor: "#06ac38" },
  { id: "z5", name: "New Tenant → Notion Page",        trigger: "Tenant created",            action: "Create page in Notion DB",      status: "off",   runsToday: 0,  totalRuns: 31,  lastRun: "Jun 25",   app: "Notion",    appColor: "#000000" },
];

export const ZAPIER_LOGS: ZapierLog[] = [
  { id: "l1", zapId: "z1", zapName: "New User → HubSpot",     status: "success", detail: "Contact created: frank@nexora.ai",          ts: "10:12 AM" },
  { id: "l2", zapId: "z2", zapName: "Invoice → Sheets",       status: "success", detail: "Row appended: INV-2026-003 $1,199",          ts: "9:48 AM"  },
  { id: "l3", zapId: "z3", zapName: "Trial → Slack DM",       status: "success", detail: "DM sent to @sales — Peak Labs expiring",     ts: "8:00 AM"  },
  { id: "l4", zapId: "z4", zapName: "API Error → PagerDuty",  status: "error",   detail: "Auth failed: invalid API key",               ts: "Jun 28"   },
  { id: "l5", zapId: "z1", zapName: "New User → HubSpot",     status: "skipped", detail: "Duplicate email — skipped dedup filter",     ts: "Jun 27"   },
];

// ── WhatsApp ──────────────────────────────────────────────────────────────────
export interface WhatsAppNumber {
  id: string; displayName: string; phoneNumber: string;
  status: ConnStatus; quality: "green" | "yellow" | "red";
  messagingLimit: string; verifiedName: string; connectedAt: string;
}

export interface WhatsAppTemplate {
  id: string; name: string; category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  status: "APPROVED" | "PENDING" | "REJECTED"; language: string; body: string;
}

export interface WhatsAppMessage {
  id: string; to: string; template: string; status: "delivered" | "read" | "failed" | "sent";
  ts: string;
}

export const WHATSAPP_NUMBERS: WhatsAppNumber[] = [
  { id: "wn1", displayName: "Nexora Support",  phoneNumber: "+1 415 555 0100", status: "connected",    quality: "green",  messagingLimit: "1,000/day", verifiedName: "Nexora AI",      connectedAt: "May 12, 2026" },
  { id: "wn2", displayName: "Nexora Marketing", phoneNumber: "+44 20 7946 0100",status: "connected",    quality: "yellow", messagingLimit: "250/day",   verifiedName: "Nexora AI EU",   connectedAt: "Jun 1, 2026"  },
  { id: "wn3", displayName: "Nexora Alerts",   phoneNumber: "+91 98765 43210",  status: "disconnected", quality: "red",    messagingLimit: "0/day",     verifiedName: "",               connectedAt: "—"            },
];

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  { id: "wt1", name: "welcome_message",      category: "UTILITY",        status: "APPROVED", language: "en_US", body: "Hello {{1}}, welcome to Nexora AI! Your account is ready. Visit {{2}} to get started." },
  { id: "wt2", name: "invoice_notification", category: "UTILITY",        status: "APPROVED", language: "en_US", body: "Hi {{1}}, your invoice #{{2}} for ${{3}} is {{4}}. Download it here: {{5}}" },
  { id: "wt3", name: "trial_reminder",       category: "MARKETING",      status: "APPROVED", language: "en_US", body: "{{1}}, your free trial ends in {{2}} days. Upgrade now and keep your data: {{3}}" },
  { id: "wt4", name: "otp_verification",     category: "AUTHENTICATION", status: "APPROVED", language: "en_US", body: "Your Nexora AI verification code is {{1}}. Valid for 10 minutes. Do not share." },
  { id: "wt5", name: "payment_failed",       category: "UTILITY",        status: "PENDING",  language: "en_US", body: "Hi {{1}}, payment for {{2}} failed. Update your billing details to avoid service interruption." },
];

export const WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  { id: "wm1", to: "+1 415 555 0199", template: "welcome_message",      status: "read",      ts: "10:02 AM" },
  { id: "wm2", to: "+44 20 7946 0200",template: "invoice_notification", status: "delivered", ts: "9:48 AM"  },
  { id: "wm3", to: "+91 98765 43200", template: "trial_reminder",       status: "failed",    ts: "9:30 AM"  },
  { id: "wm4", to: "+1 415 555 0199", template: "otp_verification",     status: "read",      ts: "9:15 AM"  },
  { id: "wm5", to: "+1 415 555 0199", template: "payment_failed",       status: "sent",      ts: "Yesterday"},
];

// ── Google Workspace ──────────────────────────────────────────────────────────
export interface GWorkspaceApp {
  id: string; name: string; icon: string; color: string;
  status: ConnStatus; scopes: string[]; connectedAt: string;
  lastSync?: string; description: string;
}

export interface GWorkspaceEvent {
  id: string; app: string; event: string; detail: string; ts: string;
}

export const GWORKSPACE_APPS: GWorkspaceApp[] = [
  { id: "ga1", name: "Gmail",          icon: "G",  color: "#ea4335", status: "connected",    scopes: ["gmail.send","gmail.readonly"],                 connectedAt: "Mar 10, 2026", lastSync: "2 min ago",  description: "Send transactional emails and read replies via Gmail" },
  { id: "ga2", name: "Google Calendar",icon: "C",  color: "#1a73e8", status: "connected",    scopes: ["calendar.events","calendar.readonly"],         connectedAt: "Mar 10, 2026", lastSync: "5 min ago",  description: "Sync meetings, create events, and send invites"       },
  { id: "ga3", name: "Google Drive",   icon: "D",  color: "#fbbc04", status: "connected",    scopes: ["drive.file","drive.readonly"],                 connectedAt: "Apr 2, 2026",  lastSync: "1 hr ago",   description: "Upload exports, invoices, and reports to Drive"        },
  { id: "ga4", name: "Google Sheets",  icon: "S",  color: "#34a853", status: "connected",    scopes: ["spreadsheets","spreadsheets.readonly"],        connectedAt: "Apr 2, 2026",  lastSync: "30 min ago", description: "Log data, analytics, and billing to spreadsheets"     },
  { id: "ga5", name: "Google Meet",    icon: "M",  color: "#00897b", status: "disconnected", scopes: [],                                              connectedAt: "—",            description: "Auto-schedule Meet links for team meetings"           },
  { id: "ga6", name: "Google SSO",     icon: "ID", color: "#4285f4", status: "connected",    scopes: ["openid","email","profile"],                    connectedAt: "Feb 20, 2026", lastSync: "Active",     description: "Allow users to sign in with their Google account"     },
];

export const GWORKSPACE_EVENTS: GWorkspaceEvent[] = [
  { id: "gwe1", app: "Gmail",           event: "Email sent",         detail: "Welcome email to frank@nexora.ai",      ts: "10:02 AM" },
  { id: "gwe2", app: "Google Calendar", event: "Event created",      detail: "Sprint Planning — Jul 7, 2026 2:00 PM", ts: "9:50 AM"  },
  { id: "gwe3", app: "Google Sheets",   event: "Row appended",       detail: "Revenue log: Jul 1 — $3,394",           ts: "9:30 AM"  },
  { id: "gwe4", app: "Google Drive",    event: "File uploaded",      detail: "INV-2026-003.pdf → /Nexora/Invoices",   ts: "9:15 AM"  },
  { id: "gwe5", app: "Google SSO",      event: "User authenticated", detail: "raj@initech.com signed in via Google",  ts: "8:45 AM"  },
];
