"use client";
import { useState } from "react";
import {
    CalendarClock, Play, Pause, Plus, Clock, CheckCircle2,
    AlertCircle, Trash2, RefreshCw, Globe, ChevronDown, ChevronRight,
} from "lucide-react";
import {
    Card, CardHeader, CardContent, CardTitle, CardDescription,
    Button, Input, Label, Switch, DropdownSelect,
} from "@/components/ui";
import { Radio } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { cn } from "@/lib/utils";
import { SCHEDULED_WORKFLOWS, WORKFLOWS, type ScheduledWorkflow } from "@/lib/workflow-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_META: Record<ScheduledWorkflow["status"], { color: string; bg: string; icon: typeof Clock; label: string }> = {
    active: { color: "#10b981", bg: "#10b98118", icon: CheckCircle2, label: "Active" },
    paused: { color: "#f59e0b", bg: "#f59e0b18", icon: Pause, label: "Paused" },
    error: { color: "#ef4444", bg: "#ef444418", icon: AlertCircle, label: "Error" },
};

const TIMEZONES = [
    "UTC", "America/New_York", "America/Chicago", "America/Los_Angeles",
    "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney",
];

const CRON_PRESETS = [
    { label: "Every minute", cron: "* * * * *" },
    { label: "Every 15 minutes", cron: "*/15 * * * *" },
    { label: "Hourly", cron: "0 * * * *" },
    { label: "Daily at 8:00 AM", cron: "0 8 * * *" },
    { label: "Daily at midnight", cron: "0 0 * * *" },
    { label: "Every Monday 7 AM", cron: "0 7 * * 1" },
    { label: "1st of every month", cron: "0 9 1 * *" },
    { label: "Quarterly", cron: "0 0 1 1,4,7,10 *" },
];

type Frequency = "Once" | "Daily" | "Weekly" | "Monthly" | "Custom";
const FREQUENCIES: Frequency[] = ["Once", "Daily", "Weekly", "Monthly", "Custom"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// Mock per-schedule run logs (3–5 entries per schedule)
const MOCK_LOGS: Record<string, { time: string; status: "success" | "failed" | "skipped"; duration: string }[]> = {
    s1: [
        { time: "Today 8:00 AM", status: "success", duration: "0.8s" },
        { time: "Yesterday 8:00 AM", status: "success", duration: "0.9s" },
        { time: "Jul 8, 8:00 AM", status: "failed", duration: "0.2s" },
        { time: "Jul 7, 8:00 AM", status: "success", duration: "1.1s" },
        { time: "Jul 6, 8:00 AM", status: "success", duration: "0.7s" },
    ],
    s2: [
        { time: "Jul 7, 7:00 AM", status: "success", duration: "3.4s" },
        { time: "Jun 30, 7:00 AM", status: "success", duration: "3.1s" },
        { time: "Jun 23, 7:00 AM", status: "success", duration: "3.8s" },
        { time: "Jun 16, 7:00 AM", status: "skipped", duration: "0s" },
        { time: "Jun 9, 7:00 AM", status: "success", duration: "2.9s" },
    ],
    s3: [
        { time: "Jul 1, 9:00 AM", status: "success", duration: "1.2s" },
        { time: "Jun 1, 9:00 AM", status: "success", duration: "1.4s" },
        { time: "May 1, 9:00 AM", status: "success", duration: "1.1s" },
    ],
    s4: [
        { time: "5 min ago", status: "success", duration: "0.3s" },
        { time: "20 min ago", status: "success", duration: "0.4s" },
        { time: "35 min ago", status: "failed", duration: "0.1s" },
        { time: "50 min ago", status: "success", duration: "0.3s" },
        { time: "1 hr ago", status: "success", duration: "0.3s" },
    ],
    s5: [
        { time: "Jul 1, 12:00 AM", status: "success", duration: "0.9s" },
        { time: "Apr 1, 12:00 AM", status: "success", duration: "0.8s" },
        { time: "Jan 1, 12:00 AM", status: "success", duration: "1.1s" },
    ],
};

const LOG_COLORS = { success: "#10b981", failed: "#ef4444", skipped: "#94a3b8" };

// ── Create Schedule Form ───────────────────────────────────────────────────────
function CreateScheduleForm({ onAdd, onCancel }: {
    onAdd: (s: ScheduledWorkflow) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState("");
    const [freq, setFreq] = useState<Frequency>("Daily");
    const [cronExpr, setCronExpr] = useState("0 8 * * *");
    const [tz, setTz] = useState("UTC");
    const [wfId, setWfId] = useState(WORKFLOWS[0].id);
    const [timeVal, setTimeVal] = useState("08:00");
    const [dateVal, setDateVal] = useState("");
    const [monthDay, setMonthDay] = useState("1");
    const [weekdays, setWeekdays] = useState<string[]>(["Mon"]);

    function toggleWeekday(d: string) {
        setWeekdays((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);
    }

    function buildCron(): string {
        const [hh, mm] = timeVal.split(":").map(Number);
        if (freq === "Daily") return `${mm ?? 0} ${hh ?? 8} * * *`;
        if (freq === "Weekly") {
            const dayNums = weekdays.map((d) => WEEKDAYS.indexOf(d as typeof WEEKDAYS[number]) + 1);
            return `${mm ?? 0} ${hh ?? 8} * * ${dayNums.join(",") || "1"}`;
        }
        if (freq === "Monthly") return `${mm ?? 0} ${hh ?? 8} ${monthDay || 1} * *`;
        if (freq === "Once") return `${mm ?? 0} ${hh ?? 8} * * *`; // simplified
        return cronExpr;
    }

    function handleAdd() {
        if (!name.trim()) return;
        const cron = buildCron();
        const wf = WORKFLOWS.find((w) => w.id === wfId);
        onAdd({
            id: `s${Date.now()}`,
            name: name.trim(),
            workflowId: wfId,
            cron,
            cronHuman: CRON_PRESETS.find((p) => p.cron === cron)?.label ?? cron,
            nextRun: "Calculating…",
            lastRun: "—",
            status: "active",
            timezone: tz,
            runCount: 0,
        });
    }

    const tzOptions = TIMEZONES.map((t) => ({ value: t, label: t }));
    const wfOptions = WORKFLOWS.map((w) => ({ value: w.id, label: w.name }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Plus size={15} /> Create Schedule</CardTitle>
                <CardDescription>Define when a workflow should run automatically</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Schedule Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Daily digest" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Which workflow to run</Label>
                        <DropdownSelect value={wfId} onChange={setWfId} options={wfOptions} />
                    </div>
                </div>

                {/* Frequency selector — Radio buttons */}
                <div className="flex flex-col gap-2">
                    <Label className="text-xs">Frequency</Label>
                    <div className="flex items-center gap-4 flex-wrap">
                        {FREQUENCIES.map((f) => (
                            <Radio key={f} checked={freq === f} onChange={() => setFreq(f)} label={f} />
                        ))}
                    </div>
                </div>

                {/* Frequency-specific inputs */}
                {freq === "Once" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Date</Label>
                            <Input type="date" value={dateVal} onChange={(e) => setDateVal(e.target.value)} className="text-sm" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Time</Label>
                            <Input type="time" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} className="text-sm" />
                        </div>
                    </div>
                )}

                {freq === "Daily" && (
                    <div className="flex flex-col gap-1.5 max-w-[160px]">
                        <Label className="text-xs">Time</Label>
                        <Input type="time" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} className="text-sm" />
                    </div>
                )}

                {freq === "Weekly" && (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Days of week</Label>
                            <div className="flex gap-2 flex-wrap">
                                {WEEKDAYS.map((d) => (
                                    <Radio
                                        key={d}
                                        checked={weekdays.includes(d)}
                                        onChange={() => toggleWeekday(d)}
                                        label={d}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 max-w-[160px]">
                            <Label className="text-xs">Time</Label>
                            <Input type="time" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} className="text-sm" />
                        </div>
                    </div>
                )}

                {freq === "Monthly" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Day of month</Label>
                            <Input
                                type="number" min={1} max={31} value={monthDay}
                                onChange={(e) => setMonthDay(e.target.value)}
                                className="text-sm"
                                placeholder="1–31"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Time</Label>
                            <Input type="time" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} className="text-sm" />
                        </div>
                    </div>
                )}

                {freq === "Custom" && (
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Cron Expression</Label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-muted font-mono text-sm">
                                <input
                                    value={cronExpr}
                                    onChange={(e) => setCronExpr(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none font-mono text-sm text-foreground"
                                    placeholder="* * * * *"
                                />
                            </code>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Format: minute hour day-of-month month day-of-week
                        </p>
                    </div>
                )}

                {/* Timezone */}
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs flex items-center gap-1"><Globe size={11} /> Timezone</Label>
                    <DropdownSelect value={tz} onChange={setTz} options={tzOptions} />
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleAdd} disabled={!name.trim()}>
                        <CalendarClock size={13} /> Create Schedule
                    </Button>
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Schedule Row ───────────────────────────────────────────────────────────────
function ScheduleRow({
    schedule,
    onToggle,
    onDelete,
    onRunNow,
    isRunning,
}: {
    schedule: ScheduledWorkflow;
    onToggle: () => void;
    onDelete: () => void;
    onRunNow: () => void;
    isRunning: boolean;
}) {
    const sm = STATUS_META[schedule.status];
    const Icon = sm.icon;
    const wf = WORKFLOWS.find((w) => w.id === schedule.workflowId);
    const [expanded, setExpanded] = useState(false);
    const logs = (MOCK_LOGS[schedule.id] ?? []).slice(0, 5);

    return (
        <div className="border-b last:border-0 border-border">
            <div
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors flex-wrap cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
            >
                {/* Status icon */}
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: sm.bg }}
                >
                    <Icon size={17} style={{ color: sm.color }} className={isRunning ? "animate-spin" : ""} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm flex items-center gap-2 flex-wrap">
                        {schedule.name}
                        <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: sm.bg, color: sm.color }}
                        >
                            {sm.label}
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                        <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                            {schedule.cron}
                        </code>
                        <span>{schedule.cronHuman}</span>
                        {wf && <span className="text-primary font-semibold">→ {wf.name}</span>}
                    </div>
                </div>

                {/* Schedule details */}
                <div className="flex flex-col items-end text-xs text-muted-foreground shrink-0">
                    <span className="font-semibold text-foreground">Next: {schedule.nextRun}</span>
                    <span>Last: {schedule.lastRun}</span>
                    <span className="flex items-center gap-1 mt-0.5">
                        <Globe size={10} />{schedule.timezone}
                    </span>
                </div>

                <div className="text-xs text-muted-foreground text-right shrink-0">
                    <span className="block font-semibold text-foreground">{schedule.runCount.toLocaleString()}</span>
                    <span>total runs</span>
                </div>

                {/* Actions — stop propagation so row click doesn't conflict */}
                <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        size="sm" variant="outline" className="h-8 px-2.5"
                        onClick={onRunNow} disabled={isRunning}
                    >
                        {isRunning
                            ? <RefreshCw size={13} className="animate-spin" />
                            : <Play size={13} />
                        }
                    </Button>
                    <Switch
                        checked={schedule.status === "active"}
                        onChange={onToggle}
                    />
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onDelete}>
                        <Trash2 size={13} />
                    </Button>
                </div>

                <ChevronRight
                    size={15}
                    className={cn("text-muted-foreground shrink-0 transition-transform", expanded && "rotate-90")}
                />
            </div>

            {/* Inline run history */}
            {expanded && (
                <div className="px-5 pb-4">
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="px-4 py-2 bg-muted/50 border-b border-border">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                                Last 5 Runs
                            </span>
                        </div>
                        {logs.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-muted-foreground">No runs yet.</div>
                        ) : (
                            logs.map((log, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 border-border text-xs hover:bg-muted/20"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ background: LOG_COLORS[log.status] }}
                                    />
                                    <span className="font-semibold capitalize" style={{ color: LOG_COLORS[log.status] }}>
                                        {log.status}
                                    </span>
                                    <span className="text-muted-foreground">{log.time}</span>
                                    <span className="text-muted-foreground ml-auto">{log.duration}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ScheduledWorkflowsPage() {
    const [schedules, setSchedules] = useState<ScheduledWorkflow[]>(SCHEDULED_WORKFLOWS);
    const [showNew, setShowNew] = useState(false);
    const [runNow, setRunNow] = useState<string | null>(null);

    const active = schedules.filter((s) => s.status === "active").length;
    const paused = schedules.filter((s) => s.status === "paused").length;
    const totalRuns = schedules.reduce((s, sc) => s + sc.runCount, 0);

    function toggleSchedule(id: string) {
        setSchedules((p) =>
            p.map((s) =>
                s.id !== id ? s
                    : { ...s, status: s.status === "active" ? "paused" : "active" } as ScheduledWorkflow
            )
        );
    }

    function removeSchedule(id: string) {
        setSchedules((p) => p.filter((s) => s.id !== id));
    }

    function triggerNow(id: string) {
        setRunNow(id);
        setTimeout(() => setRunNow(null), 1800);
    }

    function addSchedule(s: ScheduledWorkflow) {
        setSchedules((p) => [...p, s]);
        setShowNew(false);
    }

    return (
        <PageStack>
            {/* Page heading */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">Scheduled Workflows</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Run workflows automatically on a cron schedule
                    </p>
                </div>
                <Button onClick={() => setShowNew((v) => !v)}>
                    <Plus size={14} /> {showNew ? "Cancel" : "New Schedule"}
                </Button>
            </div>

            {/* Section A — Stats */}
            <StatsGrid
                stats={[
                    { icon: CalendarClock, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(schedules.length), label: "Total Schedules", change: "", up: true, spark: spC, color: "#2563eb" },
                    { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(active), label: "Active", change: "", up: true, spark: spA, color: "#10b981" },
                    { icon: Pause, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(paused), label: "Paused", change: "", up: false, spark: spD, color: "#f59e0b" },
                    { icon: Play, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: totalRuns.toLocaleString(), label: "Total Runs", change: "", up: true, spark: spB, color: "#7c3aed" },
                ]}
            />

            {/* Section B — Create Schedule form */}
            {showNew && (
                <CreateScheduleForm onAdd={addSchedule} onCancel={() => setShowNew(false)} />
            )}

            {/* Section C — Schedule list */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <CalendarClock size={17} /> All Schedules
                    </CardTitle>
                    <CardDescription>Workflows triggered automatically by cron. Click a row to see run history.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {schedules.map((sc) => (
                        <ScheduleRow
                            key={sc.id}
                            schedule={sc}
                            onToggle={() => toggleSchedule(sc.id)}
                            onDelete={() => removeSchedule(sc.id)}
                            onRunNow={() => triggerNow(sc.id)}
                            isRunning={runNow === sc.id}
                        />
                    ))}
                </CardContent>
            </Card>

            {/* Section D — Cron Reference */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Cron Expression Reference</CardTitle>
                    <CardDescription>Format: minute hour day-of-month month day-of-week</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* 5 field boxes */}
                    <div className="grid grid-cols-5 gap-3 mb-5">
                        {[
                            { field: "Minute", range: "0–59" },
                            { field: "Hour", range: "0–23" },
                            { field: "Day", range: "1–31" },
                            { field: "Month", range: "1–12" },
                            { field: "Weekday", range: "0–7" },
                        ].map(({ field, range }) => (
                            <div key={field} className="text-center rounded-xl bg-muted p-3">
                                <div className="font-bold text-xs">{field}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{range}</div>
                            </div>
                        ))}
                    </div>

                    {/* Preset examples */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {CRON_PRESETS.map((p) => (
                            <div
                                key={p.cron}
                                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted"
                            >
                                <span className="text-xs font-semibold">{p.label}</span>
                                <code className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                                    {p.cron}
                                </code>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
