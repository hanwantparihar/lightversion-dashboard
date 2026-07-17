"use client";
import { useState } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { Card, CardContent, Button, Textarea, Label } from "@/components/ui";
import { PageStack } from "@/components";

const SOURCE_LANGS = ["Auto-detect", "English", "Spanish", "French", "German", "Japanese", "Chinese"];
const TARGET_LANGS = ["English", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese", "Arabic"];

const ALTERNATIVES = [
    "It is now the moment to assist all our companion individuals.",
    "Now is the time to come to the aid of all fellow humans.",
    "This is the moment to lend a hand to all our fellow men.",
];

const SAMPLE_SOURCE = "Now is the time for all good men to come to the aid of their country. The quick brown fox jumps over the lazy dog.";
const SAMPLE_TRANSLATION = "Ahora es el momento para que todos los hombres buenos vengan en ayuda de su país. El rápido zorro marrón salta sobre el perro perezoso.";

export default function TranslationPage() {
    const [sourceLang, setSourceLang] = useState("English");
    const [targetLang, setTargetLang] = useState("Spanish");
    const [sourceText, setSourceText] = useState(SAMPLE_SOURCE);
    const [translation, setTranslation] = useState(SAMPLE_TRANSLATION);
    const [detected] = useState("English");
    const [confidence] = useState(98);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    function translate() {
        if (!sourceText.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setTranslation(`[Simulated ${targetLang} translation] "${sourceText.substring(0, 60)}${sourceText.length > 60 ? "…" : ""}"\n\nIn a real implementation this would call a translation API to convert the source text from ${sourceLang === "Auto-detect" ? "the detected language" : sourceLang} to ${targetLang}.`);
            setLoading(false);
        }, 1000);
    }

    function swap() {
        if (sourceLang === "Auto-detect") return;
        const prevSource = sourceLang;
        const prevTarget = targetLang;
        const prevText = sourceText;
        const prevTranslation = translation;
        setSourceLang(prevTarget);
        setTargetLang(prevSource);
        setSourceText(prevTranslation);
        setTranslation(prevText);
    }

    function copy() {
        navigator.clipboard.writeText(translation).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    }

    const selectStyle = {
        padding: "7px 10px", borderRadius: 8, border: "1px solid var(--bd)",
        background: "var(--cd)", color: "var(--fg)", fontSize: 13, fontWeight: 600,
        cursor: "pointer",
    };

    return (
        <PageStack>
            <div>
                <h2 style={{ fontWeight: 800, fontSize: 22 }}>AI Translation</h2>
                <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Instant, high-quality translation across 8+ languages</p>
            </div>

            {/* Main panels */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* Source */}
                <Card style={{ flex: 1 }}>
                    <div className="fb" style={{ padding: "12px 16px", borderBottom: "1px solid var(--bd)" }}>
                        <Label style={{ fontSize: 13 }}>Source Language</Label>
                        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} style={selectStyle}>
                            {SOURCE_LANGS.map((l) => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                    <CardContent style={{ paddingTop: 16 }}>
                        <Textarea
                            placeholder="Enter text to translate…"
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            rows={10}
                            style={{ fontSize: 14, lineHeight: 1.7, border: "none", padding: 0, resize: "none", background: "transparent", outline: "none" }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: "var(--mt-fg)" }}>
                            {sourceText.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                    </CardContent>
                </Card>

                {/* Swap + Translate */}
                <div className="sy" style={{ gap: 12, alignItems: "center", paddingTop: 56, flexShrink: 0 }}>
                    <button
                        onClick={swap}
                        disabled={sourceLang === "Auto-detect"}
                        style={{
                            width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--bd)",
                            background: "var(--cd)", cursor: sourceLang === "Auto-detect" ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: sourceLang === "Auto-detect" ? 0.4 : 1,
                            transition: "background .15s",
                        }}
                    >
                        <ArrowLeftRight size={16} style={{ color: "var(--fg)" }} />
                    </button>
                    <Button onClick={translate} disabled={!sourceText.trim() || loading} style={{ writingMode: "initial" }}>
                        {loading ? "…" : "Translate"}
                    </Button>
                </div>

                {/* Target */}
                <Card style={{ flex: 1 }}>
                    <div className="fb" style={{ padding: "12px 16px", borderBottom: "1px solid var(--bd)" }}>
                        <Label style={{ fontSize: 13 }}>Target Language</Label>
                        <div className="fc g2">
                            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} style={selectStyle}>
                                {TARGET_LANGS.map((l) => <option key={l}>{l}</option>)}
                            </select>
                            <Button size="sm" variant="ghost" onClick={copy} disabled={!translation}>
                                {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                            </Button>
                        </div>
                    </div>
                    <CardContent style={{ paddingTop: 16 }}>
                        <div style={{ fontSize: 14, lineHeight: 1.7, minHeight: 180, color: translation ? "var(--fg)" : "var(--mt-fg)", whiteSpace: "pre-wrap" }}>
                            {translation || "Translation will appear here…"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Meta info */}
            <Card>
                <CardContent style={{ paddingTop: 16, paddingBottom: 16 }}>
                    <div className="fc g3" style={{ flexWrap: "wrap" }}>
                        <div className="fc g2">
                            <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>Detected language:</span>
                            <span style={{
                                padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                                background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))",
                            }}>{detected}</span>
                        </div>
                        <span style={{ color: "var(--bd)" }}>·</span>
                        <div className="fc g2">
                            <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>Confidence:</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>{confidence}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alternative translations */}
            <Card>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--bd)" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Alternative Translations</span>
                </div>
                <CardContent style={{ paddingTop: 16 }}>
                    <div className="sy" style={{ gap: 10 }}>
                        {ALTERNATIVES.map((alt, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "10px 14px", borderRadius: 8, border: "1px solid var(--bd)",
                                    background: "var(--cd)", fontSize: 13, lineHeight: 1.5,
                                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                                }}
                            >
                                <span>{alt}</span>
                                <button
                                    onClick={() => setTranslation(alt)}
                                    style={{
                                        flexShrink: 0, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--bd)",
                                        background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "hsl(var(--primary))",
                                    }}
                                >Use</button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    );
}
