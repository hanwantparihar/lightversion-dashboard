// ── Advanced Analytics mock data ──────────────────────────────────────────────

// ── AI Token Tracking ─────────────────────────────────────────────────────────
export type TokenUsageDay = { d: string; input: number; output: number; total: number; cost: number };
export type ModelUsage = { model: string; tokens: number; cost: number; pct: number; color: string };

export const TOKEN_DAILY: TokenUsageDay[] = [
  { d: "Jun 25", input: 180_000, output: 62_000, total: 242_000, cost: 4.84 },
  { d: "Jun 26", input: 210_000, output: 74_000, total: 284_000, cost: 5.68 },
  { d: "Jun 27", input: 195_000, output: 68_000, total: 263_000, cost: 5.26 },
  { d: "Jun 28", input: 240_000, output: 88_000, total: 328_000, cost: 6.56 },
  { d: "Jun 29", input: 190_000, output: 60_000, total: 250_000, cost: 5.00 },
  { d: "Jun 30", input: 165_000, output: 52_000, total: 217_000, cost: 4.34 },
  { d: "Jul 1",  input: 260_000, output: 96_000, total: 356_000, cost: 7.12 },
];

export const MODEL_USAGE: ModelUsage[] = [
  { model: "gpt-4o",        tokens: 840_000, cost: 16.80, pct: 48, color: "#2563eb" },
  { model: "gpt-4o-mini",   tokens: 560_000, cost:  2.80, pct: 32, color: "#7c3aed" },
  { model: "claude-3-haiku",tokens: 280_000, cost:  0.84, pct: 16, color: "#10b981" },
  { model: "gemini-1.5",    tokens:  70_000, cost:  0.28, pct:  4, color: "#f59e0b" },
];

// ── Real-time Analytics ───────────────────────────────────────────────────────
export type RealTimePoint = { t: string; active: number; pageviews: number };
export type LivePage = { path: string; active: number; change: number };

export const REALTIME_SERIES: RealTimePoint[] = Array.from({ length: 20 }, (_, i) => ({
  t: `${i}s`,
  active: 140 + Math.round(Math.sin(i / 3) * 40) + i * 2,
  pageviews: 80 + Math.round(Math.cos(i / 2.5) * 30) + i,
}));

export const LIVE_PAGES: LivePage[] = [
  { path: "/dashboard",              active: 42, change:  3 },
  { path: "/system/billing/plans",   active: 28, change:  8 },
  { path: "/auth/login",             active: 21, change: -2 },
  { path: "/reports/revenue",        active: 17, change:  1 },
  { path: "/team/projects",          active: 14, change:  5 },
  { path: "/developer/playground",   active: 11, change: -1 },
];

// ── Geography ─────────────────────────────────────────────────────────────────
export type GeoCountry = {
  flag: string; country: string; region: string;
  sessions: number; pct: number; bounce: number; avgDuration: string; color: string;
};

export const GEO_DATA: GeoCountry[] = [
  { flag: "🇺🇸", country: "United States", region: "Americas",      sessions: 38_420, pct: 34, bounce: 36, avgDuration: "4m 22s", color: "#2563eb" },
  { flag: "🇬🇧", country: "United Kingdom",region: "Europe",        sessions: 18_210, pct: 16, bounce: 41, avgDuration: "3m 55s", color: "#7c3aed" },
  { flag: "🇩🇪", country: "Germany",        region: "Europe",        sessions: 12_640, pct: 11, bounce: 38, avgDuration: "4m 10s", color: "#10b981" },
  { flag: "🇮🇳", country: "India",          region: "Asia Pacific",  sessions:  9_830, pct:  9, bounce: 52, avgDuration: "2m 48s", color: "#f59e0b" },
  { flag: "🇨🇦", country: "Canada",         region: "Americas",      sessions:  8_120, pct:  7, bounce: 33, avgDuration: "4m 44s", color: "#06b6d4" },
  { flag: "🇫🇷", country: "France",         region: "Europe",        sessions:  6_540, pct:  6, bounce: 44, avgDuration: "3m 20s", color: "#f43f5e" },
  { flag: "🇦🇺", country: "Australia",      region: "Asia Pacific",  sessions:  5_280, pct:  5, bounce: 39, avgDuration: "3m 58s", color: "#ec4899" },
  { flag: "🇧🇷", country: "Brazil",         region: "Americas",      sessions:  4_610, pct:  4, bounce: 56, avgDuration: "2m 14s", color: "#8b5cf6" },
  { flag: "🇯🇵", country: "Japan",          region: "Asia Pacific",  sessions:  3_990, pct:  4, bounce: 47, avgDuration: "2m 38s", color: "#14b8a6" },
  { flag: "🇳🇱", country: "Netherlands",    region: "Europe",        sessions:  2_810, pct:  3, bounce: 35, avgDuration: "4m 02s", color: "#f97316" },
];

export const GEO_REGIONS = [
  { region: "Americas",     pct: 45, color: "#2563eb", sessions: 51_150 },
  { region: "Europe",       pct: 36, color: "#7c3aed", sessions: 40_200 },
  { region: "Asia Pacific", pct: 18, color: "#10b981", sessions: 19_100 },
  { region: "Other",        pct:  1, color: "#94a3b8", sessions:  1_200 },
];

// ── Conversion Tracking ───────────────────────────────────────────────────────
export type FunnelStep = { step: string; users: number; pct: number; drop: number; color: string };
export type ConversionSource = { source: string; visits: number; conversions: number; rate: number; revenue: number; color: string };
export type ConversionDay = { d: string; signups: number; trials: number; paid: number };

export const FUNNEL: FunnelStep[] = [
  { step: "Landing Page",     users: 24_800, pct: 100, drop:  0, color: "#2563eb" },
  { step: "Pricing Page",     users: 14_920, pct:  60, drop: 40, color: "#7c3aed" },
  { step: "Sign Up",          users:  7_440, pct:  30, drop: 30, color: "#10b981" },
  { step: "Trial Started",    users:  4_464, pct:  18, drop: 12, color: "#f59e0b" },
  { step: "Paid Conversion",  users:  1_984, pct:   8, drop: 10, color: "#06b6d4" },
];

export const CONVERSION_SOURCES: ConversionSource[] = [
  { source: "Organic Search", visits: 18_400, conversions: 920, rate: 5.0, revenue: 89_200, color: "#2563eb" },
  { source: "Direct",         visits: 11_200, conversions: 784, rate: 7.0, revenue: 68_400, color: "#10b981" },
  { source: "Paid Ads",       visits:  8_600, conversions: 602, rate: 7.0, revenue: 54_800, color: "#7c3aed" },
  { source: "Referral",       visits:  6_400, conversions: 320, rate: 5.0, revenue: 28_400, color: "#f59e0b" },
  { source: "Social",         visits:  5_200, conversions: 208, rate: 4.0, revenue: 18_200, color: "#f43f5e" },
  { source: "Email",          visits:  3_800, conversions: 342, rate: 9.0, revenue: 31_600, color: "#06b6d4" },
];

export const CONVERSION_DAILY: ConversionDay[] = [
  { d: "Jun 25", signups: 84,  trials: 62, paid: 18 },
  { d: "Jun 26", signups: 96,  trials: 74, paid: 24 },
  { d: "Jun 27", signups: 78,  trials: 58, paid: 16 },
  { d: "Jun 28", signups: 112, trials: 88, paid: 30 },
  { d: "Jun 29", signups: 88,  trials: 68, paid: 22 },
  { d: "Jun 30", signups: 70,  trials: 52, paid: 14 },
  { d: "Jul 1",  signups: 124, trials: 96, paid: 36 },
];
