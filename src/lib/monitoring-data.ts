// ── Monitoring mock data ──────────────────────────────────────────────────────

// ── Server Monitoring ─────────────────────────────────────────────────────────
export type ServerStatus = "healthy" | "warning" | "critical" | "offline";

export interface Server {
  id: string; name: string; type: "web" | "db" | "worker" | "cache";
  region: string; ip: string; status: ServerStatus;
  cpu: number; memory: number; disk: number;
  uptime: string; lastPing: string; os: string; version: string;
}

export interface ServerMetric { t: string; cpu: number; memory: number; rps: number; }

export const SERVERS: Server[] = [
  { id: "s1", name: "web-prod-01",    type: "web",    region: "US East",      ip: "10.0.1.10", status: "healthy",  cpu: 34, memory: 58, disk: 42, uptime: "99.98%", lastPing: "2s ago",   os: "Ubuntu 22.04", version: "nginx/1.24" },
  { id: "s2", name: "web-prod-02",    type: "web",    region: "US East",      ip: "10.0.1.11", status: "healthy",  cpu: 29, memory: 52, disk: 38, uptime: "99.97%", lastPing: "2s ago",   os: "Ubuntu 22.04", version: "nginx/1.24" },
  { id: "s3", name: "db-primary",     type: "db",     region: "US East",      ip: "10.0.2.10", status: "warning",  cpu: 78, memory: 84, disk: 71, uptime: "99.95%", lastPing: "2s ago",   os: "Debian 12",    version: "Postgres 16" },
  { id: "s4", name: "db-replica",     type: "db",     region: "EU West",      ip: "10.1.2.10", status: "healthy",  cpu: 22, memory: 61, disk: 69, uptime: "99.99%", lastPing: "3s ago",   os: "Debian 12",    version: "Postgres 16" },
  { id: "s5", name: "worker-01",      type: "worker", region: "US East",      ip: "10.0.3.10", status: "healthy",  cpu: 45, memory: 44, disk: 28, uptime: "99.92%", lastPing: "2s ago",   os: "Ubuntu 22.04", version: "Node 20.x" },
  { id: "s6", name: "cache-redis",    type: "cache",  region: "US East",      ip: "10.0.4.10", status: "healthy",  cpu: 12, memory: 38, disk: 15, uptime: "100%",   lastPing: "1s ago",   os: "Alpine 3.19",  version: "Redis 7.2" },
  { id: "s7", name: "web-eu-01",      type: "web",    region: "EU West",      ip: "10.1.1.10", status: "critical", cpu: 94, memory: 91, disk: 88, uptime: "97.40%", lastPing: "8s ago",   os: "Ubuntu 22.04", version: "nginx/1.24" },
  { id: "s8", name: "worker-ap-01",   type: "worker", region: "Asia Pacific", ip: "10.2.3.10", status: "offline",  cpu: 0,  memory: 0,  disk: 62, uptime: "0%",     lastPing: "4m ago",   os: "Ubuntu 22.04", version: "Node 20.x" },
];

export const SERVER_METRICS: ServerMetric[] = Array.from({ length: 20 }, (_, i) => ({
  t: `${i * 3}s`,
  cpu:    30 + Math.round(Math.sin(i / 3) * 20) + Math.round(Math.random() * 10),
  memory: 55 + Math.round(Math.cos(i / 4) * 15) + Math.round(Math.random() * 8),
  rps:    420 + Math.round(Math.sin(i / 2) * 80) + Math.round(Math.random() * 40),
}));

// ── Error Tracking ────────────────────────────────────────────────────────────
export type ErrorSeverity = "critical" | "error" | "warning" | "info";
export type ErrorStatus   = "open" | "resolved" | "ignored" | "regressed";

export interface TrackedError {
  id: string; title: string; message: string; type: string;
  severity: ErrorSeverity; status: ErrorStatus;
  occurrences: number; affectedUsers: number;
  firstSeen: string; lastSeen: string;
  service: string; stack: string;
  tags: string[];
}

export interface ErrorTrend { d: string; critical: number; error: number; warning: number; }

export const TRACKED_ERRORS: TrackedError[] = [
  { id: "e1",  title: "TypeError: Cannot read properties of undefined",  message: "Cannot read properties of undefined (reading 'map')",         type: "TypeError",     severity: "critical", status: "open",     occurrences: 284, affectedUsers: 42,  firstSeen: "Jul 1",  lastSeen: "10:02 AM", service: "web-prod-01", stack: "at UserList (components/users/UserList.tsx:48)\nat Dashboard (pages/dashboard.tsx:12)", tags: ["react","runtime"] },
  { id: "e2",  title: "UnhandledPromiseRejection: fetch failed",          message: "FetchError: request to https://api.nexoraai.com/v1 failed",   type: "NetworkError",  severity: "error",    status: "open",     occurrences: 121, affectedUsers: 28,  firstSeen: "Jun 29", lastSeen: "9:48 AM",  service: "web-prod-02", stack: "at Object.fetch (node:internal/process/fetch:90)\nat ApiClient.get (lib/api.ts:34)", tags: ["network","api"] },
  { id: "e3",  title: "Database connection pool exhausted",               message: "Error: max client count reached (100/100)",                    type: "DatabaseError", severity: "critical", status: "open",     occurrences: 38,  affectedUsers: 180, firstSeen: "Jul 1",  lastSeen: "8:15 AM",  service: "db-primary",  stack: "at Pool.acquire (lib/db/pool.ts:102)\nat query (lib/db/client.ts:55)", tags: ["database","pool"] },
  { id: "e4",  title: "JWT token verification failed",                    message: "JsonWebTokenError: invalid signature",                          type: "AuthError",     severity: "error",    status: "resolved", occurrences: 17,  affectedUsers: 17,  firstSeen: "Jun 28", lastSeen: "Jun 28",   service: "web-prod-01", stack: "at verify (lib/auth.ts:88)\nat middleware (middleware.ts:22)", tags: ["auth","security"] },
  { id: "e5",  title: "Redis ENOMEM: OOM command not allowed",            message: "ReplyError: ENOMEM: OOM command not allowed when used memory > maxmemory", type: "CacheError", severity: "warning", status: "open", occurrences: 9, affectedUsers: 0, firstSeen: "Jun 30", lastSeen: "7:40 AM", service: "cache-redis", stack: "at parseReply (lib/cache/redis.ts:66)", tags: ["cache","redis"] },
  { id: "e6",  title: "Stripe webhook signature verification failed",     message: "StripeSignatureVerificationError: No signatures found",        type: "WebhookError",  severity: "warning",  status: "ignored",  occurrences: 4,   affectedUsers: 0,   firstSeen: "Jun 25", lastSeen: "Jun 27",   service: "worker-01",   stack: "at Webhook.construct (lib/billing/stripe.ts:44)", tags: ["billing","webhook"] },
  { id: "e7",  title: "RangeError: Maximum call stack size exceeded",     message: "RangeError: Maximum call stack size exceeded",                  type: "RangeError",    severity: "error",    status: "open",     occurrences: 62,  affectedUsers: 31,  firstSeen: "Jun 30", lastSeen: "9:20 AM",  service: "web-prod-01", stack: "at processData (lib/reports/processor.ts:214)\nat processData (lib/reports/processor.ts:214)", tags: ["runtime","recursion"] },
  { id: "e8",  title: "S3 PutObject AccessDenied",                        message: "AccessDenied: Access Denied (Service: S3)",                    type: "PermissionError",severity: "error",    status: "resolved", occurrences: 11,  affectedUsers: 11,  firstSeen: "Jun 26", lastSeen: "Jun 27",   service: "worker-01",   stack: "at S3Client.send (lib/storage/s3.ts:78)", tags: ["storage","aws"] },
];

export const ERROR_TRENDS: ErrorTrend[] = [
  { d: "Jun 25", critical: 2,  error: 8,  warning: 12 },
  { d: "Jun 26", critical: 3,  error: 11, warning: 9  },
  { d: "Jun 27", critical: 1,  error: 7,  warning: 14 },
  { d: "Jun 28", critical: 4,  error: 13, warning: 11 },
  { d: "Jun 29", critical: 2,  error: 9,  warning: 8  },
  { d: "Jun 30", critical: 5,  error: 15, warning: 10 },
  { d: "Jul 1",  critical: 3,  error: 12, warning: 7  },
];

// ── Performance Analytics ─────────────────────────────────────────────────────
export interface PerfMetric { t: string; p50: number; p95: number; p99: number; rps: number; errorRate: number; }
export interface EndpointPerf { path: string; method: string; p50: number; p95: number; p99: number; rps: number; errorRate: number; }
export interface CoreWebVital { metric: string; value: string; score: "good" | "needs-improvement" | "poor"; threshold: string; color: string; }

export const PERF_METRICS: PerfMetric[] = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}:00`,
  p50:       80  + Math.round(Math.sin(i / 4) * 20) + Math.round(Math.random() * 15),
  p95:       280 + Math.round(Math.cos(i / 3) * 60) + Math.round(Math.random() * 40),
  p99:       620 + Math.round(Math.sin(i / 2) * 100)+ Math.round(Math.random() * 80),
  rps:       380 + Math.round(Math.sin(i / 5) * 120)+ Math.round(Math.random() * 50),
  errorRate: Math.max(0, 0.8 + Math.round(Math.sin(i / 3) * 0.6 * 10) / 10),
}));

export const ENDPOINT_PERF: EndpointPerf[] = [
  { path: "/api/v1/users",              method: "GET",    p50: 48,  p95: 142, p99: 310,  rps: 84,  errorRate: 0.1 },
  { path: "/api/v1/analytics/summary",  method: "GET",    p50: 284, p95: 820, p99: 1240, rps: 32,  errorRate: 0.4 },
  { path: "/api/v1/auth/login",         method: "POST",   p50: 95,  p95: 248, p99: 480,  rps: 22,  errorRate: 2.1 },
  { path: "/api/v1/billing/invoices",   method: "GET",    p50: 62,  p95: 184, p99: 340,  rps: 18,  errorRate: 0.0 },
  { path: "/api/v1/tenants",            method: "GET",    p50: 38,  p95: 110, p99: 220,  rps: 14,  errorRate: 0.0 },
  { path: "/api/v1/reports/revenue",    method: "GET",    p50: 520, p95: 1840,p99: 3200, rps: 8,   errorRate: 1.2 },
  { path: "/api/v1/users",              method: "POST",   p50: 112, p95: 340, p99: 620,  rps: 6,   errorRate: 0.8 },
  { path: "/api/v1/webhooks/inbound",   method: "POST",   p50: 24,  p95: 68,  p99: 120,  rps: 44,  errorRate: 0.2 },
];

export const CORE_WEB_VITALS: CoreWebVital[] = [
  { metric: "LCP",  value: "1.8s",  score: "good",              threshold: "< 2.5s",  color: "#10b981" },
  { metric: "FID",  value: "48ms",  score: "good",              threshold: "< 100ms", color: "#10b981" },
  { metric: "CLS",  value: "0.08",  score: "needs-improvement", threshold: "< 0.1",   color: "#f59e0b" },
  { metric: "TTFB", value: "320ms", score: "needs-improvement", threshold: "< 200ms", color: "#f59e0b" },
  { metric: "FCP",  value: "0.9s",  score: "good",              threshold: "< 1.8s",  color: "#10b981" },
  { metric: "INP",  value: "180ms", score: "needs-improvement", threshold: "< 200ms", color: "#f59e0b" },
];
