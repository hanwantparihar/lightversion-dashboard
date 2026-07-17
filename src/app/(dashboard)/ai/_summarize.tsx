"use client";

import { useState } from "react";
import { AlignLeft, Upload, Copy, Check, Download } from "lucide-react";
import { PillBtn } from "./_atoms";
import { SUMMARY_TYPES, LANGS } from "./_types";

function wordCount(s: string) {
    return s.trim().split(/\s+/).filter(Boolean).length;
}

export function SummarizeView() {
    const [sumInput, setSumInput] = useState(
        "Artificial intelligence is rapidly transforming organizations, from automating tasks to enabling complex decisions at scale. 78% of enterprise leaders have accelerated AI adoption following LLM breakthroughs. Successful implementations start narrow, invest in data quality, and treat AI as a capability multiplier. Top ROI sectors: financial services, healthcare, software development. The EU AI Act sets global governance precedent.",
    );
    const [sumType, setSumType] = useState(SUMMARY_TYPES[0]);
    const [sumLang, setSumLang] = useState("English");
    const [sumOut, setSumOut] = useState("");
    const [sumLoading, setSumLoading] = useState(false);
    const [sumCopied, setSumCopied] = useState(false);

    function runSummarize() {
        setSumLoading(true);
        setTimeout(() => {
            const bullets = [
                "AI adoption accelerated by 78% of enterprise leaders after LLM breakthroughs",
                "Successful implementations start narrow and invest in data quality",
                "Top ROI: financial services, healthcare, and software development",
                "Regulatory frameworks like EU AI Act are setting global precedents",
                "Organizations building AI literacy today gain competitive advantage",
            ];
            setSumOut(
                sumType.includes("Bullet") || sumType.includes("Key") || sumType.includes("Action")
                    ? bullets.slice(0, 5).join("\n")
                    : "This text discusses AI adoption trends across enterprises. Key findings include a 78% acceleration in adoption, with successful patterns focusing on narrow use cases and data quality. The financial, healthcare, and software sectors show the strongest ROI, while regulatory frameworks emerge globally.",
            );
            setSumLoading(false);
        }, 1000);
    }

    const isBullet =
        sumType.includes("Bullet") || sumType.includes("Key") || sumType.includes("Action");

    return (
        <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Input panel */}
            <div className="flex-1 flex flex-col border-r border-border">
                <div className="px-[18px] py-3 border-b border-border flex items-center justify-between shrink-0">
                    <span className="font-bold text-sm">Input</span>
                    <div className="flex gap-[6px] items-center">
                        <span className="text-xs text-muted-foreground">{wordCount(sumInput)} words</span>
                        <button className="px-[10px] py-1 rounded-[7px] border border-border bg-card cursor-pointer text-xs font-semibold text-primary flex items-center gap-1">
                            <Upload size={11} /> Upload
                        </button>
                    </div>
                </div>

                <textarea
                    value={sumInput}
                    onChange={(e) => setSumInput(e.target.value)}
                    placeholder="Paste text, URL, or upload PDF/DOC…"
                    className="flex-1 px-5 py-4 border-none outline-none resize-none text-sm leading-[1.75] text-foreground bg-transparent font-[inherit]"
                />

                <div className="px-[18px] py-3 border-t border-border flex gap-2 flex-wrap items-center shrink-0">
                    <div className="flex gap-[5px] flex-wrap flex-1">
                        {SUMMARY_TYPES.map((s) => (
                            <PillBtn key={s} active={sumType === s} onClick={() => setSumType(s)}>
                                {s}
                            </PillBtn>
                        ))}
                    </div>
                    <select
                        value={sumLang}
                        onChange={(e) => setSumLang(e.target.value)}
                        className="py-[6px] px-[10px] rounded-lg border border-border bg-card text-foreground text-xs"
                    >
                        {LANGS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                    <button
                        onClick={runSummarize}
                        disabled={!sumInput.trim() || sumLoading}
                        className="px-[18px] py-[7px] rounded-[9px] border-none bg-primary text-white cursor-pointer font-bold text-[13px] flex items-center gap-[6px] disabled:opacity-60"
                    >
                        <AlignLeft size={13} /> {sumLoading ? "Summarizing…" : "Summarize"}
                    </button>
                </div>
            </div>

            {/* Output panel */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="px-[18px] py-3 border-b border-border flex items-center justify-between shrink-0">
                    <span className="font-bold text-sm">Summary</span>
                    <div className="flex gap-[6px]">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(sumOut).catch(() => { });
                                setSumCopied(true);
                                setTimeout(() => setSumCopied(false), 1500);
                            }}
                            disabled={!sumOut}
                            className="px-[10px] py-1 rounded-[7px] border border-border bg-card cursor-pointer text-xs font-semibold flex items-center gap-[5px] text-foreground disabled:opacity-50"
                        >
                            {sumCopied ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                            {sumCopied ? "Copied" : "Copy"}
                        </button>
                        <button
                            disabled={!sumOut}
                            className="px-[10px] py-1 rounded-[7px] border border-border bg-card cursor-pointer text-xs font-semibold flex items-center gap-[5px] text-foreground disabled:opacity-50"
                        >
                            <Download size={12} /> Export
                        </button>
                    </div>
                </div>

                {sumOut ? (
                    <div className="flex-1 p-5 overflow-y-auto">
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.07em] mb-[10px]">
                            {sumType}
                        </div>
                        {isBullet ? (
                            <ul className="pl-5 m-0">
                                {sumOut.split("\n").filter(Boolean).map((b, i) => (
                                    <li key={i} className="text-sm leading-[1.8] text-foreground mb-[6px]">
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm leading-[1.8] text-foreground">{sumOut}</p>
                        )}
                        <div className="mt-5 flex gap-[10px] flex-wrap">
                            {(
                                [
                                    ["Positive", "#10b981"],
                                    ["Informative", "#2563eb"],
                                    ["Forward-looking", "#7c3aed"],
                                ] as [string, string][]
                            ).map(([l, c]) => (
                                <span
                                    key={l}
                                    className="px-[10px] py-[3px] rounded-full text-[11px] font-bold"
                                    style={{ background: c + "20", color: c }}
                                >
                                    {l}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-[13px]">
                        Summary will appear here
                    </div>
                )}
            </div>
        </div>
    );
}
