// ── Multi-Tenant mock data ─────────────────────────────────────────────────────

export type TenantStatus = "active" | "suspended" | "trial" | "churned";
export type TenantPlan   = "starter" | "pro" | "enterprise";

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  avatar: string;
  color: string;
  plan: TenantPlan;
  status: TenantStatus;
  region: string;
  seats: number;
  maxSeats: number;
  storageUsedGb: number;
  storageMaxGb: number;
  apiCallsThisMonth: number;
  apiLimit: number;
  createdAt: string;
  owner: string;
  ownerEmail: string;
  mrr: number;
}

export interface TenantEvent {
  id: string;
  tenantId: string;
  tenantName: string;
  event: string;
  detail: string;
  severity: "info" | "warning" | "critical";
  ts: string;
}

export interface TenantInvoice {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  period: string;
  plan: TenantPlan;
  issuedAt: string;
}

export interface TenantMetric {
  month: string;
  tenants: number;
  mrr: number;
  churn: number;
  newTenants: number;
}

// ─── Tenants ──────────────────────────────────────────────────────────────────
export const TENANTS: Tenant[] = [
  { id: "t1",  name: "Acme Corp",       domain: "acme.nexora.ai",       avatar: "AC", color: "#2563eb", plan: "enterprise", status: "active",    region: "US East",      seats: 42, maxSeats: 100, storageUsedGb: 28,  storageMaxGb: 500,  apiCallsThisMonth: 182_400, apiLimit: 500_000, createdAt: "Jan 12, 2025", owner: "Alex Turner",   ownerEmail: "alex@acme.com",    mrr: 799  },
  { id: "t2",  name: "Globex Inc",      domain: "globex.nexora.ai",     avatar: "GI", color: "#7c3aed", plan: "pro",        status: "active",    region: "EU West",      seats: 11, maxSeats: 25,  storageUsedGb: 8,   storageMaxGb: 100,  apiCallsThisMonth: 44_200,  apiLimit: 100_000, createdAt: "Mar 4, 2025",  owner: "Sara Kim",      ownerEmail: "sara@globex.io",   mrr: 299  },
  { id: "t3",  name: "Initech",         domain: "initech.nexora.ai",    avatar: "IN", color: "#10b981", plan: "enterprise", status: "active",    region: "Asia Pacific", seats: 78, maxSeats: 200, storageUsedGb: 102, storageMaxGb: 500,  apiCallsThisMonth: 310_000, apiLimit: 500_000, createdAt: "Nov 19, 2024", owner: "Raj Patel",     ownerEmail: "raj@initech.com",  mrr: 1199 },
  { id: "t4",  name: "Umbrella LLC",    domain: "umbrella.nexora.ai",   avatar: "UL", color: "#f59e0b", plan: "pro",        status: "suspended", region: "US West",      seats: 7,  maxSeats: 25,  storageUsedGb: 5,   storageMaxGb: 100,  apiCallsThisMonth: 0,       apiLimit: 100_000, createdAt: "Feb 28, 2025", owner: "Dana White",    ownerEmail: "dana@umbrella.io", mrr: 0    },
  { id: "t5",  name: "Nova Systems",    domain: "nova.nexora.ai",       avatar: "NS", color: "#06b6d4", plan: "starter",    status: "trial",     region: "EU Central",   seats: 3,  maxSeats: 5,   storageUsedGb: 1,   storageMaxGb: 10,   apiCallsThisMonth: 4_200,   apiLimit: 10_000,  createdAt: "Jun 28, 2026", owner: "Lena Müller",   ownerEmail: "lena@nova.io",     mrr: 0    },
  { id: "t6",  name: "Peak Labs",       domain: "peak.nexora.ai",       avatar: "PL", color: "#f43f5e", plan: "starter",    status: "trial",     region: "US East",      seats: 2,  maxSeats: 5,   storageUsedGb: 0.4, storageMaxGb: 10,   apiCallsThisMonth: 1_100,   apiLimit: 10_000,  createdAt: "Jul 1, 2026",  owner: "Tom Reed",      ownerEmail: "tom@peak.co",      mrr: 0    },
  { id: "t7",  name: "Quantum Co",      domain: "quantum.nexora.ai",    avatar: "QC", color: "#8b5cf6", plan: "pro",        status: "active",    region: "US East",      seats: 18, maxSeats: 25,  storageUsedGb: 14,  storageMaxGb: 100,  apiCallsThisMonth: 68_000,  apiLimit: 100_000, createdAt: "Apr 10, 2025", owner: "Yuki Tanaka",   ownerEmail: "yuki@quantum.ai",  mrr: 299  },
  { id: "t8",  name: "Skyline Tech",    domain: "skyline.nexora.ai",    avatar: "ST", color: "#ef4444", plan: "enterprise", status: "active",    region: "Asia Pacific", seats: 55, maxSeats: 100, storageUsedGb: 67,  storageMaxGb: 500,  apiCallsThisMonth: 224_000, apiLimit: 500_000, createdAt: "Sep 5, 2024",  owner: "Chris Lin",     ownerEmail: "chris@skyline.net", mrr: 799 },
  { id: "t9",  name: "Orbit Media",     domain: "orbit.nexora.ai",      avatar: "OM", color: "#14b8a6", plan: "starter",    status: "churned",   region: "EU West",      seats: 0,  maxSeats: 5,   storageUsedGb: 0,   storageMaxGb: 10,   apiCallsThisMonth: 0,       apiLimit: 10_000,  createdAt: "Jan 3, 2025",  owner: "Fiona Clark",   ownerEmail: "fiona@orbit.com",  mrr: 0    },
  { id: "t10", name: "Bright Studio",   domain: "bright.nexora.ai",     avatar: "BS", color: "#f97316", plan: "pro",        status: "active",    region: "US West",      seats: 9,  maxSeats: 25,  storageUsedGb: 6,   storageMaxGb: 100,  apiCallsThisMonth: 29_000,  apiLimit: 100_000, createdAt: "May 22, 2025", owner: "Maria Santos",  ownerEmail: "maria@bright.io",  mrr: 299  },
];

// ─── Events ───────────────────────────────────────────────────────────────────
export const TENANT_EVENTS: TenantEvent[] = [
  { id: "e1",  tenantId: "t3",  tenantName: "Initech",       event: "API rate limit warning",  detail: "62% of monthly limit used",         severity: "warning",  ts: "2 min ago"  },
  { id: "e2",  tenantId: "t1",  tenantName: "Acme Corp",     event: "New user invited",        detail: "engineering@acme.com",              severity: "info",     ts: "14 min ago" },
  { id: "e3",  tenantId: "t4",  tenantName: "Umbrella LLC",  event: "Tenant suspended",        detail: "Payment failed × 3",                severity: "critical", ts: "1 hr ago"   },
  { id: "e4",  tenantId: "t5",  tenantName: "Nova Systems",  event: "Trial started",           detail: "14-day Pro trial activated",        severity: "info",     ts: "3 hr ago"   },
  { id: "e5",  tenantId: "t8",  tenantName: "Skyline Tech",  event: "Storage threshold 80%",   detail: "402 GB / 500 GB used",              severity: "warning",  ts: "5 hr ago"   },
  { id: "e6",  tenantId: "t9",  tenantName: "Orbit Media",   event: "Tenant churned",          detail: "Subscription cancelled",            severity: "critical", ts: "1 day ago"  },
  { id: "e7",  tenantId: "t2",  tenantName: "Globex Inc",    event: "Plan upgraded",           detail: "Starter → Pro",                     severity: "info",     ts: "2 days ago" },
  { id: "e8",  tenantId: "t7",  tenantName: "Quantum Co",    event: "SSO configured",          detail: "Okta SAML integration enabled",     severity: "info",     ts: "3 days ago" },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const TENANT_INVOICES: TenantInvoice[] = [
  { id: "inv1",  tenantId: "t1",  tenantName: "Acme Corp",     amount: 799,  status: "paid",    period: "Jun 2026", plan: "enterprise", issuedAt: "Jun 1, 2026"  },
  { id: "inv2",  tenantId: "t2",  tenantName: "Globex Inc",    amount: 299,  status: "paid",    period: "Jun 2026", plan: "pro",        issuedAt: "Jun 1, 2026"  },
  { id: "inv3",  tenantId: "t3",  tenantName: "Initech",       amount: 1199, status: "pending", period: "Jul 2026", plan: "enterprise", issuedAt: "Jul 1, 2026"  },
  { id: "inv4",  tenantId: "t4",  tenantName: "Umbrella LLC",  amount: 299,  status: "overdue", period: "Jun 2026", plan: "pro",        issuedAt: "Jun 1, 2026"  },
  { id: "inv5",  tenantId: "t7",  tenantName: "Quantum Co",    amount: 299,  status: "paid",    period: "Jun 2026", plan: "pro",        issuedAt: "Jun 1, 2026"  },
  { id: "inv6",  tenantId: "t8",  tenantName: "Skyline Tech",  amount: 799,  status: "paid",    period: "Jun 2026", plan: "enterprise", issuedAt: "Jun 1, 2026"  },
  { id: "inv7",  tenantId: "t10", tenantName: "Bright Studio", amount: 299,  status: "pending", period: "Jul 2026", plan: "pro",        issuedAt: "Jul 1, 2026"  },
  { id: "inv8",  tenantId: "t1",  tenantName: "Acme Corp",     amount: 799,  status: "paid",    period: "May 2026", plan: "enterprise", issuedAt: "May 1, 2026"  },
];

// ─── MRR trend ────────────────────────────────────────────────────────────────
export const TENANT_METRICS: TenantMetric[] = [
  { month: "Jan", tenants: 4,  mrr: 1796,  churn: 0, newTenants: 4  },
  { month: "Feb", tenants: 5,  mrr: 2095,  churn: 0, newTenants: 1  },
  { month: "Mar", tenants: 6,  mrr: 2394,  churn: 0, newTenants: 1  },
  { month: "Apr", tenants: 7,  mrr: 2693,  churn: 0, newTenants: 1  },
  { month: "May", tenants: 8,  mrr: 2992,  churn: 0, newTenants: 1  },
  { month: "Jun", tenants: 9,  mrr: 2992,  churn: 1, newTenants: 1  },
  { month: "Jul", tenants: 10, mrr: 3394,  churn: 0, newTenants: 2  },
];

// ─── White-label data ─────────────────────────────────────────────────────────
export interface WhiteLabelConfig {
  tenantId: string;
  appName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  customDomain: string;
  domainStatus: "verified" | "pending" | "failed" | "none";
  sslStatus: "active" | "provisioning" | "failed" | "none";
  removePoweredBy: boolean;
  removeFooterLogo: boolean;
  customCss: boolean;
  customEmailDomain: string;
  emailDomainStatus: "verified" | "pending" | "none";
  loginPageBg: string;
  supportEmail: string;
  twitterUrl: string;
  linkedinUrl: string;
}

export const WHITE_LABEL_CONFIGS: WhiteLabelConfig[] = [
  {
    tenantId: "t1",
    appName: "AcmeOps", tagline: "Operations hub for Acme Corp",
    primaryColor: "#2563eb", accentColor: "#1d4ed8",
    logoUrl: "", faviconUrl: "",
    customDomain: "ops.acmecorp.com", domainStatus: "verified", sslStatus: "active",
    removePoweredBy: true, removeFooterLogo: true, customCss: true,
    customEmailDomain: "mail.acmecorp.com", emailDomainStatus: "verified",
    loginPageBg: "#f0f4ff", supportEmail: "support@acmecorp.com",
    twitterUrl: "https://twitter.com/acmecorp", linkedinUrl: "https://linkedin.com/company/acmecorp",
  },
  {
    tenantId: "t3",
    appName: "Initech Hub", tagline: "Powered by Initech",
    primaryColor: "#10b981", accentColor: "#059669",
    logoUrl: "", faviconUrl: "",
    customDomain: "hub.initech.com", domainStatus: "verified", sslStatus: "active",
    removePoweredBy: true, removeFooterLogo: false, customCss: false,
    customEmailDomain: "mail.initech.com", emailDomainStatus: "pending",
    loginPageBg: "#f0fdf4", supportEmail: "help@initech.com",
    twitterUrl: "", linkedinUrl: "https://linkedin.com/company/initech",
  },
  {
    tenantId: "t7",
    appName: "Quantum Suite", tagline: "Next-gen ops by Quantum Co",
    primaryColor: "#8b5cf6", accentColor: "#7c3aed",
    logoUrl: "", faviconUrl: "",
    customDomain: "suite.quantumco.ai", domainStatus: "pending", sslStatus: "provisioning",
    removePoweredBy: false, removeFooterLogo: false, customCss: false,
    customEmailDomain: "", emailDomainStatus: "none",
    loginPageBg: "#faf5ff", supportEmail: "support@quantumco.ai",
    twitterUrl: "", linkedinUrl: "",
  },
  {
    tenantId: "t8",
    appName: "Skyline Control", tagline: "Enterprise tools for Skyline",
    primaryColor: "#ef4444", accentColor: "#dc2626",
    logoUrl: "", faviconUrl: "",
    customDomain: "control.skylinetech.net", domainStatus: "failed", sslStatus: "failed",
    removePoweredBy: true, removeFooterLogo: true, customCss: true,
    customEmailDomain: "mail.skylinetech.net", emailDomainStatus: "verified",
    loginPageBg: "#fff5f5", supportEmail: "it@skylinetech.net",
    twitterUrl: "https://twitter.com/skylinetech", linkedinUrl: "",
  },
];

export const DEFAULT_WHITE_LABEL: WhiteLabelConfig = {
  tenantId: "",
  appName: "", tagline: "",
  primaryColor: "#2563eb", accentColor: "#1d4ed8",
  logoUrl: "", faviconUrl: "",
  customDomain: "", domainStatus: "none", sslStatus: "none",
  removePoweredBy: false, removeFooterLogo: false, customCss: false,
  customEmailDomain: "", emailDomainStatus: "none",
  loginPageBg: "#f8fafc", supportEmail: "",
  twitterUrl: "", linkedinUrl: "",
};
