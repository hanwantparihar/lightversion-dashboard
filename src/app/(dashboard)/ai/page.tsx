"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AiSidebar } from "./_sidebar";
import { ChatView } from "./_chat";
import { PromptsView } from "./_prompts";
import { ContentView } from "./_content";
import { ImageView } from "./_image";
import { SummarizeView } from "./_summarize";
import { TranslateView } from "./_translate";
import {
    MODELS, SEED_CONVOS, INITIAL_TEMPLATES,
    simulateAI,
    type View, type Convo, type Message, type PromptTemplate,
    type Reaction, type UploadedFile,
} from "./_types";

export default function AiWorkspacePage() {
    // ── Global ─────────────────────────────────────────────────────────────────
    const [view, setView] = useState<View>("chat");
    const [modelId, setModelId] = useState<string>(MODELS[0].id);

    // ── Chat ───────────────────────────────────────────────────────────────────
    const [convos, setConvos] = useState<Convo[]>(SEED_CONVOS);
    const [activeId, setActiveId] = useState("c1");
    const [chatInput, setChatInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [chatSearch, setChatSearch] = useState("");
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // ── Prompts ────────────────────────────────────────────────────────────────
    const [templates, setTemplates] = useState<PromptTemplate[]>(INITIAL_TEMPLATES);
    const [promptCat, setPromptCat] = useState("All");
    const [promptQ, setPromptQ] = useState("");
    const [activeTPL, setActiveTPL] = useState<PromptTemplate | null>(null);
    const [tplVars, setTplVars] = useState<Record<string, string>>({});

    const active = convos.find((c) => c.id === activeId) ?? convos[0];
    const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeId, active?.messages.length, loading]);

    // ── Chat actions ───────────────────────────────────────────────────────────
    function newChat() {
        const id = `c${Date.now()}`;
        setConvos((p) => [
            { id, title: "New conversation", pinned: false, model: modelId, messages: [], createdAt: "Today" },
            ...p,
        ]);
        setActiveId(id);
        setChatInput("");
        setFiles([]);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    const sendChat = useCallback(
        (text = chatInput) => {
            if (!text.trim() || loading) return;
            setChatInput("");
            const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const fileNote = files.length
                ? `\n\n📎 Attached: ${files.map((f) => f.name).join(", ")}`
                : "";
            const userMsg: Message = {
                id: `m${Date.now()}`,
                role: "user",
                content: text.trim() + fileNote,
                time: now,
            };
            setConvos((p) =>
                p.map((c) => {
                    if (c.id !== activeId) return c;
                    const title =
                        c.messages.length === 0
                            ? text.slice(0, 38) + (text.length > 38 ? "…" : "")
                            : c.title;
                    return { ...c, title, messages: [...c.messages, userMsg] };
                }),
            );
            setFiles([]);
            setLoading(true);
            setTimeout(() => {
                const ai: Message = {
                    id: `m${Date.now() + 1}`,
                    role: "ai",
                    content: simulateAI(text, modelId),
                    time: now,
                    reaction: null,
                };
                setConvos((p) =>
                    p.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, ai] } : c)),
                );
                setLoading(false);
            }, 800 + Math.random() * 700);
        },
        [chatInput, loading, files, activeId, modelId],
    );

    function reactMsg(msgId: string, r: Reaction) {
        setConvos((p) =>
            p.map((c) =>
                c.id !== activeId
                    ? c
                    : {
                        ...c,
                        messages: c.messages.map((m) =>
                            m.id === msgId ? { ...m, reaction: m.reaction === r ? null : r } : m,
                        ),
                    },
            ),
        );
    }

    function copyMsg(id: string, text: string) {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    }

    function regenLast() {
        const msgs = [...active.messages];
        const last = msgs[msgs.length - 1];
        if (last?.role !== "ai") return;
        const prev = msgs[msgs.length - 2];
        if (!prev) return;
        setConvos((p) =>
            p.map((c) => (c.id !== activeId ? c : { ...c, messages: msgs.slice(0, -1) })),
        );
        setLoading(true);
        setTimeout(() => {
            const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const ai: Message = {
                id: `m${Date.now()}`,
                role: "ai",
                content: simulateAI(prev.content, modelId),
                time: now,
                reaction: null,
            };
            setConvos((p) =>
                p.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, ai] } : c)),
            );
            setLoading(false);
        }, 800);
    }

    function pinConvo(id: string) {
        setConvos((p) => p.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
    }

    function deleteConvo(id: string) {
        const rest = convos.filter((c) => c.id !== id);
        setConvos(rest);
        if (activeId === id) setActiveId(rest[0]?.id ?? "");
    }

    function addFile() {
        const names = ["report.pdf", "data.csv", "screenshot.png", "brief.docx"];
        const types = ["PDF", "CSV", "Image", "DOC"];
        const i = Math.floor(Math.random() * 4);
        setFiles((p) => [
            ...p,
            { id: `f${Date.now()}`, name: names[i], type: types[i], size: `${(Math.random() * 2 + 0.1).toFixed(1)} MB` },
        ]);
    }

    // ── Prompt actions ─────────────────────────────────────────────────────────
    function fillAndSend() {
        if (!activeTPL) return;
        let body = activeTPL.body;
        Object.entries(tplVars).forEach(([k, v]) => {
            body = body.replaceAll(`[${k}]`, v || `[${k}]`);
        });
        setView("chat");
        setTimeout(() => sendChat(body), 100);
    }

    function toggleFav(id: string) {
        setTemplates((p) => p.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t)));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="flex overflow-hidden rounded-2xl border border-border bg-card" style={{ height: "calc(100vh - 80px)" }}>

            <AiSidebar
                view={view}
                setView={setView}
                modelId={modelId}
                setModelId={setModelId}
                convos={convos}
                activeId={activeId}
                setActiveId={setActiveId}
                chatSearch={chatSearch}
                setChatSearch={setChatSearch}
                onNewChat={newChat}
                onPin={pinConvo}
                onDelete={deleteConvo}
            />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {view === "chat" && (
                    <ChatView
                        convo={active}
                        model={model}
                        loading={loading}
                        files={files}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        copiedId={copiedId}
                        bottomRef={bottomRef}
                        inputRef={inputRef}
                        onSend={sendChat}
                        onReact={reactMsg}
                        onCopy={copyMsg}
                        onRegenerate={regenLast}
                        onAddFile={addFile}
                        onRemoveFile={(id) => setFiles((p) => p.filter((x) => x.id !== id))}
                    />
                )}

                {view === "prompts" && (
                    <PromptsView
                        templates={templates}
                        promptCat={promptCat}
                        setPromptCat={setPromptCat}
                        promptQ={promptQ}
                        setPromptQ={setPromptQ}
                        activeTPL={activeTPL}
                        setActiveTPL={setActiveTPL}
                        tplVars={tplVars}
                        setTplVars={setTplVars}
                        onToggleFav={toggleFav}
                        onFillAndSend={fillAndSend}
                    />
                )}

                {view === "content" && <ContentView modelLabel={model.label} />}

                {view === "image" && <ImageView modelLabel={model.label} />}

                {view === "summarize" && <SummarizeView />}

                {view === "translate" && <TranslateView modelLabel={model.label} />}

            </div>

            <style>{`
        @keyframes aiDot {
          0%,80%,100%{transform:translateY(0)}
          40%{transform:translateY(-5px)}
        }
      `}</style>
        </div>
    );
}
