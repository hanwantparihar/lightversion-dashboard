"use client";
import { useState } from "react";
import { ImageIcon, Download, Copy, Check, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Label } from "@/components/ui";
import { PageStack } from "@/components";

const STYLES = ["Photorealistic", "Illustration", "Pixel Art", "Watercolor", "3D Render"];
const RATIOS = ["1:1", "16:9", "9:16"];

const GRADIENTS = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
];

type ImageItem = { id: string; gradient: string; prompt: string; style: string };

const INITIAL_IMAGES: ImageItem[] = [
    { id: "i1", gradient: GRADIENTS[0], prompt: "A futuristic city skyline at sunset with neon lights", style: "Photorealistic" },
    { id: "i2", gradient: GRADIENTS[1], prompt: "Abstract geometric patterns in purple and pink", style: "Illustration" },
    { id: "i3", gradient: GRADIENTS[2], prompt: "Ocean waves crashing on rocky shore, aerial view", style: "Watercolor" },
    { id: "i4", gradient: GRADIENTS[3], prompt: "Lush tropical forest with morning mist", style: "3D Render" },
];

export default function ImageGenPage() {
    const [prompt, setPrompt] = useState("A futuristic city skyline at sunset with neon lights");
    const [style, setStyle] = useState("Photorealistic");
    const [ratio, setRatio] = useState("1:1");
    const [images, setImages] = useState<ImageItem[]>(INITIAL_IMAGES);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [genTime] = useState(8);

    function generate() {
        if (!prompt.trim()) return;
        setLoading(true);
        setTimeout(() => {
            const newImages: ImageItem[] = Array.from({ length: 4 }, (_, i) => ({
                id: `i${Date.now()}-${i}`,
                gradient: GRADIENTS[(i + Math.floor(Math.random() * 3)) % GRADIENTS.length],
                prompt: prompt.trim(),
                style,
            }));
            setImages(newImages);
            setLoading(false);
        }, 1400);
    }

    function copyPrompt(item: ImageItem) {
        navigator.clipboard.writeText(item.prompt).catch(() => { });
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 1600);
    }

    return (
        <PageStack>
            <div>
                <h2 style={{ fontWeight: 800, fontSize: 22 }}>Image Generation</h2>
                <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Generate stunning images from text prompts</p>
            </div>

            {/* Controls */}
            <Card>
                <CardContent style={{ paddingTop: 20 }}>
                    <div className="sy" style={{ gap: 14 }}>
                        <div className="fm">
                            <Label>Prompt</Label>
                            <Textarea
                                placeholder="Describe the image you want to generate…"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                            <div className="fm" style={{ flex: 1, minWidth: 200 }}>
                                <Label>Style</Label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {STYLES.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStyle(s)}
                                            style={{
                                                padding: "5px 12px", borderRadius: 8, border: "1px solid var(--bd)",
                                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                                background: style === s ? "hsl(var(--primary))" : "var(--cd)",
                                                color: style === s ? "#fff" : "var(--fg)",
                                                transition: "background .15s",
                                            }}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="fm">
                                <Label>Aspect Ratio</Label>
                                <div className="fc g2">
                                    {RATIOS.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRatio(r)}
                                            style={{
                                                padding: "5px 16px", borderRadius: 8, border: "1px solid var(--bd)",
                                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                                background: ratio === r ? "hsl(var(--primary))" : "var(--cd)",
                                                color: ratio === r ? "#fff" : "var(--fg)",
                                                transition: "background .15s",
                                            }}
                                        >{r}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="fc g3">
                            <Button onClick={generate} disabled={!prompt.trim() || loading}>
                                {loading ? <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : <><ImageIcon size={14} /> Generate Images</>}
                            </Button>
                            <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>4 images · ~{genTime}s · gpt-4o vision</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Gallery */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {images.map((img) => (
                    <Card key={img.id} style={{ overflow: "hidden" }}>
                        {/* Image placeholder */}
                        <div style={{
                            height: 220, background: img.gradient,
                            display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                        }}>
                            <ImageIcon size={48} style={{ color: "rgba(255,255,255,0.4)" }} />
                            <div style={{
                                position: "absolute", top: 10, right: 10,
                                background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 11, fontWeight: 700,
                                padding: "3px 8px", borderRadius: 6,
                            }}>{img.style}</div>
                        </div>
                        <CardContent style={{ paddingTop: 12, paddingBottom: 12 }}>
                            <p style={{ fontSize: 12, color: "var(--mt-fg)", marginBottom: 10, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                {img.prompt}
                            </p>
                            <div className="fc g2">
                                <Button size="sm" variant="outline" style={{ flex: 1 }}>
                                    <Download size={12} /> Download
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => copyPrompt(img)}>
                                    {copiedId === img.id ? <Check size={12} style={{ color: "#10b981" }} /> : <Copy size={12} />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </PageStack>
    );
}
