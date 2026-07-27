"use client";
import { useState } from "react";
import {
    ArrowRightLeft, CheckCircle2, XCircle, Clock, Play,
    Pause, RefreshCw, Plus, Upload, AlertTriangle, Download,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { MIGRATIONS, type Migration, type MigrationStatus } from "@/lib/enterprise-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_META: Record<MigrationStatus, { color: string; bg: string; label: string; icon: typeof CheckCircle2 }> = {
    pending: { color: "#94a3b8", bg: "#94a3b818", label: "Pending", icon: Clock },
    running: { color: "#2563eb", bg: "#2563eb18", label: "Running", icon: RefreshCw },
    completed: { color: "#10b981", bg: "#10b98118", label: "Completed", icon: CheckCircle2 },
    failed: { color: "#ef4444", bg: "#ef444418", label: "Failed", icon: XCircle },
    paused: { color: "#f59e0b", bg: "#f59e0b18", label: "Paused", icon: Pause },
};

const LOG_COLORS = { info: "#94a3b8", warn: "#f59e0b", error: "#ef4444" };

export default function MigrationToolsPage() {
    const [migrations] = useState(MIGRATIONS);
    const [active, setActive] = useState<Migration>(MIGRATIONS[0]);
    const [showNew, setShowNew] = useState(false);

    const completed = migrations.filter(m => m.status === "completed").length;
    const running = migrations.filter(m => m.status === "running").length;
    const failed = migrations.filter(m => m.status === "failed").length;
    const totalRecs = migrations.reduce((s, m) => s + m.totalRecords, 0);

    const pct = active.totalRecords > 0 ? Math.round((active.migratedRecords / active.totalRecords) * 100) : 0;

    return (
        <PageStack>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">Migration Tools</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Import and migrate data from external platforms into Nexora AI</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Upload size={14} /> Import CSV</Button>
                    <Button onClick={() => setShowNew(v => !v)}><Plus size={14} /> New Migration</Button>
                </div>
            </div>

            <StatsGrid stats={[
                { icon: ArrowRightLeft, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(migrations.length), label: "Total Migrations", change: "", up: true, spark: spC, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(completed), label: "Completed", change: "", up: true, spark: spA, color: "#10b981" },
                { icon: RefreshCw, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(running), label: "Running", change: "", up: true, spark: spD, color: "#f59e0b" },
                { icon: XCircle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(failed), label: "Failed", change: "", up: false, spark: spB, color: "#ef4444" },
            ]} />

            {/* New migration form */}
            {showNew && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Configure New Migration</CardTitle>
                        <CardDescription>Set source, destination, and field mappings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Migration Name</label>
                            <Input placeholder="e.g. Acme — HubSpot import" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Tenant</label>
                            <select className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground text-sm">
                                {["Acme Corp", "Initech", "Nova Systems", "Skyline Tech", "Quantum Co"].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Source System</label>
                            <select className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground text-sm">
                                {["Salesforce", "HubSpot", "MySQL", "PostgreSQL", "CSV Files", "MongoDB", "Zendesk"].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Destination</label>
                            <select className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground text-sm">
                                {["Nexora AI CRM", "Nexora DB", "Nexora Analytics", "Custom Endpoint"].map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2 flex gap-2">
                            <Button>Start Migration</Button>
                            <Button variant="outline">Save as Draft</Button>
                            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Migration list */}
                <Card className="w-64 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Migrations</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {migrations.map(m => {
                            const sm = STATUS_META[m.status];
                            const Icon = sm.icon;
                            const isA = m.id === active.id;
                            const mpct = m.totalRecords > 0 ? Math.round((m.migratedRecords / m.totalRecords) * 100) : 0;
                            return (
                                <button key={m.id} onClick={() => setActive(m)}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                        style={{ background: m.tenantColor + "22", color: m.tenantColor }}>{m.tenantAvatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] truncate font-semibold" style={{ color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>{m.name}</div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Icon size={10} style={{ color: sm.color }} className={m.status === "running" ? "animate-spin" : ""} />
                                            <span className="text-[10px] font-semibold" style={{ color: sm.color }}>{sm.label}</span>
                                            <span className="text-[10px] text-muted-foreground ml-1">{mpct}%</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Detail */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    {/* Header card */}
                    <Card>
                        <CardContent className="pt-5">
                            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                                <div>
                                    <div className="font-bold text-base">{active.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                                        <span>{active.source}</span>
                                        <ArrowRightLeft size={12} />
                                        <span>{active.destination}</span>
                                        <span>·</span>
                                        <span>{active.tenant}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {active.status === "running" && <Button size="sm" variant="outline"><Pause size={13} /> Pause</Button>}
                                    {active.status === "paused" && <Button size="sm"><Play size={13} /> Resume</Button>}
                                    {active.status === "failed" && <Button size="sm"><RefreshCw size={13} /> Retry</Button>}
                                    <Button size="sm" variant="outline"><Download size={13} /> Report</Button>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {[
                                    { label: "Total", value: active.totalRecords.toLocaleString(), color: "var(--fg)" },
                                    { label: "Migrated", value: active.migratedRecords.toLocaleString(), color: "#10b981" },
                                    { label: "Failed", value: active.failedRecords.toLocaleString(), color: active.failedRecords > 0 ? "#ef4444" : "#94a3b8" },
                                    { label: "Duration", value: active.duration, color: "var(--fg)" },
                                ].map(s => (
                                    <div key={s.label} className="rounded-xl border border-border p-3 text-center">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">{s.label}</div>
                                        <div className="font-extrabold text-base" style={{ color: s.color }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span>Overall Progress</span>
                                    <span>{pct}% ({active.migratedRecords.toLocaleString()} / {active.totalRecords.toLocaleString()} records)</span>
                                </div>
                                <div className="h-3 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full transition-all"
                                        style={{ width: `${pct}%`, background: active.status === "failed" ? "#ef4444" : active.status === "completed" ? "#10b981" : "#2563eb" }} />
                                </div>
                                {active.status === "running" && (
                                    <div className="text-xs text-muted-foreground mt-1">Est. completion: {active.estimatedCompletion}</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table breakdown */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Table Progress</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            {active.tables.map(t => {
                                const tm = STATUS_META[t.status];
                                const tpct = t.total > 0 ? Math.round((t.migrated / t.total) * 100) : 0;
                                const TIcon = tm.icon;
                                return (
                                    <div key={t.name} className="flex items-center gap-4 px-5 py-3 border-b last:border-0 border-border">
                                        <TIcon size={15} style={{ color: tm.color }} className={t.status === "running" ? "animate-spin" : ""} />
                                        <span className="font-mono font-semibold text-sm w-28 shrink-0">{t.name}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                                    <div className="h-full rounded-full transition-all"
                                                        style={{ width: `${tpct}%`, background: tm.color }} />
                                                </div>
                                                <span className="text-xs font-semibold w-8 text-right" style={{ color: tm.color }}>{tpct}%</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">{t.migrated.toLocaleString()} / {t.total.toLocaleString()}</span>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: tm.bg, color: tm.color }}>{tm.label}</span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Migration log */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Migration Log</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <div style={{ background: "hsl(222 47% 8%)", borderRadius: "0 0 12px 12px" }}>
                                {active.logs.map((log, i) => (
                                    <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b border-white/5 last:border-0">
                                        <span className="font-mono text-[11px] text-slate-500 shrink-0">{log.ts}</span>
                                        <span className="text-[11px] font-bold uppercase tracking-wide shrink-0 w-10"
                                            style={{ color: LOG_COLORS[log.level] }}>{log.level}</span>
                                        <span className="font-mono text-[12px] text-slate-300 leading-relaxed">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageStack>
    );
}
