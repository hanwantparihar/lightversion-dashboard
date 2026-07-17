"use client";
import { useState } from "react";
import { MessageSquare, AtSign, Send, CornerDownRight } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Textarea } from "@/components/ui";
import { PageStack } from "@/components";
import { COMMENTS, TEAM_MEMBERS, type Comment } from "@/lib/team-data";

const MEMBER_COLORS = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

function highlight(text: string) {
    return text.split(/(@\w[\w\s]+)/g).map((part, i) =>
        part.startsWith("@")
            ? <span key={i} style={{ color: "hsl(var(--primary))", fontWeight: 600 }}>{part}</span>
            : part
    );
}

function CommentBubble({ c, depth = 0 }: { c: Comment; depth?: number }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const colorIdx = TEAM_MEMBERS.findIndex((m) => m.id === c.author.id) % MEMBER_COLORS.length;
    const color = MEMBER_COLORS[colorIdx];

    return (
        <div style={{ marginLeft: depth * 32, marginTop: depth > 0 ? 10 : 0 }}>
            <div className="fc g3" style={{ alignItems: "flex-start" }}>
                <div
                    style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: color + "22", color, fontWeight: 700, fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    {c.author.avatar}
                </div>
                <div style={{ flex: 1 }}>
                    <div className="fc g2" style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{c.author.name}</span>
                        <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>{c.timestamp}</span>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: color + "22", color, fontWeight: 600, textTransform: "capitalize" }}>
                            {c.author.role}
                        </span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg)" }}>
                        {highlight(c.content)}
                    </p>
                    {c.mentions.length > 0 && (
                        <div className="fc g2" style={{ marginTop: 6, flexWrap: "wrap" }}>
                            {c.mentions.map((m) => (
                                <span key={m} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "var(--ac)", color: "var(--ac-fg)", fontWeight: 600 }}>
                                    <AtSign size={10} style={{ display: "inline", marginRight: 2 }} />{m}
                                </span>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => setShowReply((v) => !v)}
                        style={{ marginTop: 8, fontSize: 12, color: "var(--mt-fg)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                        <CornerDownRight size={13} /> Reply
                    </button>
                    {showReply && (
                        <div className="fc g2" style={{ marginTop: 8 }}>
                            <Textarea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={2}
                                style={{ flex: 1, fontSize: 13 }}
                            />
                            <Button size="sm" onClick={() => { setReplyText(""); setShowReply(false); }}>
                                <Send size={14} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {c.replies?.map((r) => <CommentBubble key={r.id} c={r} depth={depth + 1} />)}
        </div>
    );
}

export default function CommentsPage() {
    const [comments, setComments] = useState(COMMENTS);
    const [text, setText] = useState("");

    function post() {
        if (!text.trim()) return;
        const mentions = Array.from(text.matchAll(/@(\w[\w\s]+)/g)).map((m) => m[1].trim());
        setComments((prev) => [
            {
                id: `c${Date.now()}`,
                author: TEAM_MEMBERS[0],
                content: text,
                timestamp: "Just now",
                mentions,
                replies: [],
            },
            ...prev,
        ]);
        setText("");
    }

    return (
        <PageStack>

            <div className="gr g-31 g2">
                <Card>
                    <CardHeader>
                        <CardTitle className="fc g2"><MessageSquare size={18} /> Thread</CardTitle>
                        <CardDescription>Use @name to mention a teammate</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="fm" style={{ marginBottom: 20 }}>
                            <Textarea
                                placeholder="Write a comment… use @Name to mention someone"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={3}
                            />
                            <div className="fc g2" style={{ marginTop: 8, justifyContent: "flex-end" }}>
                                <Button onClick={post}><Send size={15} /> Post</Button>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {comments.map((c) => (
                                <div key={c.id} style={{ borderBottom: "1px solid var(--bd)", paddingBottom: 20 }}>
                                    <CommentBubble c={c} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Mentioned members panel */}
                <Card style={{ height: "fit-content" }}>
                    <CardHeader>
                        <CardTitle className="fc g2"><AtSign size={17} /> Team Members</CardTitle>
                        <CardDescription>Type @name in comments to mention</CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: 0 }}>
                        {TEAM_MEMBERS.map((m, i) => {
                            const color = MEMBER_COLORS[i % MEMBER_COLORS.length];
                            return (
                                <div
                                    key={m.id}
                                    className="fc g3"
                                    style={{ padding: "12px 20px", borderBottom: "1px solid var(--bd)", cursor: "pointer" }}
                                    onClick={() => setText((t) => t + `@${m.name} `)}
                                >
                                    <div
                                        style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: color + "22", color, fontWeight: 700, fontSize: 12,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        {m.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                                        <div style={{ fontSize: 11, color: "var(--mt-fg)", textTransform: "capitalize" }}>{m.role}</div>
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.status === "online" ? "#10b981" : m.status === "away" ? "#f59e0b" : "#94a3b8" }} />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </PageStack>
    );
}
