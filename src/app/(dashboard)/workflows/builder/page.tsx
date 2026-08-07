"use client";
import { useState } from "react";
import {
    Play, Plus, Save, Trash2, Zap, GitBranch, Clock, CheckCircle2,
    X, Search, ArrowRight, GripVertical, Settings2, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription,
    Button, Input, Label,
} from "@/components/ui";
import { Radio } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
    WORKFLOWS, WORKFLOW_RUNS, TRIGGER_DEFS, ACTION_DEFS,
    type WorkflowNode, type Workflow, type NodeType,
} from "@/lib/workflow-data";

// ── Node type styles ──────────────────────────────────────────────────────────
const NODE_STYLES: Record<NodeType, { bg: string; border: string; icon: typeof Zap; label: string }> = {
    trigger: { bg: "#2563eb12", border: "#2563eb", icon: Zap, label: "TRIGGER" },
    action: { bg: "#10b98112", border: "#10b981", icon: Play, label: "ACTION" },
    condition: { bg: "#f59e0b12", border: "#f59e0b", icon: GitBranch, label: "CONDITION" },
    delay: { bg: "#7c3aed12", border: "#7c3aed", icon: Clock, label: "DELAY" },
    end: { bg: "#94a3b812", border: "#94a3b8", icon: CheckCircle2, label: "END" },
};

const STATUS_STYLES: Record<Workflow["status"], { color: string; bg: string; label: string }> = {
    active: { color: "#10b981", bg: "#10b98118", label: "Active" },
    inactive: { color: "#94a3b8", bg: "#94a3b818", label: "Inactive" },
    draft: { color: "#f59e0b", bg: "#f59e0b18", label: "Draft" },
    error: { color: "#ef4444", bg: "#ef444418", label: "Error" },
};

const RUN_STATUS_STYLES = {
    success: { color: "#10b981", label: "Success" },
    failed: { color: "#ef4444", label: "Failed" },
    running: { color: "#2563eb", label: "Running" },
    skipped: { color: "#94a3b8", label: "Skipped" },
};

// ── Step Picker (Add Step panel) ──────────────────────────────────────────────
function StepPicker({
    onAdd,
    onClose,
}: {
    onAdd: (node: Omit<WorkflowNode, "id" | "x" | "y">) => void;
    onClose: () => void;
}) {
    const [tab, setTab] = useState<"Triggers" | "Actions">("Triggers");
    const [q, setQ] = useState("");

    const defs = tab === "Triggers" ? TRIGGER_DEFS : ACTION_DEFS;
    const cats = Array.from(new Set(defs.map((d) => d.category)));
    const filtered = defs.filter(
        (d) =>
            !q ||
            d.label.toLowerCase().includes(q.toLowerCase()) ||
            d.category.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <Card className="mt-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Add Step</CardTitle>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
                >
                    <X size={15} />
                </button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {/* Radio tab switcher */}
                <div className="flex items-center gap-5">
                    {(["Triggers", "Actions"] as const).map((t) => (
                        <Radio key={t} checked={tab === t} onChange={() => setTab(t)} label={t} />
                    ))}
                </div>
                {/* Search */}
                <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={`Search ${tab.toLowerCase()}…`}
                        className="pl-8 text-xs"
                    />
                </div>
                {/* Grouped list */}
                <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                    {cats.map((cat) => {
                        const items = filtered.filter((d) => d.category === cat);
                        if (!items.length) return null;
                        return (
                            <div key={cat}>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-1 mb-1">
                                    {cat}
                                </div>
                                {items.map((def) => (
                                    <button
                                        key={def.id}
                                        onClick={() =>
                                            onAdd({
                                                type: tab === "Triggers" ? "trigger" : "action",
                                                label: def.label,
                                                description: def.description,
                                            })
                                        }
                                        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left border border-transparent hover:border-border hover:bg-muted transition-colors mb-0.5 cursor-pointer bg-transparent"
                                    >
                                        <span className="text-base shrink-0">{def.icon}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-semibold leading-snug">{def.label}</div>
                                            <div className="text-[10px] text-muted-foreground leading-snug line-clamp-1">
                                                {def.description}
                                            </div>
                                        </div>
                                        <span
                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                            style={{ background: def.color + "20", color: def.color }}
                                        >
                                            {cat}
                                        </span>
                                        <Plus size={11} className="text-muted-foreground shrink-0" />
                                    </button>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// ── Inline config form ────────────────────────────────────────────────────────
function InlineConfig({ node }: { node: WorkflowNode }) {
    const s = NODE_STYLES[node.type];
    return (
        <div
            className="mt-2 rounded-lg border p-3 flex flex-col gap-2"
            style={{ background: s.bg, borderColor: s.border + "44" }}
        >
            <Label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: s.border }}>
                Configure: {node.label}
            </Label>
            {node.type === "trigger" && (
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Filter (optional)</Label>
                    <Input
                        defaultValue={node.config?.filter ?? ""}
                        placeholder="e.g. role = editor"
                        className="text-xs h-8"
                    />
                </div>
            )}
            {node.type === "action" && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Recipient / Target</Label>
                        <Input
                            defaultValue={node.config?.to ?? ""}
                            placeholder="e.g. {{user.email}}"
                            className="text-xs h-8"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Message / Payload</Label>
                        <textarea
                            rows={3}
                            defaultValue={node.config?.body ?? ""}
                            placeholder="Enter message…"
                            className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs outline-none resize-none font-[inherit]"
                        />
                    </div>
                </>
            )}
            {node.type === "delay" && (
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs">Duration</Label>
                        <Input type="number" defaultValue={node.config?.duration ?? "24"} className="text-xs h-8" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Unit</Label>
                        <select className="p-2 rounded-lg border border-border bg-card text-foreground text-xs h-8">
                            <option>minutes</option>
                            <option>hours</option>
                            <option>days</option>
                        </select>
                    </div>
                </div>
            )}
            {node.type === "condition" && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Field</Label>
                        <Input defaultValue={node.config?.field ?? ""} placeholder="e.g. user.plan" className="text-xs h-8" />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <Label className="text-xs">Operator</Label>
                            <select className="p-2 rounded-lg border border-border bg-card text-foreground text-xs h-8">
                                <option>equals</option>
                                <option>not equals</option>
                                <option>contains</option>
                                <option>greater than</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <Label className="text-xs">Value</Label>
                            <Input defaultValue={node.config?.value ?? ""} placeholder="e.g. pro" className="text-xs h-8" />
                        </div>
                    </div>
                </>
            )}
            <Button size="sm" className="self-start h-7 text-xs">Apply</Button>
        </div>
    );
}

// ── Linear Step Card ──────────────────────────────────────────────────────────
function StepCard({
    node,
    index,
    isHighlighted,
    onDelete,
}: {
    node: WorkflowNode;
    index: number;
    isHighlighted: boolean;
    onDelete: () => void;
}) {
    const s = NODE_STYLES[node.type];
    const Icon = s.icon;
    const canDelete = node.type !== "trigger" && node.type !== "end";
    const [showConfig, setShowConfig] = useState(false);

    return (
        <div className="relative group">
            <div
                className={cn(
                    "rounded-xl border-2 transition-all duration-300 overflow-hidden",
                    isHighlighted && "scale-[1.01] shadow-lg"
                )}
                style={{
                    borderColor: isHighlighted ? s.border : s.border + "80",
                    background: isHighlighted ? s.bg : "var(--card)",
                    boxShadow: isHighlighted ? `0 0 0 3px ${s.border}30` : undefined,
                }}
            >
                <div className="flex items-start gap-3 p-3">
                    {/* Drag handle (visual only) */}
                    <div className="text-muted-foreground mt-0.5 shrink-0 cursor-grab opacity-40 group-hover:opacity-80">
                        <GripVertical size={14} />
                    </div>

                    {/* Step number */}
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5"
                        style={{ background: s.border }}
                    >
                        {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span
                                className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded"
                                style={{ background: s.border + "22", color: s.border }}
                            >
                                <Icon size={9} className="inline mr-0.5 -mt-0.5" />
                                {s.label}
                            </span>
                        </div>
                        <div className="font-semibold text-sm leading-snug">{node.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{node.description}</div>

                        {/* Inline config toggle */}
                        {(node.type === "trigger" || node.type === "action" || node.type === "delay" || node.type === "condition") && (
                            <button
                                onClick={() => setShowConfig((v) => !v)}
                                className="mt-1.5 flex items-center gap-1 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                style={{ color: s.border }}
                            >
                                <Settings2 size={11} />
                                Configure
                                {showConfig ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                        )}

                        {showConfig && <InlineConfig node={node} />}
                    </div>

                    {/* Delete */}
                    <button
                        onClick={onDelete}
                        disabled={!canDelete}
                        className={cn(
                            "shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors bg-transparent border-none",
                            canDelete
                                ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer opacity-0 group-hover:opacity-100"
                                : "opacity-0 cursor-not-allowed"
                        )}
                        title={canDelete ? "Delete step" : "Cannot delete trigger or end"}
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>

            {/* Connector line between steps */}
            <div className="flex justify-center">
                <div className="w-px h-4 border-l-2 border-dashed border-border" />
            </div>
        </div>
    );
}

// ── Run history row ───────────────────────────────────────────────────────────
function RunRow({ run }: { run: (typeof WORKFLOW_RUNS)[0] }) {
    const rs = RUN_STATUS_STYLES[run.status];
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 border-border text-xs hover:bg-muted/30 transition-colors">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: rs.color }} />
            <span className="font-semibold" style={{ color: rs.color }}>{rs.label}</span>
            <span className="text-muted-foreground">{run.startedAt}</span>
            <span className="text-muted-foreground">{run.duration}</span>
            <span className="text-muted-foreground ml-auto">
                {run.stepsCompleted}/{run.totalSteps} steps
            </span>
            {run.error && (
                <span className="text-destructive truncate max-w-[160px]" title={run.error}>
                    {run.error}
                </span>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AutomationBuilderPage() {
    const [workflows, setWorkflows] = useState<Workflow[]>(WORKFLOWS.map((w) => ({ ...w })));
    const [activeWfId, setActiveWfId] = useState(WORKFLOWS[0].id);
    const [wfNames, setWfNames] = useState<Record<string, string>>(
        Object.fromEntries(WORKFLOWS.map((w) => [w.id, w.name]))
    );
    const [wfNodes, setWfNodes] = useState<Record<string, WorkflowNode[]>>(
        Object.fromEntries(WORKFLOWS.map((w) => [w.id, [...w.nodes]]))
    );
    const [showPicker, setShowPicker] = useState(false);
    const [testRun, setTestRun] = useState(false);
    const [testNodes, setTestNodes] = useState<string[]>([]);

    const activeWf = workflows.find((w) => w.id === activeWfId)!;
    const nodes = wfNodes[activeWfId] ?? [];
    const name = wfNames[activeWfId] ?? activeWf.name;
    const ss = STATUS_STYLES[activeWf.status];
    const runs = WORKFLOW_RUNS.filter((r) => r.workflowId === activeWfId);

    function selectWf(id: string) {
        setActiveWfId(id);
        setShowPicker(false);
        setTestNodes([]);
    }

    function toggleStatus() {
        setWorkflows((prev) =>
            prev.map((w) =>
                w.id !== activeWfId
                    ? w
                    : { ...w, status: (w.status === "active" ? "inactive" : "active") as Workflow["status"] }
            )
        );
    }

    function addNode(partial: Omit<WorkflowNode, "id" | "x" | "y">) {
        const newNode: WorkflowNode = {
            ...partial,
            id: `n-${Date.now()}`,
            x: 1,
            y: (wfNodes[activeWfId]?.length ?? 0) + 1,
        };
        setWfNodes((prev) => {
            const cur = prev[activeWfId] ?? [];
            const endIdx = [...cur].reverse().findIndex((n) => n.type === "end");
            const insertAt = endIdx >= 0 ? cur.length - 1 - endIdx : cur.length;
            const updated = [...cur.slice(0, insertAt), newNode, ...cur.slice(insertAt)];
            return { ...prev, [activeWfId]: updated };
        });
        setShowPicker(false);
    }

    function deleteNode(nodeId: string) {
        setWfNodes((prev) => ({
            ...prev,
            [activeWfId]: prev[activeWfId].filter((n) => n.id !== nodeId),
        }));
    }

    function runTest() {
        setTestRun(true);
        setTestNodes([]);
        nodes.forEach((node, i) => {
            setTimeout(() => setTestNodes((p) => [...p, node.id]), i * 400);
        });
        setTimeout(() => {
            setTestRun(false);
            setTestNodes([]);
        }, nodes.length * 400 + 800);
    }

    function newAutomation() {
        const id = `wf-${Date.now()}`;
        const newWf: Workflow = {
            id,
            name: "New Automation",
            description: "Untitled automation",
            status: "draft",
            trigger: "event",
            triggerLabel: "Manual",
            runCount: 0,
            lastRun: "—",
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            nodes: [
                { id: "n-t", type: "trigger", label: "Choose a trigger", description: "Click Configure to set up your trigger", x: 1, y: 1 },
                { id: "n-e", type: "end", label: "Done", description: "Workflow complete", x: 1, y: 2 },
            ],
            edges: [{ from: "n-t", to: "n-e" }],
            tags: [],
            color: "#2563eb",
        };
        setWorkflows((p) => [newWf, ...p]);
        setWfNames((p) => ({ ...p, [id]: "New Automation" }));
        setWfNodes((p) => ({ ...p, [id]: [...newWf.nodes] }));
        setActiveWfId(id);
    }

    return (
        <div
            className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border bg-card"
            style={{ height: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)" }}
        >
            {/* ── Left: Workflow list ───────────────────────────────────────────────── */}
            <div className="w-full md:w-72 shrink-0 border-r border-border flex flex-col md:max-h-none">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                    <span className="font-extrabold text-sm">Automations</span>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={newAutomation}>
                        <Plus size={12} /> New
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto py-1 max-h-[200px] md:max-h-none">
                    {workflows.map((wf) => {
                        const ws = STATUS_STYLES[wf.status];
                        const isA = wf.id === activeWfId;
                        return (
                            <button
                                key={wf.id}
                                onClick={() => selectWf(wf.id)}
                                className="w-full text-left px-4 py-3 border-none cursor-pointer transition-colors"
                                style={{ background: isA ? "hsl(var(--accent))" : "transparent" }}
                                onMouseEnter={(e) => { if (!isA) e.currentTarget.style.background = "hsl(var(--muted))"; }}
                                onMouseLeave={(e) => { if (!isA) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div className="flex items-center justify-between mb-0.5">
                                    <span
                                        className="text-[13px] font-semibold leading-snug truncate"
                                        style={{ color: isA ? "hsl(var(--primary))" : "inherit" }}
                                    >
                                        {wfNames[wf.id] ?? wf.name}
                                    </span>
                                    <span className="w-2 h-2 rounded-full shrink-0 ml-2" style={{ background: ws.color }} />
                                </div>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    <span
                                        className="px-1.5 py-0 rounded text-[9px] font-bold"
                                        style={{ background: ws.bg, color: ws.color }}
                                    >
                                        {ws.label}
                                    </span>
                                    <span>{wf.triggerLabel}</span>
                                    <span className="ml-auto">{wf.runCount} runs</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Right: Builder ───────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
                {/* Header bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-3 sm:px-5 py-3 border-b border-border shrink-0">
                    <Input
                        value={name}
                        onChange={(e) => setWfNames((p) => ({ ...p, [activeWfId]: e.target.value }))}
                        className="h-8 text-sm font-bold border-transparent bg-transparent focus:border-border w-full sm:w-48"
                    />
                    <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: ss.bg, color: ss.color }}
                    >
                        {ss.label}
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto shrink-0">
                        <Button size="sm" variant="outline" onClick={toggleStatus} className="flex-1 sm:flex-initial">
                            {activeWf.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" className="flex-1 sm:flex-initial">
                            <Save size={13} /> Save
                        </Button>
                    </div>
                </div>

                {/* Linear step stack */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-5">
                    <div className="max-w-xl mx-auto">
                        {nodes.map((node, i) => (
                            <StepCard
                                key={node.id}
                                node={node}
                                index={i}
                                isHighlighted={testNodes.includes(node.id)}
                                onDelete={() => deleteNode(node.id)}
                            />
                        ))}

                        {/* + Add Step button */}
                        <div className="flex justify-center -mt-3 mb-1">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowPicker((v) => !v)}
                                className="rounded-full h-8 px-4 text-xs font-bold border-dashed"
                            >
                                <Plus size={12} /> Add Step
                            </Button>
                        </div>

                        {/* Step picker */}
                        {showPicker && (
                            <StepPicker onAdd={addNode} onClose={() => setShowPicker(false)} />
                        )}
                    </div>
                </div>

                {/* Bottom bar: Test Run + Run History */}
                <div className="border-t border-border shrink-0 max-h-[200px] overflow-y-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-3 sm:px-5 py-2.5 bg-card sticky top-0 z-10 border-b border-border">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={runTest}
                            disabled={testRun}
                            className="shrink-0 w-full sm:w-auto"
                        >
                            {testRun ? (
                                <><RefreshCw size={12} className="animate-spin" /> Running…</>
                            ) : (
                                <><Play size={12} /> Test Run</>
                            )}
                        </Button>
                        <span className="text-xs font-semibold text-muted-foreground">Run History</span>
                        <span className="text-xs text-muted-foreground">{runs.length} recent</span>
                    </div>
                    {runs.length > 0 && (
                        <div>
                            {runs.map((r) => (
                                <RunRow key={r.id} run={r} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
