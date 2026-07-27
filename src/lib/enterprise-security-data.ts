// ── Enterprise Security mock data ─────────────────────────────────────────────

// ── SSO ───────────────────────────────────────────────────────────────────────
export type SsoStatus = "active" | "inactive" | "error" | "pending";
export type SsoProtocol = "SAML 2.0" | "OIDC" | "OAuth 2.0";

export interface SsoProvider {
  id: string; name: string; protocol: SsoProtocol;
  status: SsoStatus; tenants: number;
  idpEntityId: string; acsUrl: string;
  metadataUrl: string; certExpiry: string;
  lastLogin: string; totalLogins: number;
  color: string; icon: string;
}

export interface SsoSession {
  id: string; user: string; email: string; avatar: string;
  provider: string; ip: string; location: string;
  loginAt: string; expiresAt: string; active: boolean;
}

export const SSO_PROVIDERS: SsoProvider[] = [
  { id: "sso1", name: "Okta",         protocol: "SAML 2.0", status: "active",   tenants: 4, idpEntityId: "https://nexoraai.okta.com",     acsUrl: "https://nexoraai.com/auth/saml/okta/acs",     metadataUrl: "https://nexoraai.okta.com/metadata",     certExpiry: "Dec 14, 2026", lastLogin: "2 min ago", totalLogins: 8420, color: "#00297a", icon: "OK" },
  { id: "sso2", name: "Azure AD",     protocol: "OIDC",     status: "active",   tenants: 3, idpEntityId: "https://login.microsoftonline.com/tenant", acsUrl: "https://nexoraai.com/auth/oidc/azure/cb", metadataUrl: "https://login.microsoftonline.com/metadata", certExpiry: "Mar 3, 2027",  lastLogin: "14 min ago", totalLogins: 5280, color: "#0078d4", icon: "AZ" },
  { id: "sso3", name: "Google",       protocol: "OIDC",     status: "active",   tenants: 6, idpEntityId: "https://accounts.google.com",   acsUrl: "https://nexoraai.com/auth/oidc/google/cb",    metadataUrl: "https://accounts.google.com/metadata",   certExpiry: "Managed",     lastLogin: "5 min ago",  totalLogins: 14200, color: "#4285f4", icon: "G" },
  { id: "sso4", name: "OneLogin",     protocol: "SAML 2.0", status: "error",    tenants: 1, idpEntityId: "https://app.onelogin.com/saml",  acsUrl: "https://nexoraai.com/auth/saml/onelogin/acs", metadataUrl: "https://app.onelogin.com/metadata",      certExpiry: "Expired",     lastLogin: "2 days ago", totalLogins: 320,  color: "#ef4444", icon: "OL" },
  { id: "sso5", name: "Ping Identity",protocol: "SAML 2.0", status: "pending",  tenants: 0, idpEntityId: "https://auth.pingone.com",       acsUrl: "https://nexoraai.com/auth/saml/ping/acs",     metadataUrl: "",                                       certExpiry: "—",           lastLogin: "—",          totalLogins: 0,    color: "#c00", icon: "PI" },
];

export const SSO_SESSIONS: SsoSession[] = [
  { id: "ss1", user: "Raj Patel",     email: "raj@initech.com",    avatar: "RP", provider: "Okta",     ip: "10.0.1.44", location: "Mumbai, IN",    loginAt: "10:02 AM", expiresAt: "6:02 PM",  active: true  },
  { id: "ss2", user: "Alex Turner",   email: "alex@acme.com",      avatar: "AT", provider: "Azure AD", ip: "10.0.2.12", location: "New York, US",  loginAt: "9:48 AM",  expiresAt: "5:48 PM",  active: true  },
  { id: "ss3", user: "Yuki Tanaka",   email: "yuki@quantum.ai",    avatar: "YT", provider: "Google",   ip: "10.0.3.88", location: "Tokyo, JP",     loginAt: "8:30 AM",  expiresAt: "4:30 PM",  active: true  },
  { id: "ss4", user: "Chris Lin",     email: "chris@skyline.net",  avatar: "CL", provider: "Google",   ip: "10.2.1.22", location: "Singapore, SG", loginAt: "7:15 AM",  expiresAt: "1:15 PM",  active: false },
  { id: "ss5", user: "Maria Santos",  email: "maria@bright.io",    avatar: "MS", provider: "Azure AD", ip: "10.0.2.55", location: "São Paulo, BR", loginAt: "6:44 AM",  expiresAt: "2:44 PM",  active: false },
];

// ── LDAP ──────────────────────────────────────────────────────────────────────
export interface LdapConfig {
  id: string; name: string; host: string; port: number; ssl: boolean;
  bindDn: string; baseDn: string; userFilter: string; groupFilter: string;
  status: "connected" | "disconnected" | "error"; lastSync: string;
  syncedUsers: number; syncedGroups: number; tenant: string;
}

export const LDAP_CONFIGS: LdapConfig[] = [
  { id: "l1", name: "Acme Corp AD",    host: "ldap.acmecorp.com",    port: 636, ssl: true,  bindDn: "cn=nexora-svc,dc=acme,dc=com",    baseDn: "dc=acme,dc=com",    userFilter: "(objectClass=person)",   groupFilter: "(objectClass=group)",    status: "connected",    lastSync: "5 min ago",  syncedUsers: 248, syncedGroups: 18, tenant: "Acme Corp"   },
  { id: "l2", name: "Initech OpenLDAP",host: "ldap.initech.com",     port: 389, ssl: false, bindDn: "cn=admin,dc=initech,dc=com",      baseDn: "dc=initech,dc=com", userFilter: "(objectClass=inetOrgPerson)", groupFilter: "(objectClass=groupOfNames)", status: "connected", lastSync: "1 hr ago",   syncedUsers: 312, syncedGroups: 24, tenant: "Initech"     },
  { id: "l3", name: "Skyline AD",      host: "ldap.skylinetech.net", port: 636, ssl: true,  bindDn: "cn=svc-nexora,dc=skyline,dc=net", baseDn: "dc=skyline,dc=net", userFilter: "(objectClass=user)",      groupFilter: "(objectClass=group)",    status: "error",        lastSync: "2 days ago", syncedUsers: 0,   syncedGroups: 0,  tenant: "Skyline Tech" },
];

// ── RBAC ──────────────────────────────────────────────────────────────────────
export interface RbacRole {
  id: string; name: string; description: string; builtin: boolean;
  users: number; permissions: string[]; color: string;
}

export interface RbacPermission {
  id: string; resource: string; actions: string[];
}

export const RBAC_RESOURCES = ["users","tenants","billing","analytics","settings","api_keys","audit_logs","webhooks","workflows","reports","security","integrations"];

export const RBAC_ROLES: RbacRole[] = [
  { id: "r1", name: "Super Admin",    description: "Full access to all resources and settings",            builtin: true,  users: 2,  color: "#ef4444", permissions: RBAC_RESOURCES },
  { id: "r2", name: "Admin",          description: "Manage users, billing, and settings; no security",     builtin: true,  users: 8,  color: "#f59e0b", permissions: ["users","tenants","billing","settings","api_keys","webhooks","workflows","reports","integrations"] },
  { id: "r3", name: "Developer",      description: "API access, logs, webhooks, and integrations",         builtin: true,  users: 14, color: "#2563eb", permissions: ["api_keys","audit_logs","webhooks","workflows","integrations"] },
  { id: "r4", name: "Analyst",        description: "Read-only access to analytics and reports",            builtin: true,  users: 11, color: "#10b981", permissions: ["analytics","reports"] },
  { id: "r5", name: "Billing Manager",description: "Manage subscriptions, invoices, and plans",            builtin: true,  users: 3,  color: "#7c3aed", permissions: ["billing","reports"] },
  { id: "r6", name: "Support Agent",  description: "View users and tickets; no write access to billing",   builtin: true,  users: 6,  color: "#06b6d4", permissions: ["users","reports"] },
  { id: "r7", name: "Custom: DevOps", description: "Custom role for infrastructure team",                  builtin: false, users: 4,  color: "#f43f5e", permissions: ["api_keys","audit_logs","settings","workflows","integrations"] },
];

// ── Security Policies ─────────────────────────────────────────────────────────
export interface SecurityPolicy {
  id: string; category: string; name: string; description: string;
  enabled: boolean; severity: "critical" | "high" | "medium" | "low";
  value?: string | number; options?: string[];
}

export const SECURITY_POLICIES: SecurityPolicy[] = [
  // Password
  { id: "p1",  category: "Password",       name: "Minimum password length",       description: "Require passwords to be at least N characters long",      enabled: true,  severity: "high",     value: "12",     options: ["8","10","12","16","20"] },
  { id: "p2",  category: "Password",       name: "Require uppercase + symbol",    description: "Enforce uppercase letters and special characters",          enabled: true,  severity: "high"     },
  { id: "p3",  category: "Password",       name: "Password expiry",               description: "Force password reset after N days (0 = never)",             enabled: false, severity: "medium",   value: "90",     options: ["30","60","90","180","0"] },
  { id: "p4",  category: "Password",       name: "Prevent password reuse",        description: "Block last N passwords from being reused",                  enabled: true,  severity: "medium",   value: "5",      options: ["3","5","10"] },
  // MFA
  { id: "p5",  category: "MFA",            name: "Require MFA for all users",     description: "Block login if second factor is not configured",             enabled: true,  severity: "critical" },
  { id: "p6",  category: "MFA",            name: "Require MFA for admins only",   description: "Enforce MFA only on admin and super-admin roles",            enabled: false, severity: "high"     },
  { id: "p7",  category: "MFA",            name: "Trusted device period",         description: "Remember device for N days before re-prompting MFA",         enabled: true,  severity: "low",      value: "30",     options: ["7","14","30","60","never"] },
  // Session
  { id: "p8",  category: "Session",        name: "Session idle timeout",          description: "Log out inactive sessions after N minutes",                  enabled: true,  severity: "medium",   value: "60",     options: ["15","30","60","120","240"] },
  { id: "p9",  category: "Session",        name: "Max concurrent sessions",       description: "Limit simultaneous active sessions per user",                enabled: false, severity: "low",      value: "5",      options: ["1","2","3","5","unlimited"] },
  { id: "p10", category: "Session",        name: "Force re-auth on role change",  description: "Invalidate all sessions when user role is changed",          enabled: true,  severity: "high"     },
  // Access
  { id: "p11", category: "Access Control", name: "IP allowlist enforcement",      description: "Block logins from IPs not on the allowlist",                 enabled: false, severity: "critical" },
  { id: "p12", category: "Access Control", name: "Geo-blocking",                  description: "Restrict access to specific countries only",                 enabled: false, severity: "high"     },
  { id: "p13", category: "Access Control", name: "Brute force lockout",           description: "Lock account after N failed login attempts",                 enabled: true,  severity: "critical", value: "5",      options: ["3","5","10"] },
  { id: "p14", category: "Access Control", name: "Audit all admin actions",       description: "Log every action performed by admin+ roles",                 enabled: true,  severity: "high"     },
  // Data
  { id: "p15", category: "Data",           name: "Encrypt sensitive fields",      description: "AES-256 encryption for PII fields at the application layer", enabled: true,  severity: "critical" },
  { id: "p16", category: "Data",           name: "Data retention period",         description: "Automatically purge logs and data older than N days",         enabled: true,  severity: "medium",   value: "365",    options: ["90","180","365","730","never"] },
  { id: "p17", category: "Data",           name: "Restrict data export",          description: "Only Super Admins can export raw data",                       enabled: true,  severity: "high"     },
];
