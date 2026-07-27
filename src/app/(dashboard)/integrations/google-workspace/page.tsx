"use client";
import { useState } from "react";
import {
    CheckCircle2, XCircle, RefreshCw, Plus, ToggleLeft, ToggleRight,
    ExternalLink, ShieldCheck, Calendar, Mail, FileText, Table, Video,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { GWORKSPACE_APPS, GWORKSPACE_EVENTS, type GWorkspaceApp, type ConnStatus } from "@/lib/integrations-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_META: Record<ConnStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    connected: { label: "Connected", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
    disconnected: { label: "Disconnected", color: "#94a3b8", bg: "#94a3b818", icon: XCircle },
    error: { label: "Error", color: "#ef4444", bg: "#ef444418", icon: XCircle },
    pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b18", icon: RefreshCw },
};

const APP_ICONS: Record<string, typeof Mail> = {
    Gmail: Mail, "Google Calendar": Calendar, "Google Drive": FileText,
    "Google Sheets": Table, "Google Meet": Video, "Google SSO": ShieldCheck,
};

export default function GoogleWorkspacePage() {
    const [apps, setApps] = useState(GWORKSPACE_APPS);
    const [active, setActive] = useState<GWorkspaceApp | null>(null);

    function toggleApp(id: string) {
        setApps(p => p.map(a => a.id !== id ? a : {
            ...a,
            status: a.status === "connected" ? "disconnected" : "connected",
        }));
    }

    const connected = apps.filter(a => a.status === "connected").length;

    return (
        <PageStack>
            {/* Scope detail overlay */}
            {active && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
                    style={{ background: "rgba(0,0,0,.45)" }} onClick={() => setActive(null)}>
                    <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold"
                                style={{ background: active.color }}>{active.icon}</div>
                            <div>
                                <div className="font-bold text-base">{active.name}</div>
                                <div className="text-xs text-muted-foreground">{active.description}</div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">OAuth Scopes</div>
                            {active.scopes.length === 0
                                ? <p className="text-sm text-muted-foreground">No scopes — not connected</p>
                                : active.scopes.map(s => (
                                    <div key={s} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                                        <ShieldCheck size={13} className="text-[#10b981] shrink-0" />
                                        <span className="font-mono text-xs">{s}</span>
                                    </div>
                                ))
                            }
                        </div>
                        {active.lastSync && (
                            <p className="text-xs text-muted-foreground mb-4">Last sync: {active.lastSync}</p>
                        )}
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => setActive(null)}>Close</Button>
                            {active.status === "connected"
                                ? <Button size="sm" variant="destructive" className="flex-1" onClick={() => { toggleApp(active.id); setActive(null); }}>Disconnect</Button>
                                : <Button size="sm" className="flex-1" onClick={() => { toggleApp(active.id); setActive(null); }}>Connect</Button>
                            }
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-sm"
                    style={{ background: "linear-gradient(135deg,#4285f4,#34a853)" }}>G</div>
                <div>
                    <h2 className="text-[22px] font-extrabold">Google Workspace</h2>
                    <p className="text-sm text-muted-foreground">Connect Gmail, Calendar, Drive, Sheets, Meet, and SSO</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm"><ExternalLink size={13} /> Google Console</Button>
                    <Button size="sm"><Plus size={13} /> Add App</Button>
                </div>
            </div>

            <StatsGrid stats={[
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#34a853,#1e7e34)", value: String(connected), label: "Connected Apps", change: `of ${apps.length}`, up: true, spark: spC, color: "#34a853" },
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#4285f4,#1967d2)", value: String(apps.filter(a => a.scopes.includes("openid")).length), label: "SSO Active", change: "Google sign-in", up: true, spark: spA, color: "#4285f4" },
                { icon: Mail, grad: "linear-gradient(135deg,#ea4335,#c5221f)", value: String(GWORKSPACE_EVENTS.filter(e => e.app === "Gmail").length), label: "Emails Sent", change: "today", up: true, spark: spD, color: "#ea4335" },
                { icon: RefreshCw, grad: "linear-gradient(135deg,#fbbc04,#f9a825)", value: String(apps.filter(a => a.lastSync).length), label: "Syncing", change: "live", up: true, spark: spB, color: "#fbbc04" },
            ]} />

            {/* App grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {apps.map(app => {
                    const sm = STATUS_META[app.status];
                    const SIcon = sm.icon;
                    const AppIcon = APP_ICONS[app.name] ?? ShieldCheck;
                    return (
                        <Card key={app.id} className="flex flex-col">
                            <CardContent className="pt-5 flex flex-col gap-4 flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0"
                                            style={{ background: app.color }}>
                                            <AppIcon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{app.name}</div>
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>
                                                {sm.label}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleApp(app.id)}
                                        className="bg-transparent border-none cursor-pointer flex shrink-0"
                                        style={{ color: app.status === "connected" ? "#10b981" : "var(--mt-fg)" }}>
                                        {app.status === "connected" ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                    </button>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{app.description}</p>

                                {/* Scopes preview */}
                                {app.scopes.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {app.scopes.slice(0, 2).map(s => (
                                            <span key={s} className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{s}</span>
                                        ))}
                                        {app.scopes.length > 2 && (
                                            <span className="text-[10px] text-muted-foreground">+{app.scopes.length - 2} more</span>
                                        )}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-1 border-t border-border">
                                    <div className="text-[11px] text-muted-foreground">
                                        {app.lastSync ? `Synced ${app.lastSync}` : `Connected ${app.connectedAt}`}
                                    </div>
                                    <button onClick={() => setActive(app)}
                                        className="text-[11px] font-semibold text-primary bg-transparent border-none cursor-pointer hover:underline">
                                        View scopes
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* OAuth config card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck size={15} /> OAuth Configuration</CardTitle>
                    <CardDescription>Credentials used for all Google Workspace integrations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Client ID", value: "782541023847-abc...apps.googleusercontent.com", mono: true },
                            { label: "Client Secret", value: "GOCSPX-••••••••••••••••", mono: true },
                            { label: "Redirect URI", value: "https://nexoraai.com/auth/google/callback", mono: true },
                            { label: "Auth Scope", value: "openid email profile gmail.send calendar.events drive.file", mono: false },
                        ].map(({ label, value, mono }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                                <div className={`px-3 py-2 rounded-lg bg-muted text-sm ${mono ? "font-mono" : ""} text-foreground truncate`}>{value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">Regenerate Secret</Button>
                        <Button size="sm" variant="outline"><ExternalLink size={13} /> Google Cloud Console</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Activity log */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                    <CardDescription>Latest events triggered by Google Workspace integrations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {GWORKSPACE_EVENTS.map(ev => {
                        const app = apps.find(a => a.name === ev.app);
                        return (
                            <div key={ev.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                                    style={{ background: app?.color ?? "#4285f4" }}>
                                    {app?.icon ?? "G"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-sm flex-wrap">
                                        <span className="font-semibold">{ev.app}</span>
                                        <span className="text-muted-foreground">{ev.event}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{ev.detail}</div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">{ev.ts}</span>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </PageStack>
    );
}
