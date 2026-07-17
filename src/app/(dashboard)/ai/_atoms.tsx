"use client";

import React from "react";
import { Sparkles, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message, Reaction } from "./_types";

// ─────────────────────────────────────────────────────────────────────────────
// Dot — colored status indicator
// ─────────────────────────────────────────────────────────────────────────────
export function Dot({ color }: { color: string }) {
    return (
        <span
            className="inline-block shrink-0 rounded-full"
            style={{ width: 8, height: 8, background: color }}
        />
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// IconBtn — tiny icon action button
// ─────────────────────────────────────────────────────────────────────────────
export function IconBtn({
    children,
    onClick,
    title,
    active,
}: {
    children: React.ReactNode;
    onClick: () => void;
    title?: string;
    active?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={cn(
                "flex items-center rounded p-[3px] border-none bg-transparent cursor-pointer transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
        >
            {children}
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TypingDots — animated AI thinking indicator
// ─────────────────────────────────────────────────────────────────────────────
export function TypingDots() {
    return (
        <div className="flex gap-[10px] mb-5 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-primary" />
            </div>
            <div className="px-[14px] py-[10px] rounded-[14px_14px_14px_4px] bg-muted flex items-center gap-[5px]">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-[7px] h-[7px] rounded-full bg-muted-foreground"
                        style={{ animation: `aiDot 1.2s ease-in-out ${i * 0.15}s infinite` }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PillBtn — category / option toggle pill
// ─────────────────────────────────────────────────────────────────────────────
export function PillBtn({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-[5px] rounded-lg border border-border cursor-pointer text-xs font-semibold transition-colors",
                active ? "bg-primary text-white border-primary" : "bg-card text-foreground hover:bg-muted",
            )}
        >
            {children}
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MsgBubble — chat message bubble
// ─────────────────────────────────────────────────────────────────────────────
export function MsgBubble({
    msg,
    onReact,
    onCopy,
    onRegenerate,
    copied,
}: {
    msg: Message;
    onReact: (r: Reaction) => void;
    onCopy: () => void;
    onRegenerate: () => void;
    copied: boolean;
}) {
    const isUser = msg.role === "user";

    return (
        <div
            className={cn(
                "flex gap-[10px] mb-5 items-start",
                isUser ? "flex-row-reverse" : "flex-row",
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold",
                    isUser
                        ? "bg-muted text-foreground"
                        : "bg-primary/10 text-primary",
                )}
            >
                {isUser ? "U" : <Sparkles size={14} />}
            </div>

            {/* Bubble + actions */}
            <div className="max-w-[72%] flex flex-col gap-1">
                <div
                    className={cn(
                        "px-[14px] py-[10px] text-sm leading-[1.7] whitespace-pre-wrap",
                        isUser
                            ? "rounded-[14px_14px_4px_14px] bg-primary text-white"
                            : "rounded-[14px_14px_14px_4px] bg-muted text-foreground",
                        msg.isCode && "font-mono",
                    )}
                >
                    {msg.content}
                </div>

                {/* Actions row */}
                <div
                    className={cn(
                        "flex items-center gap-[6px]",
                        isUser ? "justify-end" : "justify-start",
                    )}
                >
                    <span className="text-[11px] text-muted-foreground">{msg.time}</span>
                    {!isUser && (
                        <>
                            <IconBtn onClick={onCopy} title="Copy">
                                {copied ? (
                                    <Check size={11} className="text-[#10b981]" />
                                ) : (
                                    <Copy size={11} />
                                )}
                            </IconBtn>
                            <IconBtn onClick={onRegenerate} title="Regenerate">
                                <RefreshCw size={11} />
                            </IconBtn>
                            <IconBtn
                                onClick={() => onReact("like")}
                                title="Like"
                                active={msg.reaction === "like"}
                            >
                                <ThumbsUp size={11} />
                            </IconBtn>
                            <IconBtn
                                onClick={() => onReact("dislike")}
                                title="Dislike"
                                active={msg.reaction === "dislike"}
                            >
                                <ThumbsDown size={11} />
                            </IconBtn>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
