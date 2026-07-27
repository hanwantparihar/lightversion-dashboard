"use client";
import { useState } from "react";
import {
    Zap, Play, Pause, RefreshCw, CheckCircle2, XCircle,
    AlertCircle, SkipForward, Plus, ExternalLink, BarChart2,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { ZAPIER_ZAPS, ZAPIER_LOGS, type ZapierZap } from "@/lib/integrations-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const ZAP_STATUS: Record<ZapierZap["status"], { label: string; color: string; bg: string }> = {
    on: { label: "On", color: "#10b981", bg: "#10b98118" },
    off: { label: "Off", color: "#94a3b8", bg: "#94a3b818" },
    error: { label: "Error", color: "#ef4444", bg: "#ef444418" },
};

const LOG_STATUS: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
    success: { color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
    error: { color: "#ef4444", bg: "#ef444418", icon: XCircle },
    skipped: { color: "#94a3b8", bg: "#94a3b818", icon: SkipForward },
};

export default function ZapierIntegrationPage() {
    const [zaps, setZaps] = useState(ZAPIER_ZAPS);

    function toggle(id: string) {
        setZaps(p => p.map(z => z.id !== id ? z : { ...z, status: z.status === "on" ? "off" : "on" }));
    }

    const onCount = zaps.filter(z => z.status === "on").length;
    const errorCount = zaps.filter(z => z.status === "error").length;
    const totalRuns = zaps.reduce((s, z) => s + z.runsToday, 0);

    return (
        <PageStack>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg" style={{ background: "#ff4a00" }}>Z</div>
                <div>
                    <h2 className="text-[22px] font-extrabold">Zapier Integration</h2>
                    <p className="text-sm text-muted-foreground">Automate workflows by connecting Nexora AI to 6,000+ apps via Zapier</p>
                </div>
                <div className="ml-auto">
                    <Button><Plus size={14} /> New Zap</Button>
                </div>
            </div>

            <StatsGrid stats={[
                { icon: Zap, grad: "linear-gradient(135deg,#ff4a00,#e63900)", value: String(zaps.length), label: "Total Zaps", change: `${onCount} active`, up: true, spark: spC, color: "#ff4a00" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(onCount), label: "Active", change: "running", up: true, spark: spA, color: "#10b981" },
                { icon: BarChart2, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(totalRuns), label: "Runs Today", change: "executions", up: true, spark: spD, color: "#2563eb" },
                { icon: AlertCircle, grad: "linear-gradient(135deg,#ef4444,#dc2626)", value: String(errorCount), label: "Errors", change: "need attention", up: false, spark: spB, color: "#ef4444" },
            ]} />

            {/* Zap list */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Zap size={17} /> Your Zaps</CardTitle>
                        <CardDescription>Automated workflows connected to Nexora AI</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        <ExternalLink size={13} /> Open in Zapier
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {zaps.map(z => {
                        const zs = ZAP_STATUS[z.status];
                        return (
                            <div key={z.id} className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-border flex-wrap hover:bg-muted/30 transition-colors">
                                {/* App icon */}
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shrink-0"
                                    style={{ background: z.appColor }}>
                                    {z.app[0]}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                        {z.name}
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: zs.bg, color: zs.color }}>{zs.label}</span>
                                        {z.status === "error" && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} /> Auth failed</span>}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-semibold">TRIGGER</span> {z.trigger}
                                        <span className="text-muted-foreground/50">→</span>
                                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-semibold">ACTION</span> {z.action}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-col items-end text-xs text-muted-foreground shrink-0">
                                    <span className="font-semibold text-foreground">{z.runsToday} runs today</span>
                                    <span>{z.totalRuns.toLocaleString()} total · Last {z.lastRun}</span>
                                </div>

                                {/* Toggle */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {z.status === "error"
                                        ? <Button size="sm" variant="outline"><RefreshCw size={13} /> Fix</Button>
                                        : (
                                            <button onClick={() => toggle(z.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors"
                                                style={{ borderColor: zs.color, background: zs.bg, color: zs.color }}>
                                                {z.status === "on" ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Enable</>}
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Trigger reference */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Available Nexora AI Triggers</CardTitle>
                    <CardDescription>Events you can use as Zapier triggers from Nexora AI</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {[
                            ["user.created", "New user registered"],
                            ["invoice.paid", "Invoice marked paid"],
                            ["invoice.failed", "Payment failed"],
                            ["trial.started", "Trial activated"],
                            ["trial.expiring", "Trial expiring (1 day)"],
                            ["tenant.created", "New tenant added"],
                            ["api.error_threshold", "API error rate > 5%"],
                            ["subscription.changed", "Plan upgraded/downgraded"],
                            ["data.export", "Data export triggered"],
                        ].map(([event, label]) => (
                            <div key={event} className="rounded-xl border border-border p-3">
                                <div className="font-mono text-[11px] text-primary mb-1">{event}</div>
                                <div className="text-xs text-muted-foreground">{label}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Run log */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Run History</CardTitle>
                    <CardDescription>Recent Zap execution results</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {ZAPIER_LOGS.map(log => {
                        const ls = LOG_STATUS[log.status];
                        const Icon = ls.icon;
                        return (
                            <div key={log.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border">
                                <Icon size={15} style={{ color: ls.color }} className="shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm">{log.zapName}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{log.detail}</div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: ls.bg, color: ls.color }}>{log.status}</span>
                                    <span className="text-xs text-muted-foreground">{log.ts}</span>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </PageStack>
    );
}
