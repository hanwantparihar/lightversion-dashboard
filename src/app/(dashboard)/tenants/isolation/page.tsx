"use client";
import { useState } from "react";
import {
    ShieldCheck, Database, Globe, Key, Lock, CheckCircle2,
    AlertTriangle, Server, Network, ToggleLeft, ToggleRight,
} from "lucide-react";
import {
    Card, CardHeader, CardContent, CardTitle, CardDescription, Button,
} from "@/components/ui";
import { PageStack } from "@/components";
import { TENANTS } from "@/lib/tenant-data";

type IsolationConfig = {
    dbIsolation: "shared" | "schema" | "dedicated";
    storageIsolation: "shared" | "dedicated";
    networkPolicy: boolean;
    customDomain: boolean;
    ssoEnabled: boolean;
    auditLogging: boolean;
    dataResidency: string;
    encryptionAtRest: boolean;
};

const TENANT_CONFIGS: Record<string, IsolationConfig> = {
    t1: { dbIsolation: "dedicated", storageIsolation: "dedicated", networkPolicy: true, customDomain: true, ssoEnabled: true, auditLogging: true, dataResidency: "US East", encryptionAtRest: true },
    t2: { dbIsolation: "schema", storageIsolation: "shared", networkPolicy: false, customDomain: false, ssoEnabled: false, auditLogging: true, dataResidency: "EU West", encryptionAtRest: true },
    t3: { dbIsolation: "dedicated", storageIsolation: "dedicated", networkPolicy: true, customDomain: true, ssoEnabled: true, auditLogging: true, dataResidency: "Asia Pacific", encryptionAtRest: true },
    t7: { dbIsolation: "schema", storageIsolation: "shared", networkPolicy: true, customDomain: true, ssoEnabled: true, auditLogging: true, dataResidency: "US East", encryptionAtRest: true },
    t8: { dbIsolation: "dedicated", storageIsolation: "dedicated", networkPolicy: true, customDomain: true, ssoEnabled: false, auditLogging: true, dataResidency: "Asia Pacific", encryptionAtRest: true },
    t10: { dbIsolation: "schema", storageIsolation: "shared", networkPolicy: false, customDomain: false, ssoEnabled: false, auditLogging: false, dataResidency: "US West", encryptionAtRest: false },
};

const DEFAULT_CONFIG: IsolationConfig = {
    dbIsolation: "shared", storageIsolation: "shared", networkPolicy: false,
    customDomain: false, ssoEnabled: false, auditLogging: false,
    dataResidency: "US East", encryptionAtRest: false,
};

const DB_ISOLATION_LABELS = {
    shared: { label: "Shared DB", desc: "Row-level isolation via tenant_id", color: "#f59e0b", risk: "medium" },
    schema: { label: "Schema isolation", desc: "Separate schema per tenant", color: "#2563eb", risk: "low" },
    dedicated: { label: "Dedicated DB", desc: "Own database instance", color: "#10b981", risk: "none" },
};

const REGIONS = ["US East", "US West", "EU West", "EU Central", "Asia Pacific", "AU East"];

export default function WorkspaceIsolationPage() {
    const [activeTenant, setActiveTenant] = useState(TENANTS[0].id);
    const [configs, setConfigs] = useState<Record<string, IsolationConfig>>(TENANT_CONFIGS);

    const tenant = TENANTS.find(t => t.id === activeTenant)!;
    const cfg = configs[activeTenant] ?? DEFAULT_CONFIG;

    function update<K extends keyof IsolationConfig>(key: K, value: IsolationConfig[K]) {
        setConfigs(p => ({ ...p, [activeTenant]: { ...(p[activeTenant] ?? DEFAULT_CONFIG), [key]: value } }));
    }

    const toggles: { key: keyof IsolationConfig; label: string; desc: string; icon: typeof Lock; planRequired?: string }[] = [
        { key: "networkPolicy", label: "Network Policy", desc: "Restrict inter-tenant network traffic", icon: Network },
        { key: "customDomain", label: "Custom Domain", desc: "Serve tenant on their own subdomain", icon: Globe, planRequired: "pro" },
        { key: "ssoEnabled", label: "SSO / SAML", desc: "Enterprise single sign-on via Okta/Azure", icon: Key, planRequired: "enterprise" },
        { key: "auditLogging", label: "Audit Logging", desc: "Full event log for compliance", icon: ShieldCheck },
        { key: "encryptionAtRest", label: "Encryption at Rest", desc: "AES-256 encryption for stored data", icon: Lock },
    ];

    const isolationScore = [
        cfg.dbIsolation !== "shared",
        cfg.storageIsolation === "dedicated",
        cfg.networkPolicy,
        cfg.auditLogging,
        cfg.encryptionAtRest,
        cfg.ssoEnabled,
    ].filter(Boolean).length;

    return (
        <PageStack>

            <div className="flex flex-col lg:flex-row gap-5 items-start">
                {/* Tenant list */}
                <Card className="w-full lg:w-56 shrink-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Select Tenant</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1">
                            {TENANTS.filter(t => t.status !== "churned").map(t => (
                                <button key={t.id} onClick={() => setActiveTenant(t.id)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors border-none"
                                    style={{ background: activeTenant === t.id ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (activeTenant !== t.id) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (activeTenant !== t.id) e.currentTarget.style.background = "transparent"; }}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                        style={{ background: t.color + "22", color: t.color }}>{t.avatar}</div>
                                    <span className="text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap"
                                        style={{ color: activeTenant === t.id ? "hsl(var(--primary))" : "var(--fg)", fontWeight: activeTenant === t.id ? 700 : 400 }}>
                                        {t.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Config panel */}
                <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
                    {/* Score banner */}
                    <Card>
                        <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg"
                                    style={{
                                        background: isolationScore >= 5 ? "#10b98120" : isolationScore >= 3 ? "#f59e0b20" : "#ef444420",
                                        color: isolationScore >= 5 ? "#10b981" : isolationScore >= 3 ? "#f59e0b" : "#ef4444"
                                    }}>
                                    {isolationScore}/6
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Isolation Score</div>
                                    <div className="text-xs text-muted-foreground">
                                        {isolationScore >= 5 ? "Excellent — enterprise-grade" : isolationScore >= 3 ? "Moderate — consider improvements" : "Low — review security settings"}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">Tenant:</span>
                                <span className="font-bold text-sm">{tenant.name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full capitalize font-bold"
                                    style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>
                                    {tenant.plan}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* DB Isolation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm"><Database size={16} /> Database Isolation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {(Object.entries(DB_ISOLATION_LABELS) as [IsolationConfig["dbIsolation"], typeof DB_ISOLATION_LABELS[keyof typeof DB_ISOLATION_LABELS]][]).map(([key, meta]) => (
                                    <button key={key} onClick={() => update("dbIsolation", key)}
                                        className="text-left p-4 rounded-xl border-2 transition-all cursor-pointer"
                                        style={{ borderColor: cfg.dbIsolation === key ? meta.color : "var(--bd)", background: cfg.dbIsolation === key ? meta.color + "12" : "transparent" }}>
                                        <div className="font-bold text-[13px] mb-1" style={{ color: cfg.dbIsolation === key ? meta.color : "var(--fg)" }}>{meta.label}</div>
                                        <div className="text-xs text-muted-foreground mb-2">{meta.desc}</div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                                            style={{ background: meta.color + "22", color: meta.color }}>
                                            Risk: {meta.risk}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Storage + Data Residency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Server size={16} /> Storage Isolation</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    {(["shared", "dedicated"] as const).map(opt => (
                                        <button key={opt} onClick={() => update("storageIsolation", opt)}
                                            className="flex-1 py-3 rounded-xl border-2 font-semibold text-[13px] capitalize cursor-pointer transition-all"
                                            style={{ borderColor: cfg.storageIsolation === opt ? "hsl(var(--primary))" : "var(--bd)", background: cfg.storageIsolation === opt ? "hsl(var(--primary)/0.1)" : "transparent", color: cfg.storageIsolation === opt ? "hsl(var(--primary))" : "var(--fg)" }}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Globe size={16} /> Data Residency</CardTitle></CardHeader>
                            <CardContent>
                                <select value={cfg.dataResidency} onChange={e => update("dataResidency", e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground text-sm">
                                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toggle features */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Security Features</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            {toggles.map((t, i) => {
                                const Icon = t.icon;
                                const on = cfg[t.key] as boolean;
                                return (
                                    <div key={t.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b last:border-0 border-border">
                                        <div className="flex items-center gap-3">
                                            <Icon size={16} className="text-muted-foreground shrink-0" />
                                            <div>
                                                <div className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                                                    {t.label}
                                                    {t.planRequired && (
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{t.planRequired}+</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{t.desc}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => update(t.key, !on)} className="bg-transparent border-none cursor-pointer flex shrink-0"
                                            style={{ color: on ? "#10b981" : "var(--mt-fg)" }}>
                                            {on ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">Reset to defaults</Button>
                        <Button className="w-full sm:w-auto">Save configuration</Button>
                    </div>
                </div>
            </div>
        </PageStack>
    );
}
