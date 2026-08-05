"use client";
import { useState } from "react";
import { Tag, Plus, Copy, Trash2, Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input, Label, Switch } from "@/components/ui";
import { PageStack } from "@/components";
import { COUPONS, type Coupon } from "@/lib/advanced-billing-data";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);
    const [showAdd, setShowAdd] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [newCode, setNewCode] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newType, setNewType] = useState<"percent" | "fixed">("percent");
    const [newVal, setNewVal] = useState("");
    const [newMax, setNewMax] = useState("");
    const [newExp, setNewExp] = useState("");

    function addCoupon() {
        if (!newCode.trim() || !newVal) return;
        setCoupons((p) => [...p, {
            id: `cp${Date.now()}`,
            code: newCode.toUpperCase().trim(),
            description: newDesc || newCode,
            type: newType,
            value: Number(newVal),
            usedCount: 0,
            maxUses: newMax ? Number(newMax) : null,
            expiresAt: newExp || null,
            active: true,
            appliesTo: "all",
        }]);
        setNewCode(""); setNewDesc(""); setNewType("percent"); setNewVal(""); setNewMax(""); setNewExp("");
        setShowAdd(false);
    }

    function toggle(id: string) {
        setCoupons((p) => p.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    }

    function remove(id: string) {
        setCoupons((p) => p.filter((c) => c.id !== id));
    }

    function copy(code: string) {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(code);
        setTimeout(() => setCopied(null), 1500);
    }

    return (
        <PageStack>
            <div className="fb">
                <Button onClick={() => setShowAdd((v) => !v)}><Plus size={15} /> New Coupon</Button>
            </div>

            {showAdd && (
                <Card>
                    <CardHeader><CardTitle>Create Coupon</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 14 }}>
                            <div className="flex flex-col gap-1.5">
                                <Label>Code</Label>
                                <Input placeholder="e.g. SUMMER25" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Description</Label>
                                <Input placeholder="Short description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Discount type</Label>
                                <div className="fc g2">
                                    {(["percent", "fixed"] as const).map((t) => (
                                        <button key={t} onClick={() => setNewType(t)} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--bd)", cursor: "pointer", fontWeight: 700, fontSize: 12, background: newType === t ? "hsl(var(--primary))" : "var(--cd)", color: newType === t ? "#fff" : "var(--fg)" }}>
                                            {t === "percent" ? "% Percent" : "$ Fixed"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Value ({newType === "percent" ? "%" : "$"})</Label>
                                <Input type="number" placeholder={newType === "percent" ? "e.g. 20" : "e.g. 50"} value={newVal} onChange={(e) => setNewVal(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Max uses (optional)</Label>
                                <Input type="number" placeholder="Leave blank for unlimited" value={newMax} onChange={(e) => setNewMax(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Expires (optional)</Label>
                                <Input type="date" value={newExp} onChange={(e) => setNewExp(e.target.value)} />
                            </div>
                        </div>
                        <div className="fc g2">
                            <Button onClick={addCoupon} disabled={!newCode.trim() || !newVal}>Create</Button>
                            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="gr g-2 g2">
                {coupons.map((c) => {
                    const pctUsed = c.maxUses ? (c.usedCount / c.maxUses) * 100 : null;
                    const expired = !c.active;
                    return (
                        <Card key={c.id} style={{ opacity: expired ? 0.65 : 1 }}>
                            <CardContent style={{ paddingTop: 20 }}>
                                <div className="fb" style={{ marginBottom: 10 }}>
                                    <div className="fc g2">
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Tag size={17} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "0.04em" }}>{c.code}</div>
                                            <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>{c.description}</div>
                                        </div>
                                    </div>
                                    <div className="fc g2">
                                        <button onClick={() => copy(c.code)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)" }} title="Copy code">
                                            {copied === c.code ? <Check size={15} style={{ color: "#10b981" }} /> : <Copy size={15} />}
                                        </button>
                                        <Switch
                                            checked={c.active}
                                            onChange={() => toggle(c.id)}
                                        />
                                        <button onClick={() => remove(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)" }}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="fc g3" style={{ flexWrap: "wrap", marginBottom: 12 }}>
                                    <span style={{ padding: "3px 10px", borderRadius: 20, background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))", fontWeight: 800, fontSize: 14 }}>
                                        {c.type === "percent" ? `${c.value}% OFF` : `$${c.value} OFF`}
                                    </span>
                                    <span style={{ fontSize: 12, color: "var(--mt-fg)", textTransform: "capitalize" }}>
                                        Applies to: {c.appliesTo}
                                    </span>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--mt-fg)" }}>
                                    <div className="fb">
                                        <span>{c.usedCount} uses{c.maxUses ? ` / ${c.maxUses}` : " (unlimited)"}</span>
                                        {c.expiresAt && <span>Expires {c.expiresAt}</span>}
                                    </div>
                                    {pctUsed !== null && (
                                        <div style={{ height: 5, background: "var(--mt)", borderRadius: 4, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${Math.min(pctUsed, 100)}%`, background: pctUsed >= 90 ? "#ef4444" : "hsl(var(--primary))", borderRadius: 4 }} />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </PageStack>
    );
}
