"use client";
import { useState } from "react";
import {
    MessageCircle, CheckCircle2, XCircle, AlertCircle, Clock,
    Send, Plus, Copy, Check, ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import {
    WHATSAPP_NUMBERS, WHATSAPP_TEMPLATES, WHATSAPP_MESSAGES,
    type WhatsAppNumber,
} from "@/lib/integrations-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const QUALITY_META = {
    green: { label: "High", color: "#10b981" },
    yellow: { label: "Medium", color: "#f59e0b" },
    red: { label: "Low", color: "#ef4444" },
};

const TMPL_STATUS = {
    APPROVED: { color: "#10b981", bg: "#10b98118" },
    PENDING: { color: "#f59e0b", bg: "#f59e0b18" },
    REJECTED: { color: "#ef4444", bg: "#ef444418" },
};

const TMPL_CAT = {
    MARKETING: { color: "#7c3aed", bg: "#7c3aed18" },
    UTILITY: { color: "#2563eb", bg: "#2563eb18" },
    AUTHENTICATION: { color: "#10b981", bg: "#10b98118" },
};

const MSG_STATUS = {
    delivered: { color: "#10b981", icon: CheckCircle2 },
    read: { color: "#2563eb", icon: CheckCircle2 },
    sent: { color: "#94a3b8", icon: Clock },
    failed: { color: "#ef4444", icon: XCircle },
};

export default function WhatsAppPage() {
    const [activeNum, setActiveNum] = useState(WHATSAPP_NUMBERS[0].id);
    const [testTo, setTestTo] = useState("");
    const [testTpl, setTestTpl] = useState(WHATSAPP_TEMPLATES[0].id);
    const [testSent, setTestSent] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const num = WHATSAPP_NUMBERS.find(n => n.id === activeNum)!;
    const tpl = WHATSAPP_TEMPLATES.find(t => t.id === testTpl)!;

    function copyToken(val: string) {
        navigator.clipboard.writeText(val).catch(() => { });
        setCopied(val); setTimeout(() => setCopied(null), 1500);
    }

    function sendTest() {
        if (!testTo.trim()) return;
        setTestSent(true); setTimeout(() => setTestSent(false), 2500);
    }

    const approvedCount = WHATSAPP_TEMPLATES.filter(t => t.status === "APPROVED").length;
    const deliveredCount = WHATSAPP_MESSAGES.filter(m => m.status !== "failed").length;

    return (
        <PageStack>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg" style={{ background: "#25d366" }}>W</div>
                <div>
                    <h2 className="text-[22px] font-extrabold">WhatsApp API</h2>
                    <p className="text-sm text-muted-foreground">Send template messages and notifications via WhatsApp Business API</p>
                </div>
            </div>

            <StatsGrid stats={[
                { icon: MessageCircle, grad: "linear-gradient(135deg,#25d366,#1da851)", value: String(WHATSAPP_NUMBERS.filter(n => n.status === "connected").length), label: "Connected Numbers", change: "", up: true, spark: spC, color: "#25d366" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(approvedCount), label: "Approved Templates", change: `${WHATSAPP_TEMPLATES.length} total`, up: true, spark: spA, color: "#10b981" },
                { icon: Send, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(WHATSAPP_MESSAGES.length), label: "Messages Sent", change: "today", up: true, spark: spD, color: "#2563eb" },
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: String(deliveredCount), label: "Delivered", change: `${WHATSAPP_MESSAGES.length} total`, up: true, spark: spB, color: "#7c3aed" },
            ]} />

            {/* Phone numbers */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="text-sm flex items-center gap-2"><MessageCircle size={15} /> Phone Numbers</CardTitle>
                        <CardDescription>WhatsApp Business API registered numbers</CardDescription>
                    </div>
                    <Button size="sm"><Plus size={13} /> Add Number</Button>
                </CardHeader>
                <CardContent className="p-0">
                    {WHATSAPP_NUMBERS.map(n => {
                        const qm = QUALITY_META[n.quality];
                        const isActive = n.id === activeNum;
                        return (
                            <div key={n.id} onClick={() => setActiveNum(n.id)}
                                className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-border cursor-pointer hover:bg-muted/30 transition-colors flex-wrap"
                                style={{ background: isActive ? "var(--ac)" : undefined }}>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "#25d366" }}>
                                    {n.displayName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm flex items-center gap-2">
                                        {n.displayName}
                                        {n.verifiedName && <ShieldCheck size={13} className="text-[#25d366]" />}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{n.phoneNumber} · {n.messagingLimit}</div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-xs font-semibold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full" style={{ background: qm.color }} />
                                        <span style={{ color: qm.color }}>{qm.label} quality</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${n.status === "connected" ? "bg-[#10b98118] text-[#10b981]" : "bg-muted text-muted-foreground"}`}>
                                        {n.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                {/* Templates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Message Templates</CardTitle>
                        <CardDescription>Pre-approved templates for outbound messaging</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {WHATSAPP_TEMPLATES.map(t => {
                            const ts = TMPL_STATUS[t.status];
                            const tc = TMPL_CAT[t.category];
                            return (
                                <div key={t.id} className="px-5 py-3.5 border-b last:border-0 border-border">
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <div>
                                            <div className="font-mono text-xs font-semibold text-primary">{t.name}</div>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.color }}>{t.category}</span>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.color }}>{t.status}</span>
                                                <span className="text-[10px] text-muted-foreground">{t.language}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => copyToken(t.body)}
                                            className="bg-transparent border-none cursor-pointer text-muted-foreground flex shrink-0">
                                            {copied === t.body ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{t.body}</p>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Send test + message log */}
                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Send Test Message</CardTitle>
                            <CardDescription>Test a template with a real phone number</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Recipient (WhatsApp number)</label>
                                <Input value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="+1 415 555 0100" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Template</label>
                                <select value={testTpl} onChange={e => setTestTpl(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground text-sm">
                                    {WHATSAPP_TEMPLATES.filter(t => t.status === "APPROVED").map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            {tpl && (
                                <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground leading-relaxed">
                                    {tpl.body}
                                </div>
                            )}
                            <Button onClick={sendTest} disabled={!testTo.trim() || num.status !== "connected"}>
                                <Send size={13} /> {testSent ? "Sent! ✓" : "Send Test"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-sm">Recent Messages</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            {WHATSAPP_MESSAGES.map(m => {
                                const ms = MSG_STATUS[m.status];
                                const Icon = ms.icon;
                                return (
                                    <div key={m.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0 border-border">
                                        <Icon size={14} style={{ color: ms.color }} className="shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold truncate">{m.to}</div>
                                            <div className="text-[11px] text-muted-foreground font-mono">{m.template}</div>
                                        </div>
                                        <div className="text-xs shrink-0 text-right">
                                            <div className="font-semibold capitalize" style={{ color: ms.color }}>{m.status}</div>
                                            <div className="text-muted-foreground">{m.ts}</div>
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
