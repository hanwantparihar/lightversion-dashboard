"use client";
import { useState } from "react";
import { Shield, Check, X } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack } from "@/components";
import { TEAM_MEMBERS, type TeamMember } from "@/lib/team-data";

const ROLE_COLORS: Record<TeamMember["role"], string> = {
    owner: "#2563eb",
    admin: "#7c3aed",
    editor: "#10b981",
    viewer: "#f59e0b",
};

type Permission = {
    label: string;
    owner: boolean;
    admin: boolean;
    editor: boolean;
    viewer: boolean;
};

const PERMISSIONS: Permission[] = [
    { label: "View all projects", owner: true, admin: true, editor: true, viewer: true },
    { label: "Create projects", owner: true, admin: true, editor: true, viewer: false },
    { label: "Edit projects", owner: true, admin: true, editor: true, viewer: false },
    { label: "Delete projects", owner: true, admin: true, editor: false, viewer: false },
    { label: "Manage members", owner: true, admin: true, editor: false, viewer: false },
    { label: "Invite members", owner: true, admin: true, editor: false, viewer: false },
    { label: "Access billing", owner: true, admin: false, editor: false, viewer: false },
    { label: "Manage API keys", owner: true, admin: true, editor: false, viewer: false },
    { label: "View analytics", owner: true, admin: true, editor: true, viewer: true },
    { label: "Export data", owner: true, admin: true, editor: true, viewer: false },
    { label: "Manage integrations", owner: true, admin: true, editor: false, viewer: false },
    { label: "Configure workspace", owner: true, admin: false, editor: false, viewer: false },
];

const roles: TeamMember["role"][] = ["owner", "admin", "editor", "viewer"];

export default function PermissionsPage() {
    const [members, setMembers] = useState(TEAM_MEMBERS);

    function cycleRole(id: string) {
        setMembers((prev) =>
            prev.map((m) => {
                if (m.id !== id || m.role === "owner") return m;
                const next: Record<string, TeamMember["role"]> = { admin: "editor", editor: "viewer", viewer: "admin" };
                return { ...m, role: next[m.role] };
            })
        );
    }

    return (
        <PageStack>

            <div className="gr g-31 g2">
                {/* Members list */}
                <Card>
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>Click a role to cycle through permissions</CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: 0 }}>
                        {members.map((m) => (
                            <div
                                key={m.id}
                                className="fb"
                                style={{
                                    padding: "14px 20px",
                                    borderBottom: "1px solid var(--bd)",
                                    alignItems: "center",
                                }}
                            >
                                <div className="fc g3">
                                    <div
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: ROLE_COLORS[m.role] + "22",
                                            color: ROLE_COLORS[m.role], fontWeight: 700,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 13,
                                        }}
                                    >
                                        {m.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                                        <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>{m.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => cycleRole(m.id)}
                                    style={{
                                        padding: "4px 12px", borderRadius: 6, border: "none", cursor: m.role === "owner" ? "default" : "pointer",
                                        background: ROLE_COLORS[m.role] + "22", color: ROLE_COLORS[m.role],
                                        fontWeight: 700, fontSize: 12, textTransform: "capitalize",
                                    }}
                                >
                                    {m.role}
                                </button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Permissions matrix */}
                <Card>
                    <CardHeader>
                        <CardTitle>Role Permissions Matrix</CardTitle>
                        <CardDescription>What each role can do in the workspace</CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: 0, overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: "10px 20px", textAlign: "left", color: "var(--mt-fg)", fontWeight: 600 }}>
                                        Permission
                                    </th>
                                    {roles.map((r) => (
                                        <th
                                            key={r}
                                            style={{
                                                padding: "10px 16px", textAlign: "center",
                                                color: ROLE_COLORS[r], fontWeight: 700, textTransform: "capitalize",
                                            }}
                                        >
                                            {r}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSIONS.map((p, i) => (
                                    <tr key={i} style={{ borderTop: "1px solid var(--bd)" }}>
                                        <td style={{ padding: "12px 20px", fontWeight: 500 }}>{p.label}</td>
                                        {roles.map((r) => (
                                            <td key={r} style={{ padding: "12px 16px", textAlign: "center" }}>
                                                {p[r] ? (
                                                    <Check size={15} style={{ color: "#10b981", margin: "0 auto" }} />
                                                ) : (
                                                    <X size={15} style={{ color: "var(--mt-fg)", margin: "0 auto" }} />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </PageStack>
    );
}
