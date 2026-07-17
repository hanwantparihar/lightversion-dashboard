"use client";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { FUNNEL, CONVERSION_SOURCES, CONVERSION_DAILY } from "@/lib/advanced-analytics-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

const totalConversions = CONVERSION_SOURCES.reduce((s, c) => s + c.conversions, 0);
const totalRevenue = CONVERSION_SOURCES.reduce((s, c) => s + c.revenue, 0);
const avgRate = (CONVERSION_SOURCES.reduce((s, c) => s + c.rate, 0) / CONVERSION_SOURCES.length).toFixed(1);

export default function ConversionTrackingPage() {
    return (
        <PageStack>
            <StatsGrid
                stats={[
                    { icon: Target, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(totalConversions.toLocaleString()), label: "Total Conversions", change: "9.4%", up: true, spark: spC, color: "#2563eb" },
                    { icon: TrendingUp, grad: "linear-gradient(135deg,#10b981,#059669)", value: `${avgRate}%`, label: "Avg Conv. Rate", change: "1.2%", up: true, spark: spA, color: "#10b981" },
                    { icon: DollarSign, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: `$${(totalRevenue / 1000).toFixed(0)}K`, label: "Attributed Revenue", change: "18.6%", up: true, spark: spD, color: "#7c3aed" },
                    { icon: Users, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `${FUNNEL[FUNNEL.length - 1].pct}%`, label: "Paid Conv. Rate", change: "0.6%", up: true, spark: spB, color: "#f59e0b" },
                ]}
            />

            <div className="gr g-31 g2">
                {/* Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                        <CardDescription>Drop-off at each stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {FUNNEL.map((step, i) => (
                                <div key={i}>
                                    <div className="fb" style={{ fontSize: 13, marginBottom: 5 }}>
                                        <span style={{ fontWeight: 600 }}>{step.step}</span>
                                        <span className="fc g3">
                                            <span style={{ fontWeight: 800, color: step.color }}>{step.users.toLocaleString()}</span>
                                            <span style={{ color: "var(--mt-fg)" }}>{step.pct}%</span>
                                            {step.drop > 0 && (
                                                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>−{step.drop}%</span>
                                            )}
                                        </span>
                                    </div>
                                    <div style={{ height: 8, background: "var(--mt)", borderRadius: 6, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${step.pct}%`, background: step.color, borderRadius: 6, transition: "width .4s ease" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Source bar chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conversions by Source</CardTitle>
                        <CardDescription>Which channels drive the most paid conversions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CONVERSION_SOURCES} layout="vertical" margin={{ top: 4, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" horizontal={false} />
                                    <XAxis type="number" tickLine={false} axisLine={false} tick={ax} />
                                    <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} tick={ax} width={100} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="conversions" name="Conversions" radius={[0, 6, 6, 0]}>
                                        {CONVERSION_SOURCES.map((c, i) => <Cell key={i} fill={c.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily signups / trials / paid line chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Conversion Trend</CardTitle>
                    <CardDescription>Signups → Trials → Paid over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={CONVERSION_DAILY} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                                <YAxis tickLine={false} axisLine={false} tick={ax} />
                                <Tooltip content={<ChartTip />} />
                                <Line type="monotone" dataKey="signups" name="Signups" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} />
                                <Line type="monotone" dataKey="trials" name="Trials" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed" }} />
                                <Line type="monotone" dataKey="paid" name="Paid" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Source table */}
            <Card>
                <CardHeader>
                    <CardTitle>Source Performance</CardTitle>
                    <CardDescription>Full breakdown with conversion rate and attributed revenue</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-3 pt-4 pl-5 font-semibold">Source</th>
                                    <th className="pb-3 pt-4 font-semibold">Visits</th>
                                    <th className="pb-3 pt-4 font-semibold">Conversions</th>
                                    <th className="pb-3 pt-4 font-semibold">Conv. Rate</th>
                                    <th className="pb-3 pt-4 font-semibold">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CONVERSION_SOURCES.map((c, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-3 pl-5">
                                            <span className="fc g2">
                                                <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                                                <span style={{ fontWeight: 600 }}>{c.source}</span>
                                            </span>
                                        </td>
                                        <td className="py-3 text-muted-foreground">{c.visits.toLocaleString()}</td>
                                        <td className="py-3 font-semibold">{c.conversions.toLocaleString()}</td>
                                        <td className="py-3">
                                            <span style={{ color: c.rate >= 7 ? "#10b981" : c.rate >= 5 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>
                                                {c.rate}%
                                            </span>
                                        </td>
                                        <td className="py-3 font-extrabold" style={{ color: "hsl(var(--primary))" }}>
                                            ${c.revenue.toLocaleString()}
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
