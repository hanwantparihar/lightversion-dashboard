"use client";

import { useState } from "react";
import { ImageIcon, Star, StarOff, Download } from "lucide-react";
import { PillBtn } from "./_atoms";
import { IMAGE_STYLES, GRADIENTS, MODELS } from "./_types";

interface ImageViewProps {
    modelLabel: string;
}

export function ImageView({ modelLabel }: ImageViewProps) {
    const [imgPrompt, setImgPrompt] = useState(
        "A futuristic city skyline at sunset with neon lights",
    );
    const [imgStyle, setImgStyle] = useState(IMAGE_STYLES[0]);
    const [imgRatio, setImgRatio] = useState("1:1");
    const [imgNeg, setImgNeg] = useState("");
    const [imgHD, setImgHD] = useState(false);
    const [imgResults, setImgResults] = useState([0, 1, 2, 3]);
    const [imgLoading, setImgLoading] = useState(false);
    const [imgFavs, setImgFavs] = useState<number[]>([]);
    const [imgHistory, setImgHistory] = useState<
        { prompt: string; style: string; grads: number[] }[]
    >([]);

    function generateImages() {
        setImgLoading(true);
        setTimeout(() => {
            const grads = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).slice(0, 4);
            setImgResults(grads);
            setImgHistory((h) => [{ prompt: imgPrompt, style: imgStyle, grads }, ...h.slice(0, 4)]);
            setImgLoading(false);
        }, 1400);
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="font-extrabold text-xl mb-4">Image Generation</div>

            {/* Controls */}
            <div className="bg-muted rounded-[14px] border border-border p-5 mb-5">
                <textarea
                    value={imgPrompt}
                    onChange={(e) => setImgPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate…"
                    rows={3}
                    className="w-full px-3 py-[10px] rounded-[9px] border border-border bg-card text-foreground text-sm outline-none resize-none font-[inherit] mb-[14px]"
                />

                <div className="flex gap-5 flex-wrap mb-[14px]">
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-[6px]">
                            Style
                        </label>
                        <div className="flex gap-[5px] flex-wrap">
                            {IMAGE_STYLES.map((s) => (
                                <PillBtn key={s} active={imgStyle === s} onClick={() => setImgStyle(s)}>
                                    {s}
                                </PillBtn>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-[6px]">
                            Ratio
                        </label>
                        <div className="flex gap-[5px]">
                            {["1:1", "16:9", "9:16"].map((r) => (
                                <PillBtn key={r} active={imgRatio === r} onClick={() => setImgRatio(r)}>
                                    {r}
                                </PillBtn>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-w-[160px]">
                        <label className="text-xs font-semibold text-muted-foreground block mb-[6px]">
                            Negative prompt
                        </label>
                        <input
                            value={imgNeg}
                            onChange={(e) => setImgNeg(e.target.value)}
                            placeholder="What to avoid…"
                            className="w-full py-[6px] px-[10px] rounded-lg border border-border bg-card text-foreground text-[13px] outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-[14px]">
                    <button
                        onClick={generateImages}
                        disabled={!imgPrompt.trim() || imgLoading}
                        className="px-[22px] py-[9px] rounded-[9px] border-none bg-primary text-white cursor-pointer font-bold text-[13px] flex items-center gap-[6px] disabled:opacity-60"
                    >
                        <ImageIcon size={14} /> {imgLoading ? "Generating…" : "Generate 4 Images"}
                    </button>

                    <label className="flex items-center gap-[6px] text-[13px] font-semibold cursor-pointer">
                        <input
                            type="checkbox"
                            checked={imgHD}
                            onChange={(e) => setImgHD(e.target.checked)}
                            className="w-[14px] h-[14px]"
                        />
                        HD Quality
                    </label>

                    <span className="text-xs text-muted-foreground">{modelLabel} · ~8s</span>
                </div>
            </div>

            {/* Gallery */}
            {imgResults.length > 0 && (
                <div className="grid grid-cols-2 gap-[14px] mb-5">
                    {imgResults.map((g, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-border">
                            <div
                                className="h-[200px] flex items-center justify-center relative"
                                style={{ background: GRADIENTS[g % GRADIENTS.length] }}
                            >
                                <ImageIcon size={40} style={{ color: "rgba(255,255,255,.35)" }} />
                                <div className="absolute top-2 right-2 flex gap-[5px]">
                                    <button
                                        onClick={() =>
                                            setImgFavs((p) =>
                                                p.includes(i) ? p.filter((x) => x !== i) : [...p, i],
                                            )
                                        }
                                        className="w-7 h-7 rounded-md flex items-center justify-center border-none cursor-pointer"
                                        style={{
                                            background: "rgba(0,0,0,.4)",
                                            color: imgFavs.includes(i) ? "#f59e0b" : "#fff",
                                        }}
                                    >
                                        {imgFavs.includes(i) ? (
                                            <Star size={13} fill="#f59e0b" />
                                        ) : (
                                            <StarOff size={13} />
                                        )}
                                    </button>
                                    <button
                                        className="w-7 h-7 rounded-md flex items-center justify-center border-none cursor-pointer text-white"
                                        style={{ background: "rgba(0,0,0,.4)" }}
                                    >
                                        <Download size={13} />
                                    </button>
                                </div>
                            </div>
                            <div className="px-3 py-[10px] bg-card flex items-center justify-between">
                                <span className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                    {imgPrompt.slice(0, 40)}{imgPrompt.length > 40 ? "…" : ""}
                                </span>
                                <button
                                    onClick={() => setImgPrompt(imgPrompt)}
                                    className="shrink-0 px-2 py-[3px] rounded-md border border-border bg-transparent cursor-pointer text-[11px] font-semibold text-primary ml-2"
                                >
                                    ↩
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
