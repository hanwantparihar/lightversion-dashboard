"use client";
import { useState } from "react";
import {
    Globe, ShieldCheck, AlertTriangle, XCircle, Clock, Copy,
    Check, RefreshCw, Plus, Trash2, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input, Badge } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { TENANTS, WHITE_LABEL_CONFIGS, DEFAULT_WHITE_LABEL, type WhiteLabelConfig } from "@/lib/tenant-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

type DomainStatus = WhiteLabelConfig["domainStatus"];
type SslStatus = WhiteLabelConfig["sslStatus"];

const DOMAIN_META: Record<DomainStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    verified: { label: "Verified", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
    pending: { label: "Pending DNS", color: "#f59e0b", bg: "#f59e0b18", icon: Clock },
    failed: { label: "Failed", color: "#ef4444", bg: "#ef444418", icon: XCircle },
    none: { label: "Not set", color: "#94a3b8", bg: "#94a3b818", icon: Globe },
};

const SSL_META: Record<SslStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    active: { label: "SSL Active", color: "#10b981", icon: ShieldCheck },
    provisioning: { label: "Provisioning…", color: "#f59e0b", icon: Clock },
    failed: { label: "SSL Failed", color: "#ef4444", icon: XCircle },
    none: { label: "No SSL", color: "#94a3b8", icon: AlertTriangle },
};

const DNS_RECORDS = [
    { type: "CNAME", host: "@", value: "custom.nexora.ai", ttl: "3600" },
    { type: "TXT", host: "_vfy", value: "nexora-verify=abc123xyz", ttl: "300" },
];

export default function CustomDomainPage() {
    const [activeTenantId, setActiveTenantId] = useState(TENANTS[0].id);
    const [configs, setConfigs] = useState<Record<string, WhiteLabelConfig>>(
        Object.fromEntries(WHITE_LABEL_CONFIGS.map(c => [c.tenantId, c]))
    );
    const [newDomain, setNewDomain] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const tenant = TENANTS.find(t => t.id === activeTenantId)!;
    const cfg = configs[activeTenantId] ?? { ...DEFAULT_WHITE_LABEL, tenantId: activeTenantId };
    const dm = DOMAIN_META[cfg.domainStatus];
    const sm = SSL_META[cfg.sslStatus];
    const DmIcon = dm.icon;
    const SslIcon = sm.icon;

    function update<K extends keyof WhiteLabelConfig>(key: K, value: WhiteLabelConfig[K]) {
        setConfigs(p => ({ ...p, [activeTenantId]: { ...(p[activeTenantId] ?? { ...DEFAULT_WHITE_LABEL, tenantId: activeTenantId }), [key]: value } }));
    }

    function addDomain() {
        if (!newDomain.trim()) return;
        update("customDomain", newDomain.trim());
        update("domainStatus", "pending");
        update("sslStatus", "provisioning");
        setNewDomain("");
    }

    function verify() {
        setVerifying(true);
        setTimeout(() => {
            update("domainStatus", "verified");
            update("sslStatus", "active");
            setVerifying(false);
        }, 1800);
    }

    function removeDomain() {
        update("customDomain", "");
        update("domainStatus", "none");
        update("sslStatus", "none");
    }

    function copyRecord(val: string) {
        navigator.clipboard.writeText(val).catch(() => { });
        setCopied(val);
        setTimeout(() => setCopied(null), 1500);
    }

    // Stats
    const cfgs = Object.values(configs);
    const domainCounts = {
        verified: cfgs.filter(c => c.domainStatus === "verified").length,
        pending: cfgs.filter(c => c.domainStatus === "pending").length,
        failed: cfgs.filter(c => c.domainStatus === "failed").length,
        total: cfgs.filter(c => c.customDomain).length,
    };

    return (
        <PageStack>

            <StatsGrid stats={[
                { icon: Globe, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(domainCounts.total), label: "Domains Configured", change: "", up: true, spark: spC, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(domainCounts.verified), label: "Verified", change: "live", up: true, spark: spA, color: "#10b981" },
                { icon: Clock, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(domainCounts.pending), label: "Pending DNS", change: "", up: false, spark: spD, color: "#f59e0b" },
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: String(domainCounts.verified), label: "SSL Active", change: "HTTPS", up: true, spark: spB, color: "#7c3aed" },
            ]} />

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Tenant list */}
                <Card className="w-52 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Tenants</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {TENANTS.filter(t => t.plan !== "starter" && t.status !== "churned").map(t => {
                            const isA = t.id === activeTenantId;
                            const tc = configs[t.id] ?? DEFAULT_WHITE_LABEL;
                            const tdm = DOMAIN_META[tc.domainStatus];
                            return (
                                <button key={t.id} onClick={() => setActiveTenantId(t.id)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                        style={{ background: t.color + "22", color: t.color }}>{t.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] truncate" style={{ fontWeight: isA ? 700 : 400, color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>
                                            {t.name}
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <tdm.icon size={9} style={{ color: tdm.color }} />
                                            <span className="text-[10px]" style={{ color: tdm.color }}>{tdm.label}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Domain config */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                    {/* Current domain status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm"><Globe size={15} /> Domain Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cfg.customDomain ? (
                                <div className="flex flex-col gap-4">
                                    {/* Domain row */}
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ background: dm.bg }}>
                                                <DmIcon size={17} style={{ color: dm.color }} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm flex items-center gap-2">
                                                    {cfg.customDomain}
                                                    <a href={`https://${cfg.customDomain}`} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink size={12} className="text-muted-foreground" />
                                                    </a>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {cfg.domainStatus === "verified" ? "Domain is live and routing traffic" :
                                                        cfg.domainStatus === "pending" ? "Waiting for DNS propagation (up to 48h)" :
                                                            "DNS verification failed — check records"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                                style={{ background: dm.bg, color: dm.color }}>{dm.label}</span>
                                            {cfg.domainStatus !== "verified" && (
                                                <Button size="sm" variant="outline" onClick={verify} disabled={verifying}>
                                                    <RefreshCw size={13} className={verifying ? "animate-spin" : ""} />
                                                    {verifying ? "Verifying…" : "Verify now"}
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" onClick={removeDomain}>
                                                <Trash2 size={13} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* SSL status */}
                                    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                                        <SslIcon size={17} style={{ color: sm.color }} />
                                        <div>
                                            <div className="font-semibold text-sm">{sm.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {cfg.sslStatus === "active" ? "TLS certificate is valid and auto-renewing" :
                                                    cfg.sslStatus === "provisioning" ? "Let's Encrypt certificate is being issued…" :
                                                        "SSL provisioning failed — verify domain first"}
                                            </div>
                                        </div>
                                        <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                                            style={{ background: sm.color + "20", color: sm.color }}>
                                            {cfg.sslStatus}
                                        </span>
                                    </div>

                                    {/* Email domain */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Custom Email Domain</label>
                                        <div className="flex gap-2">
                                            <Input value={cfg.customEmailDomain} onChange={e => update("customEmailDomain", e.target.value)}
                                                placeholder="mail.yourco.com" className="flex-1" />
                                            <Button variant="outline">Verify SPF</Button>
                                        </div>
                                        {cfg.emailDomainStatus !== "none" && (
                                            <span className="text-xs font-semibold capitalize"
                                                style={{ color: cfg.emailDomainStatus === "verified" ? "#10b981" : "#f59e0b" }}>
                                                Email domain: {cfg.emailDomainStatus}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Add domain form */
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-muted-foreground">No custom domain configured for <strong>{tenant.name}</strong>.</p>
                                    <div className="flex gap-2">
                                        <Input value={newDomain} onChange={e => setNewDomain(e.target.value)}
                                            placeholder="app.yourco.com" className="flex-1"
                                            onKeyDown={e => e.key === "Enter" && addDomain()} />
                                        <Button onClick={addDomain} disabled={!newDomain.trim()}>
                                            <Plus size={14} /> Add Domain
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* DNS records */}
                    {cfg.customDomain && cfg.domainStatus !== "verified" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">DNS Records</CardTitle>
                                <CardDescription>Add these records at your domain registrar to verify ownership</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                {["Type", "Host", "Value", "TTL", ""].map(h => (
                                                    <th key={h} className="pb-3 pt-4 pl-5 font-semibold text-xs">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DNS_RECORDS.map((r, i) => (
                                                <tr key={i} className="border-b last:border-0">
                                                    <td className="py-3 pl-5">
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">{r.type}</span>
                                                    </td>
                                                    <td className="py-3 pl-5 font-mono text-xs">{r.host}</td>
                                                    <td className="py-3 pl-5 font-mono text-xs max-w-[240px] truncate">{r.value}</td>
                                                    <td className="py-3 pl-5 text-xs text-muted-foreground">{r.ttl}s</td>
                                                    <td className="py-3 pl-5">
                                                        <button onClick={() => copyRecord(r.value)}
                                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">
                                                            {copied === r.value ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                                                            {copied === r.value ? "Copied" : "Copy"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* All tenants overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">All Tenant Domains</CardTitle>
                            <CardDescription>Quick overview of domain status across tenants</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {TENANTS.filter(t => t.status !== "churned" && t.plan !== "starter").map(t => {
                                const tc = configs[t.id] ?? DEFAULT_WHITE_LABEL;
                                const tdm = DOMAIN_META[tc.domainStatus];
                                const tsl = SSL_META[tc.sslStatus];
                                const TdIcon = tdm.icon;
                                return (
                                    <div key={t.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0 border-border">
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                            style={{ background: t.color + "22", color: t.color }}>{t.avatar}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm">{t.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {tc.customDomain || "—"}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] font-bold flex items-center gap-1"
                                                style={{ color: tdm.color }}>
                                                <TdIcon size={11} />{tdm.label}
                                            </span>
                                            <span className="text-[11px] font-bold flex items-center gap-1"
                                                style={{ color: tsl.color }}>
                                                <tsl.icon size={11} />{tc.sslStatus === "active" ? "SSL ✓" : tsl.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageStack>
    );
}
