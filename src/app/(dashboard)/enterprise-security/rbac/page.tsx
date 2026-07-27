"use client";
import { useState } from "react";
import { Shield, Plus, Pencil, Trash2, Check, X, Users, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { RBAC_ROLES, RBAC_RESOURCES, type RbacRole } from "@/lib/enterprise-security-data";
import { spA, spB, spC, spD } from "@/lib/data.js";
import { cn } from "@/lib/utils";

export default function RbacPage() {
    const [roles, setRoles] = useState(RBAC_ROLES);
    const [active, setActive] = useState<RbacRole>(RBAC_ROLES[0]);
    const [editing, setEditing] = useState(false);
    const [editPerms, setEditPerms] = useState<string[]>([]);
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState("");

    function startEdit() {
        setEditPerms([...active.permissions]);
        setEditing(true);
    }

    function saveEdit() {
        setRoles(p => p.map(r => r.id === active.id ? { ...r, permissions: editPerms } : r));
        setActive(prev => ({ ...prev, permissions: editPerms }));
        setEditing(false);
    }

    function togglePerm(res: string) {
        setEditPerms(p => p.includes(res) ? p.filter(x => x !== res) : [...p, res]);
    }

    function addRole() {
        if (!newName.trim()) return;
        const newRole: RbacRole = {
            id: `r${Date.now()}`, name: newName.trim(),
            description: "Custom role", builtin: false, users: 0, color: "#06b6d4", permissions: [],
        };
        setRoles(p => [...p, newRole]);
        setActive(newRole); setNewName(""); setShowNew(false); startEdit();
    }

    const totalUsers = roles.reduce((s, r) => s + r.users, 0);
    const customRoles = roles.filter(r => !r.builtin).length;

    return (
        <PageStack>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-[22px] font-extrabold">Advanced RBAC</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Define fine-grained roles and resource permissions</p>
                </div>
                <Button onClick={() => setShowNew(v => !v)}><Plus size={14} /> New Role</Button>
            </div>

            <StatsGrid stats={[
                { icon: Shield, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(roles.length), label: "Total Roles", change: `${customRoles} custom`, up: true, spark: spC, color: "#2563eb" },
                { icon: Users, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: String(totalUsers), label: "Assigned Users", change: "", up: true, spark: spA, color: "#7c3aed" },
                { icon: Lock, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(RBAC_RESOURCES.length), label: "Resources", change: "protected", up: true, spark: spD, color: "#10b981" },
                { icon: CheckCircle2, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(customRoles), label: "Custom Roles", change: "created by you", up: true, spark: spB, color: "#f59e0b" },
            ]} />

            {showNew && (
                <Card>
                    <CardHeader><CardTitle className="text-sm">Create Custom Role</CardTitle></CardHeader>
                    <CardContent className="flex gap-3">
                        <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Role name" className="flex-1"
                            onKeyDown={e => e.key === "Enter" && addRole()} />
                        <Button onClick={addRole} disabled={!newName.trim()}>Create & Edit</Button>
                        <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Role list */}
                <Card className="w-56 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Roles</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {roles.map(r => {
                            const isA = r.id === active.id;
                            return (
                                <button key={r.id} onClick={() => { setActive(r); setEditing(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}>
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] truncate" style={{ fontWeight: isA ? 700 : 400, color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>{r.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{r.users} users · {r.permissions.length} perms</div>
                                    </div>
                                    {!r.builtin && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary shrink-0">Custom</span>}
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Role detail */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    {/* Header */}
                    <Card>
                        <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: active.color }} />
                                <div>
                                    <div className="font-bold text-sm flex items-center gap-2">
                                        {active.name}
                                        {active.builtin && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Built-in</span>}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{active.description}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{active.users} users assigned</span>
                                {!editing && (
                                    <>
                                        <Button size="sm" variant="outline" onClick={startEdit}><Pencil size={13} /> Edit Permissions</Button>
                                        {!active.builtin && <Button size="sm" variant="ghost" className="text-destructive"><Trash2 size={13} /></Button>}
                                    </>
                                )}
                                {editing && (
                                    <>
                                        <Button size="sm" onClick={saveEdit}><Check size={13} /> Save</Button>
                                        <Button size="sm" variant="outline" onClick={() => setEditing(false)}><X size={13} /> Cancel</Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permission matrix */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Resource Permissions</CardTitle>
                            <CardDescription>{editing ? "Toggle resources to grant or revoke access" : `${active.permissions.length} of ${RBAC_RESOURCES.length} resources allowed`}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                                {RBAC_RESOURCES.map(res => {
                                    const hasPerm = editing ? editPerms.includes(res) : active.permissions.includes(res);
                                    return (
                                        <button key={res}
                                            onClick={() => editing && togglePerm(res)}
                                            disabled={!editing}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-xs font-semibold capitalize",
                                                editing ? "cursor-pointer" : "cursor-default",
                                                hasPerm
                                                    ? "border-[#10b981] bg-[#10b98112] text-foreground"
                                                    : "border-border bg-transparent text-muted-foreground",
                                                editing && !hasPerm && "hover:border-muted-foreground",
                                            )}>
                                            {hasPerm
                                                ? <CheckCircle2 size={14} className="text-[#10b981] shrink-0" />
                                                : <X size={14} className="text-muted-foreground shrink-0" />}
                                            {res.replace(/_/g, " ")}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned users */}
                    {active.users > 0 && (
                        <Card>
                            <CardHeader><CardTitle className="text-sm">{active.users} Assigned Users</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex gap-2 flex-wrap">
                                    {Array.from({ length: active.users }, (_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                                            style={{ background: active.color }}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                    <Button size="sm" variant="outline" className="ml-2"><Plus size={13} /> Assign User</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PageStack>
    );
}
