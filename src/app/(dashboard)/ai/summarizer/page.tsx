"use client";
import { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Textarea, Label } from "@/components/ui";
import { PageStack } from "@/components";

const LENGTHS = ["Brief", "Standard", "Detailed"];
const FORMATS = ["Bullets", "Paragraph", "Key Points"];
const SENTIMENTS = ["Positive", "Neutral", "Negative"] as const;
type Sentiment = typeof SENTIMENTS[number];

const SENTIMENT_COLORS: Record<Sentiment, string> = {
    Positive: "#10b981", Neutral: "#f59e0b", Negative: "#ef4444",
};

const SAMPLE_INPUT = `Artificial intelligence is rapidly transforming the way organizations operate, from automating repetitive tasks to enabling complex decision-making at scale. A recent industry survey found that 78% of enterprise leaders have accelerated their AI adoption plans following breakthroughs in large language models. However, adoption is not without friction: concerns about data privacy, model interpretability, and workforce displacement remain significant barriers.

The most successful implementations share common traits. They start with narrow, high-value use cases rather than broad transformations. They invest in data quality before model selection. And they treat AI not as a cost-cutting tool alone, but as a capability multiplier for skilled teams.

Sectors seeing the fastest ROI include financial services (fraud detection, credit scoring), healthcare (diagnostic imaging, patient triage), and software development (code generation, documentation). Meanwhile, regulatory frameworks are catching up — the EU AI Act represents the first comprehensive AI governance legislation globally, setting a precedent others are expected to follow.

Looking ahead, the convergence of multimodal AI, edge computing, and agentic workflows promises to unlock a second wave of enterprise value. Organizations that build strong data infrastructure and AI literacy today will be best positioned to capitalize on that wave.`;

const SAMPLE_SUMMARY = `AI adoption is accelerating across enterprises, with 78% of leaders fast-tracking plans. Successful deployments focus on narrow use cases, data quality, and augmenting skilled teams. Financial services, healthcare, and software development lead in ROI. Regulatory frameworks like the EU AI Act are emerging. Organizations investing in data infrastructure and AI literacy today will gain competitive advantage in the next wave of agentic AI.`;

const SAMPLE_BULLETS = [
    "78% of enterprise leaders have accelerated AI adoption following LLM breakthroughs",
    "Key barriers remain: data privacy, model interpretability, and workforce concerns",
    "Successful implementations prioritize narrow use cases and data quality over broad transformation",
    "Top ROI sectors: financial services, healthcare, and software development",
    "EU AI Act sets a global precedent for AI governance regulation",
];

export default function SummarizerPage() {
    const [inputText, setInputText] = useState(SAMPLE_INPUT);
    const [summaryLen, setSummaryLen] = useState("Standard");
    const [format, setFormat] = useState("Bullets");
    const [summary, setSummary] = useState(SAMPLE_SUMMARY);
    const [bullets, setBullets] = useState<string[]>(SAMPLE_BULLETS);
    const [sentiment] = useState<Sentiment>("Positive");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    function summarize() {
        if (!inputText.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setSummary(`This is a simulated ${summaryLen.toLowerCase()} summary in ${format.toLowerCase()} format. The input text has ${inputText.trim().split(/\s+/).length} words. In a real implementation, an AI model would analyze the text and produce a ${summaryLen.toLowerCase()} ${format.toLowerCase()} summary highlighting the most important information.`);
            setBullets([
                "Key point extracted from the first paragraph of the input text",
                "Important finding from the middle section of the document",
                "Critical statistic or data point identified by the AI",
                "Action item or recommendation derived from the content",
                "Conclusion or forward-looking statement from the source",
            ]);
            setLoading(false);
        }, 1200);
    }

    function copy() {
        const text = format === "Bullets" ? bullets.map((b) => `• ${b}`).join("\n") : summary;
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    }

    const sentimentColor = SENTIMENT_COLORS[sentiment];

    return (
        <PageStack>
            <div>
                <h2 style={{ fontWeight: 800, fontSize: 22 }}>AI Summarizer</h2>
                <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Condense long documents into clear, actionable summaries</p>
            </div>

            {/* Input */}
            <Card>
                <CardHeader style={{ paddingBottom: 12 }}>
                    <CardTitle style={{ fontSize: 15 }}>Source Text</CardTitle>
                    <CardDescription>Paste your text below, or upload a file (.txt, .pdf, .docx)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Paste your document, article, or text here…"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={8}
                        style={{ fontSize: 13, lineHeight: 1.7 }}
                    />
                    <div style={{ marginTop: 10, fontSize: 12, color: "var(--mt-fg)" }}>
                        {inputText.trim().split(/\s+/).filter(Boolean).length} words · {inputText.length} characters
                    </div>
                </CardContent>
            </Card>

            {/* Options + button */}
            <div className="fc g2" style={{ flexWrap: "wrap" }}>
                <div className="fc g2">
                    <Label style={{ fontSize: 13 }}>Length:</Label>
                    {LENGTHS.map((l) => (
                        <button
                            key={l}
                            onClick={() => setSummaryLen(l)}
                            style={{
                                padding: "5px 12px", borderRadius: 8, border: "1px solid var(--bd)",
                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                background: summaryLen === l ? "hsl(var(--primary))" : "var(--cd)",
                                color: summaryLen === l ? "#fff" : "var(--fg)",
                                transition: "background .15s",
                            }}
                        >{l}</button>
                    ))}
                </div>
                <div className="fc g2">
                    <Label style={{ fontSize: 13 }}>Format:</Label>
                    {FORMATS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFormat(f)}
                            style={{
                                padding: "5px 12px", borderRadius: 8, border: "1px solid var(--bd)",
                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                background: format === f ? "hsl(var(--primary))" : "var(--cd)",
                                color: format === f ? "#fff" : "var(--fg)",
                                transition: "background .15s",
                            }}
                        >{f}</button>
                    ))}
                </div>
                <Button onClick={summarize} disabled={!inputText.trim() || loading}>
                    <FileText size={14} /> {loading ? "Summarizing…" : "Summarize"}
                </Button>
            </div>

            {/* Output */}
            {(summary || bullets.length > 0) && (
                <Card>
                    <div className="fb" style={{ padding: "12px 18px", borderBottom: "1px solid var(--bd)" }}>
                        <div className="fc g2">
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Summary Output</span>
                            <span style={{
                                padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                                background: sentimentColor + "22", color: sentimentColor,
                            }}>
                                {sentiment} sentiment
                            </span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={copy}>
                            {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                            {copied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                    <CardContent style={{ paddingTop: 20 }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mt-fg)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                                Executive Summary
                            </div>
                            <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--fg)" }}>{summary}</p>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mt-fg)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                                Key Points
                            </div>
                            <div className="sy" style={{ gap: 8 }}>
                                {bullets.map((b, i) => (
                                    <div key={i} className="fc g2" style={{ alignItems: "flex-start" }}>
                                        <div style={{
                                            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                            background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 11, fontWeight: 800,
                                        }}>{i + 1}</div>
                                        <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--fg)" }}>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </PageStack>
    );
}
