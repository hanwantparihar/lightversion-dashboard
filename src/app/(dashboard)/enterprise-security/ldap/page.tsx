"use client";
import { useState } from "react";
import {
    Server, CheckCircle2, XCircle, AlertCircle, RefreshCw,
    Plus, Users, FolderOpen, ShieldCheck, ToggleLeft, ToggleRight, Copy, Check,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { LDAP_CONFIGS, type LdapConfig } from "@/lib/enterprise-security-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_META = {
    connected: { color: "#10b981", bg: "#10b98118", label: "Connected", icon: CheckCircle2 },
    disconnected: { color: "#94a3b8", bg: "#94a3b818", label: "Disconnected", icon: XCircle },
    error: { color: "#ef4444", bg: "#ef444418", label: "Error", icon: AlertCircle },
};

export default function LdapPage() {
    const [configs, setConfigs] = useState(LDAP_CONFIGS);
    const [active, setActive] = useState<LdapConfig>(LDAP_CONFIGS[0]);
    const [syncing, setSyncing] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [showNew, setShowNew] = useState(false);

    function sync() {
        setSyncing(true);
        setTimeout(() => setSyncing(false), 1800);
    }

    function copy(val: string) {
        navigator.clipboard.writeText(val).catch(() => { });
        setCopied(val); setTimeout(() => setCopied(null), 1500);
    }

    const sm = STATUS_META[active.status];
    const SIcon = sm.icon;
    const connected = configs.filter(c => c.status === "connected").length;
    const totalUsers = configs.reduce((s, c) => s + c.syncedUsers, 0);

    return (
        <PageStack>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">LDAP Support</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Connect Active Directory and OpenLDAP for centralised user sync</p>
                </div>
                <Button onClick={() => setShowNew(v => !v)}><Plus size={14} /> Add LDAP</Button>
            </div>

            <StatsGrid stats={[
                { icon: Server, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(configs.length), label: "Directories", change: `${connected} connected`, up: true, spark: spC, color: "#2563eb" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(connected), label: "Connected", change: "", up: true, spark: spA, color: "#10b981" },
                { icon: Users, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: totalUsers.toLocaleString(), label: "Synced Users", change: "all directories", up: true, spark: spD, color: "#7c3aed" },
                { icon: FolderOpen, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(configs.reduce((s, c) => s + c.syncedGroups, 0)), label: "Synced Groups", change: "", up: true, spark: spB, color: "#f59e0b" },
            ]} />

            {showNew && (
                <Card>
                    <CardHeader><CardTitle className="text-sm">New LDAP / AD Connection</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {[["Name", "e.g. Acme Corp AD"], ["Host", "ldap.example.com"], ["Bind DN", "cn=svc,dc=example,dc=com"], ["Base DN", "dc=example,dc=com"], ["User Filter", "(objectClass=person)"], ["Group Filter", "(objectClass=group)"]].map(([label, ph]) => (
                            <div key={label} className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                                <Input placeholder={ph} className="text-xs font-mono" />
                            </div>
                        ))}
                        <div className="col-span-2 flex gap-2">
                            <Input type="password" placeholder="Bind password" className="text-xs font-mono flex-1" />
                            <div className="flex items-center gap-2 px-3 rounded-lg border border-border bg-card">
                                <span className="text-xs font-semibold">SSL/TLS</span>
                                <ToggleRight size={22} className="text-[#10b981]" />
                            </div>
                        </div>
                        <div className="col-span-2 flex gap-2">
                            <Button>Connect</Button>
                            <Button variant="outline">Test Connection</Button>
                            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Directory list */}
                <Card className="w-60 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Directories</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {configs.map(c => {
                            const csm = STATUS_META[c.status];
                            const CIcon = csm.icon;
                            const isA = c.id === active.id;
                            return (
                                <button key={c.id} onClick={() => setActive(c)}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}>
                                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Server size={14} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] truncate" style={{ fontWeight: isA ? 700 : 400, color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>{c.name}</div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <CIcon size={9} style={{ color: csm.color }} />
                                            <span className="text-[10px]" style={{ color: csm.color }}>{csm.label}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Config detail */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    {/* Status banner */}
                    <Card>
                        <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: sm.bg }}>
                                    <SIcon size={18} style={{ color: sm.color }} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{active.name}</div>
                                    <div className="text-xs text-muted-foreground">{active.host}:{active.port} {active.ssl && "· SSL/TLS"} · {active.tenant}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-xs text-right text-muted-foreground">
                                    <div>Last sync: {active.lastSync}</div>
                                    <div>{active.syncedUsers} users · {active.syncedGroups} groups</div>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                                <Button size="sm" variant="outline" onClick={sync} disabled={syncing}>
                                    <RefreshCw size={13} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing…" : "Sync Now"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fields */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Directory Configuration</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Host", value: `${active.host}:${active.port}` },
                                { label: "Bind DN", value: active.bindDn },
                                { label: "Base DN", value: active.baseDn },
                                { label: "User Filter", value: active.userFilter },
                                { label: "Group Filter", value: active.groupFilter },
                                { label: "SSL/TLS", value: active.ssl ? "Enabled" : "Disabled" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-3 py-2 rounded-lg bg-muted font-mono text-xs">{value}</div>
                                        <button onClick={() => copy(value)} className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer flex shrink-0">
                                            {copied === value ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Sync stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Synced Users", value: active.syncedUsers, icon: Users, color: "#2563eb" },
                            { label: "Synced Groups", value: active.syncedGroups, icon: FolderOpen, color: "#7c3aed" },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <Card key={label}>
                                <CardContent className="pt-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "18" }}>
                                        <Icon size={18} style={{ color }} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-extrabold">{value.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">{label}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit Configuration</Button>
                        {active.status === "error" && <Button size="sm" variant="outline"><RefreshCw size={13} /> Reconnect</Button>}
                        <Button size="sm" variant="destructive" className="ml-auto">Remove Directory</Button>
                    </div>
                </div>
            </div>
        </PageStack>
    );
}
