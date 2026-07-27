"use client";
import { useState } from "react";
import {
    Hash, Bell, CheckCircle2, XCircle, AlertCircle, Plus,
    ToggleLeft, ToggleRight, Send, Trash2, RefreshCw, Link2,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import {
    SLACK_WORKSPACES, SLACK_EVENTS, SLACK_NOTIF_LABELS,
    type SlackWorkspace, type ConnStatus,
} from "@/lib/integrations-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const STATUS_META: Record<ConnStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    connected: { label: "Connected", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
    disconnected: { label: "Disconnected", color: "#94a3b8", bg: "#94a3b818", icon: XCircle },
    error: { label: "Error", color: "#ef4444", bg: "#ef444418", icon: AlertCircle },
    pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b18", icon: RefreshCw },
};

const MSG_STATUS: Record<string, { color: string }> = {
    sent: { color: "#10b981" },
    failed: { color: "#ef4444" },
};

export default function SlackIntegrationPage() {
    const [workspaces, setWorkspaces] = useState(SLACK_WORKSPACES);
    const [active, setActive] = useState(SLACK_WORKSPACES[0].id);
    const [newChannel, setNewChannel] = useState("");
    const [testSent, setTestSent] = useState(false);

    const ws = workspaces.find(w => w.id === active)!;
    const sm = STATUS_META[ws.status];
    const Icon = sm.icon;

    function toggleNotif(key: string) {
        setWorkspaces(p => p.map(w => w.id !== active ? w : {
            ...w, notifications: { ...w.notifications, [key]: !w.notifications[key] },
        }));
    }

    function addChannel() {
        if (!newChannel.trim()) return;
        const ch = newChannel.trim().startsWith("#") ? newChannel.trim() : `#${newChannel.trim()}`;
        setWorkspaces(p => p.map(w => w.id !== active ? w : { ...w, channels: [...w.channels, ch] }));
        setNewChannel("");
    }

    function removeChannel(ch: string) {
        setWorkspaces(p => p.map(w => w.id !== active ? w : { ...w, channels: w.channels.filter(c => c !== ch) }));
    }

    function sendTest() {
        setTestSent(true);
        setTimeout(() => setTestSent(false), 2500);
    }

    const connected = workspaces.filter(w => w.status === "connected").length;
    const totalNotifs = Object.values(ws.notifications).filter(Boolean).length;

    return (
        <PageStack>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg" style={{ background: "#4a154b" }}>S</div>
                <div>
                    <h2 className="text-[22px] font-extrabold">Slack Integration</h2>
                    <p className="text-sm text-muted-foreground">Send real-time alerts and notifications to Slack channels</p>
                </div>
            </div>

            <StatsGrid stats={[
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(connected), label: "Connected", change: `${workspaces.length} total`, up: true, spark: spC, color: "#10b981" },
                { icon: Hash, grad: "linear-gradient(135deg,#4a154b,#7c3aed)", value: String(ws.channels.length), label: "Channels", change: "subscribed", up: true, spark: spA, color: "#7c3aed" },
                { icon: Bell, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(totalNotifs), label: "Active Alerts", change: `of ${Object.keys(ws.notifications).length}`, up: true, spark: spD, color: "#f59e0b" },
                { icon: Send, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(SLACK_EVENTS.filter(e => e.status === "sent").length), label: "Sent Today", change: "messages", up: true, spark: spB, color: "#2563eb" },
            ]} />

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Workspace list */}
                <Card className="w-56 shrink-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Workspaces</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {workspaces.map(w => {
                            const wsm = STATUS_META[w.status];
                            const isA = w.id === active;
                            return (
                                <button key={w.id} onClick={() => setActive(w.id)}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: "#4a154b" }}>S</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] truncate" style={{ fontWeight: isA ? 700 : 400, color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>{w.name}</div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: wsm.color }} />
                                            <span className="text-[10px]" style={{ color: wsm.color }}>{wsm.label}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                        <div className="px-4 py-3 border-t border-border">
                            <Button size="sm" variant="outline" className="w-full">
                                <Plus size={13} /> Connect Workspace
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    {/* Status card */}
                    <Card>
                        <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: sm.bg }}>
                                    <Icon size={18} style={{ color: sm.color }} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{ws.name} <span className="text-xs font-mono text-muted-foreground ml-1">{ws.teamId}</span></div>
                                    <div className="text-xs text-muted-foreground">Bot: {ws.botName} · Connected {ws.connectedAt}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                                {ws.status === "error" && <Button size="sm" variant="outline"><RefreshCw size={13} /> Reconnect</Button>}
                                {ws.status === "connected" && <Button size="sm" variant="outline"><Link2 size={13} /> Manage in Slack</Button>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Channels */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm"><Hash size={15} /> Channels</CardTitle>
                                <CardDescription>Notifications will be posted to these channels</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Input value={newChannel} onChange={e => setNewChannel(e.target.value)} placeholder="#channel-name"
                                        onKeyDown={e => e.key === "Enter" && addChannel()} />
                                    <Button size="sm" onClick={addChannel} disabled={!newChannel.trim()}>Add</Button>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    {ws.channels.length === 0
                                        ? <p className="text-xs text-muted-foreground">No channels added yet.</p>
                                        : ws.channels.map(ch => (
                                            <div key={ch} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted">
                                                <span className="text-sm font-mono font-semibold">{ch}</span>
                                                <button onClick={() => removeChannel(ch)} className="text-muted-foreground hover:text-destructive bg-transparent border-none cursor-pointer flex">
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm"><Bell size={15} /> Notification Events</CardTitle>
                                <CardDescription>Choose which events trigger a Slack message</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {Object.entries(SLACK_NOTIF_LABELS).map(([key, label]) => {
                                    const on = ws.notifications[key];
                                    return (
                                        <div key={key} className="flex items-center justify-between px-5 py-3 border-b last:border-0 border-border">
                                            <span className="text-sm font-medium">{label}</span>
                                            <button onClick={() => toggleNotif(key)}
                                                className="bg-transparent border-none cursor-pointer flex"
                                                style={{ color: on ? "#10b981" : "var(--mt-fg)" }}>
                                                {on ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            </button>
                                        </div>
                                    );
                                })}
                                <div className="px-5 py-3">
                                    <Button size="sm" variant="outline" className="w-full" onClick={sendTest} disabled={ws.status !== "connected"}>
                                        <Send size={13} /> {testSent ? "Test sent! ✓" : "Send test message"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Message log */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Recent Messages</CardTitle>
                            <CardDescription>Last 5 messages sent to Slack</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {SLACK_EVENTS.map(ev => {
                                const es = MSG_STATUS[ev.status] ?? { color: "#94a3b8" };
                                return (
                                    <div key={ev.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: es.color }} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-mono font-semibold text-xs text-muted-foreground">{ev.channel}</span>
                                                <span className="font-medium">{ev.message}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">Event: {ev.event}</div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-semibold capitalize" style={{ color: es.color }}>{ev.status}</span>
                                            <span className="text-xs text-muted-foreground">{ev.ts}</span>
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
