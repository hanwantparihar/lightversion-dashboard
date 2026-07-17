// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type View = "chat" | "prompts" | "content" | "image" | "summarize" | "translate";
export type MsgRole = "user" | "ai";
export type Reaction = "like" | "dislike" | null;

export interface Message {
  id: string;
  role: MsgRole;
  content: string;
  time: string;
  reaction?: Reaction;
  isCode?: boolean;
}

export interface Convo {
  id: string;
  title: string;
  tag?: string;
  pinned: boolean;
  messages: Message[];
  model: string;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  body: string;
  variables: string[];
  favorite: boolean;
  uses: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
export const MODELS = [
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI", color: "#10b981" },
  { id: "gpt-4o-mini", label: "GPT-4o mini", provider: "OpenAI", color: "#10b981" },
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", color: "#f59e0b" },
  { id: "claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic", color: "#f59e0b" },
  { id: "gemini-1-5-pro", label: "Gemini 1.5 Pro", provider: "Google", color: "#3b82f6" },
  { id: "gemini-flash", label: "Gemini Flash", provider: "Google", color: "#3b82f6" },
] as const;

import { Sparkles, Zap, FileText, ImageIcon, AlignLeft, Languages } from "lucide-react";

export const VIEWS: { id: View; icon: typeof Sparkles; label: string }[] = [
  { id: "chat", icon: Sparkles, label: "Chat" },
  { id: "prompts", icon: Zap, label: "Prompts" },
  { id: "content", icon: FileText, label: "Content" },
  { id: "image", icon: ImageIcon, label: "Image" },
  { id: "summarize", icon: AlignLeft, label: "Summarize" },
  { id: "translate", icon: Languages, label: "Translate" },
];

export const PROMPT_CATS = [
  "All", "Marketing", "SEO", "Coding", "Social Media", "Blogging",
  "Email", "Sales", "HR", "Legal", "Startup",
];

export const TONES = ["Professional", "Casual", "Creative", "Technical", "Sales-oriented"];

export const CONTENT_TYPES = [
  "Blog Post", "Product Description", "Email", "Ad Copy", "Caption",
  "Landing Page", "SEO Content", "Video Script",
];

export const IMAGE_STYLES = ["Realistic", "Anime", "3D", "Cartoon", "Cinematic", "Logo", "UI Mockup"];

export const LANGS = [
  "English", "Hindi", "Gujarati", "Arabic", "Spanish", "French",
  "German", "Japanese", "Portuguese", "Chinese", "Russian", "Korean",
];

export const TRANS_MODES = ["Formal", "Casual", "Business", "Technical"];

export const SUMMARY_TYPES = [
  "Short summary", "Bullet points", "Key insights", "Executive summary", "Action items",
];

export const GRADIENTS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
];

export const TAG_COLORS: Record<string, string> = {
  Work: "#2563eb",
  Personal: "#10b981",
  Research: "#7c3aed",
  Ideas: "#f59e0b",
};

export const INITIAL_TEMPLATES: PromptTemplate[] = [
  { id: "p1", category: "Marketing", title: "Instagram Caption", body: "Write 3 Instagram captions for [PRODUCT] targeting [AUDIENCE]. Tone: [TONE]. Include hashtags.", variables: ["PRODUCT", "AUDIENCE", "TONE"], favorite: true, uses: 142 },
  { id: "p2", category: "SEO", title: "Meta Description", body: "Write an SEO-optimized meta description for [PAGE_TITLE]. Target keyword: [KEYWORD]. Max 160 chars.", variables: ["PAGE_TITLE", "KEYWORD"], favorite: false, uses: 89 },
  { id: "p3", category: "Coding", title: "Code Review", body: "Review this [LANGUAGE] code for readability, performance, and security:\n\n[CODE]", variables: ["LANGUAGE", "CODE"], favorite: true, uses: 204 },
  { id: "p4", category: "Coding", title: "Unit Test Generator", body: "Write unit tests for this function using [FRAMEWORK]:\n\n[CODE]", variables: ["FRAMEWORK", "CODE"], favorite: false, uses: 67 },
  { id: "p5", category: "Email", title: "Cold Outreach Email", body: "Write a cold outreach email to [RECIPIENT_ROLE] at [COMPANY] about [OFFER]. Keep it under 100 words.", variables: ["RECIPIENT_ROLE", "COMPANY", "OFFER"], favorite: false, uses: 31 },
  { id: "p6", category: "Sales", title: "Elevator Pitch", body: "Write a 30-second elevator pitch for [PRODUCT] targeting [AUDIENCE]. Focus on the key benefit: [BENEFIT].", variables: ["PRODUCT", "AUDIENCE", "BENEFIT"], favorite: false, uses: 55 },
  { id: "p7", category: "Blogging", title: "Blog Post Outline", body: "Create a detailed blog outline for '[TOPIC]'. Include intro, 5 H2 sections with bullet points, and a CTA.", variables: ["TOPIC"], favorite: true, uses: 178 },
  { id: "p8", category: "HR", title: "Job Description", body: "Write a job description for [ROLE] at a [COMPANY_TYPE] company. Required skills: [SKILLS]. Tone: [TONE].", variables: ["ROLE", "COMPANY_TYPE", "SKILLS", "TONE"], favorite: false, uses: 44 },
  { id: "p9", category: "Legal", title: "NDA Summary", body: "Summarize the key obligations and restrictions in this NDA in plain English:\n\n[NDA_TEXT]", variables: ["NDA_TEXT"], favorite: false, uses: 19 },
  { id: "p10", category: "Startup", title: "Startup Idea Validation", body: "Validate this startup idea: [IDEA]. Identify target market, key risks, competitors, and a go-to-market suggestion.", variables: ["IDEA"], favorite: true, uses: 93 },
  { id: "p11", category: "Social Media", title: "Twitter Thread", body: "Write a 5-tweet thread about [TOPIC] for [AUDIENCE]. First tweet must be a hook. End with a CTA.", variables: ["TOPIC", "AUDIENCE"], favorite: false, uses: 77 },
];

export const SEED_CONVOS: Convo[] = [
  {
    id: "c1", title: "Analytics performance tips", tag: "Work", pinned: true, model: "gpt-4o", createdAt: "Today",
    messages: [
      { id: "m1", role: "user", content: "How do I improve dashboard analytics performance?", time: "10:02 AM" },
      { id: "m2", role: "ai", content: "Great question! Key strategies:\n\n**1. Data caching**\nCache expensive queries with Redis or in-memory stores. Set TTL based on how fresh the data needs to be.\n\n**2. Aggregation at write time**\nPre-aggregate metrics when data is written so reads stay O(1).\n\n**3. Pagination**\nNever load all rows — paginate or virtualize large tables.\n\n**4. Chart lazy-loading**\nDefer off-screen charts until they scroll into view with IntersectionObserver.", time: "10:02 AM", reaction: null },
      { id: "m3", role: "user", content: "What about real-time updates?", time: "10:04 AM" },
      { id: "m4", role: "ai", content: "For real-time dashboards:\n\n```typescript\n// Server-Sent Events — simple, one-way push\nconst es = new EventSource('/api/metrics/stream');\nes.onmessage = (e) => setMetrics(JSON.parse(e.data));\n```\n\nUse **SSE** for one-way server→client pushes and **WebSockets** when you need bidirectional. Pair with client-side debounce to avoid re-rendering on every tick.", time: "10:04 AM", reaction: null, isCode: true },
    ],
  },
  { id: "c2", title: "TypeScript generics guide", tag: "Research", pinned: false, model: "claude-3-5-sonnet", createdAt: "Today", messages: [] },
  { id: "c3", title: "SQL query optimization", tag: "Work", pinned: false, model: "gemini-1-5-pro", createdAt: "Yesterday", messages: [] },
  { id: "c4", title: "React performance patterns", tag: "Personal", pinned: false, model: "gpt-4o", createdAt: "Yesterday", messages: [] },
];

export const SUGGESTED = [
  "Explain how LLMs work in simple terms",
  "Write a Python script to parse CSV files",
  "What are the best practices for REST API design?",
  "Summarize the key differences between React and Vue",
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export function simulateAI(text: string, model: string): string {
  return `Here's my response to: *"${text.slice(0, 60)}${text.length > 60 ? "…" : ""}"*\n\nThis is a simulated response from **${MODELS.find(m => m.id === model)?.label ?? model}**. In production this would stream from the model's API.\n\nKey points:\n- First insight based on your query\n- Second relevant consideration  \n- A practical recommendation you can act on today\n\nLet me know if you'd like me to expand on any of these.`;
}
