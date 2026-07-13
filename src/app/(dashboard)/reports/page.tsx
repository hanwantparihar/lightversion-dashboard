"use client";

import Link from "next/link";
import {
  BarChart3,
  Users,
  FileDown,
  ArrowRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
} from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { reportCatalog, exportableReports } from "@/lib/reports-data";
import { exportToCsv } from "@/lib/export";
import { revenueByMonth, userGrowthData } from "@/lib/reports-data";
import { spC, spA, spD, spB } from "@/lib/data";

const reportIcons: Record<string, typeof BarChart3> = {
  revenue: DollarSign,
  users: Users,
};

export default function ReportsPage() {
  function handleQuickExport(id: string) {
    if (id === "rev-monthly") {
      exportToCsv("revenue-monthly", revenueByMonth, [
        { key: "m", label: "Month" },
        { key: "revenue", label: "Revenue" },
        { key: "expenses", label: "Expenses" },
        { key: "mrr", label: "MRR" },
      ]);
    } else if (id === "user-growth") {
      exportToCsv("user-growth", userGrowthData, [
        { key: "m", label: "Month" },
        { key: "signups", label: "Signups" },
        { key: "active", label: "Active Users" },
        { key: "churned", label: "Churned" },
      ]);
    }
  }

  return (
    <PageStack>
      <StatsGrid
        stats={[
          {
            icon: DollarSign,
            grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            value: "$149K",
            label: "Total Revenue",
            change: "14.2%",
            up: true,
            spark: spC,
            color: "#2563eb",
          },
          {
            icon: TrendingUp,
            grad: "linear-gradient(135deg,#06b6d4,#0891b2)",
            value: "$42.8K",
            label: "MRR",
            change: "8.6%",
            up: true,
            spark: spA,
            color: "#06b6d4",
          },
          {
            icon: Users,
            grad: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            value: "20,080",
            label: "Total Users",
            change: "11.3%",
            up: true,
            spark: spD,
            color: "#7c3aed",
          },
          {
            icon: BarChart3,
            grad: "linear-gradient(135deg,#f59e0b,#d97706)",
            value: "4",
            label: "Reports",
            change: "2 new",
            up: true,
            spark: spB,
            color: "#f59e0b",
          },
        ]}
      />

      <div className="gr g-2 g2">
        {reportCatalog.map((report) => {
          const Icon = reportIcons[report.id] ?? BarChart3;
          return (
            <Card key={report.id}>
              <CardHeader>
                <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{report.updated}</span>
                <Button asChild size="sm" variant="outline">
                  <Link href={report.path}>
                    View report
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown size={18} />
            Export Reports
          </CardTitle>
          <CardDescription>
            Download report data as CSV for external analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Report</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Rows</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {exportableReports.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{r.name}</td>
                    <td className="py-3 text-muted-foreground">{r.type}</td>
                    <td className="py-3 text-muted-foreground">{r.rows}</td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickExport(r.id)}
                        disabled={
                          r.id !== "rev-monthly" && r.id !== "user-growth"
                        }
                      >
                        <FileDown size={14} />
                        Export CSV
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
