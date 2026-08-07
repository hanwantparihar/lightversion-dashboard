"use client";
import { useState } from "react";
import { Receipt, DollarSign, TrendingUp, AlertCircle, Download, Eye, Send } from "lucide-react";
import {
    Card, CardHeader, CardContent, CardTitle, CardDescription,
    Button, Badge,
} from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { TENANTS, TENANT_INVOICES, type TenantInvoice } from "@/lib/tenant-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_STYLES: Record<TenantInvoice["status"], { label: string; color: string; bg: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    paid: { label: "Paid", color: "#10b981", bg: "#10b98120", variant: "default" },
    pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b20", variant: "secondary" },
    overdue: { label: "Overdue", color: "#ef4444", bg: "#ef444420", variant: "destructive" },
};

const PLAN_MRR = { starter: 29, pro: 299, enterprise: 799 };

export default function TenantBillingPage() {
    const [invoices, setInvoices] = useState(TENANT_INVOICES);
    const [filter, setFilter] = useState<"all" | TenantInvoice["status"]>("all");

    const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);

    const totalMrr = TENANTS.filter(t => t.status === "active").reduce((s, t) => s + t.mrr, 0);
    const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
    const totalOwed = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
    const overdueCount = invoices.filter(i => i.status === "overdue").length;

    function sendReminder(id: string) {
        setInvoices(p => p.map(i => i.id === id && i.status === "overdue" ? { ...i, status: "pending" } : i));
    }

    return (
        <PageStack>
            <StatsGrid stats={[
                { icon: DollarSign, grad: "linear-gradient(135deg,#10b981,#059669)", value: `$${totalMrr.toLocaleString()}`, label: "Monthly MRR", change: "13.4%", up: true, spark: spC, color: "#10b981" },
                { icon: Receipt, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: `$${totalPaid.toLocaleString()}`, label: "Collected", change: "this cycle", up: true, spark: spA, color: "#2563eb" },
                { icon: AlertCircle, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `$${totalOwed.toLocaleString()}`, label: "Outstanding", change: `${overdueCount} overdue`, up: false, spark: spB, color: "#f59e0b" },
                { icon: TrendingUp, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: String(TENANTS.filter(t => t.status === "active").length), label: "Paying Tenants", change: "+2", up: true, spark: spD, color: "#7c3aed" },
            ]} />

            {/* Plan breakdown */}
            <div className="grid grid-cols-3 gap-4">
                {(["starter", "pro", "enterprise"] as const).map(plan => {
                    const count = TENANTS.filter(t => t.plan === plan && t.status === "active").length;
                    const colors = { starter: "#94a3b8", pro: "#7c3aed", enterprise: "#f59e0b" };
                    return (
                        <Card key={plan}>
                            <CardContent className="pt-5 pb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full"
                                        style={{ background: colors[plan] + "22", color: colors[plan] }}>{plan}</span>
                                    <span className="text-2xl font-extrabold">{count}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">${PLAN_MRR[plan]}/mo per tenant</div>
                                <div className="text-sm font-bold mt-1" style={{ color: "hsl(var(--primary))" }}>
                                    ${(count * PLAN_MRR[plan]).toLocaleString()} MRR
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Invoice table */}
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Receipt size={18} /> Invoices</CardTitle>
                        <CardDescription>Billing history across all tenants</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {(["all", "paid", "pending", "overdue"] as const).map(s => (
                            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold capitalize transition-colors"
                                style={{ background: filter === s ? "hsl(var(--primary))" : "var(--cd)", color: filter === s ? "#fff" : "var(--fg)" }}>{s}</button>
                        ))}
                        <Button variant="outline" size="sm"><Download size={14} /> Export</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    {["Invoice", "Tenant", "Plan", "Period", "Amount", "Status", "Actions"].map(h => (
                                        <th key={h} className="pb-3 pt-4 pl-5 font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(inv => {
                                    const tenant = TENANTS.find(t => t.id === inv.tenantId);
                                    const ss = STATUS_STYLES[inv.status];
                                    return (
                                        <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="py-3 pl-5 font-mono text-xs font-semibold">{inv.id.toUpperCase()}</td>
                                            <td className="py-3 pl-5">
                                                <div className="flex items-center gap-2">
                                                    {tenant && (
                                                        <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0"
                                                            style={{ background: tenant.color + "22", color: tenant.color }}>{tenant.avatar}</div>
                                                    )}
                                                    <span className="font-semibold">{inv.tenantName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pl-5 capitalize text-muted-foreground text-xs">{inv.plan}</td>
                                            <td className="py-3 pl-5 text-muted-foreground text-xs">{inv.period}</td>
                                            <td className="py-3 pl-5 font-extrabold">${inv.amount.toLocaleString()}</td>
                                            <td className="py-3 pl-5">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                    style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                                            </td>
                                            <td className="py-3 pl-5">
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye size={13} /></Button>
                                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Download size={13} /></Button>

                                                </div>
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
