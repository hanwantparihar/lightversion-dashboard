"use client";
import { useState } from "react";
import {
    FlaskConical, RefreshCw, Trash2, Play, CheckCircle2,
    XCircle, Clock, Database, Users, Receipt, Webhook,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Badge } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { spA, spB, spC, spD } from "@/lib/data";

type SandboxEvent = {
    id: string;
    type: string;
    payload: string;
    status: "success" | "error" | "pending";
    ts: string;
};

type SandboxStat = { label: string; value: number; color: string };

const SEED_EVENTS: SandboxEvent[] = [
    { id: "se1", type: "user.created", payload: '{"id":"u_test_01","email":"sandbox@test.com","role":"editor"}', status: "success", ts: "09:02:14" },
    { id: "se2", type: "invoice.paid", payload: '{"invoice":"INV-TEST-001","amount":129,"currency":"USD"}', status: "success", ts: "09:03:01" },
    { id: "se3", type: "webhook.fire", payload: '{"url":"https://hook.test","event":"user.created","attempt":1}', status: "error", ts: "09:03:45" },
    { id: "se4", type: "trial.started", payload: '{"customer":"Acme Test","plan":"Pro","days":14}', status: "success", ts: "09:04:10" },
];

const SCENARIOS = [
    { id: "s1", icon: Users, label: "Seed test users", desc: "Creates 5 sandbox users with mixed roles", color: "#2563eb" },
    { id: "s2", icon: Receipt, label: "Generate invoices", desc: "Creates paid, pending, and overdue invoices", color: "#10b981" },
    { id: "s3", icon: Webhook, label: "Fire webhook events", desc: "Dispatches all event types to your test endpoint", color: "#7c3aed" },
    { id: "s4", icon: Clock, label: "Simulate trial expiry", desc: "Sets 2 trial accounts to expiring state", color: "#f59e0b" },
    { id: "s5", icon: Database, label: "Reset sandbox data", desc: "Clears all sandbox records and starts fresh", color: "#ef4444" },
];

const STATUS_STYLE: Record<SandboxEvent["status"], { color: string; bg: string; icon: typeof CheckCircle2 }> = {
    success: { color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
    error: { color: "#ef4444", bg: "#ef444418", icon: XCircle },
    pending: { color: "#f59e0b", bg: "#f59e0b18", icon: Clock },
};

export default function SandboxPage() {
    const [events, setEvents] = useState<SandboxEvent[]>(SEED_EVENTS);
    const [running, setRunning] = useState<string | null>(null);
    const [cleared, setCleared] = useState(false);

    const stats: SandboxStat[] = [
        { label: "Total Events", value: events.length, color: "#2563eb" },
        { label: "Successful", value: events.filter((e) => e.status === "success").length, color: "#10b981" },
        { label: "Errors", value: events.filter((e) => e.status === "error").length, color: "#ef4444" },
        { label: "Pending", value: events.filter((e) => e.status === "pending").length, color: "#f59e0b" },
    ];

    function runScenario(id: string) {
        if (running) return;
        setRunning(id);

        setTimeout(() => {
            const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const newEvents: SandboxEvent[] = [];

            if (id === "s1") {
                ["alice", "bob", "cara", "dan", "eve"].forEach((n, i) => {
                    newEvents.push({ id: `se${Date.now()}-${i}`, type: "user.created", payload: `{"email":"${n}.sandbox@test.com","role":"editor"}`, status: "success", ts: now });
                });
            } else if (id === "s2") {
                [["paid", "success"], ["pending", "pending"], ["overdue", "error"]].forEach(([status, ev], i) => {
                    newEvents.push({ id: `se${Date.now()}-${i}`, type: "invoice.generated", payload: `{"status":"${status}","amount":${129 + i * 50}}`, status: ev as SandboxEvent["status"], ts: now });
                });
            } else if (id === "s3") {
                ["user.created", "invoice.paid", "trial.expired"].forEach((type, i) => {
                    newEvents.push({ id: `se${Date.now()}-${i}`, type: "webhook.fire", payload: `{"event":"${type}","attempt":1}`, status: i === 1 ? "error" : "success", ts: now });
                });
            } else if (id === "s4") {
                [1, 2].forEach((n, i) => {
                    newEvents.push({ id: `se${Date.now()}-${i}`, type: "trial.expiring", payload: `{"customer":"Test Corp ${n}","daysLeft":2}`, status: "pending", ts: now });
                });
            } else if (id === "s5") {
                setEvents([]);
                setRunning(null);
                return;
            }

            setEvents((p) => [...newEvents.reverse(), ...p]);
            setRunning(null);
        }, 600);
    }

    function clearLog() {
        setEvents([]);
        setCleared(true);
        setTimeout(() => setCleared(false), 2000);
    }

    return (
        <PageStack>
            <div className="fb">
                <div style={{ padding: "5px 14px", borderRadius: 8, background: "#f59e0b20", color: "#f59e0b", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <FlaskConical size={14} /> SANDBOX MODE
                </div>
            </div>

            <StatsGrid
                stats={stats.map((s, i) => ({
                    icon: FlaskConical,
                    grad: `linear-gradient(135deg,${s.color},${s.color}cc)`,
                    value: String(s.value),
                    label: s.label,
                    change: "sandbox",
                    up: true,
                    spark: [spC, spA, spD, spB][i],
                    color: s.color,
                }))}
            />

            <div className="gr g-31 g2">
                {/* Scenarios */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Scenarios</CardTitle>
                        <CardDescription>Run pre-built scenarios to populate sandbox data</CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: 0 }}>
                        {SCENARIOS.map((sc) => {
                            const Icon = sc.icon;
                            const isRunning = running === sc.id;
                            return (
                                <div key={sc.id} className="fb" style={{ padding: "14px 20px", borderBottom: "1px solid var(--bd)", alignItems: "center" }}>
                                    <div className="fc g3">
                                        <div style={{ width: 38, height: 38, borderRadius: 9, background: sc.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Icon size={17} style={{ color: sc.color }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{sc.label}</div>
                                            <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>{sc.desc}</div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={sc.id === "s5" ? "destructive" : "outline"}
                                        onClick={() => runScenario(sc.id)}
                                        disabled={!!running}
                                    >
                                        {isRunning ? <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={13} />}
                                        {isRunning ? "Running…" : "Run"}
                                    </Button>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Event log */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                        <div>
                            <CardTitle>Event Log</CardTitle>
                            <CardDescription>{events.length} sandbox event{events.length !== 1 ? "s" : ""}</CardDescription>
                        </div>
                        <Button size="sm" variant="ghost" onClick={clearLog}>
                            <Trash2 size={13} /> {cleared ? "Cleared" : "Clear"}
                        </Button>
                    </CardHeader>
                    <CardContent style={{ padding: 0, maxHeight: 420, overflowY: "auto" }}>
                        {events.length === 0 ? (
                            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--mt-fg)", fontSize: 13 }}>
                                No events yet. Run a scenario to generate sandbox data.
                            </div>
                        ) : (
                            events.map((ev) => {
                                const s = STATUS_STYLE[ev.status];
                                const Icon = s.icon;
                                return (
                                    <div key={ev.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--bd)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                                        <Icon size={15} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="fc g2" style={{ marginBottom: 3 }}>
                                                <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{ev.type}</span>
                                                <span style={{ padding: "1px 7px", borderRadius: 20, background: s.bg, color: s.color, fontSize: 10, fontWeight: 700 }}>{ev.status}</span>
                                            </div>
                                            <pre style={{ margin: 0, fontSize: 11, color: "var(--mt-fg)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {ev.payload}
                                            </pre>
                                        </div>
                                        <span style={{ fontSize: 11, color: "var(--mt-fg)", flexShrink: 0 }}>{ev.ts}</span>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageStack>
    );
}
