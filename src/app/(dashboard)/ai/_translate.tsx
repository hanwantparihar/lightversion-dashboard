"use client";

import { useState } from "react";
import { Languages, Copy, Check } from "lucide-react";
import { PillBtn } from "./_atoms";
import { LANGS, TRANS_MODES } from "./_types";

function wordCount(s: string) {
    return s.trim().split(/\s+/).filter(Boolean).length;
}

interface TranslateViewProps {
    modelLabel: string;
}

export function TranslateView({ modelLabel }: TranslateViewProps) {
    const [trSrc, setTrSrc] = useState("English");
    const [trTgt, setTrTgt] = useState("Spanish");
    const [trMode, setTrMode] = useState(TRANS_MODES[0]);
    const [trInput, setTrInput] = useState(
        "Now is the time for all good people to come to the aid of their community. The quick brown fox jumps over the lazy dog.",
    );
    const [trOut, setTrOut] = useState(
        "Ahora es el momento para que todas las personas buenas vengan en ayuda de su comunidad. El veloz zorro marrón salta sobre el perro perezoso.",
    );
    const [trLoading, setTrLoading] = useState(false);
    const [trCopied, setTrCopied] = useState(false);

    function runTranslate() {
        setTrLoading(true);
        setTimeout(() => {
            setTrOut(
                `[Simulated ${trMode} ${trTgt} translation]\n\n"${trInput.slice(0, 80)}${trInput.length > 80 ? "…" : ""}"\n\nIn production, ${modelLabel} would produce a context-aware ${trMode.toLowerCase()} translation preserving the original tone and formatting.`,
            );
            setTrLoading(false);
        }, 1000);
    }

    function swapLanguages() {
        const s = trSrc;
        setTrSrc(trTgt);
        setTrTgt(s);
        setTrInput(trOut);
        setTrOut(trInput);
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-[10px] border-b border-border flex items-center gap-[10px] flex-wrap shrink-0">
                <select
                    value={trSrc}
                    onChange={(e) => setTrSrc(e.target.value)}
                    className="py-[6px] px-[10px] rounded-lg border border-border bg-card text-foreground text-[13px] font-semibold"
                >
                    <option>Auto-detect</option>
                    {LANGS.map((l) => <option key={l}>{l}</option>)}
                </select>

                <button
                    onClick={swapLanguages}
                    className="w-8 h-8 rounded-full border border-border bg-card cursor-pointer flex items-center justify-center"
                >
                    <Languages size={14} className="text-foreground" />
                </button>

                <select
                    value={trTgt}
                    onChange={(e) => setTrTgt(e.target.value)}
                    className="py-[6px] px-[10px] rounded-lg border border-border bg-card text-foreground text-[13px] font-semibold"
                >
                    {LANGS.map((l) => <option key={l}>{l}</option>)}
                </select>

                <div className="flex gap-[5px] ml-2">
                    {TRANS_MODES.map((m) => (
                        <PillBtn key={m} active={trMode === m} onClick={() => setTrMode(m)}>
                            {m}
                        </PillBtn>
                    ))}
                </div>

                <button
                    onClick={runTranslate}
                    disabled={!trInput.trim() || trLoading}
                    className="ml-auto px-[18px] py-[7px] rounded-[9px] border-none bg-primary text-white cursor-pointer font-bold text-[13px] flex items-center gap-[6px] disabled:opacity-60"
                >
                    <Languages size={13} /> {trLoading ? "Translating…" : "Translate"}
                </button>
            </div>

            {/* Panels */}
            <div className="flex-1 flex min-h-0">
                {/* Source */}
                <div className="flex-1 flex flex-col border-r border-border">
                    <div className="px-4 py-[10px] border-b border-border flex items-center justify-between text-xs text-muted-foreground shrink-0">
                        <span className="font-bold">{trSrc}</span>
                        <span>{wordCount(trInput)} words</span>
                    </div>
                    <textarea
                        value={trInput}
                        onChange={(e) => setTrInput(e.target.value)}
                        placeholder="Enter text to translate…"
                        className="flex-1 p-4 border-none outline-none resize-none text-sm leading-[1.75] text-foreground bg-transparent font-[inherit]"
                    />
                </div>

                {/* Target */}
                <div className="flex-1 flex flex-col">
                    <div className="px-4 py-[10px] border-b border-border flex items-center justify-between text-xs shrink-0">
                        <span className="font-bold text-muted-foreground">{trTgt}</span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(trOut).catch(() => { });
                                setTrCopied(true);
                                setTimeout(() => setTrCopied(false), 1500);
                            }}
                            disabled={!trOut}
                            className="px-[10px] py-1 rounded-[7px] border border-border bg-card cursor-pointer text-xs font-semibold flex items-center gap-[5px] text-foreground disabled:opacity-50"
                        >
                            {trCopied ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                            {trCopied ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <div
                        className="flex-1 p-4 overflow-y-auto text-sm leading-[1.75] whitespace-pre-wrap"
                        style={{ color: trOut ? "var(--foreground)" : "var(--muted-foreground)" }}
                    >
                        {trOut || "Translation will appear here…"}
                    </div>

                    {trOut && (
                        <div className="px-4 py-[10px] border-t border-border flex gap-2 flex-wrap shrink-0">
                            <span className="text-xs text-muted-foreground">
                                Confidence: <strong className="text-[#10b981]">98%</strong>
                            </span>
                            <span className="text-xs text-muted-foreground">
                                · Detected: <strong className="text-foreground">{trSrc}</strong>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
