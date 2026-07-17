"use client";
import { useState } from "react";
import { Search, Plus, Zap, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Textarea, Label } from "@/components/ui";
import { PageStack } from "@/components";

type Template = { id: string; title: string; category: string; description: string; prompt: string };

const CATEGORY_COLORS: Record<string, string> = {
    Writing: "#2563eb", Code: "#10b981", Analysis: "#f59e0b", Marketing: "#ef4444",
};

const TEMPLATES: Template[] = [
    { id: "t1", category: "Writing", title: "Blog Post Outline", description: "Generate a structured blog post outline with headings and key points.", prompt: "Create a detailed blog post outline for the topic: [TOPIC]. Include an introduction, 5 main sections with subpoints, and a conclusion. Target audience: [AUDIENCE]." },
    { id: "t2", category: "Writing", title: "Professional Email", description: "Draft a polished, professional email for any business scenario.", prompt: "Write a professional email to [RECIPIENT] regarding [SUBJECT]. Tone: formal. Include a clear call-to-action. Context: [CONTEXT]." },
    { id: "t3", category: "Code", title: "Code Review", description: "Get a thorough code review with suggestions and best practices.", prompt: "Review the following code and provide feedback on: readability, performance, security issues, and best practices. Code:\n\n[CODE]" },
    { id: "t4", category: "Code", title: "Unit Test Generator", description: "Generate comprehensive unit tests for your functions.", prompt: "Write comprehensive unit tests for the following function using [FRAMEWORK]. Cover happy paths, edge cases, and error scenarios.\n\nFunction:\n[CODE]" },
    { id: "t5", category: "Analysis", title: "Data Analysis Report", description: "Analyze data and produce a structured insights report.", prompt: "Analyze the following dataset and provide: key trends, anomalies, actionable insights, and a summary. Data:\n\n[DATA]" },
    { id: "t6", category: "Analysis", title: "Competitor Analysis", description: "Compare products or services against competitors.", prompt: "Perform a competitor analysis comparing [PRODUCT] with [COMPETITORS]. Cover: pricing, features, strengths, weaknesses, and market positioning." },
    { id: "t7", category: "Marketing", title: "Social Media Caption", description: "Write engaging captions for any social platform.", prompt: "Write 3 engaging social media captions for [PLATFORM] promoting [PRODUCT/SERVICE]. Include relevant hashtags. Tone: [TONE]. Target audience: [AUDIENCE]." },
    { id: "t8", category: "Marketing", title: "Product Description", description: "Create compelling product descriptions that convert.", prompt: "Write a persuasive product description for [PRODUCT]. Highlight: key benefits (not just features), emotional value, and include a call-to-action. Max 150 words." },
];

const ALL_CATS = ["All", "Writing", "Code", "Analysis", "Marketing"];

export default function PromptsPage() {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("All");
    const [preview, setPreview] = useState("");
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newPrompt, setNewPrompt] = useState("");

    const filtered = TEMPLATES.filter((t) =>
        (cat === "All" || t.category === cat) &&
        (t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <PageStack>
            <div className="fb">
                <div>
                    <h2 style={{ fontWeight: 800, fontSize: 22 }}>Prompt Templates</h2>
                    <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Reusable prompts to accelerate your AI workflows</p>
                </div>
                <Button onClick={() => setCreating((v) => !v)}>
                    <Plus size={15} /> Create Template
                </Button>
            </div>

            {/* Create form */}
            {creating && (
                <Card>
                    <CardHeader style={{ paddingBottom: 12 }}>
                        <div className="fb">
                            <CardTitle style={{ fontSize: 15 }}>New Template</CardTitle>
                            <button onClick={() => setCreating(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)" }}>
                                <X size={16} />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="sy" style={{ gap: 12 }}>
                            <div className="fm">
                                <Label>Title</Label>
                                <Input placeholder="Template title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                            </div>
                            <div className="fm">
                                <Label>Prompt</Label>
                                <Textarea placeholder="Enter your prompt template. Use [PLACEHOLDER] for variables." rows={4} value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} />
                            </div>
                            <div className="fc g2">
                                <Button onClick={() => { setCreating(false); setNewTitle(""); setNewPrompt(""); }}>Save Template</Button>
                                <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filter bar */}
            <div className="fc g2" style={{ flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                    <Input placeholder="Search templates…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
                </div>
                <div className="fc g2">
                    {ALL_CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            style={{
                                padding: "5px 14px", borderRadius: 8, border: "1px solid var(--bd)",
                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                background: cat === c ? "hsl(var(--primary))" : "var(--cd)",
                                color: cat === c ? "#fff" : "var(--fg)",
                                transition: "background .15s",
                            }}
                        >{c}</button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="gr g-2 g2">
                {filtered.map((t) => (
                    <Card key={t.id} style={{ display: "flex", flexDirection: "column" }}>
                        <CardHeader style={{ paddingBottom: 8 }}>
                            <div className="fc g2" style={{ justifyContent: "space-between" }}>
                                <CardTitle style={{ fontSize: 14 }}>{t.title}</CardTitle>
                                <span style={{
                                    padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                                    background: (CATEGORY_COLORS[t.category] ?? "#888") + "22",
                                    color: CATEGORY_COLORS[t.category] ?? "#888",
                                }}>{t.category}</span>
                            </div>
                            <CardDescription style={{ fontSize: 13, marginTop: 4 }}>{t.description}</CardDescription>
                        </CardHeader>
                        <CardContent style={{ paddingTop: 0, marginTop: "auto" }}>
                            <Button size="sm" onClick={() => setPreview(t.prompt)} style={{ width: "100%" }}>
                                <Zap size={13} /> Use Template
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Preview area */}
            {preview && (
                <Card>
                    <CardHeader style={{ paddingBottom: 8 }}>
                        <div className="fb">
                            <CardTitle style={{ fontSize: 15 }}>Template Preview</CardTitle>
                            <button onClick={() => setPreview("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)" }}>
                                <X size={16} />
                            </button>
                        </div>
                        <CardDescription>Edit and customize before sending to AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea value={preview} onChange={(e) => setPreview(e.target.value)} rows={6} style={{ fontFamily: "monospace", fontSize: 13 }} />
                        <div className="fc g2" style={{ marginTop: 12 }}>
                            <Button>Send to AI Chat</Button>
                            <Button variant="ghost" onClick={() => setPreview("")}>Clear</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </PageStack>
    );
}
