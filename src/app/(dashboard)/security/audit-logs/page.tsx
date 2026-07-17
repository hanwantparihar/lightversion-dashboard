"use client";
import { useState } from "react";
import { ShieldAlert, Search, Download, Info, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Input, Button } from "@/components/ui";
import { PageStack } from "@/components";
import { AUDIT_LOGS, type AuditLog } from "@/lib/advanced-security-data";

const SEV_STYLES: Record<AuditLog["severity"], { icon: typeof Info; bg: string; color: string; label: string }> = {
    info: { icon: Info, bg: "#2563eb18", color: "#2563eb", label: "Info" },
    warning: { icon: AlertTriangle, bg: "#f59e0b18", color: "#f59e0b", label: "Warning" },
    critical: { icon: XCircle, bg: "#ef444418", color: "#ef4444", label: "Critical" },
};

export default function AuditLogsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | AuditLog["severity"]>("all");

    const rows = AUDIT_LOGS.filter((l) => {
        const matchSev = filter === "all" || l.severity === filter;
        const q = search.toLowerCase();
        const matchQ = !q || l.action.toLowerCase().includes(q) || l.actor.toLowerCase().includes(q) || l.ip.includes(q);
        return matchSev && matchQ;
    });

    return (
        <PageStack>
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                    <div>
                        <CardTitle className="fc g2"><ShieldAlert size={18} /> Audit Logs</CardTitle>
                        <CardDescription>Full history of security-relevant actions across your workspace</CardDescription>
                    </div>
                    <div className="fc g2" style={{ flexWrap: "wrap" }}>
                        {(["all", "info", "warning", "critical"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                style={{
                                    padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)",
                                    cursor: "pointer", fontWeight: 600, fontSize: 12, textTransform: "capitalize",
                                    background: filter === s ? "hsl(var(--primary))" : "var(--cd)",
                                    color: filter === s ? "#fff" : "var(--fg)",
                                }}
                            >{s}</button>
                        ))}
                        <Button variant="outline" size="sm"><Download size={14} /> Export</Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div style={{ position: "relative", marginBottom: 16 }}>
                        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                        <Input
                            placeholder="Search by action, actor, or IP…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: 34 }}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-3 font-semibold">Severity</th>
                                    <th className="pb-3 font-semibold">Action</th>
                                    <th className="pb-3 font-semibold">Actor</th>
                                    <th className="pb-3 font-semibold">Resource</th>
                                    <th className="pb-3 font-semibold">IP</th>
                                    <th className="pb-3 font-semibold">Location</th>
                                    <th className="pb-3 font-semibold">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((l) => {
                                    const s = SEV_STYLES[l.severity];
                                    const Icon = s.icon;
                                    return (
                                        <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="py-3">
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, fontWeight: 700, fontSize: 11 }}>
                                                    <Icon size={11} /> {s.label}
                                                </span>
                                            </td>
                                            <td className="py-3 font-medium">{l.action}</td>
                                            <td className="py-3 text-muted-foreground">
                                                <div style={{ fontSize: 13 }}>{l.actor}</div>
                                                <div style={{ fontSize: 11, color: "var(--mt-fg)" }}>{l.actorRole}</div>
                                            </td>
                                            <td className="py-3 font-mono text-xs text-muted-foreground">{l.resource}</td>
                                            <td className="py-3 font-mono text-xs">{l.ip}</td>
                                            <td className="py-3 text-muted-foreground text-xs">{l.location}</td>
                                            <td className="py-3 text-muted-foreground text-xs whitespace-nowrap">{l.timestamp}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {rows.length === 0 && (
                            <p className="py-10 text-center text-muted-foreground text-sm">No logs match your filters.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
