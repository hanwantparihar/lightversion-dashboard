"use client";
import { useState } from "react";
import { Copy, Check, Code2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Label, Input } from "@/components/ui";
import { PageStack } from "@/components";

const LANGUAGES = ["TypeScript", "Python", "Go", "Rust", "SQL"];

const SAMPLE_CODE = `import { useState, useCallback } from "react";

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  pageItems: <T>(items: T[]) => T[];
}

/**
 * Custom hook for client-side pagination.
 * @example
 *   const { currentPage, pageItems, nextPage } = usePagination({ totalItems: 100 });
 */
export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const goToPage = useCallback(
    (page: number) => setCurrentPage(Math.min(Math.max(1, page), totalPages)),
    [totalPages]
  );

  const pageItems = useCallback(
    <T>(items: T[]): T[] => {
      const start = (currentPage - 1) * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    },
    [currentPage, itemsPerPage]
  );

  return {
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    pageItems,
  };
}`;

const SAMPLE_EXPLANATION = `This TypeScript hook provides a clean, reusable pagination abstraction for React components.

**What it does:**
- Tracks the current page in local state
- Computes total pages from totalItems ÷ itemsPerPage
- Exposes goToPage, nextPage, and prevPage navigation methods
- Provides a pageItems helper that slices any array to the current page's window

**Design decisions:**
- useCallback memoizes both goToPage and pageItems to prevent unnecessary re-renders in child components
- Page boundaries are clamped (Math.min/Math.max) so callers can't navigate out of range
- The generic pageItems<T>() preserves TypeScript type inference on any array type

**Usage:** Pass totalItems and optionally itemsPerPage/initialPage. Call pageItems(myArray) to get only the current page's slice.`;

export default function CodeGenPage() {
    const [description, setDescription] = useState("A React TypeScript custom hook for client-side pagination with total pages, hasNext/hasPrev flags, and a pageItems helper");
    const [language, setLanguage] = useState("TypeScript");
    const [framework, setFramework] = useState("React");
    const [code, setCode] = useState(SAMPLE_CODE);
    const [explanation, setExplanation] = useState("");
    const [showExplanation, setShowExplanation] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [explaining, setExplaining] = useState(false);

    function generate() {
        if (!description.trim()) return;
        setLoading(true);
        setShowExplanation(false);
        setTimeout(() => {
            setCode(`// Generated ${language} code${framework ? ` · ${framework}` : ""}\n// Task: ${description}\n\n// In a real implementation this would call an AI code generation API.\n// The model would produce production-ready ${language} code following\n// best practices for ${framework || language} projects.\n\nexport function generatedFunction() {\n  // TODO: AI-generated implementation would appear here\n  throw new Error("Not yet implemented");\n}`);
            setLoading(false);
        }, 1200);
    }

    function explain() {
        setExplaining(true);
        setTimeout(() => {
            setExplanation(SAMPLE_EXPLANATION);
            setShowExplanation(true);
            setExplaining(false);
        }, 900);
    }

    function copy() {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    }

    return (
        <PageStack>
            <div>
                <h2 style={{ fontWeight: 800, fontSize: 22 }}>Code Generation</h2>
                <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Generate production-ready code from natural language descriptions</p>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Left: controls */}
                <Card style={{ width: 300, flexShrink: 0 }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: 15 }}>Code Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="sy" style={{ gap: 14 }}>
                            <div className="fm">
                                <Label>Describe what you want</Label>
                                <Textarea
                                    placeholder="e.g. A React hook for debouncing input values"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    style={{ fontSize: 13 }}
                                />
                            </div>

                            <div className="fm">
                                <Label>Language</Label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {LANGUAGES.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLanguage(l)}
                                            style={{
                                                padding: "5px 12px", borderRadius: 8, border: "1px solid var(--bd)",
                                                cursor: "pointer", fontSize: 12, fontWeight: 600,
                                                background: language === l ? "hsl(var(--primary))" : "var(--cd)",
                                                color: language === l ? "#fff" : "var(--fg)",
                                                transition: "background .15s",
                                            }}
                                        >{l}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="fm">
                                <Label>Framework / Hints</Label>
                                <Input
                                    placeholder="e.g. React, Next.js, Express…"
                                    value={framework}
                                    onChange={(e) => setFramework(e.target.value)}
                                />
                            </div>

                            <Button onClick={generate} disabled={!description.trim() || loading} style={{ width: "100%" }}>
                                <Code2 size={14} /> {loading ? "Generating…" : "Generate Code"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: output */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    <Card style={{ overflow: "hidden" }}>
                        <div className="fb" style={{ padding: "10px 18px", borderBottom: "1px solid var(--bd)" }}>
                            <div className="fc g2">
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "hsl(var(--primary))" }} />
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{language}</span>
                                {framework && <span style={{ fontSize: 12, color: "var(--mt-fg)" }}>· {framework}</span>}
                            </div>
                            <Button size="sm" variant="ghost" onClick={copy} disabled={!code}>
                                {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                        <pre
                            style={{
                                margin: 0, padding: "20px 22px",
                                background: "hsl(222 47% 8%)",
                                color: "#e2e8f0",
                                fontSize: 12.5, lineHeight: 1.75,
                                overflowX: "auto",
                                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                minHeight: 300,
                            }}
                        >
                            <code>{code || "// Generated code will appear here"}</code>
                        </pre>
                        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--bd)" }}>
                            <Button size="sm" variant="outline" onClick={explain} disabled={!code || explaining}>
                                <BookOpen size={13} /> {explaining ? "Explaining…" : "Explain Code"}
                            </Button>
                        </div>
                    </Card>

                    {/* Explanation panel */}
                    {showExplanation && explanation && (
                        <Card>
                            <CardHeader style={{ paddingBottom: 8 }}>
                                <CardTitle style={{ fontSize: 14 }}>Code Explanation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--fg)", whiteSpace: "pre-wrap" }}>
                                    {explanation}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PageStack>
    );
}
