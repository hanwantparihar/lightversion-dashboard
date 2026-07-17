"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
} from "@/components/ui";
import { ChartTip, PageStack, StatsGrid } from "@/components";
import {
  revenueByMonth,
  revenueByPlan,
} from "@/lib/reports-data";
import { exportToCsv } from "@/lib/export";
import { spC, spA, spB, spD, ax } from "@/lib/data";

export default function RevenueReportPage() {
  const totalRevenue = revenueByMonth.reduce((s, r) => s + r.revenue, 0);
  const totalMrr = revenueByMonth[revenueByMonth.length - 1]?.mrr ?? 0;

  function handleExport() {
    exportToCsv("revenue-analytics", revenueByMonth, [
      { key: "m", label: "Month" },
      { key: "revenue", label: "Revenue ($)" },
      { key: "expenses", label: "Expenses ($)" },
      { key: "mrr", label: "MRR ($)" },
    ]);
  }

  return (
    <PageStack>
      {/* <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Revenue Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track MRR, revenue trends, and plan breakdown
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown size={14} />
          Export CSV
        </Button>
      </div> */}

      <StatsGrid
        stats={[
          {
            icon: DollarSign,
            grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            value: `$${(totalRevenue / 1000).toFixed(0)}K`,
            label: "Annual Revenue",
            change: "14.2%",
            up: true,
            spark: spC,
            color: "#2563eb",
          },
          {
            icon: TrendingUp,
            grad: "linear-gradient(135deg,#06b6d4,#0891b2)",
            value: `$${(totalMrr / 1000).toFixed(1)}K`,
            label: "Current MRR",
            change: "8.6%",
            up: true,
            spark: spA,
            color: "#06b6d4",
          },
          {
            icon: TrendingDown,
            grad: "linear-gradient(135deg,#f43f5e,#e11d48)",
            value: "$186K",
            label: "Total Expenses",
            change: "3.2%",
            up: false,
            spark: spB,
            color: "#f43f5e",
          },
          {
            icon: DollarSign,
            grad: "linear-gradient(135deg,#10b981,#059669)",
            value: "68%",
            label: "Gross Margin",
            change: "2.1%",
            up: true,
            spark: spD,
            color: "#10b981",
          },
        ]}
      />

      <div className="gr g-31 g2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={ax}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<ChartTip prefix="$" />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#gRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fill="url(#gExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Current month distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByPlan}
                    dataKey="value"
                    nameKey="plan"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {revenueByPlan.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTip prefix="$" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {revenueByPlan.map((p) => (
                <div key={p.plan} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.plan}
                  </span>
                  <span className="font-semibold">
                    ${p.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MRR Growth</CardTitle>
          <CardDescription>Monthly recurring revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={ax}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTip prefix="$" />} />
                <Bar dataKey="mrr" name="MRR" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
