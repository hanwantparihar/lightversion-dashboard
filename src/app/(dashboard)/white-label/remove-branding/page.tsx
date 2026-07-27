"use client";
import { useState } from "react";
import {
    EyeOff, Check, X, ShieldCheck, ToggleLeft, ToggleRight,
    AlertTriangle, Sparkles, Crown, Info,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui";
import { PageStack, StatsGrid } from "@/components";
import { TENANTS, WHITE_LABEL_CONFIGS, DEFAULT_WHITE_LABEL, type WhiteLabelConfig } from "@/lib/tenant-data";
import { spA, spB, spC, spD } from "@/lib/data.js";

interface BrandingFeature {
    key: keyof Pick<WhiteLabelConfig, "removePoweredBy" | "removeFooterLogo" | "customCss">;
    label: string;
    desc: string;
    planRequired: "pro" | "enterprise";
    icon: typeof EyeOff;
    preview: string; // what it removes
}

const FEATURES: BrandingFeature[] = [
    {
        key: "removePoweredBy",
        label: "Remove \"Powered by Nexora AI\"",
        desc: "Hides the powered-by badge on the login page, sign-up screen, and email footers.",
        planRequired: "pro",
        icon: EyeOff,
        preview: "Login page · Emails",
    },
    {
        key: "removeFooterLogo",
        label: "Remove Footer Logo & Links",
        desc: "Strips the Nexora AI logo and navigation links from the app footer on all pages.",
        planRequired: "enterprise",
        icon: EyeOff,
        preview: "All pages footer",
    },
    {
        key: "customCss",
        label: "Custom CSS Injection",
        desc: "Inject tenant-specific CSS to override any UI element — full visual control.",
        planRequired: "enterprise",
        icon: ShieldCheck,
        preview: "Global styles",
    },
];

export default function RemoveBrandingPage() {
    const [configs, setConfigs] = useState<Record<string, WhiteLabelConfig>>(
        Object.fromEntries(WHITE_LABEL_CONFIGS.map(c => [c.tenantId, c]))
    );
    const [saved, setSaved] = useState<Record<string, boolean>>({});

    function toggle(tenantId: string, key: BrandingFeature["key"]) {
        setConfigs(p => ({
            ...p,
            [tenantId]: {
                ...(p[tenantId] ?? { ...DEFAULT_WHITE_LABEL, tenantId }),
                [key]: !(p[tenantId]?.[key] ?? false),
            },
        }));
    }

    function saveForTenant(tenantId: string) {
        setSaved(p => ({ ...p, [tenantId]: true }));
        setTimeout(() => setSaved(p => ({ ...p, [tenantId]: false })), 2000);
    }

    const activeTenants = TENANTS.filter(t => t.status !== "churned");

    // Stats
    const removedPoweredBy = Object.values(configs).filter(c => c.removePoweredBy).length;
    const removedFooter = Object.values(configs).filter(c => c.removeFooterLogo).length;
    const customCssEnabled = Object.values(configs).filter(c => c.customCss).length;
    const fullWhiteLabel = Object.values(configs).filter(c => c.removePoweredBy && c.removeFooterLogo).length;

    return (
        <PageStack>

            <StatsGrid stats={[
                { icon: EyeOff, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", value: String(removedPoweredBy), label: '"Powered by" removed', change: `of ${activeTenants.length}`, up: true, spark: spC, color: "#2563eb" },
                { icon: EyeOff, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: String(removedFooter), label: "Footer hidden", change: "tenants", up: true, spark: spA, color: "#7c3aed" },
                { icon: ShieldCheck, grad: "linear-gradient(135deg,#10b981,#059669)", value: String(customCssEnabled), label: "Custom CSS active", change: "tenants", up: true, spark: spD, color: "#10b981" },
                { icon: Crown, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: String(fullWhiteLabel), label: "Full white-label", change: "complete", up: true, spark: spB, color: "#f59e0b" },
            ]} />

            {/* Feature legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2"><Info size={15} /> White-Label Feature Matrix</CardTitle>
                    <CardDescription>Which plan unlocks each branding removal feature</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {FEATURES.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <div key={f.key} className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-border flex-wrap">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon size={16} className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                        {f.label}
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                                            style={{
                                                background: f.planRequired === "enterprise" ? "#f59e0b22" : "#7c3aed22",
                                                color: f.planRequired === "enterprise" ? "#f59e0b" : "#7c3aed"
                                            }}>
                                            {f.planRequired}+
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">Affects: {f.preview}</span>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Per-tenant control */}
            <div className="flex flex-col gap-4">
                {activeTenants.map(tenant => {
                    const cfg = configs[tenant.id] ?? { ...DEFAULT_WHITE_LABEL, tenantId: tenant.id };
                    const isPro = tenant.plan === "pro" || tenant.plan === "enterprise";
                    const isEnterprise = tenant.plan === "enterprise";
                    const planLevel = isEnterprise ? 2 : isPro ? 1 : 0;

                    const enabledCount = FEATURES.filter(f => cfg[f.key]).length;

                    return (
                        <Card key={tenant.id}>
                            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0"
                                        style={{ background: tenant.color + "22", color: tenant.color }}>{tenant.avatar}</div>
                                    <div>
                                        <div className="font-bold text-sm flex items-center gap-2">
                                            {tenant.name}
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                                                style={{
                                                    background: isEnterprise ? "#f59e0b22" : isPro ? "#7c3aed22" : "#94a3b822",
                                                    color: isEnterprise ? "#f59e0b" : isPro ? "#7c3aed" : "#94a3b8"
                                                }}>
                                                {tenant.plan}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{tenant.domain}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{enabledCount}/{FEATURES.length} features active</span>
                                    <Button size="sm" variant={saved[tenant.id] ? "default" : "outline"} onClick={() => saveForTenant(tenant.id)}>
                                        {saved[tenant.id] ? <><Check size={13} /> Saved</> : "Save"}
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {FEATURES.map(f => {
                                    const Icon = f.icon;
                                    const featureLevel = f.planRequired === "enterprise" ? 2 : 1;
                                    const canUse = planLevel >= featureLevel;
                                    const isOn = canUse && (cfg[f.key] as boolean);

                                    return (
                                        <div key={f.key}
                                            className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border"
                                            style={{ opacity: canUse ? 1 : 0.5 }}>
                                            <Icon size={15} className="text-muted-foreground shrink-0" />
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold">{f.label}</div>
                                                {!canUse && (
                                                    <div className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                                                        <AlertTriangle size={11} /> Requires {f.planRequired} plan
                                                    </div>
                                                )}
                                            </div>
                                            {/* Visual indicator */}
                                            <div className="flex items-center gap-2">
                                                {isOn ? (
                                                    <span className="text-xs font-semibold flex items-center gap-1 text-[#10b981]">
                                                        <Check size={12} /> Removed
                                                    </span>
                                                ) : canUse ? (
                                                    <span className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                                                        <X size={12} /> Showing
                                                    </span>
                                                ) : null}
                                                <button
                                                    onClick={() => canUse && toggle(tenant.id, f.key)}
                                                    disabled={!canUse}
                                                    className="bg-transparent border-none flex"
                                                    style={{ cursor: canUse ? "pointer" : "not-allowed", color: isOn ? "#10b981" : "var(--mt-fg)" }}>
                                                    {isOn ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Preview comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2"><EyeOff size={15} /> Before / After Preview</CardTitle>
                    <CardDescription>Visual example of branding removal effect</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "With Nexora AI Branding", powered: true, footer: true },
                            { label: "Full White-Label", powered: false, footer: false },
                        ].map(({ label, powered, footer }) => (
                            <div key={label}>
                                <div className="text-xs font-bold text-muted-foreground mb-2">{label}</div>
                                <div className="rounded-xl border border-border overflow-hidden">
                                    {/* Nav */}
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-primary">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                                <Sparkles size={12} className="text-white" />
                                            </div>
                                            <span className="text-white font-bold text-xs">Your App</span>
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="p-4 bg-muted/20 flex flex-col items-center gap-2">
                                        <div className="h-6 bg-muted rounded w-24" />
                                        <div className="h-4 bg-muted rounded w-32" />
                                        <div className="h-4 bg-muted rounded w-20" />
                                    </div>
                                    {/* Footer */}
                                    <div className="px-4 py-2.5 border-t border-border bg-card flex items-center justify-between">
                                        {footer ? (
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Sparkles size={9} /> Powered by Nexora AI
                                            </div>
                                        ) : (
                                            <div className="text-[10px] text-muted-foreground">© 2026 Your Company</div>
                                        )}
                                        {powered ? (
                                            <span className="text-[10px] text-muted-foreground">nexora.ai</span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
