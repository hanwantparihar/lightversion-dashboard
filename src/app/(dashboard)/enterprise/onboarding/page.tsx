"use client";
import { useState } from "react";
import {
    GraduationCap, CheckCircle2, Circle, Clock, Calendar,
    ChevronRight, Users, Video, BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { ONBOARDING_SESSIONS, ONBOARDING_TASKS, type OnboardingSession } from "@/lib/enterprise-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

const PHASE_META: Record<OnboardingSession["phase"], { label: string; color: string; step: number }> = {
    kickoff: { label: "Kickoff", color: "#2563eb", step: 1 },
    setup: { label: "Setup", color: "#7c3aed", step: 2 },
    training: { label: "Training", color: "#f59e0b", step: 3 },
    go_live: { label: "Go Live", color: "#10b981", step: 4 },
    completed: { label: "Completed", color: "#94a3b8", step: 5 },
};

const PHASES_ORDER = ["kickoff", "setup", "training", "go_live", "completed"] as const;

function PhaseBar({ phase }: { phase: OnboardingSession["phase"] }) {
    const current = PHASE_META[phase].step;
    return (
        <div className="flex items-center gap-0">
            {PHASES_ORDER.map((p, i) => {
                const pm = PHASE_META[p];
                const done = pm.step < current;
                const isNow = pm.step === current;
                const last = i === PHASES_ORDER.length - 1;
                return (
                    <div key={p} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
                                style={{
                                    borderColor: done || isNow ? pm.color : "var(--border)",
                                    background: done ? pm.color : isNow ? pm.color + "25" : "transparent",
                                    color: done ? "#fff" : isNow ? pm.color : "var(--muted-foreground)",
                                    fontSize: 11, fontWeight: 700,
                                }}>
                                {done ? "✓" : pm.step}
                            </div>
                            <span className="text-[9px] font-semibold text-center" style={{ color: isNow ? pm.color : "var(--muted-foreground)" }}>{pm.label}</span>
                        </div>
                        {!last && <div className="w-12 h-0.5 mb-4 transition-colors" style={{ background: done ? pm.color : "var(--border)" }} />}
                    </div>
                );
            })}
        </div>
    );
}

export default function DedicatedOnboardingPage() {
    const [sessions] = useState(ONBOARDING_SESSIONS);
    const [active, setActive] = useState<OnboardingSession>(sessions[0]);
    const [tasks] = useState(ONBOARDING_TASKS);

    const activeTasks = tasks.filter(t => t.phase.toLowerCase().includes(PHASE_META[active.phase].label.toLowerCase()) || true);
    const completedTasks = activeTasks.filter(t => t.completed).length;

    const inProgress = sessions.filter(s => s.phase !== "completed").length;
    const completed = sessions.filter(s => s.phase === "completed").length;

    return (
        <PageStack>

            <StatsGrid stats={[
                { icon: GraduationCap, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(sessions.length), label: "Total Accounts", change: "", up: true, spark: spC, color: "#2563eb" },
                { icon: Clock, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(inProgress), label: "In Progress", change: "", up: true, spark: spA, color: "#f59e0b" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(completed), label: "Completed", change: "", up: true, spark: spD, color: "#10b981" },
                { icon: Users, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: "3", label: "Active CSMs", change: "", up: true, spark: spB, color: "#7c3aed" },
            ]} />

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Account list */}
                <Card className="w-60 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Accounts</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {sessions.map(s => {
                            const pm = PHASE_META[s.phase];
                            const isA = s.id === active.id;
                            return (
                                <button key={s.id} onClick={() => setActive(s)}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                        style={{ background: s.tenantColor + "22", color: s.tenantColor }}>{s.tenantAvatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] truncate" style={{ fontWeight: isA ? 700 : 400, color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>{s.tenant}</div>
                                        <div className="text-[10px] flex items-center gap-1 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pm.color }} />
                                            <span style={{ color: pm.color }}>{pm.label}</span>
                                        </div>
                                    </div>
                                    <div className="text-[11px] font-bold shrink-0" style={{ color: pm.color }}>{active.id === s.id ? active.progress : s.progress}%</div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Detail */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    {/* Phase progress */}
                    <Card>
                        <CardContent className="pt-5">
                            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0"
                                        style={{ background: active.tenantColor + "22", color: active.tenantColor }}>{active.tenantAvatar}</div>
                                    <div>
                                        <div className="font-bold">{active.tenant}</div>
                                        <div className="text-xs text-muted-foreground">CSM: {active.csm} · {active.plan} plan</div>
                                    </div>
                                </div>
                                <div className="text-right text-xs text-muted-foreground">
                                    <div>Started: {active.startDate}</div>
                                    <div>Target: {active.targetDate}</div>
                                </div>
                            </div>
                            <PhaseBar phase={active.phase} />
                            <div className="mt-4">
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span>Overall Progress</span><span>{active.progress}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${active.progress}%`, background: PHASE_META[active.phase].color }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next session */}
                    {active.phase !== "completed" && (
                        <Card>
                            <CardContent className="py-4 flex items-center gap-4 flex-wrap">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Video size={18} className="text-primary" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Next Session: {active.nextTopic}</div>
                                    <div className="text-xs text-muted-foreground">{active.nextSession}</div>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <Button size="sm" variant="outline"><Calendar size={13} /> Reschedule</Button>
                                    <Button size="sm"><Video size={13} /> Join Meet</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Task checklist */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><BookOpen size={15} /> Onboarding Checklist</span>
                                <span className="text-xs text-muted-foreground font-normal">{completedTasks}/{tasks.length} completed</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border">
                                    <div className="shrink-0">
                                        {task.completed
                                            ? <CheckCircle2 size={18} className="text-[#10b981]" />
                                            : <Circle size={18} className="text-muted-foreground" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
                                        <div className="text-xs text-muted-foreground">{task.description}</div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize"
                                            style={{ background: task.owner === "nexora" ? "#2563eb18" : "#10b98118", color: task.owner === "nexora" ? "#2563eb" : "#10b981" }}>
                                            {task.owner === "nexora" ? "Nexora" : "Customer"}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">{task.dueDate}</span>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{task.phase}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageStack>
    );
}
