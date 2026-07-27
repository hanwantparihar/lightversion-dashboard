"use client";
import { useState } from "react";
import { TrendingUp, Users, DollarSign, Activity, Building2, AlertTriangle } from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
    Card, CardHeader, CardContent, CardTitle, CardDescription, Progress,
} from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { TENANTS, TENANT_METRICS, TENANT_EVENTS } from "@/lib/tenant-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

const PLAN_DATA = [
    { plan: "Enterprise", value: 3, color: "#f59e0b" },
    { plan: "Pro", value: 4, color: "#7c3aed" },
    { plan: "Starter", value: 3, color: "#94a3b8" },
];

const REGION_DATA = [
    { region: "US East", tenants: 4, mrr: 1696 },
    { region: "Asia Pacific", tenants: 2, mrr: 1998 },
    { region: "EU West", tenants: 2, mrr: 299 },
    { region: "US West", tenants: 2, mrr: 299 },
];

const SEV_STYLES = {
    info: { color: "#2563eb", bg: "#2563eb18" },
    warning: { color: "#f59e0b", bg: "#f59e0b18" },
    critical: { color: "#ef4444", bg: "#ef444418" },
};

export default function TenantAnalyticsPage() {
    const [activeSegment, setActiveSegment] = useState<"all" | "enterprise" | "pro" | "starter">("all");

    const segmented = activeSegment === "all" ? TENANTS : TENANTS.filter(t => t.plan === activeSegment);

    const totalMrr = TENANTS.filter(t => t.status === "active").reduce((s, t) => s + t.mrr, 0);
    const totalSeats = TENANTS.reduce((s, t) => s + t.seats, 0);
    const churnRate = ((TENANTS.filter(t => t.status === "churned").length / TENANTS.length) * 100).toFixed(1);
    const avgMrr = Math.round(totalMrr / TENANTS.filter(t => t.mrr > 0).length);

    return (
        <PageStack>

            <StatsGrid stats={[
                { icon: DollarSign, grad: "linear-gradient(135deg,#10b981,#059669)", value: `$${totalMrr.toLocaleString()}`, label: "Total MRR", change: "13.4%", up: true, spark: spC, color: "#10b981" },
                { icon: Building2, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(TENANTS.filter(t => t.status === "active").length), label: "Active Tenants", change: "+2", up: true, spark: spA, color: "#2563eb" },
                { icon: Users, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: String(totalSeats), label: "Total Seats", change: "+14", up: true, spark: spD, color: "#7c3aed" },
                { icon: TrendingUp, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `${churnRate}%`, label: "Churn Rate", change: "-0.4%", up: true, spark: spB, color: "#f59e0b" },
            ]} />

            <div className="gr g-31 g2">
                {/* MRR trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>MRR Growth</CardTitle>
                        <CardDescription>Monthly recurring revenue across all tenants</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TENANT_METRICS} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gMrr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={ax} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={v => `$${v}`} />
                                    <Tooltip content={<ChartTip prefix="$" />} />
                                    <Area type="monotone" dataKey="mrr" name="MRR" stroke="#10b981" strokeWidth={2.5} fill="url(#gMrr)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan distribution donut */}
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Distribution</CardTitle>
                        <CardDescription>Tenants by subscription tier</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 180 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={PLAN_DATA} dataKey="value" nameKey="plan" innerRadius={52} outerRadius={82} paddingAngle={3} stroke="none">
                                        {PLAN_DATA.map((p, i) => <Cell key={i} fill={p.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {PLAN_DATA.map(p => (
                                <div key={p.plan} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                                        {p.plan}
                                    </span>
                                    <span className="font-semibold">{p.value} tenants</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="gr g-2 g2">
                {/* Tenant growth + churn */}
                <Card>
                    <CardHeader>
                        <CardTitle>Growth vs Churn</CardTitle>
                        <CardDescription>New tenants vs churned per month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={TENANT_METRICS} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={ax} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="newTenants" name="New" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="churn" name="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Region breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>By Region</CardTitle>
                        <CardDescription>Tenant distribution and revenue</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {REGION_DATA.map(r => {
                            const pct = Math.round((r.mrr / totalMrr) * 100);
                            return (
                                <div key={r.region}>
                                    <div className="flex justify-between text-sm font-semibold mb-1">
                                        <span>{r.region}</span>
                                        <span className="text-muted-foreground">{r.tenants} tenants · ${r.mrr.toLocaleString()}</span>
                                    </div>
                                    <Progress value={pct} />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Per-tenant usage leaderboard */}
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle>Tenant Usage Leaderboard</CardTitle>
                        <CardDescription>API usage and storage utilization</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {(["all", "enterprise", "pro", "starter"] as const).map(s => (
                            <button key={s} onClick={() => setActiveSegment(s)} className="px-3 py-1 rounded-lg border border-border text-xs font-semibold capitalize transition-colors"
                                style={{ background: activeSegment === s ? "hsl(var(--primary))" : "var(--cd)", color: activeSegment === s ? "#fff" : "var(--fg)" }}>{s}</button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    {["Tenant", "Plan", "API Usage", "API %", "Storage", "Seats", "MRR"].map(h => (
                                        <th key={h} className="pb-3 pt-4 pl-5 font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {segmented.filter(t => t.status !== "churned").sort((a, b) => b.apiCallsThisMonth - a.apiCallsThisMonth).map(t => {
                                    const apiPct = Math.round((t.apiCallsThisMonth / t.apiLimit) * 100);
                                    const stPct = Math.round((t.storageUsedGb / t.storageMaxGb) * 100);
                                    const PLAN_COLORS: Record<string, string> = { starter: "#94a3b8", pro: "#7c3aed", enterprise: "#f59e0b" };
                                    return (
                                        <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="py-3 pl-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                                        style={{ background: t.color + "22", color: t.color }}>{t.avatar}</div>
                                                    <span className="font-semibold">{t.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pl-5">
                                                <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full"
                                                    style={{ background: PLAN_COLORS[t.plan] + "22", color: PLAN_COLORS[t.plan] }}>{t.plan}</span>
                                            </td>
                                            <td className="py-3 pl-5 text-xs">{t.apiCallsThisMonth.toLocaleString()}</td>
                                            <td className="py-3 pl-5">
                                                <div className="flex items-center gap-2 min-w-[80px]">
                                                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${apiPct}%`, background: apiPct >= 80 ? "#ef4444" : "#10b981" }} />
                                                    </div>
                                                    <span className="text-xs shrink-0">{apiPct}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pl-5 text-xs">{t.storageUsedGb} GB</td>
                                            <td className="py-3 pl-5 text-xs">{t.seats}</td>
                                            <td className="py-3 pl-5 font-extrabold text-xs" style={{ color: t.mrr ? "hsl(var(--primary))" : "var(--mt-fg)" }}>
                                                {t.mrr ? `$${t.mrr}` : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Platform events */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity size={17} /> Recent Platform Events</CardTitle>
                    <CardDescription>Critical alerts and activity across all tenants</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {TENANT_EVENTS.map((ev, i) => {
                        const s = SEV_STYLES[ev.severity];
                        return (
                            <div key={ev.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm">{ev.tenantName}</span>
                                        <span className="text-sm">{ev.event}</span>
                                        <span className="text-[11px] px-2 py-0.5 rounded-full font-bold capitalize"
                                            style={{ background: s.bg, color: s.color }}>{ev.severity}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{ev.detail}</div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">{ev.ts}</span>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </PageStack>
    );
}
