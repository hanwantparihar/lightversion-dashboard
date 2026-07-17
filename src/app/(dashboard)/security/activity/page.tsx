"use client";
import { useState } from "react";
import { Activity, Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PageStack } from "@/components";
import { ACTIVITY_EVENTS, type ActivityEvent } from "@/lib/advanced-security-data";

const CAT_STYLES: Record<ActivityEvent["category"], { bg: string; color: string }> = {
    auth: { bg: "#2563eb18", color: "#2563eb" },
    data: { bg: "#10b98118", color: "#10b981" },
    settings: { bg: "#7c3aed18", color: "#7c3aed" },
    billing: { bg: "#f59e0b18", color: "#f59e0b" },
    api: { bg: "#06b6d418", color: "#06b6d4" },
};

const CATS = ["all", "auth", "data", "settings", "billing", "api"] as const;

export default function ActivityTrackingPage() {
    const [cat, setCat] = useState<typeof CATS[number]>("all");

    const events = ACTIVITY_EVENTS.filter((e) => cat === "all" || e.category === cat);

    const summary = CATS.slice(1).map((c) => ({
        c, count: ACTIVITY_EVENTS.filter((e) => e.category === c).length,
        ...CAT_STYLES[c as ActivityEvent["category"]],
    }));

    return (
        <PageStack>

            {/* Summary tiles */}
            <div className="gr g-4 g2" style={{ "--cols": 5 } as React.CSSProperties}>
                {summary.map(({ c, count, bg, color }) => (
                    <div
                        key={c}
                        onClick={() => setCat(c as typeof CATS[number])}
                        style={{
                            padding: "16px 20px", borderRadius: 14, border: "1px solid var(--bd)",
                            background: cat === c ? bg : "var(--cd)", cursor: "pointer",
                            transition: "background .15s",
                        }}
                    >
                        <div style={{ fontSize: 22, fontWeight: 800, color }}>{count}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--mt-fg)", textTransform: "capitalize", marginTop: 2 }}>{c}</div>
                    </div>
                ))}
            </div>

            {/* Filter bar */}
            <div className="fc g2" style={{ flexWrap: "wrap" }}>
                <Filter size={14} style={{ color: "var(--mt-fg)" }} />
                {CATS.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCat(c)}
                        style={{
                            padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)",
                            cursor: "pointer", fontWeight: 600, fontSize: 12, textTransform: "capitalize",
                            background: cat === c ? "hsl(var(--primary))" : "var(--cd)",
                            color: cat === c ? "#fff" : "var(--fg)",
                        }}
                    >{c}</button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="fc g2"><Activity size={17} /> Recent Activity</CardTitle>
                    <CardDescription>{events.length} event{events.length !== 1 ? "s" : ""}</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    {events.map((ev, i) => {
                        const s = CAT_STYLES[ev.category];
                        return (
                            <div
                                key={ev.id}
                                className="fc g3"
                                style={{
                                    padding: "14px 20px",
                                    borderBottom: i < events.length - 1 ? "1px solid var(--bd)" : "none",
                                    alignItems: "flex-start",
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                    background: ev.color + "22", color: ev.color,
                                    fontWeight: 700, fontSize: 12,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {ev.avatar}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <div className="fc g2" style={{ flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: 700, fontSize: 14 }}>{ev.user}</span>
                                        <span style={{ fontSize: 14 }}>{ev.action}</span>
                                        <span style={{
                                            padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                            background: s.bg, color: s.color, textTransform: "capitalize",
                                        }}>{ev.category}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--mt-fg)", marginTop: 3 }}>{ev.detail}</div>
                                </div>

                                <div style={{ fontSize: 12, color: "var(--mt-fg)", flexShrink: 0 }}>{ev.timestamp}</div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </PageStack>
    );
}
