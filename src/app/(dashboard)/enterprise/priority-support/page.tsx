"use client";
import { useState } from "react";
import {
    Headphones, AlertTriangle, Clock, CheckCircle2, MessageSquare,
    Send, Plus, ChevronDown, ChevronUp, Phone, Mail, Hash, Globe,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input, Textarea } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import {
    SUPPORT_TICKETS, SLA_POLICIES,
    type SupportTicket, type TicketPriority, type TicketStatus,
} from "@/lib/enterprise-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const PRIORITY_META: Record<TicketPriority, { color: string; bg: string; label: string; icon: typeof AlertTriangle }> = {
    critical: { color: "#ef4444", bg: "#ef444418", label: "P0 Critical", icon: AlertTriangle },
    high: { color: "#f59e0b", bg: "#f59e0b18", label: "P1 High", icon: Clock },
    medium: { color: "#2563eb", bg: "#2563eb18", label: "P2 Medium", icon: Clock },
    low: { color: "#94a3b8", bg: "#94a3b818", label: "P3 Low", icon: CheckCircle2 },
};

const STATUS_META: Record<TicketStatus, { color: string; bg: string; label: string }> = {
    open: { color: "#ef4444", bg: "#ef444418", label: "Open" },
    in_progress: { color: "#2563eb", bg: "#2563eb18", label: "In Progress" },
    waiting: { color: "#f59e0b", bg: "#f59e0b18", label: "Waiting" },
    resolved: { color: "#10b981", bg: "#10b98118", label: "Resolved" },
    closed: { color: "#94a3b8", bg: "#94a3b818", label: "Closed" },
};

const CHANNEL_ICONS: Record<string, typeof Phone> = {
    slack: Hash, email: Mail, portal: Globe, phone: Phone,
};

function TicketThread({ ticket, onClose }: { ticket: SupportTicket; onClose: () => void }) {
    const [reply, setReply] = useState("");
    const pm = PRIORITY_META[ticket.priority];
    const sm = STATUS_META[ticket.status];

    return (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.4)" }} onClick={onClose}>
            <div className="w-full max-w-lg h-full bg-card flex flex-col shadow-2xl border-l border-border" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-5 border-b border-border shrink-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                            <div className="font-bold text-sm">{ticket.subject}</div>
                            <div className="text-xs text-muted-foreground mt-1 font-mono">{ticket.id}</div>
                        </div>
                        <button onClick={onClose} className="text-muted-foreground bg-transparent border-none cursor-pointer text-lg shrink-0">✕</button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: pm.bg, color: pm.color }}>{pm.label}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{ticket.tenant}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">SLA: {ticket.slaDeadline}</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                    {ticket.messages.map(msg => {
                        const isAgent = msg.role === "agent";
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isAgent ? "flex-row-reverse" : ""}`}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                                    style={{ background: isAgent ? "hsl(var(--primary)/0.15)" : "var(--mt)", color: isAgent ? "hsl(var(--primary))" : "var(--fg)" }}>
                                    {msg.avatar}
                                </div>
                                <div className="max-w-[80%]">
                                    <div className="text-[11px] text-muted-foreground mb-1 flex items-center gap-2" style={{ justifyContent: isAgent ? "flex-end" : "flex-start" }}>
                                        <span className="font-semibold">{msg.author}</span>
                                        <span>{msg.ts}</span>
                                    </div>
                                    <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                                        style={{
                                            background: isAgent ? "hsl(var(--primary))" : "var(--mt)",
                                            color: isAgent ? "#fff" : "var(--fg)",
                                            borderRadius: isAgent ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                                        }}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply */}
                <div className="p-4 border-t border-border shrink-0 flex gap-2">
                    <Textarea value={reply} onChange={e => setReply(e.target.value)} rows={2}
                        placeholder="Write a reply…" className="flex-1 text-sm resize-none" />
                    <Button onClick={() => setReply("")} disabled={!reply.trim()} className="self-end">
                        <Send size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PrioritySupportPage() {
    const [tickets] = useState(SUPPORT_TICKETS);
    const [filterP, setFilterP] = useState<"all" | TicketPriority>("all");
    const [filterS, setFilterS] = useState<"all" | TicketStatus>("all");
    const [active, setActive] = useState<SupportTicket | null>(null);

    const filtered = tickets.filter(t => {
        const mp = filterP === "all" || t.priority === filterP;
        const ms = filterS === "all" || t.status === filterS;
        return mp && ms;
    });

    const open = tickets.filter(t => t.status !== "resolved" && t.status !== "closed").length;

    return (
        <PageStack>
            {active && <TicketThread ticket={active} onClose={() => setActive(null)} />}

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">Priority Support</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Enterprise SLA-backed support with dedicated engineers</p>
                </div>
                <Button><Plus size={14} /> New Ticket</Button>
            </div>

            <StatsGrid stats={[
                { icon: Headphones, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(tickets.length), label: "Total Tickets", change: "all time", up: true, spark: spC, color: "#2563eb" },
                { icon: AlertTriangle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(open), label: "Open", change: "need action", up: false, spark: spA, color: "#ef4444" },
                { icon: Clock, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: "< 1h", label: "Avg First Reply", change: "Enterprise", up: true, spark: spD, color: "#f59e0b" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: "98%", label: "SLA Adherence", change: "this month", up: true, spark: spB, color: "#10b981" },
            ]} />

            {/* SLA policies */}
            <div className="grid grid-cols-3 gap-4">
                {SLA_POLICIES.map(p => (
                    <Card key={p.plan}>
                        <CardContent className="pt-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-sm px-2.5 py-1 rounded-full capitalize"
                                    style={{ background: p.color + "22", color: p.color }}>{p.plan}</span>
                                {p.dedicated && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Dedicated CSM</span>}
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">First response</span><span className="font-semibold">{p.responseTime}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Resolution</span><span className="font-semibold">{p.resolutionTime}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Channels</span><span className="font-semibold text-xs text-right max-w-[160px]">{p.support}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ticket list */}
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-sm"><MessageSquare size={15} /> Tickets</CardTitle>
                        <CardDescription>{filtered.length} tickets</CardDescription>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {(["all", "open", "in_progress", "waiting", "resolved"] as const).map(s => (
                            <button key={s} onClick={() => setFilterS(s)} className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-semibold capitalize transition-colors"
                                style={{ background: filterS === s ? "hsl(var(--primary))" : "var(--cd)", color: filterS === s ? "#fff" : "var(--fg)" }}>
                                {s.replace("_", " ")}
                            </button>
                        ))}
                        <div className="w-px bg-border mx-1" />
                        {(["all", "critical", "high", "medium", "low"] as const).map(p => (
                            <button key={p} onClick={() => setFilterP(p)} className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-semibold capitalize transition-colors"
                                style={{
                                    background: filterP === p ? (p === "all" ? "hsl(var(--primary))" : PRIORITY_META[p as TicketPriority]?.color) : "var(--cd)",
                                    color: filterP === p ? "#fff" : "var(--fg)"
                                }}>
                                {p}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filtered.map(t => {
                        const pm = PRIORITY_META[t.priority];
                        const sm = STATUS_META[t.status];
                        const PIcon = pm.icon;
                        const ChIcon = CHANNEL_ICONS[t.channel] ?? Globe;
                        return (
                            <div key={t.id} onClick={() => setActive(t)}
                                className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-border hover:bg-muted/30 transition-colors cursor-pointer flex-wrap">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: pm.bg }}>
                                    <PIcon size={17} style={{ color: pm.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                                        {t.subject}
                                        {t.slaBreached && <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">SLA Breached</span>}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.tenantColor }} />
                                        <span>{t.tenant}</span>
                                        <span>·</span><span>Assignee: {t.assignee}</span>
                                        <span>·</span><ChIcon size={11} /><span>{t.channel}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                    <span className="text-xs text-muted-foreground">{t.slaDeadline}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: pm.bg, color: pm.color }}>{pm.label}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </PageStack>
    );
}
