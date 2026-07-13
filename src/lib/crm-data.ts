import type { KanbanData } from "@/components";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";

export type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  value: number;
  assignee: string;
  createdAt: string;
};

export type CrmTask = {
  id: number;
  title: string;
  leadId: number;
  leadName: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
  dueDate: string;
  assignee: string;
};

export type CrmNote = {
  id: number;
  leadId: number;
  leadName: string;
  author: string;
  content: string;
  createdAt: string;
};

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "LinkedIn",
  "Conference",
  "Cold Outreach",
  "Email Campaign",
  "Other",
];

export const LEAD_ASSIGNEES = [
  "James Carter",
  "Olivia Peterson",
  "Sophia Nguyen",
];

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TASK_STATUSES = ["Todo", "In Progress", "Done"] as const;

export const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    company: "Acme Corp",
    email: "sarah@acmecorp.com",
    phone: "+1 555-0101",
    source: "Website",
    status: "Qualified",
    value: 24000,
    assignee: "James Carter",
    createdAt: "Jun 18, 2025",
  },
  {
    id: 2,
    name: "David Chen",
    company: "TechFlow Inc",
    email: "david@techflow.io",
    phone: "+1 555-0102",
    source: "Referral",
    status: "Proposal",
    value: 48000,
    assignee: "Olivia Peterson",
    createdAt: "Jun 15, 2025",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    company: "Bright Labs",
    email: "emma@brightlabs.co",
    phone: "+1 555-0103",
    source: "LinkedIn",
    status: "New",
    value: 12000,
    assignee: "James Carter",
    createdAt: "Jun 20, 2025",
  },
  {
    id: 4,
    name: "Michael Park",
    company: "Nova Systems",
    email: "mpark@novasys.com",
    phone: "+1 555-0104",
    source: "Conference",
    status: "Contacted",
    value: 36000,
    assignee: "Sophia Nguyen",
    createdAt: "Jun 12, 2025",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    company: "Greenfield Co",
    email: "lisa@greenfield.com",
    phone: "+1 555-0105",
    source: "Website",
    status: "Won",
    value: 52000,
    assignee: "Olivia Peterson",
    createdAt: "Jun 01, 2025",
  },
  {
    id: 6,
    name: "Ryan Foster",
    company: "DataPulse",
    email: "ryan@datapulse.io",
    phone: "+1 555-0106",
    source: "Cold Outreach",
    status: "Lost",
    value: 8000,
    assignee: "James Carter",
    createdAt: "May 28, 2025",
  },
];

export const initialTasks: CrmTask[] = [
  {
    id: 1,
    title: "Send proposal to Acme Corp",
    leadId: 1,
    leadName: "Sarah Mitchell",
    priority: "High",
    status: "In Progress",
    dueDate: "Jun 24, 2025",
    assignee: "James Carter",
  },
  {
    id: 2,
    title: "Schedule demo with TechFlow",
    leadId: 2,
    leadName: "David Chen",
    priority: "High",
    status: "Todo",
    dueDate: "Jun 23, 2025",
    assignee: "Olivia Peterson",
  },
  {
    id: 3,
    title: "Follow up on Bright Labs inquiry",
    leadId: 3,
    leadName: "Emma Rodriguez",
    priority: "Medium",
    status: "Todo",
    dueDate: "Jun 25, 2025",
    assignee: "James Carter",
  },
  {
    id: 4,
    title: "Prepare contract for Nova Systems",
    leadId: 4,
    leadName: "Michael Park",
    priority: "Medium",
    status: "In Progress",
    dueDate: "Jun 26, 2025",
    assignee: "Sophia Nguyen",
  },
  {
    id: 5,
    title: "Onboarding call with Greenfield",
    leadId: 5,
    leadName: "Lisa Thompson",
    priority: "Low",
    status: "Done",
    dueDate: "Jun 20, 2025",
    assignee: "Olivia Peterson",
  },
];

export const initialNotes: CrmNote[] = [
  {
    id: 1,
    leadId: 1,
    leadName: "Sarah Mitchell",
    author: "James Carter",
    content:
      "Interested in enterprise plan. Budget approved for Q3. Needs custom SSO integration.",
    createdAt: "Jun 19, 2025",
  },
  {
    id: 2,
    leadId: 2,
    leadName: "David Chen",
    author: "Olivia Peterson",
    content:
      "Demo went well. Team of 45 users. Comparing us with two competitors.",
    createdAt: "Jun 17, 2025",
  },
  {
    id: 3,
    leadId: 4,
    leadName: "Michael Park",
    author: "Sophia Nguyen",
    content:
      "Met at SaaS Connect conference. Looking for CRM + analytics bundle.",
    createdAt: "Jun 14, 2025",
  },
  {
    id: 4,
    leadId: 5,
    leadName: "Lisa Thompson",
    author: "Olivia Peterson",
    content: "Deal closed. Annual contract signed. Kickoff scheduled for next week.",
    createdAt: "Jun 10, 2025",
  },
];

export const initialPipeline: KanbanData = {
  lead: {
    name: "Lead",
    color: "#6366f1",
    cards: [
      { id: 101, title: "AI Analytics Dashboard", company: "Amazon Web Services", tags: [], tagColors: [], progress: 0, comments: 2, attachments: 3, assignee: "MA", assigneeName: "Mark Allen", aColor: "#6366f1", due: "30 May, 2025", amount: 95000 },
      { id: 102, title: "Mobile App Redesign", company: "ByteCraft Studios", tags: [], tagColors: [], progress: 0, comments: 1, attachments: 5, assignee: "AC", assigneeName: "Alex Carter", aColor: "#f59e0b", due: "12 Jun, 2025", amount: 72000 },
      { id: 103, title: "Website Revamp", company: "NextGen UI", tags: [], tagColors: [], progress: 0, comments: 4, attachments: 2, assignee: "ER", assigneeName: "Emily Rose", aColor: "#10b981", due: "18 Jun, 2025", amount: 45500 },
      { id: 104, title: "Campaign Strategy", company: "Visionary Labs", tags: [], tagColors: [], progress: 0, comments: 0, attachments: 0, assignee: "RK", assigneeName: "Ryan King", aColor: "#ef4444", due: "05 Jul, 2025", amount: 23000 },
    ],
  },
  negotiation: {
    name: "Negotiation",
    color: "#f59e0b",
    cards: [
      { id: 111, title: "Product Demo Scheduling", company: "Innovexa", tags: [], tagColors: [], progress: 0, comments: 3, attachments: 4, assignee: "NW", assigneeName: "Nina White", aColor: "#7c3aed", due: "15 Jul, 2025", amount: 18750 },
      { id: 112, title: "CRM Integration Task", company: "CoreSync Ltd.", tags: [], tagColors: [], progress: 0, comments: 7, attachments: 4, assignee: "AR", assigneeName: "Amit Rao", aColor: "#06b6d4", due: "22 Jul, 2025", amount: 39900 },
    ],
  },
  won: {
    name: "Won",
    color: "#10b981",
    cards: [
      { id: 121, title: "Enterprise License Upgrade", company: "Zentrix Corp", tags: ["Won"], tagColors: ["#10b981"], progress: 100, comments: 0, attachments: 0, assignee: "SL", assigneeName: "Sophia Lee", aColor: "#10b981", due: "01 Jul, 2025", amount: 120000 },
      { id: 122, title: "Custom CRM Implementation", company: "DebtSoft", tags: ["Won"], tagColors: ["#10b981"], progress: 100, comments: 0, attachments: 0, assignee: "MJ", assigneeName: "Mark J.", aColor: "#3b82f6", due: "28 Jun, 2025", amount: 89500 },
      { id: 123, title: "API Subscription Expansion", company: "Netwise Solutions", tags: ["Won"], tagColors: ["#10b981"], progress: 100, comments: 0, attachments: 0, assignee: "RP", assigneeName: "Raj Patel", aColor: "#f59e0b", due: "25 Jun, 2025", amount: 58000 },
      { id: 124, title: "Annual Cloud Retainer", company: "SkyVault Inc.", tags: ["Won"], tagColors: ["#10b981"], progress: 100, comments: 0, attachments: 0, assignee: "TR", assigneeName: "Tina Ray", aColor: "#ec4899", due: "21 Jun, 2025", amount: 135000 },
    ],
  },
  lost: {
    name: "Lost",
    color: "#ef4444",
    cards: [
      { id: 131, title: "E-commerce Platform Proposal", company: "QuickCart", tags: ["Lost"], tagColors: ["#ef4444"], progress: 0, comments: 0, attachments: 0, assignee: "JM", assigneeName: "Julia Mason", aColor: "#ef4444", due: "14 Jul, 2025", amount: 55000 },
      { id: 132, title: "Social Media Integration Deal", company: "SuzzPro Media", tags: ["Lost"], tagColors: ["#ef4444"], progress: 0, comments: 0, attachments: 0, assignee: "EC", assigneeName: "Ethan Cruz", aColor: "#f59e0b", due: "10 Jul, 2025", amount: 38400 },
    ],
  },
};

export function nextLeadId(leads: Lead[]): number {
  return leads.reduce((max, l) => Math.max(max, l.id), 0) + 1;
}

export function nextTaskId(tasks: CrmTask[]): number {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

export function nextNoteId(notes: CrmNote[]): number {
  return notes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
}
