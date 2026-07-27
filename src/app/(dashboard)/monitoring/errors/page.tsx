"use client";
import { useState } from "react";
import {
    Bug, AlertTriangle, XCircle, Info, CheckCircle2,
    Search, Filter, Download, RefreshCw, ChevronDown, ChevronRight, X,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid, ChartTip } from "@/components";
import { TRACKED_ERRORS, ERROR_TRENDS, type TrackedError, type ErrorSeverity, type ErrorStatus } from "@/lib/monitoring-data";
import { ax, spA, spB, spC, spD } from "@/lib/data.js";

const SEV_META: Record<ErrorSeverity, { color: string; bg: string; icon: typeof Bug; label: string }> = {
    critical: { color: "#ef4444", bg: "#ef444418", icon: XCircle, label: "Critical" },
    error: { color: "#f59e0b", bg: "#f59e0b18", icon: AlertTriangle, label: "Error" },
    warning: { color: "#2563eb", bg: "#2563eb18", icon: Info, label: "Warning" },
    info: { color: "#94a3b8", bg: "#94a3b818", icon: Info, label: "Info" },
};

const STATUS_META: Record<ErrorStatus, { color: string; bg: string; label: string }> = {
    open: { color: "#ef4444", bg: "#ef444418", label: "Open" },
    resolved: { color: "#10b981", bg: "#10b98118", label: "Resolved" },
    ignored: { color: "#94a3b8", bg: "#94a3b818", label: "Ignored" },
    regressed: { color: "#f59e0b", bg: "#f59e0b18", label: "Regressed" },
};

function ErrorDetail({ err, onClose }: { err: TrackedError; onClose: () => void }) {
    const sm = SEV_META[err.severity];
    const st = STATUS_META[err.status];
    const Icon = sm.icon;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,.45)" }} onClick={onClose}>
            <div className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-start justify-between p-5 border-b border-border sticky top-0 bg-card">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: sm.bg }}>
                            <Icon size={18} style={{ color: sm.color }} />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-sm leading-snug">{err.title}</div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                                <span className="text-xs text-muted-foreground font-mono">{err.service}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground bg-transparent border-none cursor-pointer flex shrink-0 ml-2">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-3">
                        {[["Occurrences", err.occurrences.toLocaleString()], ["Affected Users", err.affectedUsers], ["First Seen", err.firstSeen], ["Last Seen", err.lastSeen], ["Type", err.type], ["Service", err.service]].map(([k, v]) => (
                            <div key={k} className="rounded-xl border border-border p-3">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">{k}</div>
                                <div className="text-sm font-semibold">{v}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Error Message</div>
                        <div className="p-3 rounded-xl bg-muted font-mono text-xs text-foreground leading-relaxed">{err.message}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Stack Trace</div>
                        <pre className="p-4 rounded-xl text-xs leading-[1.8] overflow-x-auto whitespace-pre-wrap"
                            style={{ background: "hsl(222 47% 8%)", color: "#e2e8f0", fontFamily: '"JetBrains Mono","Fira Code",monospace' }}>
                            {err.stack}
                        </pre>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {err.tags.map(t => (
                            <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent text-accent-foreground">{t}</span>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button size="sm">Mark Resolved</Button>
                        <Button size="sm" variant="outline">Ignore</Button>
                        <Button size="sm" variant="outline">Assign</Button>
                        <Button size="sm" variant="outline" className="ml-auto">View in Logs</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ErrorTrackingPage() {
    const [errors, setErrors] = useState(TRACKED_ERRORS);
    const [filter, setFilter] = useState<"all" | ErrorStatus>("all");
    const [sevFilter, setSev] = useState<"all" | ErrorSeverity>("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<TrackedError | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = errors.filter(e => {
        const mf = filter === "all" || e.status === filter;
        const msv = sevFilter === "all" || e.severity === sevFilter;
        const mq = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.service.toLowerCase().includes(search.toLowerCase());
        return mf && msv && mq;
    });

    const counts = {
        total: errors.length,
        open: errors.filter(e => e.status === "open").length,
        critical: errors.filter(e => e.severity === "critical").length,
        resolved: errors.filter(e => e.status === "resolved").length,
    };

    return (
        <PageStack>
            {selected && <ErrorDetail err={selected} onClose={() => setSelected(null)} />}

            <StatsGrid stats={[
                { icon: Bug, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(counts.total), label: "Total Errors", change: "last 7 days", up: false, spark: spC, color: "#2563eb" },
                { icon: XCircle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(counts.open), label: "Open", change: "unresolved", up: false, spark: spA, color: "#ef4444" },
                { icon: AlertTriangle, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(counts.critical), label: "Critical", change: "action needed", up: false, spark: spD, color: "#f59e0b" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(counts.resolved), label: "Resolved", change: "this week", up: true, spark: spB, color: "#10b981" },
            ]} />

            {/* Trend chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Error Volume — Last 7 Days</CardTitle>
                    <CardDescription>Stacked by severity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ERROR_TRENDS} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                                <YAxis tickLine={false} axisLine={false} tick={ax} />
                                <Tooltip content={<ChartTip />} />
                                <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="error" name="Error" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="warning" name="Warning" stackId="a" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Filters + table */}
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-sm"><Bug size={15} /> Error List</CardTitle>
                        <CardDescription>{filtered.length} issues</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search errors…" className="pl-8 w-48 text-xs" />
                        </div>
                        <div className="flex gap-1">
                            {(["all", "open", "resolved", "ignored"] as const).map(s => (
                                <button key={s} onClick={() => setFilter(s)} className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-semibold capitalize transition-colors"
                                    style={{ background: filter === s ? "hsl(var(--primary))" : "var(--cd)", color: filter === s ? "#fff" : "var(--fg)" }}>{s}</button>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {(["all", "critical", "error", "warning"] as const).map(s => (
                                <button key={s} onClick={() => setSev(s)} className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-semibold capitalize transition-colors"
                                    style={{
                                        background: sevFilter === s ? (s === "all" ? "hsl(var(--primary))" : SEV_META[s as ErrorSeverity]?.color) : "var(--cd)",
                                        color: sevFilter === s ? "#fff" : "var(--fg)"
                                    }}>{s}</button>
                            ))}
                        </div>
                        <Button size="sm" variant="outline"><Download size={13} /> Export</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filtered.map(err => {
                        const sm = SEV_META[err.severity];
                        const st = STATUS_META[err.status];
                        const Icon = sm.icon;
                        const isExp = expanded === err.id;
                        return (
                            <div key={err.id} className="border-b last:border-0 border-border">
                                <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer flex-wrap"
                                    onClick={() => setSelected(err)}>
                                    <button onClick={e => { e.stopPropagation(); setExpanded(isExp ? null : err.id); }}
                                        className="bg-transparent border-none cursor-pointer text-muted-foreground flex shrink-0">
                                        {isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: sm.bg }}>
                                        <Icon size={13} style={{ color: sm.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">{err.title}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="font-mono">{err.service}</span>
                                            <span>·</span><span>First: {err.firstSeen}</span>
                                            <span>·</span><span>Last: {err.lastSeen}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right text-xs">
                                            <div className="font-extrabold text-base" style={{ color: sm.color }}>{err.occurrences.toLocaleString()}</div>
                                            <div className="text-muted-foreground">{err.affectedUsers} users</div>
                                        </div>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                                    </div>
                                </div>
                                {isExp && (
                                    <div className="px-12 pb-3">
                                        <div className="p-3 rounded-xl bg-muted font-mono text-xs text-muted-foreground leading-relaxed border border-border">
                                            {err.message}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {err.tags.map(t => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{t}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground text-sm">No errors match your filters.</div>
                    )}
                </CardContent>
            </Card>
        </PageStack>
    );
}
