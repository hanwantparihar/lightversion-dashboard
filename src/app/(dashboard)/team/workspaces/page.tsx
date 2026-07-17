"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, Users, FolderKanban, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { PageStack } from "@/components";
import { WORKSPACES, type Workspace } from "@/lib/team-data";

// ── Dropdown menu anchored to the ⋯ button ────────────────────────────────────
function WorkspaceMenu({
    ws,
    onRename,
    onDelete,
}: {
    ws: Workspace;
    onRename: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((v) => !v)}
                style={{ color: "var(--mt-fg)", cursor: "pointer", background: "none", border: "none", padding: 4, borderRadius: 6, display: "flex" }}
            >
                <MoreHorizontal size={18} />
            </button>
            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50,
                    background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)", minWidth: 160, overflow: "hidden",
                }}>
                    <button
                        onClick={() => { setOpen(false); onRename(ws.id); }}
                        style={{ width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, color: "var(--fg)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mt)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                        <Pencil size={14} style={{ color: "var(--mt-fg)" }} /> Rename
                    </button>
                    <div style={{ height: 1, background: "var(--bd)", margin: "2px 0" }} />
                    <button
                        onClick={() => { setOpen(false); onDelete(ws.id); }}
                        style={{ width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, color: "#ef4444" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#ef444410")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                        <Trash2 size={14} /> Delete workspace
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Confirm delete dialog ─────────────────────────────────────────────────────
function DeleteConfirm({
    ws,
    onConfirm,
    onCancel,
}: {
    ws: Workspace;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={onCancel}
        >
            <div
                style={{ background: "var(--cd)", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="fb" style={{ marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "#ef444418", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={20} style={{ color: "#ef4444" }} />
                    </div>
                    <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)", display: "flex" }}>
                        <X size={18} />
                    </button>
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Delete workspace?</div>
                <p style={{ fontSize: 14, color: "var(--mt-fg)", lineHeight: 1.6, marginBottom: 24 }}>
                    Are you sure you want to delete <strong style={{ color: "var(--fg)" }}>{ws.name}</strong>?
                    This will permanently remove the workspace and all its projects. This action cannot be undone.
                </p>
                <div className="fc g2" style={{ justifyContent: "flex-end" }}>
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button
                        onClick={onConfirm}
                        style={{ background: "#ef4444", borderColor: "#ef4444" }}
                    >
                        <Trash2 size={14} /> Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Rename dialog ─────────────────────────────────────────────────────────────
function RenameDialog({
    ws,
    onConfirm,
    onCancel,
}: {
    ws: Workspace;
    onConfirm: (name: string) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(ws.name);
    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={onCancel}
        >
            <div
                style={{ background: "var(--cd)", borderRadius: 16, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="fb" style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>Rename workspace</div>
                    <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)", display: "flex" }}>
                        <X size={18} />
                    </button>
                </div>
                <div className="fm" style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Workspace name</label>
                    <Input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onConfirm(name.trim()); if (e.key === "Escape") onCancel(); }}
                    />
                </div>
                <div className="fc g2" style={{ justifyContent: "flex-end" }}>
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={() => { if (name.trim()) onConfirm(name.trim()); }} disabled={!name.trim()}>
                        <Pencil size={14} /> Rename
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WorkspacesPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(WORKSPACES);
    const [search, setSearch] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Workspace | null>(null);
    const [renameTarget, setRenameTarget] = useState<Workspace | null>(null);

    const filtered = workspaces.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
    );

    const colors = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

    function addWorkspace() {
        if (!newName.trim()) return;
        setWorkspaces((prev) => [
            ...prev,
            {
                id: `ws${Date.now()}`,
                name: newName.trim(),
                description: newDesc.trim() || "No description",
                members: 1,
                projects: 0,
                color: colors[prev.length % colors.length],
            },
        ]);
        setNewName("");
        setNewDesc("");
        setShowNew(false);
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setWorkspaces((prev) => prev.filter((w) => w.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    function confirmRename(name: string) {
        if (!renameTarget) return;
        setWorkspaces((prev) => prev.map((w) => w.id === renameTarget.id ? { ...w, name } : w));
        setRenameTarget(null);
    }

    return (
        <PageStack>
            {/* Dialogs */}
            {deleteTarget && (
                <DeleteConfirm ws={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
            )}
            {renameTarget && (
                <RenameDialog ws={renameTarget} onConfirm={confirmRename} onCancel={() => setRenameTarget(null)} />
            )}

            <div className="fb">
                <div>
                    <h2 style={{ fontWeight: 800, fontSize: 22 }}>Team Workspaces</h2>
                    <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>
                        Organize your team into focused workspaces
                    </p>
                </div>
                <div className="fc g2">
                    <Input
                        placeholder="Search workspaces..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 220 }}
                    />
                    <Button onClick={() => setShowNew(true)}>
                        <Plus size={16} /> New Workspace
                    </Button>
                </div>
            </div>

            {showNew && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Workspace</CardTitle>
                        <CardDescription>Set up a new shared workspace for your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="sy" style={{ gap: 12 }}>
                            <div className="fm">
                                <label style={{ fontSize: 13, fontWeight: 600 }}>Name</label>
                                <Input placeholder="Workspace name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            </div>
                            <div className="fm">
                                <label style={{ fontSize: 13, fontWeight: 600 }}>Description</label>
                                <Input placeholder="Short description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                            </div>
                            <div className="fc g2">
                                <Button onClick={addWorkspace}>Create</Button>
                                <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="gr g-4 g2">
                {filtered.map((ws) => (
                    <Card key={ws.id} style={{ overflow: "hidden" }}>
                        <div style={{ height: 6, background: ws.color }} />
                        <CardContent style={{ paddingTop: 20 }}>
                            <div className="fb" style={{ marginBottom: 12 }}>
                                <div
                                    style={{
                                        width: 42, height: 42, borderRadius: 10,
                                        background: ws.color + "22", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontSize: 18, fontWeight: 800, color: ws.color,
                                    }}
                                >
                                    {ws.name[0]}
                                </div>
                                <WorkspaceMenu
                                    ws={ws}
                                    onRename={(id) => setRenameTarget(workspaces.find((w) => w.id === id) ?? null)}
                                    onDelete={(id) => setDeleteTarget(workspaces.find((w) => w.id === id) ?? null)}
                                />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{ws.name}</div>
                            <div style={{ fontSize: 13, color: "var(--mt-fg)", marginBottom: 16, lineHeight: 1.5 }}>
                                {ws.description}
                            </div>
                            <div className="fc g3" style={{ fontSize: 13, color: "var(--mt-fg)" }}>
                                <span className="fc g1"><Users size={14} /> {ws.members} members</span>
                                <span className="fc g1"><FolderKanban size={14} /> {ws.projects} projects</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--mt-fg)" }}>
                    No workspaces found.
                </div>
            )}
        </PageStack>
    );
}