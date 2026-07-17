"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Plus, Sparkles, ChevronDown } from "lucide-react";
import { Card, Input, Button } from "@/components/ui";
import { PageStack } from "@/components";

type Message = { id: string; role: "user" | "ai"; content: string; time: string };
type Convo = { id: string; title: string; messages: Message[] };

const MODELS = ["gpt-4o", "claude-3", "gemini"];

const INITIAL_CONVOS: Convo[] = [
    {
        id: "c1",
        title: "Dashboard analytics help",
        messages: [
            { id: "m1", role: "user", content: "How do I improve dashboard analytics performance?", time: "10:02 AM" },
            { id: "m2", role: "ai", content: "Great question! For dashboard analytics performance, consider these key strategies:\n\n1. **Data caching** — Cache expensive queries with Redis or in-memory stores.\n2. **Aggregation** — Pre-aggregate metrics at write time so reads stay fast.\n3. **Pagination** — Never load all rows; paginate or virtualize large tables.\n4. **Chart lazy-loading** — Defer off-screen charts until they scroll into view.", time: "10:02 AM" },
            { id: "m3", role: "user", content: "What about real-time updates?", time: "10:04 AM" },
            { id: "m4", role: "ai", content: "For real-time dashboards, WebSockets or Server-Sent Events (SSE) are your best bets. SSE is simpler for one-way server→client pushes; WebSockets suit bidirectional needs. Pair either with a debounce on the client side to avoid re-rendering on every tick.", time: "10:04 AM" },
        ],
    },
    { id: "c2", title: "TypeScript generics guide", messages: [] },
    { id: "c3", title: "SQL query optimization", messages: [] },
];

export default function AiChatPage() {
    const [convos, setConvos] = useState<Convo[]>(INITIAL_CONVOS);
    const [activeId, setActiveId] = useState("c1");
    const [input, setInput] = useState("");
    const [model, setModel] = useState("gpt-4o");
    const [showModel, setShowModel] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const active = convos.find((c) => c.id === activeId)!;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeId, active?.messages.length]);

    function send() {
        if (!input.trim()) return;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const userMsg: Message = { id: `m${Date.now()}`, role: "user", content: input.trim(), time: now };
        const aiMsg: Message = {
            id: `m${Date.now() + 1}`, role: "ai",
            content: `I received your message: "${input.trim()}". This is a simulated AI response using ${model}. In a real implementation this would call the selected model's API.`,
            time: now,
        };
        setConvos((prev) =>
            prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, userMsg, aiMsg] } : c)
        );
        setInput("");
    }

    function newChat() {
        const id = `c${Date.now()}`;
        setConvos((prev) => [{ id, title: "New conversation", messages: [] }, ...prev]);
        setActiveId(id);
    }

    return (
        <PageStack>
            <div className="fb">
                <div>
                    <h2 style={{ fontWeight: 800, fontSize: 22 }}>AI Chat</h2>
                    <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Conversational AI with multiple model support</p>
                </div>
            </div>

            <Card style={{ overflow: "hidden", display: "flex", height: 680 }}>
                {/* Sidebar */}
                <div style={{ width: 260, borderRight: "1px solid var(--bd)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--bd)" }}>
                        <Button onClick={newChat} style={{ width: "100%" }}>
                            <Plus size={15} /> New Chat
                        </Button>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                        {convos.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveId(c.id)}
                                style={{
                                    width: "100%", textAlign: "left", padding: "10px 16px", border: "none",
                                    background: activeId === c.id ? "var(--ac)" : "transparent",
                                    cursor: "pointer", fontSize: 13, fontWeight: activeId === c.id ? 700 : 500,
                                    color: activeId === c.id ? "hsl(var(--primary))" : "var(--fg)",
                                    borderRadius: 0, transition: "background .15s",
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}
                            >
                                {c.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat pane */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                    {/* Header */}
                    <div className="fb" style={{ padding: "12px 20px", borderBottom: "1px solid var(--bd)", flexShrink: 0 }}>
                        <div className="fc g2">
                            <Sparkles size={16} style={{ color: "hsl(var(--primary))" }} />
                            <span style={{ fontWeight: 700, fontSize: 15 }}>{active.title}</span>
                        </div>
                        {/* Model selector */}
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setShowModel((v) => !v)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                                    border: "1px solid var(--bd)", borderRadius: 8, background: "var(--cd)",
                                    cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--fg)",
                                }}
                            >
                                {model} <ChevronDown size={12} />
                            </button>
                            {showModel && (
                                <div style={{
                                    position: "absolute", top: "110%", right: 0, zIndex: 50,
                                    background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 8,
                                    minWidth: 130, boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                                }}>
                                    {MODELS.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => { setModel(m); setShowModel(false); }}
                                            style={{
                                                width: "100%", textAlign: "left", padding: "9px 14px", border: "none",
                                                background: model === m ? "var(--ac)" : "transparent",
                                                cursor: "pointer", fontSize: 13, fontWeight: model === m ? 700 : 400,
                                                color: "var(--fg)",
                                            }}
                                        >{m}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                        {active.messages.length === 0 ? (
                            <div style={{ textAlign: "center", color: "var(--mt-fg)", fontSize: 14, marginTop: 80 }}>
                                Start a conversation with {model}
                            </div>
                        ) : (
                            active.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        display: "flex", gap: 10, marginBottom: 18,
                                        flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                                        background: msg.role === "ai" ? "hsl(var(--primary) / 0.15)" : "var(--mt)",
                                        color: msg.role === "ai" ? "hsl(var(--primary))" : "var(--fg)",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                                    }}>
                                        {msg.role === "ai" ? <Sparkles size={14} /> : "U"}
                                    </div>
                                    <div style={{ maxWidth: "70%" }}>
                                        <div style={{
                                            padding: "10px 14px",
                                            borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                                            background: msg.role === "user" ? "hsl(var(--primary))" : "var(--mt)",
                                            color: msg.role === "user" ? "#fff" : "var(--fg)",
                                            fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={{ fontSize: 11, color: "var(--mt-fg)", marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="fc g2" style={{ padding: "14px 20px", borderTop: "1px solid var(--bd)", flexShrink: 0 }}>
                        <Input
                            placeholder="Ask anything…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                            style={{ flex: 1, fontSize: 14 }}
                        />
                        <Button onClick={send} disabled={!input.trim()}>
                            <Send size={15} />
                        </Button>
                    </div>
                </div>
            </Card>
        </PageStack>
    );
}
