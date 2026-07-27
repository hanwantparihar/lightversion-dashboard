"use client";
import { useState } from "react";
import {
    Building2, Plus, Search, MoreHorizontal, CheckCircle2,
    PauseCircle, Clock, XCircle, Users, HardDrive, Zap, Globe,
} from "lucide-react";
import {
    Card, CardHeader, CardContent, CardTitle, CardDescription,
    Button, Input, Badge,
} from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { TENANTS, type Tenant, type TenantStatus, type TenantPlan } from "@/lib/tenant-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

// ── Styles ────────────────────────────────────────────────────────────────────
const STATUS_META: Record<TenantStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    active: { label: "Active", color: "#10b981", bg: "#10b98120", icon: CheckCircle2 },
    suspended: { label: "Suspended", color: "#f59e0b", bg: "#f59e0b20", icon: PauseCircle },
    trial: { label: "Trial", color: "#2563eb", bg: "#2563eb20", icon: Clock },
    churned: { label: "Churned", color: "#ef4444", bg: "#ef444420", icon: XCircle },
};

const PLAN_COLORS: Record<TenantPlan, string> = {
    starter: "#94a3b8", pro: "#7c3aed", enterprise: "#f59e0b",
};

// ── Detail drawer ─────────────────────────────────────────────────────────────
function TenantDrawer({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) {
    const sm = STATUS_META[tenant.status];
    const StatusIcon = sm.icon;
    const storagePct = Math.round((tenant.storageUsedGb / tenant.storageMaxGb) * 100);
    const apiPct = Math.round((tenant.apiCallsThisMonth / tenant.apiLimit) * 100);
    const seatsPct = Math.round((tenant.seats / tenant.maxSeats) * 100);

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end"
            style={{ background: "rgba(0,0,0,.4)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md h-full bg-card overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm"
                            style={{ background: tenant.color + "22", color: tenant.color }}>
                            {tenant.avatar}
                        </div>
                        <div>
                            <div className="font-bold text-base">{tenant.name}</div>
                            <div className="text-xs text-muted-foreground">{tenant.domain}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">✕</button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                            style={{ background: sm.bg, color: sm.color }}>
                            <StatusIcon size={10} className="inline mr-1" />{sm.label}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                            style={{ background: PLAN_COLORS[tenant.plan] + "22", color: PLAN_COLORS[tenant.plan] }}>
                            {tenant.plan}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground">
                            <Globe size={10} className="inline mr-1" />{tenant.region}
                        </span>
                    </div>

                    {/* Owner */}
                    <div className="rounded-xl border border-border p-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Owner</div>
                        <div className="font-semibold text-sm">{tenant.owner}</div>
                        <div className="text-xs text-muted-foreground">{tenant.ownerEmail}</div>
                        <div className="text-xs text-muted-foreground mt-1">Created {tenant.createdAt}</div>
                    </div>

                    {/* Usage meters */}
                    {[
                        { label: "Seats", value: tenant.seats, used: seatsPct, fmt: `${tenant.seats} / ${tenant.maxSeats}` },
                        { label: "Storage", value: tenant.storageUsedGb, used: storagePct, fmt: `${tenant.storageUsedGb} / ${tenant.storageMaxGb} GB` },
                        { label: "API Calls", value: tenant.apiCallsThisMonth, used: apiPct, fmt: `${tenant.apiCallsThisMonth.toLocaleString()} / ${tenant.apiLimit.toLocaleString()}` },
                    ].map(m => (
                        <div key={m.label}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span>{m.label}</span>
                                <span className="text-muted-foreground">{m.fmt}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full transition-all"
                                    style={{ width: `${m.used}%`, background: m.used >= 90 ? "#ef4444" : m.used >= 70 ? "#f59e0b" : "#10b981" }} />
                            </div>
                        </div>
                    ))}

                    {/* MRR */}
                    <div className="rounded-xl border border-border p-4 flex justify-between items-center">
                        <span className="text-sm font-semibold">Monthly Revenue</span>
                        <span className="text-lg font-extrabold" style={{ color: "hsl(var(--primary))" }}>
                            {tenant.mrr ? `$${tenant.mrr}` : "—"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" className="flex-1">Impersonate</Button>
                        <Button size="sm" variant="outline" className="flex-1">Edit Plan</Button>
                        {tenant.status === "active" && (
                            <Button size="sm" variant="destructive" className="flex-1">Suspend</Button>
                        )}
                        {tenant.status === "suspended" && (
                            <Button size="sm" className="flex-1">Reactivate</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TenantManagementPage() {
    const [tenants, setTenants] = useState(TENANTS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | TenantStatus>("all");
    const [selected, setSelected] = useState<Tenant | null>(null);

    const filtered = tenants.filter(t => {
        const matchF = filter === "all" || t.status === filter;
        const matchQ = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.domain.includes(search.toLowerCase());
        return matchF && matchQ;
    });

    const counts = {
        total: tenants.length,
        active: tenants.filter(t => t.status === "active").length,
        trial: tenants.filter(t => t.status === "trial").length,
        suspended: tenants.filter(t => t.status === "suspended").length,
    };

    const totalMrr = tenants.reduce((s, t) => s + t.mrr, 0);

    return (
        <PageStack>
            {selected && <TenantDrawer tenant={selected} onClose={() => setSelected(null)} />}

            <StatsGrid stats={[
                { icon: Building2, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(counts.total), label: "Total Tenants", change: "+2 this month", up: true, spark: spC, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(counts.active), label: "Active", change: "healthy", up: true, spark: spA, color: "#10b981" },
                { icon: Clock, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(counts.trial), label: "In Trial", change: "convert soon", up: true, spark: spD, color: "#f59e0b" },
                { icon: Zap, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: `$${totalMrr.toLocaleString()}`, label: "Total MRR", change: "13.4%", up: true, spark: spB, color: "#7c3aed" },
            ]} />

            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Building2 size={18} /> Tenants</CardTitle>
                        <CardDescription>All organizations using your platform</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search tenants…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-52" />
                        </div>
                        {(["all", "active", "trial", "suspended", "churned"] as const).map(s => (
                            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold capitalize transition-colors"
                                style={{ background: filter === s ? "hsl(var(--primary))" : "var(--cd)", color: filter === s ? "#fff" : "var(--fg)" }}>
                                {s}
                            </button>
                        ))}
                        <Button size="sm"><Plus size={14} /> Add Tenant</Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    {["Tenant", "Plan", "Status", "Region", "Seats", "Storage", "MRR", ""].map(h => (
                                        <th key={h} className="pb-3 pt-4 pl-5 font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(t => {
                                    const sm = STATUS_META[t.status];
                                    const SIcon = sm.icon;
                                    const storagePct = Math.round((t.storageUsedGb / t.storageMaxGb) * 100);
                                    return (
                                        <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(t)}>
                                            <td className="py-3 pl-5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                                                        style={{ background: t.color + "22", color: t.color }}>{t.avatar}</div>
                                                    <div>
                                                        <div className="font-semibold">{t.name}</div>
                                                        <div className="text-xs text-muted-foreground">{t.domain}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 pl-5">
                                                <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full"
                                                    style={{ background: PLAN_COLORS[t.plan] + "22", color: PLAN_COLORS[t.plan] }}>
                                                    {t.plan}
                                                </span>
                                            </td>
                                            <td className="py-3 pl-5">
                                                <span className="flex items-center gap-1 text-xs font-semibold"
                                                    style={{ color: sm.color }}>
                                                    <SIcon size={12} />{sm.label}
                                                </span>
                                            </td>
                                            <td className="py-3 pl-5 text-muted-foreground text-xs">{t.region}</td>
                                            <td className="py-3 pl-5 text-xs">{t.seats}/{t.maxSeats}</td>
                                            <td className="py-3 pl-5">
                                                <div className="flex items-center gap-2 min-w-[80px]">
                                                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${storagePct}%`, background: storagePct >= 80 ? "#ef4444" : "#10b981" }} />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground shrink-0">{storagePct}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pl-5 font-extrabold text-xs" style={{ color: t.mrr ? "hsl(var(--primary))" : "var(--mt-fg)" }}>
                                                {t.mrr ? `$${t.mrr}` : "—"}
                                            </td>
                                            <td className="py-3 pl-5">
                                                <button className="text-muted-foreground hover:text-foreground" onClick={e => { e.stopPropagation(); setSelected(t); }}>
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </td>
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
