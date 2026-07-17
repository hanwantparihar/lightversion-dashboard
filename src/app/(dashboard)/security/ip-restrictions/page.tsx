"use client";
import { useState } from "react";
import { Globe, Plus, Trash2, ToggleLeft, ToggleRight, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input, Label } from "@/components/ui";
import { PageStack } from "@/components";
import { IP_RULES, type IpRule } from "@/lib/advanced-security-data";

export default function IpRestrictionsPage() {
    const [rules, setRules] = useState<IpRule[]>(IP_RULES);
    const [showAdd, setShowAdd] = useState(false);
    const [newLabel, setNewLabel] = useState("");
    const [newIp, setNewIp] = useState("");
    const [newType, setNewType] = useState<"allow" | "deny">("allow");

    function addRule() {
        if (!newIp.trim()) return;
        setRules((p) => [...p, {
            id: `ip${Date.now()}`, label: newLabel || newIp,
            ip: newIp.trim(), type: newType,
            addedBy: "alice@nexora.ai", addedAt: "Jul 1, 2026", active: true,
        }]);
        setNewLabel(""); setNewIp(""); setNewType("allow"); setShowAdd(false);
    }

    function toggleActive(id: string) {
        setRules((p) => p.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    }

    function deleteRule(id: string) {
        setRules((p) => p.filter((r) => r.id !== id));
    }

    const allows = rules.filter((r) => r.type === "allow");
    const denies = rules.filter((r) => r.type === "deny");

    return (
        <PageStack>
            <div className="fb">
                <Button onClick={() => setShowAdd((v) => !v)}><Plus size={15} /> Add Rule</Button>
            </div>

            {showAdd && (
                <Card>
                    <CardHeader><CardTitle>New IP Rule</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 14 }}>
                            <div className="flex flex-col gap-1.5">
                                <Label>Label</Label>
                                <Input placeholder="e.g. Office Network" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>IP / CIDR</Label>
                                <Input placeholder="e.g. 192.168.1.0/24" value={newIp} onChange={(e) => setNewIp(e.target.value)} />
                            </div>
                        </div>
                        <div className="fc g3" style={{ marginBottom: 16 }}>
                            {(["allow", "deny"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setNewType(t)}
                                    style={{
                                        padding: "6px 18px", borderRadius: 8, border: "1px solid var(--bd)",
                                        cursor: "pointer", fontWeight: 700, fontSize: 13, textTransform: "capitalize",
                                        background: newType === t ? (t === "allow" ? "#10b98122" : "#ef444422") : "var(--cd)",
                                        color: newType === t ? (t === "allow" ? "#10b981" : "#ef4444") : "var(--fg)",
                                    }}
                                >{t}</button>
                            ))}
                        </div>
                        <div className="fc g2">
                            <Button onClick={addRule} disabled={!newIp.trim()}>Add Rule</Button>
                            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="gr g-2 g2">
                {[{ label: "Allow List", icon: ShieldCheck, color: "#10b981", items: allows },
                { label: "Deny List", icon: ShieldX, color: "#ef4444", items: denies }].map(({ label, icon: Icon, color, items }) => (
                    <Card key={label}>
                        <CardHeader>
                            <CardTitle className="fc g2" style={{ color }}><Icon size={17} /> {label}</CardTitle>
                            <CardDescription>{items.length} rule{items.length !== 1 ? "s" : ""}</CardDescription>
                        </CardHeader>
                        <CardContent style={{ padding: 0 }}>
                            {items.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-muted-foreground">No rules defined.</p>
                            ) : (
                                items.map((r) => (
                                    <div key={r.id} className="fb" style={{ padding: "14px 20px", borderBottom: "1px solid var(--bd)", alignItems: "center" }}>
                                        <div className="fc g3">
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 8, background: color + "18",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <Globe size={16} style={{ color }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                                                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--mt-fg)" }}>{r.ip}</div>
                                                <div style={{ fontSize: 11, color: "var(--mt-fg)", marginTop: 2 }}>Added by {r.addedBy} · {r.addedAt}</div>
                                            </div>
                                        </div>
                                        <div className="fc g2">
                                            <button
                                                onClick={() => toggleActive(r.id)}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: r.active ? color : "var(--mt-fg)" }}
                                                title={r.active ? "Disable" : "Enable"}
                                            >
                                                {r.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                            </button>
                                            <button
                                                onClick={() => deleteRule(r.id)}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)" }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </PageStack>
    );
}
