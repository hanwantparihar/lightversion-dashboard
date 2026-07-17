"use client";
import { useState } from "react";
import { Receipt, Plus, Download, Send, Eye } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Badge } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { INVOICES, type Invoice } from "@/lib/advanced-billing-data";
import { spA, spB, spC, spD } from "@/lib/data";

const STATUS_STYLES: Record<Invoice["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string; color: string }> = {
    paid: { variant: "default", label: "Paid", color: "#10b981" },
    pending: { variant: "secondary", label: "Pending", color: "#f59e0b" },
    overdue: { variant: "destructive", label: "Overdue", color: "#ef4444" },
    draft: { variant: "outline", label: "Draft", color: "#94a3b8" },
};

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState(INVOICES);
    const [filter, setFilter] = useState<"all" | Invoice["status"]>("all");
    const [preview, setPreview] = useState<Invoice | null>(null);

    const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

    const totals = {
        paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
        pending: invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0),
        overdue: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
    };

    function send(id: string) {
        setInvoices((p) => p.map((inv) => inv.id === id && inv.status === "draft" ? { ...inv, status: "pending" } : inv));
    }

    return (
        <PageStack>
            <StatsGrid
                stats={[
                    { icon: Receipt, grad: "linear-gradient(135deg,#10b981,#059669)", value: `$${totals.paid.toFixed(2)}`, label: "Paid", change: `${invoices.filter(i => i.status === "paid").length} invoices`, up: true, spark: spC, color: "#10b981" },
                    { icon: Receipt, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: `$${totals.pending.toFixed(2)}`, label: "Pending", change: `${invoices.filter(i => i.status === "pending").length} invoices`, up: true, spark: spA, color: "#f59e0b" },
                    { icon: Receipt, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: `$${totals.overdue.toFixed(2)}`, label: "Overdue", change: `${invoices.filter(i => i.status === "overdue").length} invoices`, up: false, spark: spB, color: "#ef4444" },
                    { icon: Receipt, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(invoices.length), label: "Total", change: "All time", up: true, spark: spD, color: "#2563eb" },
                ]}
            />

            {/* Invoice detail modal */}
            {preview && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={() => setPreview(null)}
                >
                    <div
                        style={{ background: "var(--cd)", borderRadius: 18, padding: 32, width: "100%", maxWidth: 520, boxShadow: "var(--sh-l)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="fb" style={{ marginBottom: 20 }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 20 }}>{preview.id}</div>
                                <div style={{ fontSize: 13, color: "var(--mt-fg)" }}>{preview.customer} · {preview.customerEmail}</div>
                            </div>
                            <span style={{ padding: "4px 12px", borderRadius: 20, background: STATUS_STYLES[preview.status].color + "22", color: STATUS_STYLES[preview.status].color, fontWeight: 700, fontSize: 12 }}>
                                {STATUS_STYLES[preview.status].label}
                            </span>
                        </div>
                        <table className="w-full text-sm" style={{ marginBottom: 16 }}>
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-semibold">Description</th>
                                    <th className="pb-2 font-semibold text-right">Qty</th>
                                    <th className="pb-2 font-semibold text-right">Unit</th>
                                    <th className="pb-2 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {preview.items.map((item, i) => (
                                    <tr key={i} className="border-b last:border-0">
                                        <td className="py-2">{item.desc}</td>
                                        <td className="py-2 text-right">{item.qty}</td>
                                        <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                                        <td className="py-2 text-right font-semibold">${(item.qty * item.unitPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ borderTop: "1px solid var(--bd)", paddingTop: 12 }}>
                            <div className="fb" style={{ fontSize: 13, color: "var(--mt-fg)", marginBottom: 4 }}>
                                <span>Subtotal</span><span>${(preview.amount - preview.tax).toFixed(2)}</span>
                            </div>
                            <div className="fb" style={{ fontSize: 13, color: "var(--mt-fg)", marginBottom: 8 }}>
                                <span>Tax (10%)</span><span>${preview.tax.toFixed(2)}</span>
                            </div>
                            <div className="fb" style={{ fontWeight: 800, fontSize: 18 }}>
                                <span>Total</span><span style={{ color: "hsl(var(--primary))" }}>${preview.amount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="fc g2" style={{ marginTop: 20, justifyContent: "flex-end" }}>
                            <Button variant="outline" onClick={() => setPreview(null)}>Close</Button>
                            <Button><Download size={14} /> Download PDF</Button>
                        </div>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="fc g2"><Receipt size={18} /> Invoices</CardTitle>
                        <CardDescription>Generate, send, and track customer invoices</CardDescription>
                    </div>
                    <div className="fc g2" style={{ flexWrap: "wrap" }}>
                        {(["all", "paid", "pending", "overdue", "draft"] as const).map((s) => (
                            <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)", cursor: "pointer", fontWeight: 600, fontSize: 12, textTransform: "capitalize", background: filter === s ? "hsl(var(--primary))" : "var(--cd)", color: filter === s ? "#fff" : "var(--fg)" }}>{s}</button>
                        ))}
                        <Button size="sm"><Plus size={14} /> New Invoice</Button>
                    </div>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-3 pt-4 pl-5 font-semibold">Invoice</th>
                                    <th className="pb-3 pt-4 font-semibold">Customer</th>
                                    <th className="pb-3 pt-4 font-semibold">Plan</th>
                                    <th className="pb-3 pt-4 font-semibold">Amount</th>
                                    <th className="pb-3 pt-4 font-semibold">Issued</th>
                                    <th className="pb-3 pt-4 font-semibold">Due</th>
                                    <th className="pb-3 pt-4 font-semibold">Status</th>
                                    <th className="pb-3 pt-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((inv) => (
                                    <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-3 pl-5 font-mono font-semibold text-xs">{inv.id}</td>
                                        <td className="py-3">
                                            <div className="fc g2">
                                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: inv.color + "22", color: inv.color, fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{inv.avatar}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.customer}</div>
                                                    <div style={{ fontSize: 11, color: "var(--mt-fg)" }}>{inv.customerEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-muted-foreground">{inv.plan}</td>
                                        <td className="py-3 font-extrabold">${inv.amount.toFixed(2)}</td>
                                        <td className="py-3 text-muted-foreground text-xs">{inv.issuedAt}</td>
                                        <td className="py-3 text-muted-foreground text-xs">{inv.dueAt}</td>
                                        <td className="py-3">
                                            <Badge variant={STATUS_STYLES[inv.status].variant}>{STATUS_STYLES[inv.status].label}</Badge>
                                        </td>
                                        <td className="py-3">
                                            <div className="fc g1">
                                                <Button size="sm" variant="ghost" onClick={() => setPreview(inv)}><Eye size={13} /></Button>
                                                <Button size="sm" variant="ghost"><Download size={13} /></Button>
                                                {inv.status === "draft" && (
                                                    <Button size="sm" variant="ghost" onClick={() => send(inv.id)}><Send size={13} /></Button>
                                                )}
                                            </div>
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
