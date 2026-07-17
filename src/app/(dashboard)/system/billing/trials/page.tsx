"use client";
import { useState } from "react";
import { FlaskConical, Mail, CheckCircle2, Clock, XCircle, ArrowRightCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { TRIAL_ACCOUNTS, type TrialAccount } from "@/lib/advanced-billing-data";
import { spA, spB, spC, spD } from "@/lib/data";

const STATUS_META: Record<TrialAccount["status"], { icon: typeof Clock; color: string; bg: string; label: string }> = {
    active: { icon: Clock, color: "#2563eb", bg: "#2563eb18", label: "Active" },
    expiring: { icon: Clock, color: "#f59e0b", bg: "#f59e0b18", label: "Expiring" },
    expired: { icon: XCircle, color: "#ef4444", bg: "#ef444418", label: "Expired" },
    converted: { icon: CheckCircle2, color: "#10b981", bg: "#10b98118", label: "Converted" },
};

export default function TrialSystemPage() {
    const [trials, setTrials] = useState(TRIAL_ACCOUNTS);
    const [filter, setFilter] = useState<"all" | TrialAccount["status"]>("all");

    const counts = {
        active: trials.filter((t) => t.status === "active").length,
        expiring: trials.filter((t) => t.status === "expiring").length,
        expired: trials.filter((t) => t.status === "expired").length,
        converted: trials.filter((t) => t.status === "converted").length,
    };

    const filtered = filter === "all" ? trials : trials.filter((t) => t.status === filter);

    function extend(id: string) {
        setTrials((p) => p.map((t) =>
            t.id === id ? { ...t, daysLeft: t.daysLeft + 7, status: "active" } : t
        ));
    }

    function convert(id: string) {
        setTrials((p) => p.map((t) =>
            t.id === id ? { ...t, status: "converted", convertedTo: t.plan, daysLeft: 0 } : t
        ));
    }

    return (
        <PageStack>
            <StatsGrid
                stats={[
                    { icon: FlaskConical, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(counts.active), label: "Active Trials", change: "this month", up: true, spark: spC, color: "#2563eb" },
                    { icon: Clock, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(counts.expiring), label: "Expiring Soon", change: "≤7 days", up: false, spark: spA, color: "#f59e0b" },
                    { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(counts.converted), label: "Converted", change: "all time", up: true, spark: spD, color: "#10b981" },
                    { icon: XCircle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(counts.expired), label: "Expired", change: "no action", up: false, spark: spB, color: "#ef4444" },
                ]}
            />

            {/* Filter */}
            <div className="fc g2" style={{ flexWrap: "wrap" }}>
                {(["all", "active", "expiring", "expired", "converted"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        style={{
                            padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)",
                            cursor: "pointer", fontWeight: 600, fontSize: 12, textTransform: "capitalize",
                            background: filter === s ? "hsl(var(--primary))" : "var(--cd)",
                            color: filter === s ? "#fff" : "var(--fg)",
                        }}
                    >{s}</button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="fc g2"><FlaskConical size={18} /> Trial Accounts</CardTitle>
                    <CardDescription>Monitor and act on trial users before they churn or convert</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    {filtered.map((t) => {
                        const m = STATUS_META[t.status];
                        const Icon = m.icon;
                        return (
                            <div
                                key={t.id}
                                className="fc g3"
                                style={{ padding: "16px 20px", borderBottom: "1px solid var(--bd)", alignItems: "center", flexWrap: "wrap" }}
                            >
                                {/* Avatar */}
                                <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: t.color + "22", color: t.color, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {t.avatar}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 160 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.customer}</div>
                                    <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>{t.email}</div>
                                    <div style={{ fontSize: 12, color: "var(--mt-fg)", marginTop: 3 }}>
                                        {t.plan} plan · Started {t.startedAt} · Ends {t.endsAt}
                                        {t.convertedTo && <span style={{ color: "#10b981", fontWeight: 700 }}> → Converted to {t.convertedTo}</span>}
                                    </div>
                                </div>

                                {/* Days left */}
                                {t.status !== "converted" && t.status !== "expired" && (
                                    <div style={{ textAlign: "center", minWidth: 72 }}>
                                        <div style={{ fontWeight: 800, fontSize: 22, color: m.color }}>{t.daysLeft}</div>
                                        <div style={{ fontSize: 11, color: "var(--mt-fg)", fontWeight: 600 }}>days left</div>
                                    </div>
                                )}

                                {/* Status badge */}
                                <span style={{ padding: "4px 12px", borderRadius: 20, background: m.bg, color: m.color, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                                    <Icon size={12} /> {m.label}
                                </span>

                                {/* Actions */}
                                <div className="fc g2">
                                    {(t.status === "active" || t.status === "expiring") && (
                                        <>
                                            <Button size="sm" variant="outline" onClick={() => extend(t.id)}>
                                                <Clock size={13} /> Extend 7d
                                            </Button>
                                            <Button size="sm" onClick={() => convert(t.id)}>
                                                <ArrowRightCircle size={13} /> Convert
                                            </Button>
                                        </>
                                    )}
                                    {t.status === "expired" && (
                                        <Button size="sm" variant="outline" onClick={() => extend(t.id)}>
                                            <Clock size={13} /> Reactivate
                                        </Button>
                                    )}
                                    <Button size="sm" variant="ghost">
                                        <Mail size={13} /> Email
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </PageStack>
    );
}
