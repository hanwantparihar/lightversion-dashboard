import { months } from "@/lib/data";

export const revenueByMonth = months.map((m, i) => ({
  m,
  revenue: 42000 + i * 8500 + Math.round(Math.sin(i) * 3000),
  expenses: 18000 + i * 3200 + Math.round(Math.cos(i) * 1500),
  mrr: 28000 + i * 4200,
}));

export const revenueByPlan = [
  { plan: "Starter", value: 18400, color: "#94a3b8" },
  { plan: "Pro", value: 42800, color: "#2563eb" },
  { plan: "Business", value: 35600, color: "#7c3aed" },
  { plan: "Enterprise", value: 52200, color: "#10b981" },
];

export const userGrowthData = months.map((m, i) => ({
  m,
  signups: 120 + i * 28 + Math.round(Math.sin(i) * 15),
  active: 890 + i * 145,
  churned: 12 + Math.round(Math.cos(i) * 8),
}));

export const userSegments = [
  { segment: "Free", users: 8420, pct: 42 },
  { segment: "Trial", users: 2180, pct: 11 },
  { segment: "Paid", users: 6840, pct: 34 },
  { segment: "Enterprise", users: 2640, pct: 13 },
];

export const reportCatalog = [
  {
    id: "revenue",
    title: "Revenue Analytics",
    description: "MRR, ARR, revenue by plan, and expense breakdown",
    path: "/reports/revenue",
    updated: "Updated today",
  },
  {
    id: "users",
    title: "User Analytics",
    description: "Signups, active users, churn, and segment breakdown",
    path: "/reports/users",
    updated: "Updated today",
  },
];

export const exportableReports = [
  { id: "rev-monthly", name: "Monthly Revenue", type: "Revenue", rows: revenueByMonth.length },
  { id: "user-growth", name: "User Growth", type: "Users", rows: userGrowthData.length },
  { id: "plan-split", name: "Revenue by Plan", type: "Revenue", rows: revenueByPlan.length },
  { id: "segments", name: "User Segments", type: "Users", rows: userSegments.length },
];
