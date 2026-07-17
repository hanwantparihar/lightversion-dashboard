"use client";
import { useState } from "react";
import { Globe, MapPin, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress } from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { GEO_DATA, GEO_REGIONS } from "@/lib/advanced-analytics-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

export default function GeographyReportsPage() {
    const [region, setRegion] = useState("All");
    const regions = ["All", ...Array.from(new Set(GEO_DATA.map((g) => g.region)))];
    const filtered = region === "All" ? GEO_DATA : GEO_DATA.filter((g) => g.region === region);
    const totalSessions = GEO_DATA.reduce((s, g) => s + g.sessions, 0);

    return (
        <PageStack>
            <StatsGrid
                stats={[
                    { icon: Globe, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: `${(totalSessions / 1000).toFixed(1)}K`, label: "Total Sessions", change: "11.4%", up: true, spark: spC, color: "#2563eb" },
                    { icon: MapPin, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(GEO_DATA.length), label: "Countries", change: "+2 new", up: true, spark: spA, color: "#10b981" },
                    { icon: Globe, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: "4", label: "Regions", change: "global", up: true, spark: spD, color: "#7c3aed" },
                    { icon: TrendingUp, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: "41%", label: "Avg Bounce Rate", change: "2.1%", up: false, spark: spB, color: "#f59e0b" },
                ]}
            />

            <div className="gr g-31 g2">
                {/* Regional bar chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sessions by Region</CardTitle>
                        <CardDescription>Geographic traffic distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 240 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={GEO_REGIONS} margin={{ top: 8, right: 6, left: -14, bottom: 0 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" horizontal={false} />
                                    <XAxis type="number" tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                                    <YAxis dataKey="region" type="category" tickLine={false} axisLine={false} tick={ax} width={90} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="sessions" name="Sessions" radius={[0, 6, 6, 0]}>
                                        {GEO_REGIONS.map((r, i) => <Cell key={i} fill={r.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                            {GEO_REGIONS.map((r) => (
                                <div key={r.region} className="fc g3" style={{ fontSize: 13 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontWeight: 600 }}>{r.region}</span>
                                    <Progress value={r.pct} style={{ flex: 2 }} />
                                    <span style={{ fontWeight: 700, width: 36, textAlign: "right" }}>{r.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Regional donut */}
                <Card>
                    <CardHeader>
                        <CardTitle>Region Share</CardTitle>
                        <CardDescription>% of total sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={GEO_REGIONS} dataKey="pct" nameKey="region" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                                        {GEO_REGIONS.map((r, i) => <Cell key={i} fill={r.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTip suffix="%" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Country table */}
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle>Country Breakdown</CardTitle>
                        <CardDescription>Sessions, bounce rate, and engagement per country</CardDescription>
                    </div>
                    <div className="fc g2" style={{ flexWrap: "wrap" }}>
                        {regions.map((r) => (
                            <button key={r} onClick={() => setRegion(r)} style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)", cursor: "pointer", fontWeight: 600, fontSize: 12, background: region === r ? "hsl(var(--primary))" : "var(--cd)", color: region === r ? "#fff" : "var(--fg)" }}>{r}</button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-3 pt-4 pl-5 font-semibold">Country</th>
                                    <th className="pb-3 pt-4 font-semibold">Region</th>
                                    <th className="pb-3 pt-4 font-semibold">Sessions</th>
                                    <th className="pb-3 pt-4 font-semibold">Share</th>
                                    <th className="pb-3 pt-4 font-semibold">Bounce</th>
                                    <th className="pb-3 pt-4 font-semibold">Avg Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((g, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-3 pl-5">
                                            <span className="fc g2">
                                                <span style={{ fontSize: 20 }}>{g.flag}</span>
                                                <span style={{ fontWeight: 600 }}>{g.country}</span>
                                            </span>
                                        </td>
                                        <td className="py-3 text-muted-foreground text-xs">{g.region}</td>
                                        <td className="py-3 font-semibold">{g.sessions.toLocaleString()}</td>
                                        <td className="py-3">
                                            <div className="fc g2" style={{ minWidth: 80 }}>
                                                <div style={{ flex: 1, height: 5, background: "var(--mt)", borderRadius: 4, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${g.pct}%`, background: g.color, borderRadius: 4 }} />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 700, width: 30 }}>{g.pct}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span style={{ color: g.bounce > 50 ? "#ef4444" : g.bounce > 40 ? "#f59e0b" : "#10b981", fontWeight: 700, fontSize: 13 }}>
                                                {g.bounce}%
                                            </span>
                                        </td>
                                        <td className="py-3 text-muted-foreground">{g.avgDuration}</td>
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
