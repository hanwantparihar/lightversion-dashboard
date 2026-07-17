"use client";
import { useEffect, useState, useRef } from "react";
import { Activity, Users, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack, ChartTip } from "@/components";
import { REALTIME_SERIES, LIVE_PAGES, type RealTimePoint } from "@/lib/advanced-analytics-data";
import { ax } from "@/lib/data.js";

export default function RealtimeAnalyticsPage() {
    const [series, setSeries] = useState<RealTimePoint[]>(REALTIME_SERIES);
    const [active, setActive] = useState(240);
    const [pvRate, setPvRate] = useState(112);
    const [pulse, setPulse] = useState(false);
    const tickRef = useRef(0);

    // Simulate live ticking data
    useEffect(() => {
        const id = setInterval(() => {
            tickRef.current += 1;
            const t = tickRef.current;
            const newActive = 220 + Math.round(Math.sin(t / 4) * 50) + Math.round(Math.random() * 20);
            const newPv = 90 + Math.round(Math.cos(t / 3) * 30) + Math.round(Math.random() * 15);

            setActive(newActive);
            setPvRate(newPv);
            setPulse(true);
            setTimeout(() => setPulse(false), 300);

            setSeries((prev) => {
                const next = [...prev.slice(1), { t: `${t}s`, active: newActive, pageviews: newPv }];
                return next;
            });
        }, 1500);
        return () => clearInterval(id);
    }, []);

    return (
        <PageStack>
            {/* Live pulse header */}
            {/* <div className="fc g3">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 4px #10b98130", animation: "pulse 1.5s infinite" }} />
                <h2 style={{ fontWeight: 800, fontSize: 22 }}>Real-time Analytics</h2>
                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#10b98120", color: "#10b981", fontWeight: 700 }}>LIVE</span>
            </div> */}

            {/* KPI tiles */}
            <div className="gr g-4 g2">
                {[
                    { icon: Users, label: "Active Users", value: active, unit: "", color: "#2563eb", change: "+3" },
                    { icon: Eye, label: "Pages / min", value: pvRate, unit: "", color: "#7c3aed", change: "+8" },
                    { icon: Activity, label: "Events / min", value: active * 3, unit: "", color: "#10b981", change: "+12" },
                    { icon: TrendingUp, label: "Avg Load Time", value: 1.4, unit: "s", color: "#f59e0b", change: "-0.1" },
                ].map((k, i) => {
                    const Icon = k.icon;
                    return (
                        <Card key={i} style={{ overflow: "hidden" }}>
                            <CardContent style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <div className="fb" style={{ marginBottom: 10 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: k.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon size={18} style={{ color: k.color }} />
                                    </div>
                                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#10b98118", color: "#10b981", fontWeight: 700 }}>
                                        {k.change}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: 28, fontWeight: 800,
                                    transition: "color .3s",
                                    color: pulse ? k.color : "var(--fg)",
                                }}>
                                    {typeof k.value === "number" ? k.value.toLocaleString() : k.value}{k.unit}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--mt-fg)", marginTop: 3, fontWeight: 600 }}>{k.label}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="gr g-31 g2">
                {/* Live chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="fc g2">
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                            Active Users & Pageviews
                        </CardTitle>
                        <CardDescription>Rolling 20-second window</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={series} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                                    <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={4} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} />
                                    <Tooltip content={<ChartTip />} />
                                    <Line type="monotone" dataKey="active" name="Active Users" stroke="#2563eb" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                                    <Line type="monotone" dataKey="pageviews" name="Pageviews/min" stroke="#10b981" strokeWidth={2.5} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Live page breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Live Pages</CardTitle>
                        <CardDescription>Most active pages right now</CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: 0 }}>
                        {LIVE_PAGES.map((p, i) => (
                            <div key={i} className="fb" style={{ padding: "12px 20px", borderBottom: "1px solid var(--bd)" }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {p.path}
                                    </div>
                                </div>
                                <div className="fc g3">
                                    <span style={{ fontWeight: 800, fontSize: 15, color: "hsl(var(--primary))" }}>{p.active}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: p.change >= 0 ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", gap: 2 }}>
                                        {p.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                        {p.change >= 0 ? "+" : ""}{p.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </PageStack>
    );
}
