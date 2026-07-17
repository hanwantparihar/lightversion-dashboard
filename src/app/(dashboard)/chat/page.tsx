"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Search, Users, Hash } from "lucide-react";
import { Card, Input, Button } from "@/components/ui";
import { PageStack } from "@/components";
import { CHAT_CONTACTS, CHAT_MESSAGES, type ChatContact, type ChatMessage } from "@/lib/chat-data";

const STATUS_COLOR = { online: "#10b981", away: "#f59e0b", offline: "#94a3b8" };
const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#f43f5e", "#3b82f6"];

export default function ChatPage() {
    const [active, setActive] = useState<ChatContact>(CHAT_CONTACTS[0]);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(CHAT_MESSAGES);
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const thread = messages[active.id] ?? [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [active, thread.length]);

    function send() {
        if (!text.trim()) return;
        const msg: ChatMessage = {
            id: `m${Date.now()}`,
            sender: "You",
            avatar: "ME",
            content: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMine: true,
        };
        setMessages((prev) => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), msg] }));
        setText("");
    }

    function handleKey(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    }

    const filtered = CHAT_CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    const directs = filtered.filter((c) => !c.isGroup);
    const groups = filtered.filter((c) => c.isGroup);

    function colorFor(idx: number) { return AVATAR_COLORS[idx % AVATAR_COLORS.length]; }

    return (
        <PageStack>

            <Card style={{ overflow: "hidden", display: "flex", height: 680 }}>
                {/* Sidebar */}
                <div style={{ width: 280, borderRight: "1px solid var(--bd)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--bd)" }}>
                        <div style={{ position: "relative" }}>
                            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: 32, fontSize: 13 }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {directs.length > 0 && (
                            <>
                                <div style={{ padding: "10px 16px 4px", fontSize: 11, fontWeight: 700, color: "var(--mt-fg)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Direct Messages
                                </div>
                                {directs.map((c, i) => <ContactRow key={c.id} contact={c} color={colorFor(i)} active={active.id === c.id} onClick={() => setActive(c)} />)}
                            </>
                        )}
                        {groups.length > 0 && (
                            <>
                                <div style={{ padding: "10px 16px 4px", fontSize: 11, fontWeight: 700, color: "var(--mt-fg)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Channels
                                </div>
                                {groups.map((c, i) => <ContactRow key={c.id} contact={c} color={colorFor(i + 10)} active={active.id === c.id} onClick={() => setActive(c)} />)}
                            </>
                        )}
                    </div>
                </div>

                {/* Chat pane */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                    {/* Header */}
                    <div className="fc g3" style={{ padding: "14px 20px", borderBottom: "1px solid var(--bd)", flexShrink: 0 }}>
                        <div style={{ position: "relative" }}>
                            <div
                                style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: colorFor(CHAT_CONTACTS.indexOf(active)) + "22",
                                    color: colorFor(CHAT_CONTACTS.indexOf(active)),
                                    fontWeight: 700, fontSize: 13,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                            >
                                {active.isGroup ? <Hash size={14} /> : active.avatar}
                            </div>
                            <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[active.status], border: "2px solid var(--cd)" }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>{active.name}</div>
                            <div style={{ fontSize: 12, color: active.status === "online" ? "#10b981" : "var(--mt-fg)", fontWeight: 600, textTransform: "capitalize" }}>
                                {active.isGroup ? <span className="fc g1"><Users size={12} /> Group channel</span> : active.status}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
                        {thread.length === 0 ? (
                            <div style={{ textAlign: "center", color: "var(--mt-fg)", fontSize: 13, marginTop: 60 }}>
                                No messages yet. Say hello!
                            </div>
                        ) : (
                            thread.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="fc g2" style={{ padding: "14px 20px", borderTop: "1px solid var(--bd)", flexShrink: 0 }}>
                        <Input
                            placeholder={`Message ${active.name}...`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKey}
                            style={{ flex: 1, fontSize: 14 }}
                        />
                        <Button onClick={send} disabled={!text.trim()}>
                            <Send size={15} />
                        </Button>
                    </div>
                </div>
            </Card>
        </PageStack>
    );
}

function ContactRow({ contact, color, active, onClick }: { contact: ChatContact; color: string; active: boolean; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                cursor: "pointer", background: active ? "var(--ac)" : "transparent",
                transition: "background .15s",
            }}
        >
            <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                    style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: color + "22", color, fontWeight: 700, fontSize: 12,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    {contact.isGroup ? <Hash size={14} /> : contact.avatar}
                </div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: STATUS_COLOR[contact.status], border: "2px solid var(--cd)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fb">
                    <span style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {contact.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--mt-fg)", flexShrink: 0 }}>{contact.lastTime}</span>
                </div>
                <div className="fb" style={{ marginTop: 2 }}>
                    <span style={{ fontSize: 12, color: "var(--mt-fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {contact.lastMessage}
                    </span>
                    {contact.unread > 0 && (
                        <span style={{ marginLeft: 4, minWidth: 18, height: 18, borderRadius: 9, background: "hsl(var(--primary))", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                            {contact.unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
    return (
        <div
            style={{
                display: "flex", gap: 10, marginBottom: 16,
                flexDirection: msg.isMine ? "row-reverse" : "row",
                alignItems: "flex-end",
            }}
        >
            {!msg.isMine && (
                <div
                    style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: "#2563eb22", color: "#2563eb", fontWeight: 700, fontSize: 11,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    {msg.avatar}
                </div>
            )}
            <div style={{ maxWidth: "68%" }}>
                {!msg.isMine && (
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--mt-fg)" }}>
                        {msg.sender}
                    </div>
                )}
                <div
                    style={{
                        padding: "10px 14px", borderRadius: msg.isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: msg.isMine ? "hsl(var(--primary))" : "var(--mt)",
                        color: msg.isMine ? "#fff" : "var(--fg)",
                        fontSize: 14, lineHeight: 1.5,
                    }}
                >
                    {msg.content}
                </div>
                <div style={{ fontSize: 11, color: "var(--mt-fg)", marginTop: 4, textAlign: msg.isMine ? "right" : "left" }}>
                    {msg.time}
                </div>
            </div>
        </div>
    );
}
