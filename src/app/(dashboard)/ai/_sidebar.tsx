"use client";

import { useState } from "react";
import {
    Sparkles, Plus, Search, Pin, PinOff, Trash2, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, IconBtn } from "./_atoms";
import { MODELS, VIEWS, TAG_COLORS, type View, type Convo } from "./_types";

interface AiSidebarProps {
    view: View;
    setView: (v: View) => void;
    modelId: string;
    setModelId: (id: string) => void;
    convos: Convo[];
    activeId: string;
    setActiveId: (id: string) => void;
    chatSearch: string;
    setChatSearch: (s: string) => void;
    onNewChat: () => void;
    onPin: (id: string) => void;
    onDelete: (id: string) => void;
}

export function AiSidebar({
    view, setView,
    modelId, setModelId,
    convos, activeId, setActiveId,
    chatSearch, setChatSearch,
    onNewChat, onPin, onDelete,
}: AiSidebarProps) {
    const [showMdl, setShowMdl] = useState(false);
    const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

    const filtered = convos.filter(
        (c) => !chatSearch || c.title.toLowerCase().includes(chatSearch.toLowerCase()),
    );
    const pinned = filtered.filter((c) => c.pinned);
    const unpinned = filtered.filter((c) => !c.pinned);

    return (
        <div className="w-[252px] border-r border-border flex flex-col shrink-0 bg-card">

            {/* Brand + new chat */}
            <div className="px-3 pt-[14px] pb-[10px] border-b border-border">
                <div className="flex items-center gap-2 mb-[10px]">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                    </div>
                    <span className="font-extrabold text-[15px]">Nexora AI</span>
                </div>

                {view === "chat" && (
                    <button
                        onClick={onNewChat}
                        className="w-full px-[11px] py-[7px] rounded-[9px] border border-border bg-transparent cursor-pointer text-xs font-semibold text-foreground flex items-center gap-[6px] transition-colors hover:bg-muted"
                    >
                        <Plus size={13} /> New conversation
                    </button>
                )}
            </div>

            {/* View switcher */}
            <div className="px-2 pt-2 pb-1">
                {VIEWS.map((v) => {
                    const Icon = v.icon;
                    const isA = view === v.id;
                    return (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id)}
                            className={cn(
                                "w-full flex items-center gap-2 px-[10px] py-2 rounded-lg border-none cursor-pointer text-[13px] transition-colors mb-px",
                                isA
                                    ? "bg-primary/10 text-primary font-bold"
                                    : "bg-transparent text-foreground font-medium hover:bg-muted",
                            )}
                        >
                            <Icon size={14} className="shrink-0" />
                            {v.label}
                        </button>
                    );
                })}
            </div>

            {/* Chat history */}
            {view === "chat" && (
                <div className="flex-1 overflow-y-auto px-2 py-[6px] flex flex-col gap-0.5">
                    {/* Search */}
                    <div className="relative mb-[6px]">
                        <Search
                            size={12}
                            className="absolute left-[9px] top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            value={chatSearch}
                            onChange={(e) => setChatSearch(e.target.value)}
                            placeholder="Search chats…"
                            className="w-full py-[6px] pr-2 pl-7 rounded-lg border border-border bg-muted text-foreground text-xs outline-none"
                        />
                    </div>

                    {pinned.length > 0 && (
                        <div className="text-[10px] font-bold text-muted-foreground tracking-[0.08em] uppercase pl-1 mb-0.5">
                            Pinned
                        </div>
                    )}

                    {[...pinned, ...unpinned].map((c) => {
                        const isA = c.id === activeId;
                        return (
                            <div
                                key={c.id}
                                onClick={() => setActiveId(c.id)}
                                className={cn(
                                    "flex items-center gap-[6px] rounded-lg px-2 py-[6px] cursor-pointer transition-colors relative",
                                    isA ? "bg-accent" : "hover:bg-muted",
                                )}
                            >
                                {c.pinned && (
                                    <Pin size={10} className="text-primary shrink-0" />
                                )}
                                {c.tag && (
                                    <span
                                        className="w-[6px] h-[6px] rounded-full shrink-0"
                                        style={{ background: TAG_COLORS[c.tag] ?? "#888" }}
                                    />
                                )}
                                <span
                                    className={cn(
                                        "flex-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap",
                                        isA ? "font-bold text-primary" : "font-normal text-foreground",
                                    )}
                                >
                                    {c.title}
                                </span>
                                <div
                                    className="flex gap-px shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <IconBtn onClick={() => onPin(c.id)} title={c.pinned ? "Unpin" : "Pin"}>
                                        {c.pinned ? <PinOff size={10} /> : <Pin size={10} />}
                                    </IconBtn>
                                    <IconBtn onClick={() => onDelete(c.id)} title="Delete">
                                        <Trash2 size={10} />
                                    </IconBtn>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {view !== "chat" && <div className="flex-1" />}

            {/* Model selector */}
            <div className="px-3 py-[10px] border-t border-border relative">
                <button
                    onClick={() => setShowMdl((v) => !v)}
                    className="w-full flex items-center justify-between px-[10px] py-2 rounded-[9px] border border-border bg-muted cursor-pointer text-xs font-semibold text-foreground"
                >
                    <span className="flex items-center gap-[6px]">
                        <Dot color={model.color} />
                        {model.label}
                    </span>
                    <ChevronDown
                        size={12}
                        className={cn(
                            "text-muted-foreground transition-transform duration-200",
                            showMdl && "rotate-180",
                        )}
                    />
                </button>

                {showMdl && (
                    <div className="absolute bottom-[calc(100%+4px)] left-3 right-3 bg-card border border-border rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,.15)] overflow-hidden z-50">
                        {["OpenAI", "Anthropic", "Google"].map((provider) => (
                            <div key={provider}>
                                <div className="px-3 pt-[6px] pb-[3px] text-[10px] font-bold text-muted-foreground uppercase tracking-[0.08em]">
                                    {provider}
                                </div>
                                {MODELS.filter((m) => m.provider === provider).map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => { setModelId(m.id); setShowMdl(false); }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 border-none cursor-pointer text-[13px] flex items-center gap-2 transition-colors",
                                            modelId === m.id
                                                ? "bg-accent text-primary font-bold"
                                                : "bg-transparent text-foreground font-normal hover:bg-muted",
                                        )}
                                    >
                                        <Dot color={m.color} />
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
