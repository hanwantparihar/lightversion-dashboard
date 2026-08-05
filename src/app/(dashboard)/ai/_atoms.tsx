"use client";

import React from "react";
import { Sparkles, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, Edit2 } from "lucide-react";
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
    onEdit,
    copied,
    isEditing,
    editText,
    setEditText,
    onSaveEdit,
    onCancelEdit,
}: {
    msg: Message;
    onReact: (r: Reaction) => void;
    onCopy: () => void;
    onRegenerate: () => void;
    onEdit?: () => void;
    copied: boolean;
    isEditing?: boolean;
    editText?: string;
    setEditText?: (s: string) => void;
    onSaveEdit?: () => void;
    onCancelEdit?: () => void;
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
                {isEditing && isUser ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText?.(e.target.value)}
                            className="px-[14px] py-[10px] text-sm leading-[1.7] rounded-[14px] bg-muted text-foreground border border-border outline-none resize-none min-h-[60px]"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={onCancelEdit}
                                className="px-3 py-1.5 text-xs rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSaveEdit}
                                className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1"
                            >
                                <Check size={12} /> Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
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
                            {isUser && onEdit && (
                                <IconBtn onClick={onEdit} title="Edit">
                                    <Edit2 size={11} />
                                </IconBtn>
                            )}
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
                    </>
                )}
            </div>
        </div>
    );
}
