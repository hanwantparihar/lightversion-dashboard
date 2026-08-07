"use client";
import { useState } from "react";
import { BookOpen, Copy, Check, ChevronRight } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { PageStack } from "@/components";
import { SDK_DOCS, type DocSection } from "@/lib/devtools-data";

type Lang = "ts" | "python" | "curl";

const LANG_LABELS: Record<Lang, string> = { ts: "TypeScript", python: "Python", curl: "cURL" };
const METHOD_COLORS: Record<string, string> = { ts: "#2563eb", python: "#10b981", curl: "#f59e0b" };

const categories = Array.from(new Set(SDK_DOCS.map((d) => d.category)));

export default function SdkDocsPage() {
    const [active, setActive] = useState(SDK_DOCS[0].id);
    const [lang, setLang] = useState<Lang>("ts");
    const [copied, setCopied] = useState(false);

    const doc = SDK_DOCS.find((d) => d.id === active)!;

    function copy() {
        navigator.clipboard.writeText(doc.code[lang]).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    }

    return (
        <PageStack>
            <div className="fb flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="fc g2 w-full sm:w-auto flex-wrap">
                    {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            style={{
                                padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)",
                                cursor: "pointer", fontWeight: 600, fontSize: 12,
                                background: lang === l ? METHOD_COLORS[l] : "var(--cd)",
                                color: lang === l ? "#fff" : "var(--fg)",
                                transition: "background .15s",
                            }}
                        >{LANG_LABELS[l]}</button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 items-stretch">
                {/* Sidebar */}
                <Card className="w-full md:w-[220px] shrink-0">
                    <CardContent style={{ padding: "12px 0" }}>
                        {categories.map((cat) => (
                            <div key={cat}>
                                <div style={{ padding: "8px 16px 4px", fontSize: 11, fontWeight: 700, color: "var(--mt-fg)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    {cat}
                                </div>
                                {SDK_DOCS.filter((d) => d.category === cat).map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setActive(d.id)}
                                        style={{
                                            width: "100%", textAlign: "left", padding: "9px 16px",
                                            background: active === d.id ? "var(--ac)" : "transparent",
                                            border: "none", cursor: "pointer",
                                            fontWeight: active === d.id ? 700 : 500,
                                            fontSize: 13,
                                            color: active === d.id ? "hsl(var(--primary))" : "var(--fg)",
                                            display: "flex", alignItems: "center", gap: 6,
                                            transition: "background .1s",
                                        }}
                                    >
                                        {active === d.id && <ChevronRight size={13} />}
                                        {d.title}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <Card className="overflow-hidden">
                        <CardContent style={{ paddingTop: 24 }}>
                            <div className="font-extrabold text-xl sm:text-2xl mb-2">{doc.title}</div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-0">{doc.description}</p>
                        </CardContent>
                    </Card>

                    {/* Code block */}
                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-border">
                            <div className="fc g2">
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: METHOD_COLORS[lang] }} />
                                <span className="text-xs sm:text-sm font-bold">{LANG_LABELS[lang]}</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={copy}>
                                {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                        <pre className="m-0 p-4 sm:p-5 bg-[hsl(222,47%,8%)] text-slate-200 text-xs sm:text-sm leading-relaxed overflow-x-auto font-mono">
                            <code>{doc.code[lang]}</code>
                        </pre>
                    </Card>

                    {/* Installation hint */}
                    {lang === "ts" && (
                        <Card className="overflow-hidden">
                            <CardContent className="pt-5">
                                <div className="font-bold text-sm mb-2.5">Install</div>
                                <pre className="m-0 p-3 sm:p-4 bg-muted rounded-lg text-xs sm:text-sm font-mono overflow-x-auto">
                                    npm install @nexora/sdk
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                    {lang === "python" && (
                        <Card className="overflow-hidden">
                            <CardContent className="pt-5">
                                <div className="font-bold text-sm mb-2.5">Install</div>
                                <pre className="m-0 p-3 sm:p-4 bg-muted rounded-lg text-xs sm:text-sm font-mono overflow-x-auto">
                                    pip install nexora-sdk
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PageStack>
    );
}
