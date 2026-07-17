"use client";
import { useState } from "react";
import { Play, Copy, Check, RotateCcw, Zap } from "lucide-react";
import { Card, CardContent, Button, Input, Label } from "@/components/ui";
import { PageStack } from "@/components";
import { PLAYGROUND_ENDPOINTS, type PlaygroundEndpoint } from "@/lib/devtools-data";

const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
    GET: { bg: "#2563eb18", color: "#2563eb" },
    POST: { bg: "#10b98118", color: "#10b981" },
    PUT: { bg: "#f59e0b18", color: "#f59e0b" },
    PATCH: { bg: "#7c3aed18", color: "#7c3aed" },
    DELETE: { bg: "#ef444418", color: "#ef4444" },
};

export default function ApiPlaygroundPage() {
    const [active, setActive] = useState<PlaygroundEndpoint>(PLAYGROUND_ENDPOINTS[0]);
    const [paramVals, setParamVals] = useState<Record<string, string>>({});
    const [apiKey, setApiKey] = useState("nx_live_••••••••••••••••");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState<number | null>(null);
    const [latency, setLatency] = useState<number | null>(null);

    function selectEndpoint(ep: PlaygroundEndpoint) {
        setActive(ep);
        setResponse(null);
        setStatus(null);
        setLatency(null);
        setParamVals({});
    }

    function getParam(name: string) {
        return paramVals[name] ?? (active.params?.find((p) => p.name === name)?.defaultValue ?? "");
    }

    function run() {
        setLoading(true);
        setResponse(null);
        const start = Date.now();
        // Simulate network delay
        setTimeout(() => {
            setLatency(Date.now() - start);
            setStatus(200);
            setResponse(active.sampleResponse);
            setLoading(false);
        }, 400 + Math.random() * 300);
    }

    function reset() {
        setParamVals({});
        setResponse(null);
        setStatus(null);
        setLatency(null);
    }

    function copy() {
        if (response) {
            navigator.clipboard.writeText(response).catch(() => { });
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    }

    const m = METHOD_COLORS[active.method];
    const bodyParams = active.params?.filter((p) => p.in === "body") ?? [];
    const queryParams = active.params?.filter((p) => p.in === "query") ?? [];
    const pathParams = active.params?.filter((p) => p.in === "path") ?? [];

    return (
        <PageStack>

            {/* API key bar */}
            <Card>
                <CardContent style={{ paddingTop: 18, paddingBottom: 18 }}>
                    <div className="fc g3" style={{ flexWrap: "wrap" }}>
                        <Zap size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />
                        <Label style={{ flexShrink: 0, fontSize: 13 }}>API Key</Label>
                        <Input
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{ flex: 1, minWidth: 240, fontFamily: "monospace", fontSize: 13 }}
                            placeholder="nx_live_..."
                        />
                        <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>Requests go to the sandbox — no real data is modified</span>
                    </div>
                </CardContent>
            </Card>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Endpoint list */}
                <Card style={{ width: 260, flexShrink: 0 }}>
                    <CardContent style={{ padding: "12px 0" }}>
                        <div style={{ padding: "8px 16px 6px", fontSize: 11, fontWeight: 700, color: "var(--mt-fg)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Endpoints</div>
                        {PLAYGROUND_ENDPOINTS.map((ep) => {
                            const mc = METHOD_COLORS[ep.method];
                            return (
                                <button
                                    key={ep.id}
                                    onClick={() => selectEndpoint(ep)}
                                    style={{
                                        width: "100%", textAlign: "left", padding: "10px 16px",
                                        background: active.id === ep.id ? "var(--ac)" : "transparent",
                                        border: "none", cursor: "pointer", transition: "background .1s",
                                        display: "flex", alignItems: "center", gap: 10,
                                    }}
                                >
                                    <span style={{ padding: "2px 7px", borderRadius: 5, background: mc.bg, color: mc.color, fontWeight: 800, fontSize: 10, fontFamily: "monospace", flexShrink: 0 }}>
                                        {ep.method}
                                    </span>
                                    <span style={{ fontSize: 12, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ep.path}</span>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Request + response panes */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Request */}
                    <Card>
                        <CardContent style={{ paddingTop: 20 }}>
                            {/* Method + path */}
                            <div className="fc g3" style={{ marginBottom: 18, flexWrap: "wrap" }}>
                                <span style={{ padding: "5px 12px", borderRadius: 8, background: m.bg, color: m.color, fontWeight: 800, fontSize: 13, fontFamily: "monospace" }}>
                                    {active.method}
                                </span>
                                <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>
                                    https://api.nexoraai.com{active.path}
                                </span>
                            </div>
                            <p style={{ fontSize: 13, color: "var(--mt-fg)", marginBottom: 18 }}>{active.description}</p>

                            {/* Path params */}
                            {pathParams.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mt-fg)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Path</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {pathParams.map((p) => (
                                            <div key={p.name} className="fc g3">
                                                <Label style={{ width: 120, flexShrink: 0, fontFamily: "monospace", fontSize: 13 }}>
                                                    {p.name} {p.required && <span style={{ color: "#ef4444" }}>*</span>}
                                                </Label>
                                                <Input value={getParam(p.name)} onChange={(e) => setParamVals((v) => ({ ...v, [p.name]: e.target.value }))} placeholder={p.type} style={{ flex: 1 }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Query params */}
                            {queryParams.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mt-fg)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Query</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {queryParams.map((p) => (
                                            <div key={p.name} className="fc g3">
                                                <Label style={{ width: 120, flexShrink: 0, fontFamily: "monospace", fontSize: 13 }}>{p.name}</Label>
                                                <Input value={getParam(p.name)} onChange={(e) => setParamVals((v) => ({ ...v, [p.name]: e.target.value }))} placeholder={p.defaultValue || p.type} style={{ flex: 1 }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Body params */}
                            {bodyParams.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mt-fg)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Body</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {bodyParams.map((p) => (
                                            <div key={p.name} className="fc g3">
                                                <Label style={{ width: 120, flexShrink: 0, fontFamily: "monospace", fontSize: 13 }}>
                                                    {p.name} {p.required && <span style={{ color: "#ef4444" }}>*</span>}
                                                </Label>
                                                <Input value={getParam(p.name)} onChange={(e) => setParamVals((v) => ({ ...v, [p.name]: e.target.value }))} placeholder={p.type} style={{ flex: 1 }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="fc g2" style={{ marginTop: 4 }}>
                                <Button onClick={run} disabled={loading}>
                                    <Play size={14} /> {loading ? "Sending…" : "Send Request"}
                                </Button>
                                <Button variant="outline" onClick={reset}><RotateCcw size={14} /> Reset</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response */}
                    {(response !== null || loading) && (
                        <Card style={{ overflow: "hidden" }}>
                            <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div className="fc g3">
                                    <span style={{ fontWeight: 700, fontSize: 13 }}>Response</span>
                                    {status && (
                                        <span style={{ padding: "2px 10px", borderRadius: 20, background: "#10b98120", color: "#10b981", fontWeight: 700, fontSize: 12 }}>
                                            {status} OK
                                        </span>
                                    )}
                                    {latency && (
                                        <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>{latency}ms</span>
                                    )}
                                </div>
                                {response && (
                                    <Button size="sm" variant="ghost" onClick={copy}>
                                        {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                )}
                            </div>
                            <pre style={{ margin: 0, padding: "20px 22px", background: "hsl(222 47% 8%)", color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, overflowX: "auto", fontFamily: '"JetBrains Mono","Fira Code",monospace', minHeight: 120 }}>
                                {loading ? <span style={{ color: "#64748b" }}>Waiting for response…</span> : <code>{response}</code>}
                            </pre>
                        </Card>
                    )}
                </div>
            </div>
        </PageStack>
    );
}
