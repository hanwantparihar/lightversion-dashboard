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
            <div className="fb">
                <div className="fc g2">
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

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Sidebar */}
                <Card style={{ width: 220, flexShrink: 0 }}>
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
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    <Card>
                        <CardContent style={{ paddingTop: 24 }}>
                            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{doc.title}</div>
                            <p style={{ fontSize: 14, color: "var(--mt-fg)", lineHeight: 1.7, marginBottom: 0 }}>{doc.description}</p>
                        </CardContent>
                    </Card>

                    {/* Code block */}
                    <Card style={{ overflow: "hidden" }}>
                        <div
                            style={{
                                padding: "10px 18px", borderBottom: "1px solid var(--bd)",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                            }}
                        >
                            <div className="fc g2">
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: METHOD_COLORS[lang] }} />
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{LANG_LABELS[lang]}</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={copy}>
                                {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                        <pre
                            style={{
                                margin: 0, padding: "20px 22px",
                                background: "hsl(222 47% 8%)",
                                color: "#e2e8f0",
                                fontSize: 13, lineHeight: 1.75,
                                overflowX: "auto",
                                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                            }}
                        >
                            <code>{doc.code[lang]}</code>
                        </pre>
                    </Card>

                    {/* Installation hint */}
                    {lang === "ts" && (
                        <Card>
                            <CardContent style={{ paddingTop: 20 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Install</div>
                                <pre style={{ margin: 0, padding: "12px 16px", background: "var(--mt)", borderRadius: 8, fontSize: 13, fontFamily: "monospace", overflowX: "auto" }}>
                                    npm install @nexora/sdk
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                    {lang === "python" && (
                        <Card>
                            <CardContent style={{ paddingTop: 20 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Install</div>
                                <pre style={{ margin: 0, padding: "12px 16px", background: "var(--mt)", borderRadius: 8, fontSize: 13, fontFamily: "monospace", overflowX: "auto" }}>
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
