"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Search, Users, Hash, ArrowLeft } from "lucide-react";
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
    const [showSidebar, setShowSidebar] = useState(true);
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

    function selectContact(contact: ChatContact) {
        setActive(contact);
        setShowSidebar(false); // Hide sidebar on mobile after selecting
    }

    const filtered = CHAT_CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    const directs = filtered.filter((c) => !c.isGroup);
    const groups = filtered.filter((c) => c.isGroup);

    function colorFor(idx: number) { return AVATAR_COLORS[idx % AVATAR_COLORS.length]; }

    return (
        <PageStack>

            <Card className="overflow-hidden flex flex-col sm:flex-row h-[500px] sm:h-[680px] relative">
                {/* Sidebar */}
                <div className={`w-full sm:w-[280px] border-b sm:border-b-0 sm:border-r border-border flex flex-col shrink-0 sm:max-h-full overflow-y-auto absolute sm:relative inset-0 sm:inset-auto bg-card z-10 sm:z-auto transition-transform ${showSidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
                    <div className="p-3.5 sm:p-4 border-b border-border shrink-0">
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 text-xs sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {directs.length > 0 && (
                            <>
                                <div className="px-4 pt-2.5 pb-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Direct Messages
                                </div>
                                {directs.map((c, i) => <ContactRow key={c.id} contact={c} color={colorFor(i)} active={active.id === c.id} onClick={() => selectContact(c)} />)}
                            </>
                        )}
                        {groups.length > 0 && (
                            <>
                                <div className="px-4 pt-2.5 pb-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Channels
                                </div>
                                {groups.map((c, i) => <ContactRow key={c.id} contact={c} color={colorFor(i + 10)} active={active.id === c.id} onClick={() => selectContact(c)} />)}
                            </>
                        )}
                    </div>
                </div>

                {/* Chat pane */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="fc g3 px-3 sm:px-5 py-3 sm:py-3.5 border-b border-border shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSidebar(true)}
                            className="sm:hidden p-2 h-auto"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="relative">
                            <div
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center"
                                style={{
                                    background: colorFor(CHAT_CONTACTS.indexOf(active)) + "22",
                                    color: colorFor(CHAT_CONTACTS.indexOf(active)),
                                }}
                            >
                                {active.isGroup ? <Hash size={14} /> : active.avatar}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-card" style={{ background: STATUS_COLOR[active.status] }} />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-sm sm:text-base truncate">{active.name}</div>
                            <div className="text-xs font-semibold capitalize" style={{ color: active.status === "online" ? "#10b981" : "var(--mt-fg)" }}>
                                {active.isGroup ? <span className="fc g1"><Users size={11} /> Group channel</span> : active.status}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 sm:px-5 pt-4 sm:pt-5">
                        {thread.length === 0 ? (
                            <div className="text-center text-muted-foreground text-xs sm:text-sm mt-10 sm:mt-15">
                                No messages yet. Say hello!
                            </div>
                        ) : (
                            thread.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="fc g2 px-3 sm:px-5 py-3 sm:py-3.5 border-t border-border shrink-0">
                        <Input
                            placeholder={`Message ${active.name}...`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKey}
                            className="flex-1 text-sm"
                        />
                        <Button onClick={send} disabled={!text.trim()} size="sm" className="sm:size-default">
                            <Send size={14} className="sm:w-[15px] sm:h-[15px]" />
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
            className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer transition-colors"
            style={{ background: active ? "var(--ac)" : "transparent" }}
        >
            <div className="relative shrink-0">
                <div
                    className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full font-bold text-xs flex items-center justify-center"
                    style={{ background: color + "22", color }}
                >
                    {contact.isGroup ? <Hash size={12} className="sm:w-[14px] sm:h-[14px]" /> : contact.avatar}
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-[9px] sm:h-[9px] rounded-full border-2 border-card" style={{ background: STATUS_COLOR[contact.status] }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="fb">
                    <span className="font-semibold text-xs sm:text-[13px] truncate">
                        {contact.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground shrink-0">{contact.lastTime}</span>
                </div>
                <div className="fb mt-0.5">
                    <span className="text-[11px] sm:text-xs text-muted-foreground truncate flex-1">
                        {contact.lastMessage}
                    </span>
                    {contact.unread > 0 && (
                        <span className="ml-1 min-w-[16px] sm:min-w-[18px] h-4 sm:h-[18px] rounded-full bg-primary text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center px-1 sm:px-1.5">
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
            className="flex gap-2 sm:gap-2.5 mb-3 sm:mb-4 items-end"
            style={{ flexDirection: msg.isMine ? "row-reverse" : "row" }}
        >
            {!msg.isMine && (
                <div
                    className="w-6 h-6 sm:w-[30px] sm:h-[30px] rounded-full shrink-0 font-bold text-[10px] sm:text-[11px] flex items-center justify-center"
                    style={{ background: "#2563eb22", color: "#2563eb" }}
                >
                    {msg.avatar}
                </div>
            )}
            <div className="max-w-[75%] sm:max-w-[68%]">
                {!msg.isMine && (
                    <div className="text-xs font-bold mb-1 text-muted-foreground">
                        {msg.sender}
                    </div>
                )}
                <div
                    className="px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm leading-relaxed"
                    style={{
                        borderRadius: msg.isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: msg.isMine ? "hsl(var(--primary))" : "var(--mt)",
                        color: msg.isMine ? "#fff" : "var(--fg)",
                    }}
                >
                    {msg.content}
                </div>
                <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-1" style={{ textAlign: msg.isMine ? "right" : "left" }}>
                    {msg.time}
                </div>
            </div>
        </div>
    );
}
