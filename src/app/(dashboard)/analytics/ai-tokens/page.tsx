"use client";
import { Brain, DollarSign, Zap, TrendingUp } from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { TOKEN_DAILY, MODEL_USAGE } from "@/lib/advanced-analytics-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

const totalTokens = TOKEN_DAILY.reduce((s, d) => s + d.total, 0);
const totalCost = TOKEN_DAILY.reduce((s, d) => s + d.cost, 0);

export default function AiTokensPage() {
    return (
        <PageStack>
            <StatsGrid
                stats={[
                    { icon: Brain, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: `${(totalTokens / 1_000_000).toFixed(2)}M`, label: "Total Tokens", change: "14.2%", up: true, spark: spC, color: "#2563eb" },
                    { icon: DollarSign, grad: "linear-gradient(135deg,#10b981,#059669)", value: `$${totalCost.toFixed(2)}`, label: "Total Cost", change: "11.8%", up: true, spark: spA, color: "#10b981" },
                    { icon: Zap, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: `${(TOKEN_DAILY[TOKEN_DAILY.length - 1].total / 1000).toFixed(0)}K`, label: "Today's Tokens", change: "8.6%", up: true, spark: spD, color: "#7c3aed" },
                    { icon: TrendingUp, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `$${(totalCost / TOKEN_DAILY.length).toFixed(2)}`, label: "Avg Daily Cost", change: "3.1%", up: false, spark: spB, color: "#f59e0b" },
                ]}
            />

            <div className="gr g-31 g2">
                {/* Daily token usage area chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Token Usage</CardTitle>
                        <CardDescription>Input vs output tokens per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TOKEN_DAILY} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                                            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                                    <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                                    <Tooltip content={<ChartTip />} />
                                    <Area type="monotone" dataKey="input" name="Input" stroke="#2563eb" strokeWidth={2.5} fill="url(#gIn)" />
                                    <Area type="monotone" dataKey="output" name="Output" stroke="#7c3aed" strokeWidth={2.5} fill="url(#gOut)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Model distribution donut */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage by Model</CardTitle>
                        <CardDescription>Token share per model</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 190 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={MODEL_USAGE} dataKey="tokens" nameKey="model" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                                        {MODEL_USAGE.map((m, i) => <Cell key={i} fill={m.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                            {MODEL_USAGE.map((m) => (
                                <div key={m.model} className="fb" style={{ fontSize: 13 }}>
                                    <span className="fc g2">
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                                        <span style={{ fontWeight: 600 }}>{m.model}</span>
                                    </span>
                                    <span className="fc g3" style={{ color: "var(--mt-fg)" }}>
                                        <span>{m.pct}%</span>
                                        <span style={{ fontWeight: 700, color: "var(--fg)" }}>${m.cost.toFixed(2)}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily cost bar chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Spend</CardTitle>
                    <CardDescription>Estimated API cost per day (USD)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TOKEN_DAILY} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                                <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `$${v}`} />
                                <Tooltip content={<ChartTip prefix="$" />} />
                                <Bar dataKey="cost" name="Cost" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
