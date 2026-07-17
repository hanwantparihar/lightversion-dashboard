// ── Advanced Billing mock data ─────────────────────────────────────────────────

// ── Usage-based billing ───────────────────────────────────────────────────────
export type UsageMetric = {
  id: string;
  name: string;
  unit: string;
  used: number;
  limit: number;
  costPerUnit: number;
  color: string;
};

export type UsageCustomer = {
  id: string;
  name: string;
  plan: string;
  metrics: { metricId: string; used: number }[];
  totalThisCycle: number;
  avatar: string;
  color: string;
};

export const USAGE_METRICS: UsageMetric[] = [
  { id: "m1", name: "API Calls",       unit: "calls",  used: 84_200,  limit: 100_000, costPerUnit: 0.0001, color: "#2563eb" },
  { id: "m2", name: "Storage",         unit: "GB",     used: 38,      limit: 100,     costPerUnit: 0.023,  color: "#7c3aed" },
  { id: "m3", name: "Email Sends",     unit: "emails", used: 12_400,  limit: 50_000,  costPerUnit: 0.0008, color: "#10b981" },
  { id: "m4", name: "Active Seats",    unit: "users",  used: 9,       limit: 15,      costPerUnit: 12,     color: "#f59e0b" },
  { id: "m5", name: "Webhook Events",  unit: "events", used: 6_700,   limit: 20_000,  costPerUnit: 0.0005, color: "#06b6d4" },
];

export const USAGE_CUSTOMERS: UsageCustomer[] = [
  { id: "uc1", name: "Acme Corp",    plan: "Pro",        metrics: [{ metricId: "m1", used: 22_000 }, { metricId: "m2", used: 12 }], totalThisCycle: 48.20,  avatar: "AC", color: "#2563eb" },
  { id: "uc2", name: "Globex Inc",   plan: "Starter",    metrics: [{ metricId: "m1", used: 5_400  }, { metricId: "m2", used: 3  }], totalThisCycle: 9.54,   avatar: "GI", color: "#7c3aed" },
  { id: "uc3", name: "Initech",      plan: "Enterprise", metrics: [{ metricId: "m1", used: 41_800 }, { metricId: "m2", used: 18 }], totalThisCycle: 118.74, avatar: "IN", color: "#10b981" },
  { id: "uc4", name: "Umbrella LLC", plan: "Pro",        metrics: [{ metricId: "m1", used: 15_000 }, { metricId: "m2", used: 5  }], totalThisCycle: 31.50,  avatar: "UL", color: "#f59e0b" },
];

// ── Invoices ──────────────────────────────────────────────────────────────────
export type Invoice = {
  id: string;
  customer: string;
  customerEmail: string;
  avatar: string;
  color: string;
  plan: string;
  amount: number;
  tax: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issuedAt: string;
  dueAt: string;
  items: { desc: string; qty: number; unitPrice: number }[];
};

export const INVOICES: Invoice[] = [
  {
    id: "INV-2026-001", customer: "Acme Corp",    customerEmail: "billing@acme.com",   avatar: "AC", color: "#2563eb",
    plan: "Pro", amount: 149.00, tax: 14.90, status: "paid",    issuedAt: "Jun 1, 2026",  dueAt: "Jun 15, 2026",
    items: [{ desc: "Pro Plan (monthly)", qty: 1, unitPrice: 129 }, { desc: "Extra seats (2)", qty: 2, unitPrice: 10 }],
  },
  {
    id: "INV-2026-002", customer: "Globex Inc",   customerEmail: "finance@globex.io",  avatar: "GI", color: "#7c3aed",
    plan: "Starter", amount: 29.00, tax: 2.90, status: "paid",    issuedAt: "Jun 1, 2026",  dueAt: "Jun 15, 2026",
    items: [{ desc: "Starter Plan (monthly)", qty: 1, unitPrice: 29 }],
  },
  {
    id: "INV-2026-003", customer: "Initech",      customerEmail: "ap@initech.com",     avatar: "IN", color: "#10b981",
    plan: "Enterprise", amount: 399.00, tax: 39.90, status: "pending", issuedAt: "Jul 1, 2026",  dueAt: "Jul 15, 2026",
    items: [{ desc: "Enterprise Plan (monthly)", qty: 1, unitPrice: 399 }],
  },
  {
    id: "INV-2026-004", customer: "Umbrella LLC", customerEmail: "billing@umbrella.io",avatar: "UL", color: "#f59e0b",
    plan: "Pro", amount: 149.00, tax: 14.90, status: "overdue",  issuedAt: "Jun 1, 2026",  dueAt: "Jun 15, 2026",
    items: [{ desc: "Pro Plan (monthly)", qty: 1, unitPrice: 129 }, { desc: "Extra seats (2)", qty: 2, unitPrice: 10 }],
  },
  {
    id: "INV-2026-005", customer: "Acme Corp",    customerEmail: "billing@acme.com",   avatar: "AC", color: "#2563eb",
    plan: "Pro", amount: 149.00, tax: 14.90, status: "draft",    issuedAt: "Jul 1, 2026",  dueAt: "Jul 15, 2026",
    items: [{ desc: "Pro Plan (monthly)", qty: 1, unitPrice: 129 }, { desc: "Extra seats (2)", qty: 2, unitPrice: 10 }],
  },
];

// ── Coupons ───────────────────────────────────────────────────────────────────
export type Coupon = {
  id: string;
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  usedCount: number;
  maxUses: number | null;
  expiresAt: string | null;
  active: boolean;
  appliesTo: "all" | "pro" | "enterprise";
};

export const COUPONS: Coupon[] = [
  { id: "cp1", code: "LAUNCH20",   description: "Launch promo — 20% off",           type: "percent", value: 20, usedCount: 142, maxUses: null,  expiresAt: "Aug 31, 2026",  active: true,  appliesTo: "all"        },
  { id: "cp2", code: "SAVE50",     description: "$50 off any Pro plan",              type: "fixed",   value: 50, usedCount: 38,  maxUses: 100,   expiresAt: "Jul 31, 2026",  active: true,  appliesTo: "pro"        },
  { id: "cp3", code: "ENT15",      description: "15% off Enterprise first month",    type: "percent", value: 15, usedCount: 9,   maxUses: 50,    expiresAt: null,             active: true,  appliesTo: "enterprise" },
  { id: "cp4", code: "BLACKFRI30", description: "Black Friday — 30% off",           type: "percent", value: 30, usedCount: 521, maxUses: 500,   expiresAt: "Dec 1, 2025",   active: false, appliesTo: "all"        },
  { id: "cp5", code: "FRIEND10",   description: "Referral reward — $10 off",        type: "fixed",   value: 10, usedCount: 77,  maxUses: null,  expiresAt: null,             active: true,  appliesTo: "all"        },
];

// ── Trial system ──────────────────────────────────────────────────────────────
export type TrialAccount = {
  id: string;
  customer: string;
  email: string;
  avatar: string;
  color: string;
  plan: string;
  startedAt: string;
  endsAt: string;
  daysLeft: number;
  status: "active" | "expiring" | "expired" | "converted";
  convertedTo?: string;
};

export const TRIAL_ACCOUNTS: TrialAccount[] = [
  { id: "t1", customer: "Nova Systems",    email: "hello@novasys.io",    avatar: "NS", color: "#2563eb", plan: "Pro",        startedAt: "Jun 17, 2026", endsAt: "Jul 17, 2026", daysLeft: 16, status: "active"    },
  { id: "t2", customer: "Peak Labs",       email: "team@peaklabs.co",    avatar: "PL", color: "#7c3aed", plan: "Pro",        startedAt: "Jun 24, 2026", endsAt: "Jul 10, 2026", daysLeft: 9,  status: "expiring"  },
  { id: "t3", customer: "Bright Studio",   email: "billing@bright.io",   avatar: "BS", color: "#10b981", plan: "Starter",    startedAt: "Jun 1, 2026",  endsAt: "Jul 1, 2026",  daysLeft: 0,  status: "expired"   },
  { id: "t4", customer: "Quantum Co",      email: "ops@quantum.ai",      avatar: "QC", color: "#f59e0b", plan: "Enterprise", startedAt: "May 15, 2026", endsAt: "Jun 15, 2026", daysLeft: 0,  status: "converted", convertedTo: "Enterprise" },
  { id: "t5", customer: "Skyline Tech",    email: "finance@skyline.net", avatar: "ST", color: "#ef4444", plan: "Pro",        startedAt: "Jun 28, 2026", endsAt: "Jul 28, 2026", daysLeft: 27, status: "active"    },
  { id: "t6", customer: "Orbit Media",     email: "hey@orbitmedia.com",  avatar: "OM", color: "#06b6d4", plan: "Starter",    startedAt: "Jun 30, 2026", endsAt: "Jul 5, 2026",  daysLeft: 4,  status: "expiring"  },
];
