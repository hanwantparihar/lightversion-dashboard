"use client";

import React from "react";
import { Sparkles, Send, Upload, X, FileUp, Edit2, Check, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MsgBubble, TypingDots } from "./_atoms";
import { SUGGESTED, MODELS, TAG_COLORS, type Convo, type Reaction, type UploadedFile } from "./_types";

interface ChatViewProps {
    convo: Convo;
    model: (typeof MODELS)[number];
    loading: boolean;
    files: UploadedFile[];
    chatInput: string;
    setChatInput: (s: string) => void;
    copiedId: string | null;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    editingMsgId: string | null;
    editText: string;
    setEditText: (s: string) => void;
    onSend: (text?: string) => void;
    onReact: (msgId: string, r: Reaction) => void;
    onCopy: (id: string, text: string) => void;
    onRegenerate: () => void;
    onAddFile: () => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (id: string) => void;
    onEditMsg: (msgId: string, content: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onToggleSidebar: () => void;
}

export function ChatView({
    convo, model, loading, files,
    chatInput, setChatInput,
    copiedId, bottomRef, inputRef, fileInputRef,
    editingMsgId, editText, setEditText,
    onSend, onReact, onCopy, onRegenerate,
    onAddFile, onFileSelect, onRemoveFile,
    onEditMsg, onSaveEdit, onCancelEdit,
    onToggleSidebar,
}: ChatViewProps) {
    return (
        <>
            {/* Topbar */}
            <div className="px-3 md:px-5 h-[52px] border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    {/* Mobile menu button */}
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Menu size={18} className="text-foreground" />
                    </button>
                    <Sparkles size={15} className="text-primary" />
                    <span className="font-bold text-sm md:text-[15px] truncate">{convo.title}</span>
                    {convo.tag && (
                        <span
                            className="hidden sm:inline text-[11px] px-[7px] py-0.5 rounded-full font-bold"
                            style={{
                                background: (convo.tag in TAG_COLORS ? TAG_COLORS[convo.tag] : "#888") + "22",
                                color: convo.tag in TAG_COLORS ? TAG_COLORS[convo.tag] : "#888",
                            }}
                        >
                            {convo.tag}
                        </span>
                    )}
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground truncate">{model.label}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-[12%] py-6">
                {convo.messages.length === 0 ? (
                    <div className="text-center max-w-[480px] mx-auto mt-[50px]">
                        <div className="w-[52px] h-[52px] rounded-[14px] bg-primary/10 flex items-center justify-center mx-auto mb-[14px]">
                            <Sparkles size={24} className="text-primary" />
                        </div>
                        <div className="font-extrabold text-xl mb-[6px]">How can I help?</div>
                        <div className="text-sm text-muted-foreground mb-[22px]">
                            Powered by {model.label}
                        </div>
                        <div className="flex flex-col gap-2">
                            {SUGGESTED.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSend(s)}
                                    className="px-[14px] py-[10px] rounded-[10px] border border-border bg-muted cursor-pointer text-left text-[13px] text-foreground transition-colors hover:bg-accent"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    convo.messages.map((msg) => (
                        <MsgBubble
                            key={msg.id}
                            msg={msg}
                            onReact={(r) => onReact(msg.id, r)}
                            onCopy={() => onCopy(msg.id, msg.content)}
                            onRegenerate={onRegenerate}
                            onEdit={() => onEditMsg(msg.id, msg.content)}
                            copied={copiedId === msg.id}
                            isEditing={editingMsgId === msg.id}
                            editText={editText}
                            setEditText={setEditText}
                            onSaveEdit={onSaveEdit}
                            onCancelEdit={onCancelEdit}
                        />
                    ))
                )}
                {loading && <TypingDots />}
                <div ref={bottomRef} />
            </div>

            {/* File chips */}
            {files.length > 0 && (
                <div className="px-4 md:px-[12%] py-[6px] flex gap-2 flex-wrap">
                    {files.map((f) => (
                        <div
                            key={f.id}
                            className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-lg bg-muted border border-border text-xs"
                        >
                            <FileUp size={13} className="text-primary" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{f.name}</span>
                            <span className="text-muted-foreground">{f.size}</span>
                            <button
                                onClick={() => onRemoveFile(f.id)}
                                className="bg-transparent border-none cursor-pointer text-muted-foreground flex p-0"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input bar */}
            <div className="px-4 md:px-[12%] pt-[10px] pb-[14px] shrink-0">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                />
                <div className="relative flex items-center gap-2 bg-muted rounded-[14px] border border-border px-3 py-[10px]">
                    <button
                        onClick={onAddFile}
                        title="Upload file"
                        className="bg-transparent border-none cursor-pointer text-muted-foreground flex p-1 rounded-md shrink-0 transition-colors hover:text-primary"
                    >
                        <Upload size={16} />
                    </button>
                    <textarea
                        ref={inputRef}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                        placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-[1.6] text-foreground font-[inherit] max-h-[140px] overflow-y-auto"
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = Math.min(el.scrollHeight, 140) + "px";
                        }}
                    />
                    <button
                        onClick={() => onSend()}
                        disabled={(!chatInput.trim() && files.length === 0) || loading}
                        className={cn(
                            "w-[34px] h-[34px] rounded-[9px] border-none flex items-center justify-center shrink-0 transition-colors",
                            (chatInput.trim() || files.length > 0) && !loading
                                ? "bg-primary cursor-pointer"
                                : "bg-border cursor-default",
                        )}
                    >
                        <Send
                            size={14}
                            className={(chatInput.trim() || files.length > 0) && !loading ? "text-white" : "text-muted-foreground"}
                        />
                    </button>
                </div>
                <div className="text-center text-[10px] md:text-[11px] text-muted-foreground mt-[6px]">
                    {model.label} · AI can make mistakes. Verify important information.
                </div>
            </div>
        </>
    );
}


