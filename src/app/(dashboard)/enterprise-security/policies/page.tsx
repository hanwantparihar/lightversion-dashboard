"use client";
import { useState } from "react";
import {
    ShieldCheck, ToggleLeft, ToggleRight, AlertTriangle,
    CheckCircle2, Info, Save, RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { SECURITY_POLICIES, type SecurityPolicy } from "@/lib/enterprise-security-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const SEV_META: Record<SecurityPolicy["severity"], { color: string; bg: string; icon: typeof Info }> = {
    critical: { color: "#ef4444", bg: "#ef444418", icon: AlertTriangle },
    high: { color: "#f59e0b", bg: "#f59e0b18", icon: AlertTriangle },
    medium: { color: "#2563eb", bg: "#2563eb18", icon: Info },
    low: { color: "#94a3b8", bg: "#94a3b818", icon: Info },
};

export default function SecurityPoliciesPage() {
    const [policies, setPolicies] = useState(SECURITY_POLICIES);
    const [saved, setSaved] = useState(false);

    function togglePolicy(id: string) {
        setPolicies(p => p.map(pol => pol.id === id ? { ...pol, enabled: !pol.enabled } : pol));
    }

    function updateValue(id: string, value: string) {
        setPolicies(p => p.map(pol => pol.id === id ? { ...pol, value } : pol));
    }

    function save() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    const enabledCount = policies.filter(p => p.enabled).length;
    const criticalCount = policies.filter(p => p.severity === "critical" && p.enabled).length;
    const totalCritical = policies.filter(p => p.severity === "critical").length;
    const categories = Array.from(new Set(policies.map(p => p.category)));

    return (
        <PageStack>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">Security Policies</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Configure platform-wide security rules for passwords, MFA, sessions, and data</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPolicies(SECURITY_POLICIES)}>
                        <RefreshCw size={13} /> Reset Defaults
                    </Button>
                    <Button onClick={save}>
                        {saved ? <><CheckCircle2 size={13} /> Saved</> : <><Save size={13} /> Save Policies</>}
                    </Button>
                </div>
            </div>

            <StatsGrid stats={[
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(enabledCount), label: "Policies Enabled", change: `of ${policies.length}`, up: true, spark: spC, color: "#10b981" },
                { icon: AlertTriangle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(criticalCount), label: "Critical Active", change: `of ${totalCritical}`, up: true, spark: spA, color: "#ef4444" },
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(categories.length), label: "Categories", change: "configured", up: true, spark: spD, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: `${Math.round((enabledCount / policies.length) * 100)}%`, label: "Coverage", change: "overall", up: true, spark: spB, color: "#7c3aed" },
            ]} />

            {categories.map(cat => {
                const catPolicies = policies.filter(p => p.category === cat);
                const catEnabled = catPolicies.filter(p => p.enabled).length;
                return (
                    <Card key={cat}>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <ShieldCheck size={15} className="text-primary" />
                                    {cat}
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">{catEnabled}/{catPolicies.length} enabled</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {catPolicies.map(pol => {
                                const sm = SEV_META[pol.severity];
                                const SIcon = sm.icon;
                                return (
                                    <div key={pol.id} className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-border flex-wrap">
                                        {/* Severity dot */}
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: sm.bg }}>
                                            <SIcon size={15} style={{ color: sm.color }} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                                {pol.name}
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize"
                                                    style={{ background: sm.bg, color: sm.color }}>{pol.severity}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{pol.description}</div>
                                        </div>

                                        {/* Value selector (if applicable) */}
                                        {pol.options && pol.enabled && (
                                            <select
                                                value={pol.value}
                                                onChange={e => updateValue(pol.id, e.target.value)}
                                                className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold shrink-0"
                                            >
                                                {pol.options.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        )}

                                        {/* Toggle */}
                                        <button
                                            onClick={() => togglePolicy(pol.id)}
                                            className="bg-transparent border-none cursor-pointer flex shrink-0"
                                            style={{ color: pol.enabled ? "#10b981" : "var(--mt-fg)" }}
                                        >
                                            {pol.enabled ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Save footer */}
            <div className="flex justify-end gap-2 pb-2">
                <Button variant="outline" onClick={() => setPolicies(SECURITY_POLICIES)}>
                    <RefreshCw size={13} /> Reset Defaults
                </Button>
                <Button onClick={save}>
                    {saved ? <><CheckCircle2 size={13} /> Saved!</> : <><Save size={13} /> Save Policies</>}
                </Button>
            </div>
        </PageStack>
    );
}
