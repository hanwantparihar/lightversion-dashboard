"use client";
import { useState } from "react";
import { Plus, Tag, Calendar, MoreHorizontal } from "lucide-react";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { PageStack } from "@/components";
import { SHARED_PROJECTS, type SharedProject } from "@/lib/team-data";

const STATUS_STYLES: Record<SharedProject["status"], { bg: string; color: string; label: string }> = {
    active: { bg: "#2563eb22", color: "#2563eb", label: "Active" },
    paused: { bg: "#f59e0b22", color: "#f59e0b", label: "Paused" },
    completed: { bg: "#10b98122", color: "#10b981", label: "Completed" },
};

export default function SharedProjectsPage() {
    const [filter, setFilter] = useState<"all" | SharedProject["status"]>("all");
    const [search, setSearch] = useState("");

    const filtered = SHARED_PROJECTS.filter((p) => {
        const matchFilter = filter === "all" || p.status === filter;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.workspace.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <PageStack>
            <div className="fb">
                <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button><Plus size={16} /> New Project</Button>
            </div>

            <div className="fc g2" style={{ flexWrap: "wrap" }}>
                {(["all", "active", "paused", "completed"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        style={{
                            padding: "6px 16px", borderRadius: 8, border: "1px solid var(--bd)", cursor: "pointer",
                            fontWeight: 600, fontSize: 13, textTransform: "capitalize",
                            background: filter === s ? "hsl(var(--primary))" : "var(--cd)",
                            color: filter === s ? "#fff" : "var(--fg)",
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="gr g-2 g2">
                {filtered.map((p) => {
                    const s = STATUS_STYLES[p.status];
                    return (
                        <Card key={p.id} style={{ overflow: "hidden" }}>
                            <CardContent style={{ paddingTop: 20 }}>
                                <div className="fb" style={{ marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                                        <div style={{ fontSize: 12, color: "var(--mt-fg)", marginTop: 2 }}>{p.workspace}</div>
                                    </div>
                                    <div className="fc g2">
                                        <span style={{ padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, fontSize: 12, fontWeight: 700 }}>
                                            {s.label}
                                        </span>
                                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)" }}>
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div style={{ marginBottom: 14 }}>
                                    <div className="fb" style={{ fontSize: 12, color: "var(--mt-fg)", marginBottom: 6 }}>
                                        <span>Progress</span>
                                        <span style={{ fontWeight: 700, color: "var(--fg)" }}>{p.progress}%</span>
                                    </div>
                                    <div style={{ height: 6, background: "var(--mt)", borderRadius: 4, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${p.progress}%`, background: "hsl(var(--primary))", borderRadius: 4, transition: "width .3s" }} />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="fc g2" style={{ flexWrap: "wrap", marginBottom: 14 }}>
                                    {p.tags.map((t) => (
                                        <span key={t} style={{ padding: "2px 8px", borderRadius: 6, background: "var(--ac)", color: "var(--ac-fg)", fontSize: 11, fontWeight: 600 }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="fb" style={{ fontSize: 12, color: "var(--mt-fg)" }}>
                                    {/* Member avatars */}
                                    <div className="fc" style={{ gap: -4 }}>
                                        {p.members.map((m, i) => (
                                            <div
                                                key={m.id}
                                                title={m.name}
                                                style={{
                                                    width: 26, height: 26, borderRadius: "50%",
                                                    background: ["#2563eb22", "#7c3aed22", "#10b98122"][i % 3],
                                                    color: ["#2563eb", "#7c3aed", "#10b981"][i % 3],
                                                    fontWeight: 700, fontSize: 11,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    marginLeft: i > 0 ? -8 : 0,
                                                    border: "2px solid var(--cd)",
                                                }}
                                            >
                                                {m.avatar}
                                            </div>
                                        ))}
                                        <span style={{ marginLeft: 8 }}>{p.members.length} members</span>
                                    </div>
                                    <span className="fc g1">
                                        <Calendar size={13} /> {p.dueDate}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--mt-fg)" }}>
                    No projects match your filters.
                </div>
            )}
        </PageStack>
    );
}
