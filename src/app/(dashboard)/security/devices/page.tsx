"use client";
import { useState } from "react";
import { Monitor, Smartphone, Tablet, ShieldCheck, ShieldAlert, LogOut, Trash2, MapPin, Globe } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Badge } from "@/components/ui";
import { PageStack } from "@/components";
import { MANAGED_DEVICES, type ManagedDevice } from "@/lib/advanced-security-data";

function DeviceIcon({ type }: { type: ManagedDevice["type"] }) {
    if (type === "mobile") return <Smartphone size={20} />;
    if (type === "tablet") return <Tablet size={20} />;
    return <Monitor size={20} />;
}

export default function DeviceManagementPage() {
    const [devices, setDevices] = useState(MANAGED_DEVICES);

    function trust(id: string) {
        setDevices((p) => p.map((d) => d.id === id ? { ...d, trusted: true } : d));
    }

    function remove(id: string) {
        setDevices((p) => p.filter((d) => d.id !== id));
    }

    const trusted = devices.filter((d) => d.trusted);
    const untrusted = devices.filter((d) => !d.trusted);

    return (
        <PageStack>
            <div className="fb">
                <div className="fc g3" style={{ fontSize: 13 }}>
                    <span className="fc g1" style={{ color: "#10b981", fontWeight: 700 }}>
                        <ShieldCheck size={15} /> {trusted.length} trusted
                    </span>
                    {untrusted.length > 0 && (
                        <span className="fc g1" style={{ color: "#ef4444", fontWeight: 700 }}>
                            <ShieldAlert size={15} /> {untrusted.length} unverified
                        </span>
                    )}
                </div>
            </div>

            {untrusted.length > 0 && (
                <div style={{ padding: "14px 20px", borderRadius: 12, border: "1px solid #ef444440", background: "#ef444410", display: "flex", alignItems: "center", gap: 12 }}>
                    <ShieldAlert size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
                    <div style={{ fontSize: 13 }}>
                        <span style={{ fontWeight: 700, color: "#ef4444" }}>{untrusted.length} unverified device{untrusted.length > 1 ? "s" : ""} </span>
                        detected. Review and trust or remove them below.
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="fc g2"><Monitor size={17} /> All Devices</CardTitle>
                    <CardDescription>{devices.length} device{devices.length !== 1 ? "s" : ""} on record</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: 0 }}>
                    {devices.map((d) => (
                        <div
                            key={d.id}
                            className="fc g3"
                            style={{
                                padding: "16px 20px",
                                borderBottom: "1px solid var(--bd)",
                                alignItems: "center",
                                background: !d.trusted ? "#ef444406" : "transparent",
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                                background: d.trusted ? "hsl(var(--primary) / 0.1)" : "#ef444418",
                                color: d.trusted ? "hsl(var(--primary))" : "#ef4444",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <DeviceIcon type={d.type} />
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1 }}>
                                <div className="fc g2" style={{ flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</span>
                                    {d.current && <Badge variant="default" className="text-xs">Current</Badge>}
                                    {!d.trusted && (
                                        <span style={{ padding: "2px 8px", borderRadius: 20, background: "#ef444418", color: "#ef4444", fontSize: 11, fontWeight: 700 }}>
                                            Unverified
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: "var(--mt-fg)", marginTop: 3 }}>
                                    {d.os} · {d.browser}
                                </div>
                                <div className="fc g3" style={{ marginTop: 4, fontSize: 12, color: "var(--mt-fg)", flexWrap: "wrap" }}>
                                    <span className="fc g1"><Globe size={12} /> {d.ip}</span>
                                    <span className="fc g1"><MapPin size={12} /> {d.location}</span>
                                    <span>Last seen: {d.lastSeen}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="fc g2">
                                {!d.trusted && (
                                    <Button size="sm" variant="outline" onClick={() => trust(d.id)}>
                                        <ShieldCheck size={14} /> Trust
                                    </Button>
                                )}
                                {!d.current && (
                                    <Button size="sm" variant="outline" onClick={() => remove(d.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </PageStack>
    );
}
