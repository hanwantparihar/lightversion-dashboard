"use client";
import { useState, useEffect, useRef } from "react";
import { Server as ServerIcon, Cpu, HardDrive, MemoryStick, Activity, Wifi, WifiOff, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { SERVERS, SERVER_METRICS, type Server, type ServerStatus } from "@/lib/monitoring-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_META: Record<ServerStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    healthy: { label: "Healthy", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
    warning: { label: "Warning", color: "#f59e0b", bg: "#f59e0b18", icon: AlertTriangle },
    critical: { label: "Critical", color: "#ef4444", bg: "#ef444418", icon: AlertTriangle },
    offline: { label: "Offline", color: "#94a3b8", bg: "#94a3b818", icon: WifiOff },
};

const TYPE_COLORS: Record<Server["type"], string> = {
    web: "#2563eb", db: "#7c3aed", worker: "#f59e0b", cache: "#10b981",
};

function UsageBar({ value, warn = 70, crit = 90 }: { value: number; warn?: number; crit?: number }) {
    const color = value >= crit ? "#ef4444" : value >= warn ? "#f59e0b" : "#10b981";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
            </div>
            <span className="text-xs font-semibold w-8 text-right" style={{ color }}>{value}%</span>
        </div>
    );
}

export default function ServerMonitoringPage() {
    const [servers, setServers] = useState(SERVERS);
    const [selected, setSelected] = useState<Server | null>(null);
    const [metrics, setMetrics] = useState(SERVER_METRICS);
    const tickRef = useRef(0);

    // Live tick simulation
    useEffect(() => {
        const id = setInterval(() => {
            tickRef.current += 1;
            const t = tickRef.current;
            setServers(p => p.map(s => s.status === "offline" ? s : {
                ...s,
                cpu: Math.min(99, Math.max(1, s.cpu + Math.round((Math.random() - 0.5) * 8))),
                memory: Math.min(99, Math.max(10, s.memory + Math.round((Math.random() - 0.5) * 4))),
            }));
            setMetrics(p => {
                const last = p[p.length - 1];
                const next = {
                    t: `${t * 3}s`,
                    cpu: Math.min(99, Math.max(5, last.cpu + Math.round((Math.random() - 0.5) * 12))),
                    memory: Math.min(99, Math.max(10, last.memory + Math.round((Math.random() - 0.5) * 6))),
                    rps: Math.max(100, last.rps + Math.round((Math.random() - 0.5) * 60)),
                };
                return [...p.slice(1), next];
            });
        }, 2000);
        return () => clearInterval(id);
    }, []);

    const healthy = servers.filter(s => s.status === "healthy").length;
    const warning = servers.filter(s => s.status === "warning").length;
    const critical = servers.filter(s => s.status === "critical" || s.status === "offline").length;
    const avgCpu = Math.round(servers.filter(s => s.status !== "offline").reduce((a, s) => a + s.cpu, 0) / servers.filter(s => s.status !== "offline").length);

    return (
        <PageStack>

            <StatsGrid stats={[
                { icon: ServerIcon, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(servers.length), label: "Total Servers", change: `${healthy} healthy`, up: true, spark: spC, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(healthy), label: "Healthy", change: "", up: true, spark: spA, color: "#10b981" },
                { icon: AlertTriangle, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(warning), label: "Warning", change: "needs attention", up: false, spark: spD, color: "#f59e0b" },
                { icon: XCircle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(critical), label: "Critical/Offline", change: "action required", up: false, spark: spB, color: "#ef4444" },
            ]} />

            {/* Detail drawer */}
            {selected && (
                <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.4)" }} onClick={() => setSelected(null)}>
                    <div className="w-96 h-full bg-card overflow-y-auto shadow-2xl border-l border-border" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <ServerIcon size={18} className="text-primary" />
                                </div>
                                <div>
                                    <div className="font-bold">{selected.name}</div>
                                    <div className="text-xs text-muted-foreground">{selected.ip} · {selected.region}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-muted-foreground bg-transparent border-none cursor-pointer text-lg">✕</button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[["OS", selected.os], ["Version", selected.version], ["Uptime", selected.uptime], ["Last Ping", selected.lastPing]].map(([k, v]) => (
                                    <div key={k} className="rounded-xl border border-border p-3">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">{k}</div>
                                        <div className="text-sm font-semibold">{v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3">
                                {[["CPU", selected.cpu], ["Memory", selected.memory], ["Disk", selected.disk]].map(([k, v]) => (
                                    <div key={k}>
                                        <div className="flex justify-between text-xs font-semibold mb-1"><span>{k}</span><span>{v}%</span></div>
                                        <UsageBar value={v as number} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: 160 }}>
                                <div className="text-xs font-bold text-muted-foreground mb-2">CPU · Memory (live)</div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={metrics.slice(-15)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={4} />
                                        <YAxis tickLine={false} axisLine={false} tick={ax} domain={[0, 100]} />
                                        <Tooltip content={<ChartTip suffix="%" />} />
                                        <Line type="monotone" dataKey="cpu" name="CPU" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />
                                        <Line type="monotone" dataKey="memory" name="Memory" stroke="#7c3aed" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Live charts */}
            <div className="gr g-2 g2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">CPU Usage (live)</CardTitle>
                        <CardDescription>Cluster average over last 60s</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={4} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                                    <Tooltip content={<ChartTip suffix="%" />} />
                                    <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#2563eb" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Requests / sec (live)</CardTitle>
                        <CardDescription>Total HTTP requests across all web nodes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="t" tickLine={false} axisLine={false} tick={ax} interval={4} />
                                    <YAxis tickLine={false} axisLine={false} tick={ax} />
                                    <Tooltip content={<ChartTip />} />
                                    <Line type="monotone" dataKey="rps" name="RPS" stroke="#10b981" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Server table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm"><ServerIcon size={16} /> All Servers</CardTitle>
                    <CardDescription>Click a row to inspect details</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    {["Server", "Type", "Region", "Status", "CPU", "Memory", "Disk", "Uptime", "Last Ping"].map(h => (
                                        <th key={h} className="pb-3 pt-4 pl-5 font-semibold text-xs">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {servers.map(s => {
                                    const sm = STATUS_META[s.status];
                                    const Icon = sm.icon;
                                    return (
                                        <tr key={s.id} onClick={() => setSelected(s)}
                                            className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                                            <td className="py-3 pl-5 font-mono font-semibold text-xs">{s.name}</td>
                                            <td className="py-3 pl-5">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                                                    style={{ background: TYPE_COLORS[s.type] + "20", color: TYPE_COLORS[s.type] }}>{s.type}</span>
                                            </td>
                                            <td className="py-3 pl-5 text-xs text-muted-foreground">{s.region}</td>
                                            <td className="py-3 pl-5">
                                                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: sm.color }}>
                                                    <Icon size={12} />{sm.label}
                                                </span>
                                            </td>
                                            <td className="py-3 pl-5 w-28"><UsageBar value={s.cpu} /></td>
                                            <td className="py-3 pl-5 w-28"><UsageBar value={s.memory} /></td>
                                            <td className="py-3 pl-5 w-28"><UsageBar value={s.disk} warn={80} crit={90} /></td>
                                            <td className="py-3 pl-5 text-xs font-semibold" style={{ color: s.uptime === "0%" ? "#ef4444" : "#10b981" }}>{s.uptime}</td>
                                            <td className="py-3 pl-5 text-xs text-muted-foreground">{s.lastPing}</td>
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
