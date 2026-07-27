"use client";
import { useState } from "react";
import { Gauge, TrendingUp, TrendingDown, Zap, Clock, AlertTriangle } from "lucide-react";
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress } from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { PERF_METRICS, ENDPOINT_PERF, CORE_WEB_VITALS } from "@/lib/monitoring-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

type Percentile = "p50" | "p95" | "p99";

const VITAL_SCORES: Record<string, { bg: string; label: string }> = {
    good: { bg: "#10b98118", label: "Good" },
    "needs-improvement": { bg: "#f59e0b18", label: "Needs Improvement" },
    poor: { bg: "#ef444418", label: "Poor" },
};

export default function PerformanceAnalyticsPage() {
    const [pct, setPct] = useState<Percentile>("p95");

    const latestIdx = PERF_METRICS.length - 1;
    const avgP50 = Math.round(PERF_METRICS.reduce((s, m) => s + m.p50, 0) / PERF_METRICS.length);
    const avgP95 = Math.round(PERF_METRICS.reduce((s, m) => s + m.p95, 0) / PERF_METRICS.length);
    const avgRps = Math.round(PERF_METRICS.reduce((s, m) => s + m.rps, 0) / PERF_METRICS.length);
    const avgErr = (PERF_METRICS.reduce((s, m) => s + m.errorRate, 0) / PERF_METRICS.length).toFixed(2);

    return (
        <PageStack>

            <StatsGrid stats={[
                { icon: Clock, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: `${avgP50}ms`, label: "Avg Response (p50)", change: "↓ 12ms", up: true, spark: spC, color: "#2563eb" },
                { icon: Clock, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: `${avgP95}ms`, label: "p95 Latency", change: "↓ 28ms", up: true, spark: spA, color: "#7c3aed" },
                { icon: TrendingUp, grad: "linear-gradient(135deg,#10b981,#059669)", value: `${avgRps}`, label: "Avg RPS", change: "+40", up: true, spark: spD, color: "#10b981" },
                { icon: AlertTriangle, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `${avgErr}%`, label: "Error Rate", change: "↓ 0.2%", up: true, spark: spB, color: "#f59e0b" },
            ]} />

            {/* Core Web Vitals */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2"><Zap size={15} /> Core Web Vitals</CardTitle>
                    <CardDescription>Real-user monitoring metrics for the Nexora AI frontend</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                        {CORE_WEB_VITALS.map(v => {
                            const vm = VITAL_SCORES[v.score];
                            return (
                                <div key={v.metric} className="rounded-xl border border-border p-4 text-center flex flex-col items-center gap-2"
                                    style={{ borderColor: v.color + "40", background: vm.bg }}>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{v.metric}</div>
                                    <div className="text-2xl font-extrabold" style={{ color: v.color }}>{v.value}</div>
                                    <div className="text-[10px] font-semibold" style={{ color: v.color }}>{vm.label}</div>
                                    <div className="text-[10px] text-muted-foreground">Target {v.threshold}</div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Latency chart */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="text-sm">Response Time Distribution</CardTitle>
                        <CardDescription>24-hour latency percentile trend</CardDescription>
                    </div>
                    <div className="flex gap-1.5">
                        {(["p50", "p95", "p99"] as Percentile[]).map(p => (
                            <button key={p} onClick={() => setPct(p)} className="px-2.5 py-1 rounded-lg border border-border text-xs font-bold transition-colors"
                                style={{ background: pct === p ? "hsl(var(--primary))" : "var(--cd)", color: pct === p ? "#fff" : "var(--fg)" }}>
                                {p.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERF_METRICS} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={3} />
                                <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={v => `${v}ms`} />
                                <Tooltip content={<ChartTip suffix="ms" />} />
                                <Area type="monotone" dataKey={pct} name={`${pct.toUpperCase()} (ms)`} stroke="#2563eb" strokeWidth={2.5} fill="url(#gLatency)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="gr g-2 g2">
                {/* RPS chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Requests / Second</CardTitle>
                        <CardDescription>Hourly throughput over 24h</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={PERF_METRICS} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gRps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={3} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} />
                                    <Tooltip content={<ChartTip />} />
                                    <Area type="monotone" dataKey="rps" name="RPS" stroke="#10b981" strokeWidth={2.5} fill="url(#gRps)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Error rate chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Error Rate %</CardTitle>
                        <CardDescription>Hourly API error rate over 24h</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={PERF_METRICS} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gErr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={3} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={v => `${v}%`} />
                                    <Tooltip content={<ChartTip suffix="%" />} />
                                    <Area type="monotone" dataKey="errorRate" name="Error Rate" stroke="#ef4444" strokeWidth={2.5} fill="url(#gErr)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Endpoint table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Slowest Endpoints</CardTitle>
                    <CardDescription>API endpoint performance sorted by p99 latency</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    {["Method", "Endpoint", "p50", "p95", "p99", "RPS", "Error Rate"].map(h => (
                                        <th key={h} className="pb-3 pt-4 pl-5 font-semibold text-xs">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...ENDPOINT_PERF].sort((a, b) => b.p99 - a.p99).map((ep, i) => {
                                    const methodColors: Record<string, string> = { GET: "#10b981", POST: "#2563eb", PUT: "#f59e0b", DELETE: "#ef4444", PATCH: "#7c3aed" };
                                    const mc = methodColors[ep.method] ?? "#888";
                                    const latencyColor = (ms: number) => ms > 1000 ? "#ef4444" : ms > 400 ? "#f59e0b" : "#10b981";
                                    const errColor = ep.errorRate > 2 ? "#ef4444" : ep.errorRate > 0.5 ? "#f59e0b" : "#10b981";
                                    return (
                                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="py-3 pl-5">
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: mc + "20", color: mc }}>{ep.method}</span>
                                            </td>
                                            <td className="py-3 pl-5 font-mono text-xs">{ep.path}</td>
                                            <td className="py-3 pl-5 text-xs font-semibold" style={{ color: latencyColor(ep.p50) }}>{ep.p50}ms</td>
                                            <td className="py-3 pl-5 text-xs font-semibold" style={{ color: latencyColor(ep.p95) }}>{ep.p95}ms</td>
                                            <td className="py-3 pl-5 text-xs font-semibold" style={{ color: latencyColor(ep.p99) }}>{ep.p99}ms</td>
                                            <td className="py-3 pl-5 text-xs">{ep.rps}/s</td>
                                            <td className="py-3 pl-5 text-xs font-bold" style={{ color: errColor }}>{ep.errorRate}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
