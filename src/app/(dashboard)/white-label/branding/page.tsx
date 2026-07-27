"use client";
import { useState } from "react";
import {
    Paintbrush, Upload, Check, Twitter, Linkedin, Mail,
    Link2, ChevronRight, Eye, Save, RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Input, Label } from "@/components/ui";
import { PageStack } from "@/components";
import {
    TENANTS, WHITE_LABEL_CONFIGS, DEFAULT_WHITE_LABEL,
    type WhiteLabelConfig,
} from "@/lib/tenant-data";

// ── Live preview ──────────────────────────────────────────────────────────────
function BrandPreview({ cfg }: { cfg: WhiteLabelConfig }) {
    return (
        <div className="rounded-xl overflow-hidden border border-border shadow-sm" style={{ fontFamily: "inherit" }}>
            {/* Simulated browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b border-border">
                <div className="flex gap-1.5">
                    {["#ef4444", "#f59e0b", "#10b981"].map(c => (
                        <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                    ))}
                </div>
                <div className="flex-1 text-xs bg-card rounded-md px-3 py-1 text-muted-foreground truncate border border-border">
                    {cfg.customDomain || `tenant.nexora.ai`}
                </div>
            </div>

            {/* Navbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border" style={{ background: cfg.primaryColor }}>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-extrabold text-[11px]">
                        {(cfg.appName || "App")[0]}
                    </div>
                    <span className="text-white font-bold text-sm">{cfg.appName || "Your App"}</span>
                </div>
                <div className="flex items-center gap-3">
                    {["Dashboard", "Analytics", "Settings"].map(n => (
                        <span key={n} className="text-white/80 text-xs">{n}</span>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-white/20" />
                </div>
            </div>

            {/* Login page preview */}
            <div className="p-8 flex flex-col items-center gap-4" style={{ background: cfg.loginPageBg || "#f8fafc" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white"
                    style={{ background: cfg.primaryColor }}>
                    {(cfg.appName || "A")[0]}
                </div>
                <div className="text-center">
                    <div className="font-bold text-base">{cfg.appName || "Your App"}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cfg.tagline || "Your tagline here"}</div>
                </div>
                <div className="w-full max-w-[200px] flex flex-col gap-2">
                    <div className="h-8 rounded-lg bg-white border border-border text-xs px-3 flex items-center text-muted-foreground">Email address</div>
                    <div className="h-8 rounded-lg bg-white border border-border text-xs px-3 flex items-center text-muted-foreground">Password</div>
                    <div className="h-8 rounded-lg text-white text-xs flex items-center justify-center font-semibold"
                        style={{ background: cfg.primaryColor }}>Sign in</div>
                </div>
                {!cfg.removePoweredBy && (
                    <div className="text-[10px] text-muted-foreground">Powered by Nexora AI</div>
                )}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomBrandingPage() {
    const [activeTenantId, setActiveTenantId] = useState(TENANTS[0].id);
    const [configs, setConfigs] = useState<Record<string, WhiteLabelConfig>>(
        Object.fromEntries(WHITE_LABEL_CONFIGS.map(c => [c.tenantId, c]))
    );
    const [saved, setSaved] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const tenant = TENANTS.find(t => t.id === activeTenantId)!;
    const cfg = configs[activeTenantId] ?? { ...DEFAULT_WHITE_LABEL, tenantId: activeTenantId };

    function update<K extends keyof WhiteLabelConfig>(key: K, value: WhiteLabelConfig[K]) {
        setConfigs(p => ({ ...p, [activeTenantId]: { ...(p[activeTenantId] ?? { ...DEFAULT_WHITE_LABEL, tenantId: activeTenantId }), [key]: value } }));
    }

    function save() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    const isPro = tenant.plan === "pro" || tenant.plan === "enterprise";
    const isEnterprise = tenant.plan === "enterprise";

    return (
        <PageStack>
            <div className="flex items-start justify-between gap-3 flex-wrap">
                {/* <div>
                    <h2 className="text-[22px] font-extrabold">Custom Branding</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Configure white-label branding per tenant</p>
                </div> */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(v => !v)}>
                        <Eye size={14} /> {showPreview ? "Hide" : "Show"} Preview
                    </Button>
                    <Button size="sm" onClick={save}>
                        {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
                    </Button>
                </div>
            </div>

            <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
                {/* Tenant selector */}
                <Card className="w-52 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Tenant</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {TENANTS.filter(t => t.status !== "churned").map(t => {
                            const isA = t.id === activeTenantId;
                            return (
                                <button key={t.id} onClick={() => setActiveTenantId(t.id)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left border-none transition-colors"
                                    style={{ background: isA ? "var(--ac)" : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--mt)"; }}
                                    onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0"
                                        style={{ background: t.color + "22", color: t.color }}>{t.avatar}</div>
                                    <div className="min-w-0">
                                        <div className="text-[13px] truncate" style={{ fontWeight: isA ? 700 : 400, color: isA ? "hsl(var(--primary))" : "var(--fg)" }}>
                                            {t.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground capitalize">{t.plan}</div>
                                    </div>
                                    {isA && <ChevronRight size={12} className="ml-auto shrink-0 text-primary" />}
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Config */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                    {/* Plan gate */}
                    {!isPro && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-3 text-sm flex items-center gap-2">
                            <Paintbrush size={15} className="text-amber-600 shrink-0" />
                            <span>Custom branding requires <strong>Pro or Enterprise</strong>. Upgrade this tenant's plan to enable.</span>
                        </div>
                    )}

                    {/* Identity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2"><Paintbrush size={15} /> Brand Identity</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">App / Product Name</Label>
                                <Input value={cfg.appName} onChange={e => update("appName", e.target.value)} placeholder="Your App Name" disabled={!isPro} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Tagline</Label>
                                <Input value={cfg.tagline} onChange={e => update("tagline", e.target.value)} placeholder="Short description" disabled={!isPro} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Primary Color</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={cfg.primaryColor} onChange={e => update("primaryColor", e.target.value)}
                                        disabled={!isPro} className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card" />
                                    <Input value={cfg.primaryColor} onChange={e => update("primaryColor", e.target.value)} className="font-mono text-xs" disabled={!isPro} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Accent Color</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={cfg.accentColor} onChange={e => update("accentColor", e.target.value)}
                                        disabled={!isPro} className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card" />
                                    <Input value={cfg.accentColor} onChange={e => update("accentColor", e.target.value)} className="font-mono text-xs" disabled={!isPro} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Login Page Background</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={cfg.loginPageBg} onChange={e => update("loginPageBg", e.target.value)}
                                        disabled={!isPro} className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-card" />
                                    <Input value={cfg.loginPageBg} onChange={e => update("loginPageBg", e.target.value)} className="font-mono text-xs" disabled={!isPro} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">Support Email</Label>
                                <div className="relative">
                                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input value={cfg.supportEmail} onChange={e => update("supportEmail", e.target.value)}
                                        placeholder="support@yourco.com" className="pl-8" disabled={!isPro} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2"><Upload size={15} /> Logo & Favicon</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Logo URL", key: "logoUrl" as const, ph: "https://cdn.yourco.com/logo.svg" },
                                { label: "Favicon URL", key: "faviconUrl" as const, ph: "https://cdn.yourco.com/favicon.ico" },
                            ].map(({ label, key, ph }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <Label className="text-xs text-muted-foreground">{label}</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Upload size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input value={cfg[key]} onChange={e => update(key, e.target.value)} placeholder={ph} className="pl-8" disabled={!isPro} />
                                        </div>
                                        {cfg[key] && (
                                            <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center bg-muted shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={cfg[key]} alt={label} className="max-h-7 max-w-7 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Social links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Social Links</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Twitter / X", key: "twitterUrl" as const, Icon: Twitter, ph: "https://twitter.com/yourco" },
                                { label: "LinkedIn", key: "linkedinUrl" as const, Icon: Linkedin, ph: "https://linkedin.com/company/yourco" },
                            ].map(({ label, key, Icon, ph }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <Label className="text-xs text-muted-foreground">{label}</Label>
                                    <div className="relative">
                                        <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input value={cfg[key]} onChange={e => update(key, e.target.value)} placeholder={ph} className="pl-8" disabled={!isPro} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Live preview */}
                {showPreview && (
                    <div className="w-80 shrink-0 flex flex-col gap-3">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Live Preview</div>
                        <BrandPreview cfg={cfg} />
                    </div>
                )}
            </div>
        </PageStack>
    );
}
