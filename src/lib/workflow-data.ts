// ── Workflow Automation mock data ─────────────────────────────────────────────

export type WorkflowStatus = "active" | "inactive" | "draft" | "error";
export type NodeType = "trigger" | "condition" | "action" | "delay" | "end";
export type TriggerType = "event" | "schedule" | "webhook" | "manual";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  x: number;   // grid column (1-based)
  y: number;   // grid row    (1-based)
  config?: Record<string, string>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: TriggerType;
  triggerLabel: string;
  runCount: number;
  lastRun: string;
  createdAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  tags: string[];
  color: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "failed" | "running" | "skipped";
  startedAt: string;
  duration: string;
  stepsCompleted: number;
  totalSteps: number;
  error?: string;
}

export interface ScheduledWorkflow {
  id: string;
  name: string;
  workflowId: string;
  cron: string;
  cronHuman: string;
  nextRun: string;
  lastRun: string;
  status: "active" | "paused" | "error";
  timezone: string;
  runCount: number;
}

// ── Trigger/Action library ────────────────────────────────────────────────────
export interface TriggerDef {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  fields: { key: string; label: string; type: "text" | "select" | "number"; options?: string[] }[];
}

export interface ActionDef {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  fields: { key: string; label: string; type: "text" | "select" | "number" | "textarea"; options?: string[] }[];
}

export const TRIGGER_DEFS: TriggerDef[] = [
  { id: "t-user-created",     category: "Users",    label: "User Created",          description: "Fires when a new user is registered",              icon: "👤", color: "#2563eb", fields: [{ key: "role",  label: "Filter by role",     type: "select",  options: ["any","admin","editor","viewer"] }] },
  { id: "t-invoice-paid",     category: "Billing",  label: "Invoice Paid",          description: "Fires when an invoice is marked paid",             icon: "💳", color: "#10b981", fields: [{ key: "minAmt",label: "Min amount ($)",     type: "number" }] },
  { id: "t-invoice-failed",   category: "Billing",  label: "Payment Failed",        description: "Fires when a payment is declined",                 icon: "❌", color: "#ef4444", fields: [] },
  { id: "t-trial-expiring",   category: "Billing",  label: "Trial Expiring Soon",   description: "Fires N days before a trial ends",                 icon: "⏰", color: "#f59e0b", fields: [{ key: "days", label: "Days before expiry",  type: "number" }] },
  { id: "t-tenant-created",   category: "Tenants",  label: "Tenant Created",        description: "Fires when a new tenant workspace is added",       icon: "🏢", color: "#7c3aed", fields: [{ key: "plan",  label: "Filter by plan",     type: "select",  options: ["any","starter","pro","enterprise"] }] },
  { id: "t-api-error",        category: "System",   label: "API Error Threshold",   description: "Fires when error rate exceeds a percentage",       icon: "🔥", color: "#ef4444", fields: [{ key: "pct",   label: "Error rate %",       type: "number" }] },
  { id: "t-webhook-received", category: "System",   label: "Webhook Received",      description: "Fires when a POST arrives on a webhook URL",       icon: "📡", color: "#06b6d4", fields: [{ key: "path",  label: "Webhook path",       type: "text" }] },
  { id: "t-form-submitted",   category: "Forms",    label: "Form Submitted",        description: "Fires when a user submits a form",                 icon: "📝", color: "#8b5cf6", fields: [{ key: "formId",label: "Form ID",            type: "text" }] },
];

export const ACTION_DEFS: ActionDef[] = [
  { id: "a-send-email",       category: "Email",      label: "Send Email",            description: "Send a transactional email to a recipient",       icon: "✉️", color: "#2563eb", fields: [{ key: "to", label: "To", type: "text" }, { key: "subject", label: "Subject", type: "text" }, { key: "body", label: "Body", type: "textarea" }] },
  { id: "a-slack-message",    category: "Slack",      label: "Send Slack Message",    description: "Post a message to a Slack channel",               icon: "💬", color: "#4a154b", fields: [{ key: "channel", label: "Channel", type: "text" }, { key: "message", label: "Message", type: "textarea" }] },
  { id: "a-whatsapp",         category: "WhatsApp",   label: "Send WhatsApp Message", description: "Send a template message via WhatsApp API",        icon: "📱", color: "#25d366", fields: [{ key: "to", label: "Phone number", type: "text" }, { key: "template", label: "Template name", type: "text" }] },
  { id: "a-webhook",          category: "System",     label: "Fire Webhook",          description: "POST a payload to an external URL",               icon: "📡", color: "#06b6d4", fields: [{ key: "url", label: "URL", type: "text" }, { key: "method", label: "Method", type: "select", options: ["POST","PUT","PATCH"] }] },
  { id: "a-update-user",      category: "Users",      label: "Update User",           description: "Update a field on the triggering user",           icon: "✏️", color: "#7c3aed", fields: [{ key: "field", label: "Field", type: "select", options: ["role","status","tags"] }, { key: "value", label: "Value", type: "text" }] },
  { id: "a-create-invoice",   category: "Billing",    label: "Create Invoice",        description: "Generate an invoice for a tenant",                icon: "🧾", color: "#10b981", fields: [{ key: "amount", label: "Amount ($)", type: "number" }, { key: "plan", label: "Plan", type: "text" }] },
  { id: "a-add-tag",          category: "CRM",        label: "Add Tag to Contact",    description: "Add a CRM tag to the triggering contact",         icon: "🏷️", color: "#f59e0b", fields: [{ key: "tag", label: "Tag name", type: "text" }] },
  { id: "a-google-sheets",    category: "Google",     label: "Append to Sheet",       description: "Append a row to a Google Sheet",                  icon: "📊", color: "#34a853", fields: [{ key: "sheetId", label: "Sheet ID", type: "text" }, { key: "row", label: "Row data", type: "text" }] },
  { id: "a-wait-delay",       category: "Control",    label: "Wait / Delay",          description: "Pause execution for a set duration",              icon: "⏳", color: "#94a3b8", fields: [{ key: "duration", label: "Duration", type: "number" }, { key: "unit", label: "Unit", type: "select", options: ["minutes","hours","days"] }] },
  { id: "a-condition-branch", category: "Control",    label: "Condition / Branch",    description: "Fork execution based on a boolean condition",     icon: "🔀", color: "#f43f5e", fields: [{ key: "field", label: "Field to check", type: "text" }, { key: "operator", label: "Operator", type: "select", options: ["equals","not_equals","contains","gt","lt"] }, { key: "value", label: "Value", type: "text" }] },
];

// ── Workflows ─────────────────────────────────────────────────────────────────
export const WORKFLOWS: Workflow[] = [
  {
    id: "wf1", name: "Welcome New User", description: "Sends welcome email + Slack notification when a new user signs up",
    status: "active", trigger: "event", triggerLabel: "User Created", runCount: 284, lastRun: "10:02 AM", createdAt: "May 1, 2026",
    tags: ["onboarding", "email"], color: "#2563eb",
    nodes: [
      { id: "n1", type: "trigger",   label: "User Created",         description: "Trigger: new user registered",             x: 1, y: 2 },
      { id: "n2", type: "action",    label: "Send Welcome Email",   description: "Action: send email via SMTP",               x: 2, y: 2 },
      { id: "n3", type: "action",    label: "Slack Notification",   description: "Action: post to #new-users",                x: 3, y: 1 },
      { id: "n4", type: "action",    label: "Add CRM Tag",          description: "Action: tag as 'new-signup'",               x: 3, y: 3 },
      { id: "n5", type: "end",       label: "Done",                 description: "Workflow complete",                         x: 4, y: 2 },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n2", to: "n4" },
      { from: "n3", to: "n5" },
      { from: "n4", to: "n5" },
    ],
  },
  {
    id: "wf2", name: "Trial Expiry Reminder", description: "Sends reminder at 7 days and 1 day before trial ends",
    status: "active", trigger: "schedule", triggerLabel: "Every day 8:00 AM", runCount: 142, lastRun: "8:00 AM", createdAt: "May 15, 2026",
    tags: ["trial", "retention"], color: "#f59e0b",
    nodes: [
      { id: "n1", type: "trigger",   label: "Daily Schedule",       description: "Trigger: every day at 8:00 AM",            x: 1, y: 2 },
      { id: "n2", type: "condition", label: "Days Left = 7?",       description: "Condition: daysLeft equals 7",              x: 2, y: 1 },
      { id: "n3", type: "condition", label: "Days Left = 1?",       description: "Condition: daysLeft equals 1",              x: 2, y: 3 },
      { id: "n4", type: "action",    label: "Send 7-Day Email",     description: "Action: send reminder email",               x: 3, y: 1 },
      { id: "n5", type: "action",    label: "Send Final Reminder",  description: "Action: send urgent reminder + WhatsApp",   x: 3, y: 3 },
      { id: "n6", type: "end",       label: "Done",                 description: "Workflow complete",                         x: 4, y: 2 },
    ],
    edges: [
      { from: "n1", to: "n2" }, { from: "n1", to: "n3" },
      { from: "n2", to: "n4", label: "yes" }, { from: "n3", to: "n5", label: "yes" },
      { from: "n4", to: "n6" }, { from: "n5", to: "n6" },
    ],
  },
  {
    id: "wf3", name: "Failed Payment Recovery", description: "Automatically notifies customer and creates follow-up task",
    status: "active", trigger: "event", triggerLabel: "Payment Failed", runCount: 38, lastRun: "Jun 29", createdAt: "Jun 1, 2026",
    tags: ["billing", "retention"], color: "#ef4444",
    nodes: [
      { id: "n1", type: "trigger",   label: "Payment Failed",       description: "Trigger: invoice payment declined",        x: 1, y: 2 },
      { id: "n2", type: "action",    label: "Send Failure Email",   description: "Action: notify customer via email",        x: 2, y: 2 },
      { id: "n3", type: "delay",     label: "Wait 24h",             description: "Delay: pause for 24 hours",                x: 3, y: 2 },
      { id: "n4", type: "action",    label: "Retry Payment",        description: "Action: trigger payment retry",            x: 4, y: 1 },
      { id: "n5", type: "action",    label: "Slack Alert",          description: "Action: notify sales team in Slack",       x: 4, y: 3 },
      { id: "n6", type: "end",       label: "Done",                 description: "Workflow complete",                        x: 5, y: 2 },
    ],
    edges: [
      { from: "n1", to: "n2" }, { from: "n2", to: "n3" },
      { from: "n3", to: "n4" }, { from: "n3", to: "n5" },
      { from: "n4", to: "n6" }, { from: "n5", to: "n6" },
    ],
  },
  {
    id: "wf4", name: "Weekly Analytics Report", description: "Compiles metrics and emails a digest every Monday",
    status: "active", trigger: "schedule", triggerLabel: "Every Monday 7:00 AM", runCount: 12, lastRun: "Jul 7, 2026", createdAt: "Jun 10, 2026",
    tags: ["reporting"], color: "#7c3aed",
    nodes: [
      { id: "n1", type: "trigger",   label: "Weekly Schedule",      description: "Trigger: every Monday 7:00 AM",            x: 1, y: 2 },
      { id: "n2", type: "action",    label: "Fetch Metrics",        description: "Action: query analytics API",               x: 2, y: 2 },
      { id: "n3", type: "action",    label: "Append to Sheet",      description: "Action: log to Google Sheets",              x: 3, y: 1 },
      { id: "n4", type: "action",    label: "Send Digest Email",    description: "Action: email report to admins",            x: 3, y: 3 },
      { id: "n5", type: "end",       label: "Done",                 description: "Workflow complete",                         x: 4, y: 2 },
    ],
    edges: [
      { from: "n1", to: "n2" }, { from: "n2", to: "n3" },
      { from: "n2", to: "n4" }, { from: "n3", to: "n5" }, { from: "n4", to: "n5" },
    ],
  },
  {
    id: "wf5", name: "API Error Alert",          description: "Notifies on-call engineer when error rate exceeds 5%",
    status: "inactive", trigger: "event", triggerLabel: "API Error Threshold", runCount: 7, lastRun: "Jun 28", createdAt: "Jun 5, 2026",
    tags: ["monitoring"], color: "#06b6d4",
    nodes: [
      { id: "n1", type: "trigger",   label: "Error Rate > 5%",      description: "Trigger: API error threshold breached",    x: 1, y: 2 },
      { id: "n2", type: "action",    label: "Slack #ops Alert",     description: "Action: post to Slack #ops",               x: 2, y: 2 },
      { id: "n3", type: "action",    label: "Fire PagerDuty",       description: "Action: trigger PagerDuty incident",       x: 3, y: 2 },
      { id: "n4", type: "end",       label: "Done",                 description: "Workflow complete",                        x: 4, y: 2 },
    ],
    edges: [{ from: "n1", to: "n2" }, { from: "n2", to: "n3" }, { from: "n3", to: "n4" }],
  },
];

// ── Run history ────────────────────────────────────────────────────────────────
export const WORKFLOW_RUNS: WorkflowRun[] = [
  { id: "r1", workflowId: "wf1", workflowName: "Welcome New User",         status: "success", startedAt: "10:02 AM", duration: "1.2s",  stepsCompleted: 5, totalSteps: 5 },
  { id: "r2", workflowId: "wf2", workflowName: "Trial Expiry Reminder",    status: "success", startedAt: "8:00 AM",  duration: "0.8s",  stepsCompleted: 4, totalSteps: 4 },
  { id: "r3", workflowId: "wf1", workflowName: "Welcome New User",         status: "success", startedAt: "7:44 AM",  duration: "1.1s",  stepsCompleted: 5, totalSteps: 5 },
  { id: "r4", workflowId: "wf3", workflowName: "Failed Payment Recovery",  status: "failed",  startedAt: "Jun 29",   duration: "0.4s",  stepsCompleted: 2, totalSteps: 6, error: "SMTP timeout on step 2" },
  { id: "r5", workflowId: "wf4", workflowName: "Weekly Analytics Report",  status: "success", startedAt: "Jul 7",    duration: "3.4s",  stepsCompleted: 5, totalSteps: 5 },
  { id: "r6", workflowId: "wf5", workflowName: "API Error Alert",          status: "skipped", startedAt: "Jun 28",   duration: "0s",    stepsCompleted: 0, totalSteps: 4 },
];

// ── Scheduled workflows ───────────────────────────────────────────────────────
export const SCHEDULED_WORKFLOWS: ScheduledWorkflow[] = [
  { id: "s1", name: "Trial Expiry Reminder",    workflowId: "wf2", cron: "0 8 * * *",   cronHuman: "Every day at 8:00 AM",       nextRun: "Tomorrow 8:00 AM",      lastRun: "Today 8:00 AM",   status: "active", timezone: "America/New_York", runCount: 142 },
  { id: "s2", name: "Weekly Analytics Report",  workflowId: "wf4", cron: "0 7 * * 1",   cronHuman: "Every Monday at 7:00 AM",    nextRun: "Jul 14, 7:00 AM",       lastRun: "Jul 7, 7:00 AM",  status: "active", timezone: "America/New_York", runCount: 12  },
  { id: "s3", name: "Monthly Invoice Run",       workflowId: "wf2", cron: "0 9 1 * *",   cronHuman: "1st of every month, 9:00 AM",nextRun: "Aug 1, 9:00 AM",        lastRun: "Jul 1, 9:00 AM",  status: "active", timezone: "UTC",              runCount: 7   },
  { id: "s4", name: "Daily Health Check",        workflowId: "wf5", cron: "*/15 * * * *",cronHuman: "Every 15 minutes",           nextRun: "In 8 minutes",          lastRun: "5 min ago",       status: "paused", timezone: "UTC",              runCount: 489 },
  { id: "s5", name: "Quarterly Cleanup",         workflowId: "wf4", cron: "0 0 1 1,4,7,10 *", cronHuman: "Quarterly (Jan/Apr/Jul/Oct)", nextRun: "Oct 1, 12:00 AM", lastRun: "Jul 1, 12:00 AM", status: "active", timezone: "UTC",              runCount: 3   },
];
