"use client";

import { Send, Search, Star, StarOff, Zap, X } from "lucide-react";
import { PillBtn } from "./_atoms";
import { PROMPT_CATS, type PromptTemplate } from "./_types";

interface PromptsViewProps {
    templates: PromptTemplate[];
    promptCat: string;
    setPromptCat: (c: string) => void;
    promptQ: string;
    setPromptQ: (q: string) => void;
    activeTPL: PromptTemplate | null;
    setActiveTPL: (t: PromptTemplate | null) => void;
    tplVars: Record<string, string>;
    setTplVars: (v: Record<string, string>) => void;
    onToggleFav: (id: string) => void;
    onFillAndSend: () => void;
}

export function PromptsView({
    templates, promptCat, setPromptCat,
    promptQ, setPromptQ,
    activeTPL, setActiveTPL,
    tplVars, setTplVars,
    onToggleFav, onFillAndSend,
}: PromptsViewProps) {
    const filtered = templates.filter(
        (t) =>
            (promptCat === "All" || t.category === promptCat) &&
            (!promptQ ||
                t.title.toLowerCase().includes(promptQ.toLowerCase()) ||
                t.category.toLowerCase().includes(promptQ.toLowerCase())),
    );

    return (
        <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-4">
                <div className="font-extrabold text-xl mb-1">Prompt Templates</div>
                <div className="text-[13px] text-muted-foreground">
                    Pre-built prompts to accelerate your AI workflows
                </div>
            </div>

            {/* Search + filters */}
            <div className="flex gap-[10px] mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search
                        size={13}
                        className="absolute left-[10px] top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        value={promptQ}
                        onChange={(e) => setPromptQ(e.target.value)}
                        placeholder="Search templates…"
                        className="w-full py-[7px] pr-[10px] pl-[30px] rounded-lg border border-border bg-muted text-foreground text-[13px] outline-none"
                    />
                </div>
                <div className="flex gap-[6px] flex-wrap">
                    {PROMPT_CATS.map((c) => (
                        <PillBtn key={c} active={promptCat === c} onClick={() => setPromptCat(c)}>
                            {c}
                        </PillBtn>
                    ))}
                </div>
            </div>

            {/* Template detail / edit */}
            {activeTPL ? (
                <div className="bg-muted rounded-[14px] border border-border p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-bold text-base">{activeTPL.title}</div>
                            <div className="text-xs text-muted-foreground">{activeTPL.category}</div>
                        </div>
                        <button
                            onClick={() => setActiveTPL(null)}
                            className="bg-transparent border-none cursor-pointer text-muted-foreground flex"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body preview */}
                    <div className="font-mono text-[13px] leading-[1.7] bg-[hsl(222_47%_8%)] text-[#e2e8f0] rounded-[10px] p-4 mb-4 whitespace-pre-wrap">
                        {activeTPL.body}
                    </div>

                    {/* Variable inputs */}
                    {activeTPL.variables.length > 0 && (
                        <div
                            className="grid gap-[10px] mb-4"
                            style={{ gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))" }}
                        >
                            {activeTPL.variables.map((v) => (
                                <div key={v}>
                                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                                        {v}
                                    </label>
                                    <input
                                        value={tplVars[v] ?? ""}
                                        onChange={(e) => setTplVars({ ...tplVars, [v]: e.target.value })}
                                        placeholder={`Enter ${v.toLowerCase()}…`}
                                        className="w-full py-[7px] px-[10px] rounded-lg border border-border bg-card text-foreground text-[13px] outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={onFillAndSend}
                            className="px-[18px] py-2 rounded-[9px] border-none bg-primary text-white cursor-pointer font-bold text-[13px] flex items-center gap-[6px]"
                        >
                            <Send size={13} /> Use in Chat
                        </button>
                        <button
                            onClick={() => setActiveTPL(null)}
                            className="px-[18px] py-2 rounded-[9px] border border-border bg-transparent text-foreground cursor-pointer font-semibold text-[13px]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                /* Template grid */
                <div
                    className="grid gap-[14px]"
                    style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}
                >
                    {filtered.map((t) => (
                        <div
                            key={t.id}
                            className="bg-card rounded-xl border border-border p-4 flex flex-col gap-[10px] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,.08)]"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="font-bold text-sm mb-[3px]">{t.title}</div>
                                    <span className="text-[11px] px-[7px] py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                                        {t.category}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onToggleFav(t.id)}
                                    className={`bg-transparent border-none cursor-pointer shrink-0 flex ${t.favorite ? "text-[#f59e0b]" : "text-muted-foreground"}`}
                                >
                                    {t.favorite ? (
                                        <Star size={15} fill="#f59e0b" />
                                    ) : (
                                        <StarOff size={15} />
                                    )}
                                </button>
                            </div>

                            <div className="text-xs text-muted-foreground leading-[1.5] flex-1">
                                {t.body.slice(0, 80)}…
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-muted-foreground">
                                    {t.uses} uses · {t.variables.length} vars
                                </span>
                                <button
                                    onClick={() => {
                                        setActiveTPL(t);
                                        const vars: Record<string, string> = {};
                                        t.variables.forEach((v) => (vars[v] = ""));
                                        setTplVars(vars);
                                    }}
                                    className="px-3 py-[5px] rounded-[7px] border-none bg-primary text-white cursor-pointer text-xs font-bold flex items-center gap-[5px]"
                                >
                                    <Zap size={11} /> Use
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
