"use client";

import { Users, UserPlus, UserMinus, FileDown } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Progress,
  Button,
} from "@/components/ui";
import { ChartTip, PageStack, StatsGrid } from "@/components";
import { userGrowthData, userSegments } from "@/lib/reports-data";
import { exportToCsv } from "@/lib/export";
import { spA, spC, spB, spD, ax } from "@/lib/data";

export default function UsersReportPage() {
  const latest = userGrowthData[userGrowthData.length - 1];

  function handleExport() {
    exportToCsv("user-analytics", userGrowthData, [
      { key: "m", label: "Month" },
      { key: "signups", label: "Signups" },
      { key: "active", label: "Active Users" },
      { key: "churned", label: "Churned" },
    ]);
  }

  return (
    <PageStack>
      {/* <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">User Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Signups, retention, churn, and segment breakdown
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
            icon: Users,
            grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            value: latest?.active.toLocaleString() ?? "—",
            label: "Active Users",
            change: "11.3%",
            up: true,
            spark: spC,
            color: "#2563eb",
          },
          {
            icon: UserPlus,
            grad: "linear-gradient(135deg,#10b981,#059669)",
            value: String(latest?.signups ?? 0),
            label: "Monthly Signups",
            change: "18.4%",
            up: true,
            spark: spA,
            color: "#10b981",
          },
          {
            icon: UserMinus,
            grad: "linear-gradient(135deg,#f43f5e,#e11d48)",
            value: String(latest?.churned ?? 0),
            label: "Churned Users",
            change: "2.1%",
            up: false,
            spark: spB,
            color: "#f43f5e",
          },
          {
            icon: Users,
            grad: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            value: "34%",
            label: "Paid Conversion",
            change: "4.6%",
            up: true,
            spark: spD,
            color: "#7c3aed",
          },
        ]}
      />

      <div className="gr g-31 g2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Signups and active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} />
                  <Tooltip content={<ChartTip />} />
                  <Line
                    type="monotone"
                    dataKey="active"
                    name="Active Users"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    name="Signups"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Segments</CardTitle>
            <CardDescription>Breakdown by subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userSegments.map((seg) => (
              <div key={seg.segment}>
                <div className="mb-1.5 flex justify-between text-sm font-semibold">
                  <span>{seg.segment}</span>
                  <span>
                    {seg.users.toLocaleString()} ({seg.pct}%)
                  </span>
                </div>
                <Progress value={seg.pct} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Churn</CardTitle>
          <CardDescription>Users who cancelled each month</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                <YAxis tickLine={false} axisLine={false} tick={ax} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="churned" name="Churned" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
