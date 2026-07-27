"use client";
import { useState } from "react";
import {
    Zap, Play, Plus, Search, CheckCircle2, Trash2, ArrowRight, Filter,
} from "lucide-react";
import {
    Card, CardHeader, CardContent, CardTitle, CardDescription,
    Button, Input, Label, Switch,
} from "@/components/ui";
import { Radio } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { cn } from "@/lib/utils";
import { TRIGGER_DEFS, ACTION_DEFS, type TriggerDef, type ActionDef } from "@/lib/workflow-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TriggerAction {
    id: string;
    name: string;
    triggerId: string;
    actionId: string;
    enabled: boolean;
    runCount: number;
    lastRun: string;
}

const INITIAL_TAS: TriggerAction[] = [
    { id: "ta1", name: "New user → Welcome email", triggerId: "t-user-created", actionId: "a-send-email", enabled: true, runCount: 284, lastRun: "10:02 AM" },
    { id: "ta2", name: "Payment failed → Slack alert", triggerId: "t-invoice-failed", actionId: "a-slack-message", enabled: true, runCount: 38, lastRun: "Jun 29" },
    { id: "ta3", name: "Trial expiring → WhatsApp nudge", triggerId: "t-trial-expiring", actionId: "a-whatsapp", enabled: true, runCount: 21, lastRun: "Jul 1" },
    { id: "ta4", name: "API error → PagerDuty webhook", triggerId: "t-api-error", actionId: "a-webhook", enabled: false, runCount: 7, lastRun: "Jun 28" },
    { id: "ta5", name: "Form submitted → Google Sheet", triggerId: "t-form-submitted", actionId: "a-google-sheets", enabled: true, runCount: 112, lastRun: "9:44 AM" },
];

// ── Category colour maps ──────────────────────────────────────────────────────
const TCAT_COLORS: Record<string, string> = {
    Users: "#2563eb", Billing: "#10b981", Tenants: "#7c3aed",
    System: "#ef4444", Forms: "#8b5cf6", Webhook: "#06b6d4",
};
const ACAT_COLORS: Record<string, string> = {
    Email: "#2563eb", Slack: "#4a154b", WhatsApp: "#25d366",
    System: "#06b6d4", Users: "#7c3aed", Billing: "#10b981",
    CRM: "#f59e0b", Google: "#34a853", Control: "#94a3b8",
};

const TRIGGER_FILTER_TABS = ["All", "Users", "Billing", "System"] as const;
const ACTION_FILTER_TABS = ["All", "Email", "Slack", "System", "CRM"] as const;

type TriggerFilter = typeof TRIGGER_FILTER_TABS[number];
type ActionFilter = typeof ACTION_FILTER_TABS[number];

// ── Helper: library card ──────────────────────────────────────────────────────
function LibraryCard({ icon, label, category, description, catColor }: {
    icon: string; label: string; category: string; description: string; catColor: string;
}) {
    return (
        <div className="rounded-xl border border-border p-3 flex flex-col gap-1.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: catColor + "20", color: catColor }}
                >
                    {category}
                </span>
            </div>
            <div className="font-semibold text-xs leading-snug">{label}</div>
            <div className="text-[10px] text-muted-foreground leading-snug">{description}</div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TriggerActionsPage() {
    const [tas, setTas] = useState<TriggerAction[]>(INITIAL_TAS);
    const [showBuilder, setShowBuilder] = useState(false);

    // Builder state
    const [newName, setNewName] = useState("");
    const [selTrigger, setSelTrig] = useState<TriggerDef | null>(null);
    const [selAction, setSelAct] = useState<ActionDef | null>(null);
    const [triggerQ, setTriggerQ] = useState("");
    const [actionQ, setActionQ] = useState("");
    const [triggerTab, setTriggerTab] = useState<TriggerFilter>("All");
    const [actionTab, setActionTab] = useState<ActionFilter>("All");

    // Library filter state
    const triggerCats = Array.from(new Set(TRIGGER_DEFS.map((d) => d.category)));
    const actionCats = Array.from(new Set(ACTION_DEFS.map((d) => d.category)));
    const [libTriggerTab, setLibTriggerTab] = useState<string>("All");
    const [libActionTab, setLibActionTab] = useState<string>("All");

    const activeCount = tas.filter((t) => t.enabled).length;
    const totalRuns = tas.reduce((s, t) => s + t.runCount, 0);

    function toggle(id: string) {
        setTas((p) => p.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
    }
    function remove(id: string) {
        setTas((p) => p.filter((t) => t.id !== id));
    }
    function addTA() {
        if (!selTrigger || !selAction || !newName.trim()) return;
        setTas((p) => [
            ...p,
            {
                id: `ta${Date.now()}`,
                name: newName.trim(),
                triggerId: selTrigger.id,
                actionId: selAction.id,
                enabled: true,
                runCount: 0,
                lastRun: "—",
            },
        ]);
        setSelTrig(null); setSelAct(null); setNewName(""); setShowBuilder(false);
    }

    // Filtered defs for builder pickers
    const filteredTriggers = TRIGGER_DEFS.filter(
        (d) =>
            (triggerTab === "All" || d.category === triggerTab) &&
            (!triggerQ || d.label.toLowerCase().includes(triggerQ.toLowerCase()))
    );
    const filteredActions = ACTION_DEFS.filter(
        (d) =>
            (actionTab === "All" || d.category === actionTab) &&
            (!actionQ || d.label.toLowerCase().includes(actionQ.toLowerCase()))
    );

    // Filtered defs for library sections
    const libTriggers = TRIGGER_DEFS.filter((d) => libTriggerTab === "All" || d.category === libTriggerTab);
    const libActions = ACTION_DEFS.filter((d) => libActionTab === "All" || d.category === libActionTab);

    return (
        <PageStack>
            {/* Page heading */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">Trigger → Actions</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Connect event triggers to automated actions in one click
                    </p>
                </div>
                <Button onClick={() => setShowBuilder((v) => !v)}>
                    <Plus size={14} /> {showBuilder ? "Cancel" : "New Rule"}
                </Button>
            </div>

            {/* Section A — Stats */}
            <StatsGrid
                stats={[
                    { icon: Zap, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(TRIGGER_DEFS.length), label: "Triggers Available", change: "", up: true, spark: spC, color: "#f59e0b" },
                    { icon: Play, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(ACTION_DEFS.length), label: "Actions Available", change: "", up: true, spark: spD, color: "#2563eb" },
                    { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(activeCount), label: "Active Rules", change: "", up: true, spark: spA, color: "#10b981" },
                    { icon: Zap, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: totalRuns.toLocaleString(), label: "Total Runs", change: "", up: true, spark: spB, color: "#7c3aed" },
                ]}
            />

            {/* Section B — Active Rules */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 flex-wrap">
                    <div>
                        <CardTitle className="text-sm flex items-center gap-2"><Zap size={15} /> Active Rules</CardTitle>
                        <CardDescription>{tas.length} trigger→action rules configured</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {tas.map((ta) => {
                        const tDef = TRIGGER_DEFS.find((d) => d.id === ta.triggerId);
                        const aDef = ACTION_DEFS.find((d) => d.id === ta.actionId);
                        const tc = TCAT_COLORS[tDef?.category ?? ""] ?? "#888";
                        const ac = ACAT_COLORS[aDef?.category ?? ""] ?? "#888";
                        return (
                            <div
                                key={ta.id}
                                className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-border hover:bg-muted/30 transition-colors flex-wrap"
                            >
                                {/* Trigger → Action visual */}
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                                        style={{ background: tc + "18", color: tc }}
                                    >
                                        <span>{tDef?.icon ?? "⚡"}</span>
                                        {tDef?.label ?? ta.triggerId}
                                    </div>
                                    <ArrowRight size={13} className="text-muted-foreground shrink-0" />
                                    <div
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                                        style={{ background: ac + "18", color: ac }}
                                    >
                                        <span>{aDef?.icon ?? "▶"}</span>
                                        {aDef?.label ?? ta.actionId}
                                    </div>
                                    <div className="min-w-0 ml-2">
                                        <div className="font-semibold text-sm truncate">{ta.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {ta.runCount.toLocaleString()} runs · Last {ta.lastRun}
                                        </div>
                                    </div>
                                </div>
                                {/* Controls */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <Switch checked={ta.enabled} onChange={() => toggle(ta.id)} />
                                    <Button
                                        size="sm" variant="ghost" className="h-7 w-7 p-0"
                                        onClick={() => remove(ta.id)}
                                    >
                                        <Trash2 size={13} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Section C — New Rule inline builder */}
            {showBuilder && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Plus size={15} /> Create Trigger → Action Rule
                        </CardTitle>
                        <CardDescription>Pick a trigger event and an action to perform automatically</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* Rule name */}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Rule Name</Label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. New user → send welcome email"
                            />
                        </div>

                        {/* Two picker panels */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Trigger picker */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs font-semibold">When this happens… (Trigger)</Label>
                                {/* Radio filter tabs */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {TRIGGER_FILTER_TABS.map((t) => (
                                        <Radio key={t} checked={triggerTab === t} onChange={() => setTriggerTab(t)} label={t} />
                                    ))}
                                </div>
                                <div className="relative">
                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={triggerQ}
                                        onChange={(e) => setTriggerQ(e.target.value)}
                                        placeholder="Search triggers…"
                                        className="pl-8 text-xs"
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto border border-border rounded-lg p-1">
                                    {triggerCats.map((cat) => {
                                        const items = filteredTriggers.filter((d) => d.category === cat);
                                        if (!items.length) return null;
                                        const cc = TCAT_COLORS[cat] ?? "#888";
                                        return (
                                            <div key={cat}>
                                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide px-2 py-1">{cat}</div>
                                                {items.map((def) => (
                                                    <button
                                                        key={def.id}
                                                        onClick={() => setSelTrig(def)}
                                                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left cursor-pointer bg-transparent border-none transition-colors"
                                                        style={{
                                                            background: selTrigger?.id === def.id ? cc + "18" : "transparent",
                                                            borderLeft: selTrigger?.id === def.id ? `3px solid ${cc}` : "3px solid transparent",
                                                        }}
                                                    >
                                                        <span className="text-sm shrink-0">{def.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-semibold leading-snug">{def.label}</div>
                                                            <div className="text-[10px] text-muted-foreground line-clamp-1">{def.description}</div>
                                                        </div>
                                                        <span
                                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                                            style={{ background: cc + "20", color: cc }}
                                                        >
                                                            {cat}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action picker */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs font-semibold">Do this… (Action)</Label>
                                {/* Radio filter tabs */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {ACTION_FILTER_TABS.map((t) => (
                                        <Radio key={t} checked={actionTab === t} onChange={() => setActionTab(t)} label={t} />
                                    ))}
                                </div>
                                <div className="relative">
                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={actionQ}
                                        onChange={(e) => setActionQ(e.target.value)}
                                        placeholder="Search actions…"
                                        className="pl-8 text-xs"
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto border border-border rounded-lg p-1">
                                    {actionCats.map((cat) => {
                                        const items = filteredActions.filter((d) => d.category === cat);
                                        if (!items.length) return null;
                                        const cc = ACAT_COLORS[cat] ?? "#888";
                                        return (
                                            <div key={cat}>
                                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide px-2 py-1">{cat}</div>
                                                {items.map((def) => (
                                                    <button
                                                        key={def.id}
                                                        onClick={() => setSelAct(def)}
                                                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left cursor-pointer bg-transparent border-none transition-colors"
                                                        style={{
                                                            background: selAction?.id === def.id ? cc + "18" : "transparent",
                                                            borderLeft: selAction?.id === def.id ? `3px solid ${cc}` : "3px solid transparent",
                                                        }}
                                                    >
                                                        <span className="text-sm shrink-0">{def.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-semibold leading-snug">{def.label}</div>
                                                            <div className="text-[10px] text-muted-foreground line-clamp-1">{def.description}</div>
                                                        </div>
                                                        <span
                                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                                            style={{ background: cc + "20", color: cc }}
                                                        >
                                                            {cat}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Summary bar */}
                        {(selTrigger || selAction) && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border text-sm flex-wrap">
                                <span className="text-xs text-muted-foreground font-semibold">When</span>
                                {selTrigger ? (
                                    <span className="flex items-center gap-1.5 font-semibold text-xs">
                                        <span>{selTrigger.icon}</span>{selTrigger.label}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground text-xs">pick a trigger…</span>
                                )}
                                <ArrowRight size={13} className="text-muted-foreground shrink-0" />
                                <span className="text-xs text-muted-foreground font-semibold">Do</span>
                                {selAction ? (
                                    <span className="flex items-center gap-1.5 font-semibold text-xs">
                                        <span>{selAction.icon}</span>{selAction.label}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground text-xs">pick an action…</span>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button onClick={addTA} disabled={!selTrigger || !selAction || !newName.trim()}>
                                <CheckCircle2 size={13} /> Create Rule
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => { setShowBuilder(false); setSelTrig(null); setSelAct(null); setNewName(""); }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Section D — Trigger Library */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <CardTitle className="text-sm">Trigger Library</CardTitle>
                            <CardDescription>All events that can initiate a workflow</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {["All", ...triggerCats].map((cat) => (
                                <Radio
                                    key={cat}
                                    checked={libTriggerTab === cat}
                                    onChange={() => setLibTriggerTab(cat)}
                                    label={cat}
                                />
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {libTriggers.map((def) => (
                            <LibraryCard
                                key={def.id}
                                icon={def.icon}
                                label={def.label}
                                category={def.category}
                                description={def.description}
                                catColor={TCAT_COLORS[def.category] ?? "#888"}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Section E — Action Library */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <CardTitle className="text-sm">Action Library</CardTitle>
                            <CardDescription>All actions that can be triggered automatically</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {["All", ...actionCats].map((cat) => (
                                <Radio
                                    key={cat}
                                    checked={libActionTab === cat}
                                    onChange={() => setLibActionTab(cat)}
                                    label={cat}
                                />
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {libActions.map((def) => (
                            <LibraryCard
                                key={def.id}
                                icon={def.icon}
                                label={def.label}
                                category={def.category}
                                description={def.description}
                                catColor={ACAT_COLORS[def.category] ?? "#888"}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
