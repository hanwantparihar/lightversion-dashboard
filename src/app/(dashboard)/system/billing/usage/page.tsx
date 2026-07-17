"use client";
import { Zap, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { USAGE_METRICS, USAGE_CUSTOMERS } from "@/lib/advanced-billing-data";
import { spA, spB, spC, spD } from "@/lib/data";

export default function UsageBillingPage() {
    const totalRevenue = USAGE_CUSTOMERS.reduce((s, c) => s + c.totalThisCycle, 0);

    return (
        <PageStack>
            <StatsGrid
                stats={[
                    { icon: Zap, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: `$${totalRevenue.toFixed(2)}`, label: "Usage Revenue (cycle)", change: "8.4%", up: true, spark: spC, color: "#2563eb" },
                    { icon: TrendingUp, grad: "linear-gradient(135deg,#10b981,#059669)", value: `${USAGE_METRICS[0].used.toLocaleString()}`, label: "API Calls", change: "12.1%", up: true, spark: spA, color: "#10b981" },
                    { icon: Zap, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: `${USAGE_METRICS[1].used} GB`, label: "Storage Used", change: "4.3%", up: true, spark: spD, color: "#7c3aed" },
                    { icon: TrendingUp, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `${USAGE_CUSTOMERS.length}`, label: "Metered Customers", change: "2", up: true, spark: spB, color: "#f59e0b" },
                ]}
            />

            {/* Metric usage bars */}
            <Card>
                <CardHeader>
                    <CardTitle>Metered Resources</CardTitle>
                    <CardDescription>Current cycle usage across all tracked metrics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {USAGE_METRICS.map((m) => {
                            const pct = Math.min((m.used / m.limit) * 100, 100);
                            const overageUnits = Math.max(m.used - m.limit, 0);
                            const cost = (Math.min(m.used, m.limit) * m.costPerUnit).toFixed(2);
                            return (
                                <div key={m.id}>
                                    <div className="fb" style={{ marginBottom: 6 }}>
                                        <div>
                                            <span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span>
                                            <span style={{ fontSize: 12, color: "var(--mt-fg)", marginLeft: 8 }}>
                                                {m.used.toLocaleString()} / {m.limit.toLocaleString()} {m.unit}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>
                                            ${cost}
                                            {overageUnits > 0 && (
                                                <span style={{ marginLeft: 6, fontSize: 11, color: "#ef4444" }}>
                                                    +{overageUnits.toLocaleString()} overage
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ height: 8, background: "var(--mt)", borderRadius: 6, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%", width: `${pct}%`, borderRadius: 6,
                                            background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : m.color,
                                            transition: "width .4s ease",
                                        }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--mt-fg)", marginTop: 4 }}>
                                        {pct.toFixed(1)}% used · ${m.costPerUnit.toFixed(4)} per {m.unit}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Per-customer breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Usage</CardTitle>
                    <CardDescription>Estimated charges per account this billing cycle</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="pb-3 pt-4 pl-5 font-semibold">Customer</th>
                                <th className="pb-3 pt-4 font-semibold">Plan</th>
                                {USAGE_METRICS.slice(0, 2).map((m) => (
                                    <th key={m.id} className="pb-3 pt-4 font-semibold">{m.name}</th>
                                ))}
                                <th className="pb-3 pt-4 font-semibold">Total (est.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {USAGE_CUSTOMERS.map((c) => (
                                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="py-3 pl-5">
                                        <div className="fc g2">
                                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: c.color + "22", color: c.color, fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {c.avatar}
                                            </div>
                                            <span className="font-semibold">{c.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-muted-foreground">{c.plan}</td>
                                    {USAGE_METRICS.slice(0, 2).map((m) => {
                                        const entry = c.metrics.find((x) => x.metricId === m.id);
                                        return (
                                            <td key={m.id} className="py-3">
                                                {entry ? `${entry.used.toLocaleString()} ${m.unit}` : "—"}
                                            </td>
                                        );
                                    })}
                                    <td className="py-3 font-extrabold" style={{ color: "hsl(var(--primary))" }}>
                                        ${c.totalThisCycle.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </PageStack>
    );
}
