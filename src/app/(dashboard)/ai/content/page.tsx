"use client";
import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Textarea, Label } from "@/components/ui";
import { PageStack } from "@/components";

const TONES = ["Professional", "Casual", "Persuasive", "Technical"];
const LENGTHS = ["Short", "Medium", "Long"];
const TYPES = ["Blog post", "Email", "Social post", "Product desc"];

const SAMPLE_OUTPUT = `# Unlocking the Power of AI-Driven Analytics Dashboards

In today's fast-paced digital landscape, data is no longer just a byproduct of operations — it's the compass that guides strategic decisions. AI-driven analytics dashboards have emerged as the definitive solution for organizations seeking to transform raw numbers into actionable intelligence.

## Why Traditional Dashboards Fall Short

Legacy reporting tools require manual effort, lag behind real-time events, and present data without context. Decision-makers find themselves drowning in charts while still lacking clear answers.

## The AI Advantage

Modern AI dashboards automatically surface anomalies, predict trends, and translate metrics into plain-language recommendations. They adapt to your workflow — not the other way around.

**Key benefits:**
- Real-time anomaly detection with automated alerts
- Predictive forecasting based on historical patterns  
- Natural language querying ("Show me revenue drop in Q3")
- Automated executive summaries delivered to your inbox

## Getting Started

Begin with a focused pilot: pick one critical KPI, connect your data source, and let the AI establish baselines over 30 days. From there, expansion is straightforward.

The organizations winning today are those that treat AI not as a novelty, but as infrastructure.`;

export default function ContentPage() {
    const [topic, setTopic] = useState("AI-driven analytics dashboards");
    const [tone, setTone] = useState("Professional");
    const [length, setLength] = useState("Medium");
    const [type, setType] = useState("Blog post");
    const [output, setOutput] = useState(SAMPLE_OUTPUT);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    function generate() {
        setLoading(true);
        setTimeout(() => {
            setOutput(`# ${topic}\n\nThis is a simulated ${tone.toLowerCase()} ${type.toLowerCase()} about "${topic}". Length: ${length}.\n\nIn a real implementation this would call an AI API with the selected parameters (tone: ${tone}, length: ${length}, type: ${type}) and stream the response back to this output panel.\n\nThe generated content would be formatted appropriately for a ${type.toLowerCase()}, with proper structure, headers, and calls-to-action tailored to a ${tone.toLowerCase()} style.`);
            setLoading(false);
        }, 1200);
    }

    function copy() {
        navigator.clipboard.writeText(output).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    }

    const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;
    const charCount = output.length;

    return (
        <PageStack>
            <div>
                <h2 style={{ fontWeight: 800, fontSize: 22 }}>Content Generation</h2>
                <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>AI-powered content creation for any format or tone</p>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Left: form */}
                <Card style={{ width: 300, flexShrink: 0 }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: 15 }}>Content Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="sy" style={{ gap: 14 }}>
                            <div className="fm">
                                <Label>Topic</Label>
                                <Input placeholder="What should the content be about?" value={topic} onChange={(e) => setTopic(e.target.value)} />
                            </div>

                            <div className="fm">
                                <Label>Content Type</Label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--bd)", background: "var(--cd)", color: "var(--fg)", fontSize: 14 }}
                                >
                                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="fm">
                                <Label>Tone</Label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {TONES.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            style={{
                                                padding: "5px 12px", borderRadius: 8, border: "1px solid var(--bd)",
                                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                                background: tone === t ? "hsl(var(--primary))" : "var(--cd)",
                                                color: tone === t ? "#fff" : "var(--fg)",
                                                transition: "background .15s",
                                            }}
                                        >{t}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="fm">
                                <Label>Length</Label>
                                <div className="fc g2">
                                    {LENGTHS.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLength(l)}
                                            style={{
                                                flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid var(--bd)",
                                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                                background: length === l ? "hsl(var(--primary))" : "var(--cd)",
                                                color: length === l ? "#fff" : "var(--fg)",
                                                transition: "background .15s",
                                            }}
                                        >{l}</button>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={generate} disabled={!topic.trim() || loading} style={{ width: "100%", marginTop: 4 }}>
                                {loading ? "Generating…" : "Generate Content"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: output */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    <Card style={{ flex: 1 }}>
                        <div className="fb" style={{ padding: "12px 18px", borderBottom: "1px solid var(--bd)" }}>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Generated Content</span>
                            <div className="fc g2">
                                <Button size="sm" variant="ghost" onClick={copy} disabled={!output}>
                                    {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={generate} disabled={!topic.trim() || loading}>
                                    <RefreshCw size={14} /> Regenerate
                                </Button>
                            </div>
                        </div>
                        <CardContent style={{ paddingTop: 16 }}>
                            <Textarea
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                rows={20}
                                style={{ fontSize: 13, lineHeight: 1.7, fontFamily: "inherit", resize: "vertical" }}
                            />
                            <div className="fc g3" style={{ marginTop: 10 }}>
                                <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>
                                    <strong style={{ color: "var(--fg)" }}>{wordCount}</strong> words
                                </span>
                                <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>·</span>
                                <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>
                                    <strong style={{ color: "var(--fg)" }}>{charCount}</strong> characters
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageStack>
    );
}
