"use client";
import { useState } from "react";
import {
    KeyRound, CheckCircle2, XCircle, AlertCircle, Clock,
    Copy, Check, RefreshCw, Plus, ExternalLink, ShieldCheck,
    Globe, Users,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { SSO_PROVIDERS, SSO_SESSIONS, type SsoProvider, type SsoStatus } from "@/lib/enterprise-security-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_META: Record<SsoStatus, { color: string; bg: string; label: string; icon: typeof CheckCircle2 }> = {
    active: { color: "#10b981", bg: "#10b98118", label: "Active", icon: CheckCircle2 },
    inactive: { color: "#94a3b8", bg: "#94a3b818", label: "Inactive", icon: XCircle },
    error: { color: "#ef4444", bg: "#ef444418", label: "Error", icon: AlertCircle },
    pending: { color: "#f59e0b", bg: "#f59e0b18", label: "Pending", icon: Clock },
};

const PROTO_COLORS: Record<string, string> = {
    "SAML 2.0": "#7c3aed", "OIDC": "#2563eb", "OAuth 2.0": "#10b981",
};

export default function SsoPage() {
    const [providers] = useState(SSO_PROVIDERS);
    const [selected, setSelected] = useState<SsoProvider | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    function copy(val: string) {
        navigator.clipboard.writeText(val).catch(() => { });
        setCopied(val); setTimeout(() => setCopied(null), 1500);
    }

    const active = providers.filter(p => p.status === "active").length;
    const totalLogins = providers.reduce((s, p) => s + p.totalLogins, 0);

    return (
        <PageStack>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">SSO Login</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Configure SAML 2.0 and OIDC identity providers for enterprise single sign-on</p>
                </div>
                <Button><Plus size={14} /> Add Provider</Button>
            </div>

            <StatsGrid stats={[
                { icon: KeyRound, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(providers.length), label: "Providers", change: `${active} active`, up: true, spark: spC, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(active), label: "Active", change: "", up: true, spark: spA, color: "#10b981" },
                { icon: Users, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: SSO_SESSIONS.filter(s => s.active).length.toString(), label: "Active Sessions", change: "now", up: true, spark: spD, color: "#7c3aed" },
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: totalLogins.toLocaleString(), label: "Total Logins", change: "all time", up: true, spark: spB, color: "#f59e0b" },
            ]} />

            {/* Provider cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {providers.map(p => {
                    const sm = STATUS_META[p.status];
                    const SIcon = sm.icon;
                    return (
                        <Card key={p.id} className="flex flex-col">
                            <CardContent className="pt-5 flex flex-col gap-3 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shrink-0"
                                            style={{ background: p.color }}>{p.icon}</div>
                                        <div>
                                            <div className="font-bold text-sm">{p.name}</div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: PROTO_COLORS[p.protocol] + "20", color: PROTO_COLORS[p.protocol] }}>{p.protocol}</span>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <SIcon size={16} style={{ color: sm.color }} className="shrink-0 mt-1" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div><span className="text-muted-foreground">Tenants: </span><span className="font-semibold">{p.tenants}</span></div>
                                    <div><span className="text-muted-foreground">Logins: </span><span className="font-semibold">{p.totalLogins.toLocaleString()}</span></div>
                                    <div><span className="text-muted-foreground">Cert expiry: </span><span className={`font-semibold ${p.certExpiry === "Expired" ? "text-destructive" : ""}`}>{p.certExpiry}</span></div>
                                    <div><span className="text-muted-foreground">Last: </span><span className="font-semibold">{p.lastLogin}</span></div>
                                </div>

                                <div className="flex gap-2 mt-auto pt-1 border-t border-border">
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(p)}>Configure</Button>
                                    {p.status === "error" && <Button size="sm" variant="outline"><RefreshCw size={13} /></Button>}
                                    {p.status === "active" && <Button size="sm" variant="outline"><ExternalLink size={13} /></Button>}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Config detail */}
            {selected && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px]" style={{ background: selected.color }}>{selected.icon}</div>
                                {selected.name} — Configuration
                            </CardTitle>
                            <CardDescription>{selected.protocol} provider settings</CardDescription>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>✕</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "IdP Entity ID / Issuer", value: selected.idpEntityId },
                                { label: "ACS / Callback URL", value: selected.acsUrl },
                                { label: "Metadata URL", value: selected.metadataUrl },
                                { label: "Certificate Expiry", value: selected.certExpiry },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-3 py-2 rounded-lg bg-muted font-mono text-xs truncate">{value || "—"}</div>
                                        {value && (
                                            <button onClick={() => copy(value)} className="shrink-0 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer flex">
                                                {copied === value ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm">Save</Button>
                            <Button size="sm" variant="outline">Test Connection</Button>
                            <Button size="sm" variant="outline"><ExternalLink size={13} /> IdP Docs</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Active sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2"><Users size={15} /> Active SSO Sessions</CardTitle>
                    <CardDescription>Currently authenticated users via SSO</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {SSO_SESSIONS.map(s => (
                        <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 border-b last:border-0 border-border flex-wrap">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0">{s.avatar}</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">{s.user}</div>
                                <div className="text-xs text-muted-foreground">{s.email} · {s.provider} · {s.location}</div>
                            </div>
                            <div className="text-xs text-muted-foreground text-right shrink-0">
                                <div>Login: {s.loginAt}</div>
                                <div>Expires: {s.expiresAt}</div>
                            </div>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${s.active ? "bg-[#10b98118] text-[#10b981]" : "bg-muted text-muted-foreground"}`}>
                                {s.active ? "Active" : "Expired"}
                            </span>
                            {s.active && <Button size="sm" variant="ghost" className="h-7 text-xs shrink-0">Revoke</Button>}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </PageStack>
    );
}
